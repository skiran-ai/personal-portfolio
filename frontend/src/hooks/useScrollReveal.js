import { useEffect, useRef, useState } from 'react';

/**
 * useScrollReveal — Returns a ref and a boolean `isVisible`.
 * When the ref element enters the viewport, isVisible becomes true.
 * @param {object} options - IntersectionObserver options
 */
export default function useScrollReveal(options = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target); // Only trigger once
        }
      },
      {
        threshold: options.threshold ?? 0.12,
        rootMargin: options.rootMargin ?? '0px 0px -60px 0px',
        ...options
      }
    );

    const el = ref.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  return [ref, isVisible];
}
