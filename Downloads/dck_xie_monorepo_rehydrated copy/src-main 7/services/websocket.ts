import type {
  TokenPriceUpdate,
  NewMintEvent,
  AuthorityEvent,
  LiquidityEvent,
  TokenData,
  SnipeOpportunity
} from '../types/solana';

class WebSocketService
{
  private url: string;
  private socket: WebSocket | null = null;
  private connected = false;
  private listeners = new Map<string, ( data: any ) => void>();
  private attempts = 0;
  private connecting = false;
  private tokensByAgeMaxHours: number | null = null;
  private pingTimer: any = null;
  private livenessTimer: any = null;
  private outQ: any[] = [];
  private MAX_Q = 100;

  constructor()
  {
    this.url = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';
  }

  private computeDelay ( msBase = 1000 )
  {
    const max = Math.min( 30000, msBase * 2 ** this.attempts ); // cap at 30s
    const jitter = Math.random() * 0.3; // up to 30% jitter
    return max * ( 1 - jitter );
  }

  connect ()
  {
    if ( this.connected || this.socket || this.connecting ) return;
    this.connecting = true;
    try
    {
      this.socket = new WebSocket( this.url );
      this.socket.onopen = () =>
      {
        this.connecting = false;
        this.attempts = 0;
        this.connected = true;
        console.log( 'Connected to WebSocket server' );
        this.startHeartbeat();
        this.flush();
        // Resubscribe to all active listeners
        for ( const [ key, callback ] of this.listeners )
        {
          if ( key.startsWith( 'price_' ) )
          {
            const mint = key.replace( 'price_', '' );
            this.send( { type: 'subscribe_solana_price', mintAddress: mint } );
          } else if ( key === 'tokens_by_age' && this.tokensByAgeMaxHours !== null )
          {
            this.send( { type: 'subscribe_tokens_by_age', maxAgeHours: this.tokensByAgeMaxHours } );
          } else if ( key === 'bonding_curve' )
          {
            this.send( { type: 'subscribe_bonding_curve' } );
          } else if ( key === 'graduated_tokens' )
          {
            this.send( { type: 'subscribe_graduated_tokens' } );
          }
          // Others like new_mints, authority_events, etc. assumed server-side
        }
      };
      this.socket.onmessage = ( event ) =>
      {
        try
        {
          const data = JSON.parse( event.data );
          if ( data?.type === 'pong' )
          {
            clearTimeout( this.livenessTimer );
            return;
          }
          this.handleMessage( data );
        } catch ( e )
        {
          console.error( 'Failed to parse WS message', e );
        }
      };
      this.socket.onclose = ( ev ) =>
      {
        this.stopHeartbeat();
        this.connected = false;
        this.socket = null;
        this.connecting = false;
        console.log( 'Disconnected from WebSocket server' );
        let delay = this.computeDelay();
        try
        {
          const reasonData = ev.reason && JSON.parse( ev.reason );
          if ( reasonData?.retryAfterMs ) delay = Number( reasonData.retryAfterMs );
        } catch { }
        this.attempts++;
        setTimeout( () => this.connect(), delay );
      };
      this.socket.onerror = ( err ) =>
      {
        console.error( 'WebSocket error', err );
        // onclose handles retry
      };
    } catch ( e )
    {
      this.connecting = false;
      this.attempts++;
      console.error( 'Failed to create WebSocket', e );
      setTimeout( () => this.connect(), this.computeDelay() );
    }
  }

  private handleMessage ( data: any )
  {
    if ( data.type === 'solana_price_update' && data.mintAddress )
    {
      const callback = this.listeners.get( `price_${ data.mintAddress }` );
      if ( callback ) callback( data );
    } else if ( data.type === 'solana_new_mint' )
    {
      const callback = this.listeners.get( 'new_mints' );
      if ( callback ) callback( data );
    } else if ( data.type === 'solana_authority_event' )
    {
      const callback = this.listeners.get( 'authority_events' );
      if ( callback ) callback( data );
    } else if ( data.type === 'solana_snipe_opportunity' )
    {
      const callback = this.listeners.get( 'snipe_opportunities' );
      if ( callback ) callback( data );
    } else if ( data.type === 'solana_liquidity_event' )
    {
      const callback = this.listeners.get( 'liquidity_events' );
      if ( callback ) callback( data );
    } else if ( data.type === 'tokens_by_age_update' )
    {
      const callback = this.listeners.get( 'tokens_by_age' );
      if ( callback ) callback( data );
    } else if ( data.type === 'bonding_curve_update' )
    {
      const callback = this.listeners.get( 'bonding_curve' );
      if ( callback ) callback( data );
    } else if ( data.type === 'graduated_token_update' )
    {
      const callback = this.listeners.get( 'graduated_tokens' );
      if ( callback ) callback( data );
    }
  }

  private send ( data: any )
  {
    if ( this.socket && this.socket.readyState === WebSocket.OPEN )
    {
      this.socket.send( JSON.stringify( data ) );
    } else
    {
      if ( this.outQ.length >= this.MAX_Q ) this.outQ.shift();
      this.outQ.push( data );
    }
  }

  private flush ()
  {
    if ( !this.socket || this.socket.readyState !== WebSocket.OPEN ) return;
    while ( this.outQ.length ) this.socket.send( JSON.stringify( this.outQ.shift() ) );
  }

  private startHeartbeat ()
  {
    this.stopHeartbeat();

    const sendPing = () =>
    {
      this.send( { type: 'ping', t: Date.now() } );
      clearTimeout( this.livenessTimer );
      this.livenessTimer = setTimeout( () =>
      {
        try { this.socket?.close( 4000, 'pong-timeout' ); } catch { }
      }, 10000 ); // expect pong within 10s
    };

    this.pingTimer = setInterval( sendPing, 25000 ); // 25s
    sendPing();
  }

  private stopHeartbeat ()
  {
    clearInterval( this.pingTimer );
    clearTimeout( this.livenessTimer );
  }

  // Subscribe to Solana token price updates
  subscribeToTokenPrice ( mintAddress: string, callback: ( data: TokenPriceUpdate ) => void )
  {
    this.listeners.set( `price_${ mintAddress }`, callback );
    if ( this.connected )
    {
      this.send( { type: 'subscribe_solana_price', mintAddress } );
    }
  }

  // Subscribe to new Solana token mints
  subscribeToNewMints ( callback: ( data: NewMintEvent ) => void )
  {
    this.listeners.set( 'new_mints', callback );
    // Assume server sends these without subscription
  }

  // Subscribe to Solana freeze/authority events
  subscribeToAuthorityEvents ( callback: ( data: AuthorityEvent ) => void )
  {
    this.listeners.set( 'authority_events', callback );
    // Assume server sends these without subscription
  }

  // Subscribe to Solana snipe opportunities
  subscribeToSnipeOpportunities ( callback: ( data: SnipeOpportunity ) => void )
  {
    this.listeners.set( 'snipe_opportunities', callback );
    // Assume server sends these without subscription
  }

  // Subscribe to liquidity pool events
  subscribeLiquidityEvents ( callback: ( data: LiquidityEvent ) => void )
  {
    this.listeners.set( 'liquidity_events', callback );
    // Assume server sends these without subscription
  }

  // Subscribe to token age-based filtering
  subscribeToTokensByAge ( maxAgeHours: number, callback: ( data: TokenData[] ) => void )
  {
    this.listeners.set( 'tokens_by_age', callback );
    this.tokensByAgeMaxHours = maxAgeHours;
    if ( this.connected )
    {
      this.send( { type: 'subscribe_tokens_by_age', maxAgeHours } );
    }
  }

  // Subscribe to bonding curve progress (tokens approaching graduation)
  subscribeToBondingCurve ( callback: ( data: TokenData ) => void )
  {
    this.listeners.set( 'bonding_curve', callback );
    if ( this.connected )
    {
      this.send( { type: 'subscribe_bonding_curve' } );
    }
  }

  // Subscribe to graduated tokens (completed bonding curve)
  subscribeToGraduatedTokens ( callback: ( data: TokenData ) => void )
  {
    this.listeners.set( 'graduated_tokens', callback );
    if ( this.connected )
    {
      this.send( { type: 'subscribe_graduated_tokens' } );
    }
  }

  // Unsubscribe from Solana token updates
  unsubscribeFromToken ( mintAddress: string )
  {
    this.listeners.delete( `price_${ mintAddress }` );
    if ( this.connected )
    {
      this.send( { type: 'unsubscribe_solana_price', mintAddress } );
    }
  }

  disconnect ()
  {
    this.stopHeartbeat();
    if ( this.socket )
    {
      this.socket.close();
      this.socket = null;
      this.connected = false;
      this.connecting = false;
    }
  }
}

export const wsService = new WebSocketService();
export default wsService;