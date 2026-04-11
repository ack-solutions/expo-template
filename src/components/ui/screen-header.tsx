import React from 'react';

import { Toolbar, type ToolbarProps } from './toolbar';

/**
 * Header bar that expects top safe area from a parent such as `SafeScreen`.
 * Prefer `Toolbar` when the bar should apply the top inset itself (`safeAreaTop`).
 */
export type ScreenHeaderProps = Omit<ToolbarProps, 'safeAreaTop'>;

export function ScreenHeader(props: ScreenHeaderProps) {
  return <Toolbar {...props} safeAreaTop={false} />;
}
