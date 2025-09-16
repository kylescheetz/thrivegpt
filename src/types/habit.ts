export interface Habit {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  createdAt: string;
}

export interface HabitCompletion {
  habitId: string;
  date: string; // YYYY-MM-DD format
  completed: boolean;
  completedAt?: string;
}

export interface HabitStreak {
  habitId: string;
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate?: string;
}

export interface DailyProgress {
  date: string;
  completions: HabitCompletion[];
  totalHabits: number;
  completedHabits: number;
  completionRate: number;
  endedDay: boolean;
  summary?: string;
}