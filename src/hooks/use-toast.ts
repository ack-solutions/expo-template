import type { FeedbackVariant } from '@/components/ui/feedback-dialog';
import { useCallback, useState } from 'react';

export type { FeedbackVariant };

interface FeedbackState {
  visible: boolean;
  message: string;
  variant: FeedbackVariant;
  /** Optional title; defaults per variant in FeedbackDialog */
  title?: string;
}

const initial: FeedbackState = {
  visible: false,
  message: '',
  variant: 'info',
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
      variant: FeedbackVariant = 'info',
      options?: ShowToastOptions,
    ) => {
      setToast({
        visible: true,
        message,
        variant,
        title: options?.title,
      });
    },
    [],
  );

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  return { toast, showToast, hideToast };
}
