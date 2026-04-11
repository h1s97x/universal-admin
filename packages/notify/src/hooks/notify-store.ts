import { type ClassValue, clsx } from 'clsx';
import { type NotifyAPI, type NotifyInstance, type NotifyOptions, type NotifyType } from '../types';

type Listener = (notifications: NotifyInstance[]) => void;

class NotifyStore {
  private notifications: NotifyInstance[] = [];
  private listeners: Set<Listener> = new Set();
  private timers: Map<string, NodeJS.Timeout> = new Map();

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.notifications);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener([...this.notifications]));
  }

  private createNotification(options: NotifyOptions): NotifyInstance {
    const {
      type = 'info',
      title,
      message,
      duration = 3000,
      closable = true,
      onClose,
    } = options;

    return {
      id: `notify_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      type,
      title,
      message,
      duration,
      closable,
      onClose,
      createdAt: Date.now(),
    };
  }

  private setTimer(notification: NotifyInstance): void {
    if (notification.duration > 0) {
      const timer = setTimeout(() => {
        this.remove(notification.id);
      }, notification.duration);
      this.timers.set(notification.id, timer);
    }
  }

  private clearTimer(id: string): void {
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }
  }

  add(options: NotifyOptions): string {
    const notification = this.createNotification(options);
    this.notifications.push(notification);
    this.notify();
    this.setTimer(notification);
    return notification.id;
  }

  remove(id: string): void {
    this.clearTimer(id);
    const index = this.notifications.findIndex((n) => n.id === id);
    if (index !== -1) {
      const notification = this.notifications[index];
      notification.onClose?.();
      this.notifications.splice(index, 1);
      this.notify();
    }
  }

  removeAll(): void {
    this.timers.forEach((timer) => clearTimeout(timer));
    this.timers.clear();
    this.notifications.forEach((n) => n.onClose?.());
    this.notifications = [];
    this.notify();
  }

  update(id: string, options: Partial<NotifyOptions>): void {
    const index = this.notifications.findIndex((n) => n.id === id);
    if (index !== -1) {
      this.clearTimer(id);
      this.notifications[index] = {
        ...this.notifications[index],
        ...options,
      };
      this.notify();
      if (this.notifications[index].duration > 0) {
        this.setTimer(this.notifications[index]);
      }
    }
  }

  getNotifications(): NotifyInstance[] {
    return [...this.notifications];
  }
}

const notifyStore = new NotifyStore();

export function createNotifyAPI(): NotifyAPI {
  const notify = (options: NotifyOptions): string => {
    return notifyStore.add(options);
  };

  const createTypeHandler =
    (type: NotifyType): NotifyAPI['success'] =>
    (message: string, options = {}) =>
      notifyStore.add({ type, message, ...options });

  return {
    notify,
    success: createTypeHandler('success'),
    error: createTypeHandler('error'),
    warning: createTypeHandler('warning'),
    info: createTypeHandler('info'),
    loading: createTypeHandler('loading'),
    remove: (id: string) => notifyStore.remove(id),
    removeAll: () => notifyStore.removeAll(),
    update: (id: string, options: Partial<NotifyOptions>) =>
      notifyStore.update(id, options),
  };
}

export { notifyStore };
