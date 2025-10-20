import { useEffect, useState } from 'react';

/**
 * useDangerMode
 * - Typed unlock flow for Danger Zone.
 * - Returns { unlocked, unlock, lock, typedValue, setTyped }.
 */
export default function useDangerMode(passphrase = 'UNLOCK DANGER ZONE') {
  const [typed, setTyped] = useState('');
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    if (typed.trim().toUpperCase() === passphrase.toUpperCase()) {
      setUnlocked(true);
    } else {
      setUnlocked(false);
    }
  }, [typed, passphrase]);

  const unlock = () => setUnlocked(true);
  const lock = () => {
    setTyped('');
    setUnlocked(false);
  };

  return {
    unlocked,
    typedValue: typed,
    setTyped,
    unlock,
    lock,
  };
}
