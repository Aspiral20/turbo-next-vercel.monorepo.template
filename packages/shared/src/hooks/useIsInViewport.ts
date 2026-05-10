import { useState, useEffect, useRef, MutableRefObject } from 'react';

const useIsInViewport = <T extends HTMLElement = HTMLDivElement>(
  options: IntersectionObserverInit = {},
  inViewportOnce = false
): [MutableRefObject<T | null>, boolean] => {
  const [isInViewport, setIsInViewport] = useState(false);
  const elementRef = useRef<T | null>(null);
  const hasBeenInViewport = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInViewport(true);

        if (inViewportOnce) {
          hasBeenInViewport.current = true;
          observer.disconnect();
        }
      } else if (!inViewportOnce) {
        setIsInViewport(false);
      }
    }, options);

    if (elementRef.current && !hasBeenInViewport.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [options, inViewportOnce]);

  return [elementRef, isInViewport];
};

export default useIsInViewport;