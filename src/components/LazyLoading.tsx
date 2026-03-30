import React, { useState, useEffect, useRef, ReactNode } from 'react';

interface LazyLoadingProps<T = any> {
  items: T[];
  initialCount?: number;
  loadMoreCount?: number;
  children: (items: T[], visibleSections: Record<string, boolean>) => ReactNode;
  visibleSections: Record<string, boolean>;
  loadingText?: string;
  threshold?: number;
}

export default function LazyLoading<T = any>({
  items,
  initialCount = 3,
  loadMoreCount = 3,
  children,
  visibleSections,
  loadingText = 'loading more...',
  threshold = 0.1
}: LazyLoadingProps<T>) {
  const [displayCount, setDisplayCount] = useState(initialCount);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loadMoreObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && displayCount < items.length) {
          setDisplayCount(prev => Math.min(prev + loadMoreCount, items.length));
        }
      },
      { threshold }
    );

    if (loadMoreRef.current) {
      loadMoreObserver.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        loadMoreObserver.unobserve(loadMoreRef.current);
      }
    };
  }, [displayCount, items.length, loadMoreCount, threshold]);

  return (
    <>
      {children(items.slice(0, displayCount), visibleSections)}
      
      {displayCount < items.length && (
        <div ref={loadMoreRef} className="h-20 flex items-center justify-center mt-8">
          <div className="animate-pulse text-gray-400 text-sm lowercase">{loadingText}</div>
        </div>
      )}
    </>
  );
}