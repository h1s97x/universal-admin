'use client';

import { type FC, type ReactNode } from 'react';
import { NotifyToast, type NotifyToastProps } from './notify-toast';
import { useNotify } from '../hooks/use-notify';
import { cn } from '../utils';

export interface NotifyContainerProps {
  /**
   * Position of the notification container
   * @default 'top-right'
   */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  /**
   * Custom className for the container
   */
  className?: string;
  /**
   * Custom toast component
   */
  renderToast?: (props: NotifyToastProps) => ReactNode;
}

const positionClasses = {
  'top-left': 'items-start justify-start',
  'top-right': 'items-start justify-end',
  'bottom-left': 'items-end justify-start',
  'bottom-right': 'items-end justify-end',
};

export const NotifyContainer: FC<NotifyContainerProps> = ({
  position = 'top-right',
  className,
  renderToast,
}) => {
  const { notifications, remove } = useNotify();

  return (
    <div
      className={cn(
        'fixed z-50 flex flex-col gap-2 p-4 pointer-events-none',
        'max-w-md w-full',
        positionClasses[position],
        className
      )}
      aria-live="polite"
      aria-label="Notifications"
    >
      {notifications.map((notification) =>
        renderToast ? (
          <div key={notification.id} className="pointer-events-auto">
            {renderToast({ notification, onClose: remove })}
          </div>
        ) : (
          <div key={notification.id} className="pointer-events-auto">
            <NotifyToast notification={notification} onClose={remove} />
          </div>
        )
      )}
    </div>
  );
};
