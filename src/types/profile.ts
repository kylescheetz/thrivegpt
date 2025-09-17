export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinDate: string;
  preferences: UserPreferences;
  stats: UserStats;
}

export interface UserPreferences {
  voiceInputEnabled: boolean;
  reminderFrequency: ReminderFrequency;
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  dataSharing: boolean;
  personalizedInsights: boolean;
}

export interface UserStats {
  currentStreak: number;
  totalHabitsCompleted: number;
  journalEntries: number;
  coachingSessions: number;
  goalsCompleted: number;
  totalDaysActive: number;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: GoalCategory;
  priority: Priority;
  status: GoalStatus;
  targetValue?: number;
  currentValue?: number;
  unit?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface TrackedHabit {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: HabitCategory;
  difficulty: Difficulty;
  frequency: HabitFrequency;
  targetValue?: number;
  unit?: string;
  streak: number;
  completedToday: boolean;
  createdAt: string;
  lastCompletedAt?: string;
  completionHistory: HabitCompletion[];
}

export interface HabitCompletion {
  date: string;
  completed: boolean;
  value?: number;
  notes?: string;
}

export interface WeeklySummary {
  weekStart: string;
  weekEnd: string;
  goalsProgress: GoalProgress[];
  habitsCompleted: HabitSummary[];
  overallScore: number;
  insights: string[];
  achievements: Achievement[];
}

export interface GoalProgress {
  goalId: string;
  goalTitle: string;
  progressPercentage: number;
  completed: boolean;
}

export interface HabitSummary {
  habitId: string;
  habitTitle: string;
  completionRate: number;
  streak: number;
  daysCompleted: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  type: AchievementType;
}

// Enums
export type GoalCategory = 'energy' | 'focus' | 'sleep' | 'longevity' | 'fitness' | 'nutrition' | 'mindfulness' | 'productivity';

export type HabitCategory = 'health' | 'movement' | 'mindfulness' | 'growth' | 'nutrition' | 'productivity' | 'social' | 'environment';

export type Priority = 'low' | 'medium' | 'high' | 'critical';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type GoalStatus = 'active' | 'completed' | 'paused' | 'archived';

export type HabitFrequency = 'daily' | 'weekly' | 'custom';

export type ReminderFrequency = 'never' | 'daily' | 'twice-daily' | 'custom';

export type AchievementType = 'streak' | 'goal' | 'habit' | 'milestone' | 'special';

// Default values
export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  voiceInputEnabled: false,
  reminderFrequency: 'daily',
  theme: 'system',
  language: 'en',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  dataSharing: true,
  personalizedInsights: true,
};

export const DEFAULT_USER_STATS: UserStats = {
  currentStreak: 0,
  totalHabitsCompleted: 0,
  journalEntries: 0,
  coachingSessions: 0,
  goalsCompleted: 0,
  totalDaysActive: 0,
};

// Goal and Habit Libraries
export const WELLNESS_GOALS = [
  {
    id: 'energy',
    title: 'Energy',
    description: 'Boost vitality and combat fatigue',
    icon: '⚡',
    category: 'energy' as GoalCategory
  },
  {
    id: 'focus',
    title: 'Focus',
    description: 'Enhance concentration and productivity',
    icon: '🎯',
    category: 'focus' as GoalCategory
  },
  {
    id: 'sleep',
    title: 'Sleep',
    description: 'Improve sleep quality and rest',
    icon: '🌙',
    category: 'sleep' as GoalCategory
  },
  {
    id: 'longevity',
    title: 'Longevity',
    description: 'Build long-term health and wellness',
    icon: '❤️',
    category: 'longevity' as GoalCategory
  },
  {
    id: 'fitness',
    title: 'Fitness',
    description: 'Build strength and physical endurance',
    icon: '💪',
    category: 'fitness' as GoalCategory
  },
  {
    id: 'nutrition',
    title: 'Nutrition',
    description: 'Optimize diet and eating habits',
    icon: '🥗',
    category: 'nutrition' as GoalCategory
  },
  {
    id: 'mindfulness',
    title: 'Mindfulness',
    description: 'Cultivate awareness and mental clarity',
    icon: '🧘',
    category: 'mindfulness' as GoalCategory
  },
  {
    id: 'productivity',
    title: 'Productivity',
    description: 'Optimize work and time management',
    icon: '📈',
    category: 'productivity' as GoalCategory
  }
];

export const HABIT_LIBRARY = [
  {
    id: 'water',
    title: 'Drink Water',
    description: '8 glasses throughout the day',
    icon: '💧',
    category: 'health' as HabitCategory,
    difficulty: 'easy' as Difficulty
  },
  {
    id: 'morning-walk',
    title: 'Morning Walk',
    description: '10-minute walk after waking up',
    icon: '🚶',
    category: 'movement' as HabitCategory,
    difficulty: 'easy' as Difficulty
  },
  {
    id: 'meditation',
    title: 'Daily Meditation',
    description: '5 minutes of mindfulness',
    icon: '🧠',
    category: 'mindfulness' as HabitCategory,
    difficulty: 'medium' as Difficulty
  },
  {
    id: 'reading',
    title: 'Read Daily',
    description: '15 minutes of reading',
    icon: '📚',
    category: 'growth' as HabitCategory,
    difficulty: 'easy' as Difficulty
  },
  {
    id: 'healthy-breakfast',
    title: 'Healthy Breakfast',
    description: 'Nutritious morning meal',
    icon: '🍳',
    category: 'nutrition' as HabitCategory,
    difficulty: 'medium' as Difficulty
  },
  {
    id: 'exercise',
    title: 'Exercise',
    description: '20 minutes of physical activity',
    icon: '🏋️',
    category: 'movement' as HabitCategory,
    difficulty: 'medium' as Difficulty
  },
  {
    id: 'gratitude',
    title: 'Gratitude Practice',
    description: "Write 3 things you're grateful for",
    icon: '💝',
    category: 'mindfulness' as HabitCategory,
    difficulty: 'easy' as Difficulty
  },
  {
    id: 'morning-sun',
    title: 'Morning Sunlight',
    description: '10 minutes of natural light exposure',
    icon: '☀️',
    category: 'health' as HabitCategory,
    difficulty: 'easy' as Difficulty
  },
  {
    id: 'pomodoro',
    title: 'Pomodoro Focus',
    description: '25-minute focused work sessions',
    icon: '⏲️',
    category: 'productivity' as HabitCategory,
    difficulty: 'medium' as Difficulty
  }
];

// Utility functions
export const getGoalById = (id: string) => WELLNESS_GOALS.find(goal => goal.id === id);
export const getHabitById = (id: string) => HABIT_LIBRARY.find(habit => habit.id === id);

export const calculateGoalProgress = (goal: Goal): number => {
  if (!goal.targetValue || !goal.currentValue) return 0;
  return Math.min((goal.currentValue / goal.targetValue) * 100, 100);
};

export const calculateHabitCompletionRate = (habit: TrackedHabit, days: number = 7): number => {
  if (habit.completionHistory.length === 0) return 0;
  
  const recentHistory = habit.completionHistory
    .slice(-days)
    .filter(completion => completion.completed);
  
  return (recentHistory.length / days) * 100;
};