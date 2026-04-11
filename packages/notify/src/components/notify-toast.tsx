'use client';

import { type FC, memo, useCallback } from 'react';
import { cn } from '../utils';
import type { NotifyInstance, NotifyType } from '../types';

const iconMap: Record<NotifyType, string> = {
  success: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22,4 12,14.01 9,11.01"/>
    </svg>
  `,
  error: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="15" y1="9" x2="9" y2="15"/>
      <line x1="9" y1="9" x2="15" y2="15"/>
    </svg>
  `,
  warning: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  `,
  info: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="16" x2="12" y2="12"/>
      <line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  `,
  loading: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animate-spin">
      <line x1="12" y1="2" x2="12" y2="6"/>
      <line x1="12" y1="18" x2="12" y2="22"/>
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
      <line x1="2" y1="12" x2="6" y2="12"/>
      <line x1="18" y1="12" x2="22" y2="12"/>
      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/>
      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
    </svg>
  `,
};

const colorMap: Record<NotifyType, string> = {
  success: 'bg-green-50 border-green-500 text-green-800 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700',
  error: 'bg-red-50 border-red-500 text-red-800 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700',
  warning: 'bg-yellow-50 border-yellow-500 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700',
  info: 'bg-blue-50 border-blue-500 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700',
  loading: 'bg-gray-50 border-gray-500 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-600',
};

const iconColorMap: Record<NotifyType, string> = {
  success: 'text-green-500 dark:text-green-400',
  error: 'text-red-500 dark:text-red-400',
  warning: 'text-yellow-500 dark:text-yellow-400',
  info: 'text-blue-500 dark:text-blue-400',
  loading: 'text-gray-500 dark:text-gray-400',
};

export interface NotifyToastProps {
  notification: NotifyInstance;
  onClose: (id: string) => void;
}

export const NotifyToast: FC<NotifyToastProps> = memo(({ notification, onClose }) => {
  const { id, type, title, message, closable } = notification;

  const handleClose = useCallback(() => {
    onClose(id);
  }, [id, onClose]);

  return (
    <div
      className={cn(
        'relative flex items-start gap-3 p-4 rounded-lg border-l-4 shadow-lg',
        'transform transition-all duration-300 ease-out',
        'animate-slide-in-right',
        colorMap[type]
      )}
      role="alert"
    >
      <span
        className={cn('flex-shrink-0 mt-0.5', iconColorMap[type])}
        dangerouslySetInnerHTML={{ __html: iconMap[type] }}
      />
      <div className="flex-1 min-w-0">
        {title && <p className="font-semibold text-sm">{title}</p>}
        <p className={cn('text-sm', title && 'mt-1')}>{message}</p>
      </div>
      {closable && (
        <button
          onClick={handleClose}
          className="flex-shrink-0 ml-2 text-current opacity-50 hover:opacity-100 transition-opacity"
          aria-label="Close notification"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
});

NotifyToast.displayName = 'NotifyToast';
