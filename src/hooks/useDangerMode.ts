import { useEffect, useState } from 'react';

/**
 * useDangerMode
 * - Typed unlock flow for Danger Zone.
 * - Returns { unlocked, unlock, lock, typedValue, setTyped }.
 *
 * default phrase: 'UNLOCK DANGER'
 */

export function useDangerMode(requiredPhrase = 'UNLOCK DANGER') {
  const [typed, setTyped] = useState('');
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    if (unlocked) return;
    if (typed === requiredPhrase) {
      setUnlocked(true);
    }
  }, [typed, requiredPhrase, unlocked]);

  function unlock(value?: string) {
    if (value !== undefined) {
      setTyped(value);
      if (value === requiredPhrase) setUnlocked(true);
    }
  }
  function lock() {
    setTyped('');
    setUnlocked(false);
  }

  return { unlocked, typedValue: typed, setTyped, unlock, lock };
}

export default useDangerMode;
