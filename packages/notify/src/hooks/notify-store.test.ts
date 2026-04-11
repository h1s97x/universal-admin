import { describe, expect, it, vi, beforeEach } from 'vitest';
import { notifyStore, createNotifyAPI } from './notify-store';

describe('notifyStore', () => {
  beforeEach(() => {
    notifyStore.removeAll();
  });

  describe('add', () => {
    it('should add a notification', () => {
      const id = notifyStore.add({ message: 'Test notification' });
      expect(id).toBeTruthy();
      const notifications = notifyStore.getNotifications();
      expect(notifications).toHaveLength(1);
      expect(notifications[0].message).toBe('Test notification');
    });

    it('should set default type to info', () => {
      notifyStore.add({ message: 'Test' });
      const notifications = notifyStore.getNotifications();
      expect(notifications[0].type).toBe('info');
    });

    it('should support custom type', () => {
      notifyStore.add({ type: 'success', message: 'Success!' });
      const notifications = notifyStore.getNotifications();
      expect(notifications[0].type).toBe('success');
    });

    it('should set default duration of 3000ms', () => {
      notifyStore.add({ message: 'Test' });
      const notifications = notifyStore.getNotifications();
      expect(notifications[0].duration).toBe(3000);
    });

    it('should support custom duration', () => {
      notifyStore.add({ message: 'Test', duration: 5000 });
      const notifications = notifyStore.getNotifications();
      expect(notifications[0].duration).toBe(5000);
    });

    it('should support title', () => {
      notifyStore.add({ title: 'Title', message: 'Test' });
      const notifications = notifyStore.getNotifications();
      expect(notifications[0].title).toBe('Title');
    });
  });

  describe('remove', () => {
    it('should remove a notification by id', () => {
      const id = notifyStore.add({ message: 'Test' });
      notifyStore.remove(id);
      const notifications = notifyStore.getNotifications();
      expect(notifications).toHaveLength(0);
    });

    it('should call onClose callback', () => {
      const onClose = vi.fn();
      const id = notifyStore.add({ message: 'Test', onClose });
      notifyStore.remove(id);
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('removeAll', () => {
    it('should remove all notifications', () => {
      notifyStore.add({ message: 'Test 1' });
      notifyStore.add({ message: 'Test 2' });
      notifyStore.removeAll();
      const notifications = notifyStore.getNotifications();
      expect(notifications).toHaveLength(0);
    });
  });

  describe('update', () => {
    it('should update a notification', () => {
      const id = notifyStore.add({ message: 'Original' });
      notifyStore.update(id, { message: 'Updated' });
      const notifications = notifyStore.getNotifications();
      expect(notifications[0].message).toBe('Updated');
    });
  });

  describe('subscribe', () => {
    it('should call listener on changes', () => {
      const listener = vi.fn();
      const unsubscribe = notifyStore.subscribe(listener);
      
      notifyStore.add({ message: 'Test' });
      
      expect(listener).toHaveBeenCalled();
      
      const calls = listener.mock.calls;
      expect(calls[calls.length - 1][0]).toHaveLength(1);
      
      unsubscribe();
    });

    it('should return unsubscribe function', () => {
      const listener = vi.fn();
      const unsubscribe = notifyStore.subscribe(listener);
      
      unsubscribe();
      notifyStore.add({ message: 'Test' });
      
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });
});

describe('createNotifyAPI', () => {
  beforeEach(() => {
    notifyStore.removeAll();
  });

  it('should create a notify API', () => {
    const api = createNotifyAPI();
    expect(api.notify).toBeDefined();
    expect(api.success).toBeDefined();
    expect(api.error).toBeDefined();
    expect(api.warning).toBeDefined();
    expect(api.info).toBeDefined();
    expect(api.remove).toBeDefined();
    expect(api.removeAll).toBeDefined();
    expect(api.update).toBeDefined();
  });

  it('should show success notification', () => {
    const api = createNotifyAPI();
    const id = api.success('Operation completed!');
    const notifications = notifyStore.getNotifications();
    expect(notifications[0].type).toBe('success');
    expect(notifications[0].message).toBe('Operation completed!');
  });

  it('should show error notification', () => {
    const api = createNotifyAPI();
    api.error('Something went wrong');
    const notifications = notifyStore.getNotifications();
    expect(notifications[0].type).toBe('error');
  });

  it('should show warning notification', () => {
    const api = createNotifyAPI();
    api.warning('Be careful!');
    const notifications = notifyStore.getNotifications();
    expect(notifications[0].type).toBe('warning');
  });

  it('should show info notification', () => {
    const api = createNotifyAPI();
    api.info('Here is some info');
    const notifications = notifyStore.getNotifications();
    expect(notifications[0].type).toBe('info');
  });

  it('should show loading notification', () => {
    const api = createNotifyAPI();
    api.loading('Loading...');
    const notifications = notifyStore.getNotifications();
    expect(notifications[0].type).toBe('loading');
  });

  it('should support additional options', () => {
    const api = createNotifyAPI();
    api.success('Message', { title: 'Title', duration: 5000 });
    const notifications = notifyStore.getNotifications();
    expect(notifications[0].title).toBe('Title');
    expect(notifications[0].duration).toBe(5000);
  });

  it('should remove notification', () => {
    const api = createNotifyAPI();
    const id = api.success('Test');
    api.remove(id);
    const notifications = notifyStore.getNotifications();
    expect(notifications).toHaveLength(0);
  });
});
