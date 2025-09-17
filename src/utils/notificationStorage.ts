import { NotificationSettings, DEFAULT_NOTIFICATION_SETTINGS } from '../types/notifications';

const NOTIFICATION_SETTINGS_KEY = 'thrive_notification_settings';
const NOTIFICATION_PERMISSIONS_KEY = 'thrive_notification_permissions';

export class NotificationStorage {
  static getSettings(): NotificationSettings {
    try {
      const stored = localStorage.getItem(NOTIFICATION_SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with defaults to ensure all properties exist
        return { ...DEFAULT_NOTIFICATION_SETTINGS, ...parsed };
      }
    } catch (error) {
      console.warn('Error loading notification settings:', error);
    }
    return DEFAULT_NOTIFICATION_SETTINGS;
  }

  static saveSettings(settings: NotificationSettings): void {
    try {
      localStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  }

  static updateSetting<K extends keyof NotificationSettings>(
    key: K,
    value: NotificationSettings[K]
  ): NotificationSettings {
    const currentSettings = this.getSettings();
    const updatedSettings = { ...currentSettings, [key]: value };
    this.saveSettings(updatedSettings);
    return updatedSettings;
  }

  static getPermissionStatus(): boolean {
    try {
      const stored = localStorage.getItem(NOTIFICATION_PERMISSIONS_KEY);
      return stored ? JSON.parse(stored) : false;
    } catch (error) {
      console.warn('Error loading notification permissions:', error);
      return false;
    }
  }

  static savePermissionStatus(granted: boolean): void {
    try {
      localStorage.setItem(NOTIFICATION_PERMISSIONS_KEY, JSON.stringify(granted));
    } catch (error) {
      console.error('Error saving notification permissions:', error);
    }
  }

  static clearSettings(): void {
    try {
      localStorage.removeItem(NOTIFICATION_SETTINGS_KEY);
      localStorage.removeItem(NOTIFICATION_PERMISSIONS_KEY);
    } catch (error) {
      console.error('Error clearing notification settings:', error);
    }
  }

  static exportSettings(): string {
    const settings = this.getSettings();
    const permissions = this.getPermissionStatus();
    return JSON.stringify({ settings, permissions }, null, 2);
  }

  static importSettings(data: string): boolean {
    try {
      const parsed = JSON.parse(data);
      if (parsed.settings) {
        this.saveSettings(parsed.settings);
      }
      if (typeof parsed.permissions === 'boolean') {
        this.savePermissionStatus(parsed.permissions);
      }
      return true;
    } catch (error) {
      console.error('Error importing notification settings:', error);
      return false;
    }
  }
}