import { LocalNotifications, LocalNotificationSchema } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import {
  NotificationSettings,
  NotificationSchedule,
  NotificationType,
  NOTIFICATION_MESSAGES,
} from '../types/notifications';
import { NotificationStorage } from '../utils/notificationStorage';

export class NotificationService {
  private static instance: NotificationService;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Only initialize on mobile platforms
      if (Capacitor.isNativePlatform()) {
        await this.requestPermissions();
        await this.setupNotificationHandlers();
      }
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize notification service:', error);
    }
  }

  async requestPermissions(): Promise<boolean> {
    try {
      const result = await LocalNotifications.requestPermissions();
      const granted = result.display === 'granted';
      NotificationStorage.savePermissionStatus(granted);
      return granted;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  async checkPermissions(): Promise<boolean> {
    try {
      const result = await LocalNotifications.checkPermissions();
      const granted = result.display === 'granted';
      NotificationStorage.savePermissionStatus(granted);
      return granted;
    } catch (error) {
      console.error('Error checking notification permissions:', error);
      return false;
    }
  }

  private async setupNotificationHandlers(): Promise<void> {
    // Handle notification received while app is in foreground
    LocalNotifications.addListener('localNotificationReceived', (notification) => {
      console.log('Notification received:', notification);
    });

    // Handle notification action performed
    LocalNotifications.addListener('localNotificationActionPerformed', (notificationAction) => {
      console.log('Notification action performed:', notificationAction);
      // You can add navigation logic here based on notification type
    });
  }

  async scheduleAllNotifications(): Promise<void> {
    const settings = NotificationStorage.getSettings();
    const hasPermission = await this.checkPermissions();

    if (!hasPermission) {
      console.warn('No notification permissions, skipping scheduling');
      return;
    }

    // Clear existing notifications
    await this.cancelAllNotifications();

    const notifications: LocalNotificationSchema[] = [];

    // Schedule morning reminders
    if (settings.dailyReminders && settings.morningTime) {
      const morningNotification = this.createMorningNotification(settings);
      if (morningNotification) notifications.push(morningNotification);
    }

    // Schedule evening reminders
    if (settings.dailyReminders && settings.eveningTime) {
      const eveningNotification = this.createEveningNotification(settings);
      if (eveningNotification) notifications.push(eveningNotification);
    }

    // Schedule weekly summary
    if (settings.weeklyReports && settings.weeklyDay !== undefined && settings.weeklyTime) {
      const weeklyNotification = this.createWeeklyNotification(settings);
      if (weeklyNotification) notifications.push(weeklyNotification);
    }

    // Schedule motivational messages (if enabled)
    if (settings.motivationalMessages) {
      const motivationalNotification = this.createMotivationalNotification();
      if (motivationalNotification) notifications.push(motivationalNotification);
    }

    if (notifications.length > 0) {
      try {
        await LocalNotifications.schedule({ notifications });
        console.log(`Scheduled ${notifications.length} notifications`);
      } catch (error) {
        console.error('Error scheduling notifications:', error);
      }
    }
  }

  private createMorningNotification(settings: NotificationSettings): LocalNotificationSchema | null {
    if (!settings.morningTime) return null;

    const [hour, minute] = settings.morningTime.split(':').map(Number);
    const message = NOTIFICATION_MESSAGES[NotificationType.MORNING_REMINDER];

    return {
      title: message.title,
      body: message.body,
      id: 1,
      schedule: {
        on: { hour, minute },
        repeats: true,
        every: 'day'
      },
      extra: {
        type: NotificationType.MORNING_REMINDER
      }
    };
  }

  private createEveningNotification(settings: NotificationSettings): LocalNotificationSchema | null {
    if (!settings.eveningTime) return null;

    const [hour, minute] = settings.eveningTime.split(':').map(Number);
    const message = NOTIFICATION_MESSAGES[NotificationType.EVENING_REMINDER];

    return {
      title: message.title,
      body: message.body,
      id: 2,
      schedule: {
        on: { hour, minute },
        repeats: true,
        every: 'day'
      },
      extra: {
        type: NotificationType.EVENING_REMINDER
      }
    };
  }

  private createWeeklyNotification(settings: NotificationSettings): LocalNotificationSchema | null {
    if (settings.weeklyDay === undefined || !settings.weeklyTime) return null;

    const [hour, minute] = settings.weeklyTime.split(':').map(Number);
    const message = NOTIFICATION_MESSAGES[NotificationType.WEEKLY_SUMMARY];

    return {
      title: message.title,
      body: message.body,
      id: 3,
      schedule: {
        on: { 
          hour, 
          minute, 
          weekday: settings.weeklyDay + 1 // Capacitor uses 1-7 for Sunday-Saturday
        },
        repeats: true,
        every: 'week'
      },
      extra: {
        type: NotificationType.WEEKLY_SUMMARY
      }
    };
  }

  private createMotivationalNotification(): LocalNotificationSchema | null {
    const message = NOTIFICATION_MESSAGES[NotificationType.MOTIVATIONAL];
    
    // Schedule motivational messages for mid-afternoon (2 PM) every 3 days
    return {
      title: message.title,
      body: message.body,
      id: 4,
      schedule: {
        on: { hour: 14, minute: 0 },
        repeats: true,
        every: 'day'
      },
      extra: {
        type: NotificationType.MOTIVATIONAL
      }
    };
  }

  async cancelAllNotifications(): Promise<void> {
    try {
      await LocalNotifications.cancel({ notifications: [
        { id: 1 }, // Morning
        { id: 2 }, // Evening
        { id: 3 }, // Weekly
        { id: 4 }, // Motivational
      ]});
    } catch (error) {
      console.error('Error canceling notifications:', error);
    }
  }

  async cancelNotification(id: number): Promise<void> {
    try {
      await LocalNotifications.cancel({ notifications: [{ id }] });
    } catch (error) {
      console.error(`Error canceling notification ${id}:`, error);
    }
  }

  async getPendingNotifications(): Promise<any[]> {
    try {
      const result = await LocalNotifications.getPending();
      return result.notifications;
    } catch (error) {
      console.error('Error getting pending notifications:', error);
      return [];
    }
  }

  async scheduleTestNotification(): Promise<void> {
    const hasPermission = await this.checkPermissions();
    if (!hasPermission) {
      throw new Error('No notification permissions');
    }

    const now = new Date();
    now.setSeconds(now.getSeconds() + 5); // 5 seconds from now

    await LocalNotifications.schedule({
      notifications: [{
        title: 'ThriveGPT Test 🧪',
        body: 'This is a test notification!',
        id: 999,
        schedule: {
          at: now
        },
        extra: {
          type: 'test'
        }
      }]
    });
  }

  // Update notification settings and reschedule
  async updateSettings(settings: NotificationSettings): Promise<void> {
    NotificationStorage.saveSettings(settings);
    await this.scheduleAllNotifications();
  }

  // Get current settings
  getSettings(): NotificationSettings {
    return NotificationStorage.getSettings();
  }

  // Check if running on supported platform
  isSupported(): boolean {
    return Capacitor.isNativePlatform();
  }

  // For web development/testing - show browser notifications
  async showWebNotification(title: string, body: string): Promise<void> {
    if (!Capacitor.isNativePlatform() && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(title, { body, icon: '/favicon.ico' });
      } else if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          new Notification(title, { body, icon: '/favicon.ico' });
        }
      }
    }
  }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance();