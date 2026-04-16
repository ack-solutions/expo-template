import type { FeedbackColor } from '@/components/ui/feedback-dialog';
import { useCallback, useState } from 'react';

export type { FeedbackColor };

interface FeedbackState {
  visible: boolean;
  message: string;
  color: FeedbackColor;
  /** Optional title; defaults per color in FeedbackDialog */
  title?: string;
}

const initial: FeedbackState = {
  visible: false,
  message: '',
  color: 'info',
};

export type ShowToastOptions = {
  title?: string;
};

/**
 * Manages modal feedback (replaces transient toasts).
 *
 * ```tsx
 * const { toast, showToast, hideToast } = useToast();
 * showToast('Saved', 'success');
 * <FeedbackDialog {...toast} onDismiss={hideToast} />
 * ```
 */
export function useToast() {
  const [toast, setToast] = useState<FeedbackState>(initial);

  const showToast = useCallback(
    (
      message: string,
      color: FeedbackColor = 'info',
      options?: ShowToastOptions,
    ) => {
      setToast({
        visible: true,
        message,
        color,
        title: options?.title,
      });
    },
    [],
  );

  const hideToast = useCallback(() => {
    setToast((prev) => ({
      ...prev,
      visible: false,
    }));
  }, []);

  return {
    toast,
    showToast,
    hideToast,
  };
}
