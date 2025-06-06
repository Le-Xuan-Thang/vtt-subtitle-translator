'use client';

import { useState, useEffect } from 'react';

export function useScrollHeader() {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      // Only hide header after scrolling down past 120px for better UX
      if (currentScrollY > 120) {
        // Show header when scrolling up, hide when scrolling down
        // Add a threshold to prevent jittery behavior
        const scrollDifference = Math.abs(currentScrollY - lastScrollY);
        
        if (scrollDifference > 10) {
          if (currentScrollY < lastScrollY) {
            setIsHeaderVisible(true);
          } else if (currentScrollY > lastScrollY) {
            setIsHeaderVisible(false);
          }
        }
      } else {
        // Always show header near the top
        setIsHeaderVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    // Throttle scroll events for better performance
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };
  }, [lastScrollY]);

  return { isHeaderVisible, scrollY };
}
