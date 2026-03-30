// src/hooks/useTouchGestures.ts

import { useRef, useCallback, useEffect } from 'react';
import type { TouchEvent } from 'react';

interface UseTouchGesturesOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  enabled?: boolean;
}

export function useTouchGestures<T extends HTMLElement = HTMLDivElement>({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  enabled = true,
}: UseTouchGesturesOptions) {
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const touchEndY = useRef<number>(0);
  const isSwiping = useRef<boolean>(false);

  const handleTouchStart = useCallback((e: TouchEvent<T>) => {
    if (!enabled) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isSwiping.current = false;
  }, [enabled]);

  const handleTouchMove = useCallback((e: TouchEvent<T>) => {
    if (!enabled) return;
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;

    const deltaX = Math.abs(touchEndX.current - touchStartX.current);
    const deltaY = Math.abs(touchEndY.current - touchStartY.current);

    if (deltaX > 10 || deltaY > 10) {
      isSwiping.current = true;
    }
  }, [enabled]);

  const handleTouchEnd = useCallback((e: TouchEvent<T>) => {
    if (!enabled || !isSwiping.current) return;

    const deltaX = touchEndX.current - touchStartX.current;
    const deltaY = touchEndY.current - touchStartY.current;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    if (absDeltaX > threshold && absDeltaX > absDeltaY) {
      deltaX > 0 ? onSwipeRight?.() : onSwipeLeft?.();
    } else if (absDeltaY > threshold) {
      deltaY > 0 ? onSwipeDown?.() : onSwipeUp?.();
    }

    isSwiping.current = false;
  }, [enabled, threshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}

export function useSmoothScroll(
  ref: React.RefObject<HTMLElement>,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled || !ref.current) return;

    ref.current.style.scrollBehavior = 'smooth';

    return () => {
      if (ref.current) {
        ref.current.style.scrollBehavior = '';
      }
    };
  }, [ref, enabled]);
}

export function useSnapScroll(
  ref: React.RefObject<HTMLElement>,
  options: {
    enabled?: boolean;
    snapAlign?: 'start' | 'center' | 'end';
    snapStop?: 'normal' | 'always';
  } = {}
) {
  const { enabled = true, snapAlign = 'center', snapStop = 'normal' } = options;

  useEffect(() => {
    if (!enabled || !ref.current) return;

    const element = ref.current;
    element.style.scrollSnapType = 'x mandatory';

    Array.from(element.children).forEach((child) => {
      (child as HTMLElement).style.scrollSnapAlign = snapAlign;
      (child as HTMLElement).style.scrollSnapStop = snapStop;
    });

    return () => {
      element.style.scrollSnapType = '';
      Array.from(element.children).forEach((child) => {
        (child as HTMLElement).style.scrollSnapAlign = '';
        (child as HTMLElement).style.scrollSnapStop = '';
      });
    };
  }, [ref, enabled, snapAlign, snapStop]);
}