import { useEffect } from 'react';
import { scrollManager } from '../utils/scrollManager';

export default function LenisWrapper({ children }) {
  useEffect(() => {
    scrollManager.init();

    return () => {
      scrollManager.destroy();
    };
  }, []);

  return children;
}

