// src/hooks/useScrollActiveImage.ts
import { useState, useEffect, useRef, RefObject, useCallback } from 'react';

interface UseScrollActiveImageOptions {
  enabled?: boolean;
  threshold?: number;
}

export function useScrollActiveImage(
  containerRef: RefObject<HTMLElement>,
  imageCount: number,
  options: UseScrollActiveImageOptions = {}
) {
  const { enabled = true, threshold = 0.3 } = options;
  const [activeIndex, setActiveIndex] = useState(0);
  const imageRefs = useRef<(HTMLElement | null)[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Initialize refs array with correct length
  useEffect(() => {
    imageRefs.current = new Array(imageCount).fill(null);
  }, [imageCount]);

  // Create and manage observer
  useEffect(() => {
    if (!enabled || !containerRef.current || imageCount === 0) return;

    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the most visible entry
        let maxRatio = 0;
        let maxIndex = 0;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const ratio = entry.intersectionRatio;
            const index = Number(entry.target.getAttribute('data-image-index'));
            
            if (!isNaN(index) && ratio > maxRatio) {
              maxRatio = ratio;
              maxIndex = index;
            }
          }
        });

        if (maxRatio >= threshold) {
          setActiveIndex(maxIndex);
        }
      },
      {
        root: containerRef.current,
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
        rootMargin: '-10% 0px -10% 0px',
      }
    );

    observerRef.current = observer;

    // Small delay to ensure refs are set
    const timeoutId = setTimeout(() => {
      imageRefs.current.forEach((ref) => {
        if (ref && observerRef.current) {
          observerRef.current.observe(ref);
        }
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [enabled, threshold, imageCount, containerRef]);

  const setImageRef = useCallback((index: number) => (el: HTMLElement | null) => {
    imageRefs.current[index] = el;
    
    // If observer exists and element is set, observe it immediately
    if (el && observerRef.current) {
      observerRef.current.observe(el);
    }
  }, []);

  return { activeIndex, setImageRef };
}