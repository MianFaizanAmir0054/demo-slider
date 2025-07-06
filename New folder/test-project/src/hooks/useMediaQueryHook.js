import { useEffect, useState } from 'react';

export const useMediaQuery = (width) => {
  const [isLessThan, setIsLessThan] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsLessThan(window.innerWidth <= width);
    handleResize(); // initialize

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [width]);

  return isLessThan;
};
