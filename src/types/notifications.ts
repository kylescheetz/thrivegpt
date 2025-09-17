export interface NotificationSettings {
  dailyReminders: boolean;
  habitReminders: boolean;
  weeklyReports: boolean;
  motivationalMessages: boolean;
  reminderTime: 'morning' | 'afternoon' | 'evening';
  frequency: 'daily' | 'weekly' | 'custom';
  morningTime?: string; // Format: "HH:MM"
  eveningTime?: string; // Format: "HH:MM"
  weeklyDay?: number; // 0-6 (Sunday-Saturday)
  weeklyTime?: string; // Format: "HH:MM"
}

export interface NotificationSchedule {
  id: number;
  title: string;
  body: string;
  schedule: {
    on: {
      hour: number;
      minute: number;
      weekday?: number;
    };
    every?: 'day' | 'week';
    count?: number;
  };
  extra?: Record<string, any>;
}

export interface NotificationPermissionStatus {
  display: 'granted' | 'denied' | 'prompt';
}

export enum NotificationType {
  MORNING_REMINDER = 'morning_reminder',
  EVENING_REMINDER = 'evening_reminder',
  WEEKLY_SUMMARY = 'weekly_summary',
  HABIT_STREAK = 'habit_streak',
  MOTIVATIONAL = 'motivational'
}

export interface NotificationContent {
  type: NotificationType;
  title: string;
  body: string;
  icon?: string;
  actionTypeId?: string;
}

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  dailyReminders: true,
  habitReminders: true,
  weeklyReports: true,
  motivationalMessages: true,
  reminderTime: 'morning',
  frequency: 'daily',
  morningTime: '09:00',
  eveningTime: '18:00',
  weeklyDay: 0, // Sunday
  weeklyTime: '10:00'
};

export const NOTIFICATION_MESSAGES = {
  [NotificationType.MORNING_REMINDER]: {
    title: "Ready to start strong? 💪",
    body: "Log your goals and make today count!"
  },
  [NotificationType.EVENING_REMINDER]: {
    title: "Time to reflect & track 🌅",
    body: "How did your habits go today?"
  },
  [NotificationType.WEEKLY_SUMMARY]: {
    title: "Your ThriveGPT summary is ready! 📊",
    body: "Check out your weekly progress and insights"
  },
  [NotificationType.HABIT_STREAK]: {
    title: "Streak Alert! 🔥",
    body: "Keep your momentum going strong!"
  },
  [NotificationType.MOTIVATIONAL]: {
    title: "You've got this! ✨",
    body: "Small steps lead to big changes"
  }
};