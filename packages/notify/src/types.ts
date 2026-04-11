export type NotifyType = 'success' | 'error' | 'warning' | 'info' | 'loading';

export interface NotifyOptions {
  type?: NotifyType;
  title?: string;
  message: string;
  duration?: number;
  closable?: boolean;
  onClose?: () => void;
}

export interface NotifyInstance {
  id: string;
  type: NotifyType;
  title?: string;
  message: string;
  duration: number;
  closable: boolean;
  onClose?: () => void;
  createdAt: number;
}

export type NotifyFunction = (options: NotifyOptions) => string;

export type NotifyTypeFunction = (
  message: string,
  options?: Omit<NotifyOptions, 'message' | 'type'>
) => string;

export interface NotifyAPI {
  notify: NotifyFunction;
  success: NotifyTypeFunction;
  error: NotifyTypeFunction;
  warning: NotifyTypeFunction;
  info: NotifyTypeFunction;
  loading: NotifyTypeFunction;
  remove: (id: string) => void;
  removeAll: () => void;
  update: (id: string, options: Partial<NotifyOptions>) => void;
}
