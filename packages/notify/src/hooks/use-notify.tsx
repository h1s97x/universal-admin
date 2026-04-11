'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import { createNotifyAPI, notifyStore } from './notify-store';
import type { NotifyAPI, NotifyInstance, NotifyOptions } from '../types';

interface NotifyContextValue extends NotifyAPI {
  notifications: NotifyInstance[];
}

const NotifyContext = createContext<NotifyContextValue | null>(null);

export interface NotifyProviderProps {
  children: ReactNode;
  maxNotifications?: number;
  defaultDuration?: number;
}

export function NotifyProvider({
  children,
  maxNotifications = 5,
  defaultDuration = 3000,
}: NotifyProviderProps): ReactElement {
  const [notifications, setNotifications] = useState<NotifyInstance[]>([]);
  const [api] = useState<NotifyAPI>(() => createNotifyAPI());

  useEffect(() => {
    const unsubscribe = notifyStore.subscribe((newNotifications) => {
      setNotifications(newNotifications.slice(-maxNotifications));
    });
    return unsubscribe;
  }, [maxNotifications]);

  const notify = useCallback(
    (options: NotifyOptions) => {
      const finalOptions = {
        ...options,
        duration: options.duration ?? defaultDuration,
      };
      return api.notify(finalOptions);
    },
    [api, defaultDuration]
  );

  const value: NotifyContextValue = useMemo(
    () => ({
      ...api,
      notifications,
      notify,
    }),
    [api, notifications, notify]
  );

  return (
    <NotifyContext.Provider value={value}>{children}</NotifyContext.Provider>
  );
}

export function useNotify(): NotifyContextValue {
  const context = useContext(NotifyContext);
  if (!context) {
    throw new Error('useNotify must be used within a NotifyProvider');
  }
  return context;
}

export function useNotifyActions(): NotifyAPI {
  const { notify, success, error, warning, info, loading, remove, removeAll, update } =
    useNotify();
  return { notify, success, error, warning, info, loading, remove, removeAll, update };
}
