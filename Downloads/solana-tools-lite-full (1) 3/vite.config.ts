/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
  server: { port: 5173 },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split Solana SDK into separate chunk
          'solana-web3': ['@solana/web3.js'],
          'solana-wallet': [
            '@solana/wallet-adapter-base',
            '@solana/wallet-adapter-react',
            '@solana/wallet-adapter-react-ui',
            '@solana/wallet-adapter-wallets'
          ],
          'solana-spl': ['@solana/spl-token'],
          // Split Raydium and OpenBook into separate chunks (only if used)
          'raydium-sdk': ['@raydium-io/raydium-sdk'],
          'openbook-sdk': ['@openbook-dex/openbook'],
          // React vendor chunk
          'react-vendor': ['react', 'react-dom'],
        }
      }
    },
    // Increase chunk size warning limit to 600kb
    chunkSizeWarningLimit: 600,
  // Enable source maps for better debugging (optional)
    sourcemap: false,
  },
})

