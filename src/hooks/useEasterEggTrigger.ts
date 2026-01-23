import { useRef, useCallback, useEffect } from 'react';
import { useEasterEggs } from './useEasterEggs';
import type { EasterEggId } from '../data/easterEggs';

export function useEasterEggTrigger(
  eggId: EasterEggId,
  options: {
    trigger?: 'click' | 'longPress' | 'multiClick' | 'doubleTap';
    multiClickCount?: number;
    multiClickTimeout?: number;
    longPressDelay?: number;
  }
) {
  const { triggerEgg } = useEasterEggs();
  const timeoutRef = useRef<number | undefined>(undefined);
  const clickCountRef = useRef(0);
  const longPressTimerRef = useRef<number | undefined>(undefined);

  const {
    trigger = 'click',
    multiClickCount = 3,
    multiClickTimeout = 500,
    longPressDelay = 800,
  } = options;

  const handleInteraction = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.stopPropagation();

      if (trigger === 'click') {
        triggerEgg(eggId);
      } else if (trigger === 'doubleTap') {
        clickCountRef.current += 1;

        if (clickCountRef.current === 2) {
          triggerEgg(eggId);
          clickCountRef.current = 0;
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          return;
        }

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          clickCountRef.current = 0;
        }, multiClickTimeout);
      } else if (trigger === 'multiClick') {
        clickCountRef.current += 1;

        if (clickCountRef.current >= multiClickCount) {
          triggerEgg(eggId);
          clickCountRef.current = 0;
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          return;
        }

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          clickCountRef.current = 0;
        }, multiClickTimeout);
      }
    },
    [eggId, trigger, multiClickCount, multiClickTimeout, triggerEgg]
  );

  const handleLongPressStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.stopPropagation();

      if (trigger === 'longPress') {
        longPressTimerRef.current = setTimeout(() => {
          triggerEgg(eggId);
        }, longPressDelay);
      }
    },
    [eggId, trigger, longPressDelay, triggerEgg]
  );

  const handleLongPressEnd = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    handleLongPressEnd();
  }, [handleLongPressEnd]);

  const handleMouseLeave = useCallback(() => {
    handleLongPressEnd();
  }, [handleLongPressEnd]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

  if (trigger === 'longPress') {
    return {
      onMouseDown: handleLongPressStart,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseLeave,
      onTouchStart: handleLongPressStart,
      onTouchEnd: handleLongPressEnd,
      onTouchCancel: handleLongPressEnd,
    };
  }

  if (trigger === 'doubleTap' || trigger === 'multiClick') {
    return {
      onClick: handleInteraction,
    };
  }

  return {
    onClick: handleInteraction,
  };
}
