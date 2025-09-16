import { Habit, HabitCompletion, HabitStreak, DailyProgress } from '@/types/habit';

const HABITS_KEY = 'thrive_habits';
const COMPLETIONS_KEY = 'thrive_completions';
const STREAKS_KEY = 'thrive_streaks';
const DAILY_PROGRESS_KEY = 'thrive_daily_progress';

// Helper to get today's date in YYYY-MM-DD format
export const getTodayDateString = (): string => {
  return new Date().toISOString().split('T')[0];
};

// Helper to get yesterday's date
export const getYesterdayDateString = (): string => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
};

// Habit management
export const getHabits = (): Habit[] => {
  const stored = localStorage.getItem(HABITS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Try to get habits from onboarding data
  const onboardingData = localStorage.getItem('onboarding_data');
  if (onboardingData) {
    const data = JSON.parse(onboardingData);
    return convertOnboardingHabitsToHabits(data.habits || []);
  }
  
  return [];
};

export const saveHabits = (habits: Habit[]): void => {
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
};

// Convert onboarding habit IDs to full habit objects
const convertOnboardingHabitsToHabits = (habitIds: string[]): Habit[] => {
  const habitMap: Record<string, Omit<Habit, 'id' | 'createdAt'>> = {
    water: {
      title: 'Drink Water',
      description: '8 glasses throughout the day',
      icon: '💧',
      category: 'Health',
      difficulty: 'Easy'
    },
    'morning-walk': {
      title: 'Morning Walk',
      description: '10-minute walk after waking up',
      icon: '🚶‍♀️',
      category: 'Movement',
      difficulty: 'Easy'
    },
    meditation: {
      title: 'Daily Meditation',
      description: '5 minutes of mindfulness',
      icon: '🧘‍♀️',
      category: 'Mindfulness',
      difficulty: 'Medium'
    },
    reading: {
      title: 'Read Daily',
      description: '15 minutes of reading',
      icon: '📚',
      category: 'Growth',
      difficulty: 'Easy'
    },
    'healthy-breakfast': {
      title: 'Healthy Breakfast',
      description: 'Nutritious morning meal',
      icon: '🥗',
      category: 'Nutrition',
      difficulty: 'Medium'
    },
    exercise: {
      title: 'Exercise',
      description: '20 minutes of physical activity',
      icon: '💪',
      category: 'Movement',
      difficulty: 'Medium'
    },
    gratitude: {
      title: 'Gratitude Practice',
      description: 'Write 3 things you\'re grateful for',
      icon: '❤️',
      category: 'Mindfulness',
      difficulty: 'Easy'
    },
    'morning-sun': {
      title: 'Morning Sunlight',
      description: '10 minutes of natural light exposure',
      icon: '☀️',
      category: 'Health',
      difficulty: 'Easy'
    },
    pomodoro: {
      title: 'Pomodoro Focus',
      description: '25-minute focused work sessions',
      icon: '⏰',
      category: 'Productivity',
      difficulty: 'Medium'
    }
  };

  return habitIds.map(id => ({
    id,
    ...habitMap[id],
    createdAt: new Date().toISOString()
  })).filter(habit => habit.title); // Filter out any invalid habits
};

// Completion management
export const getCompletions = (): HabitCompletion[] => {
  const stored = localStorage.getItem(COMPLETIONS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveCompletions = (completions: HabitCompletion[]): void => {
  localStorage.setItem(COMPLETIONS_KEY, JSON.stringify(completions));
};

export const getTodayCompletions = (): HabitCompletion[] => {
  const today = getTodayDateString();
  return getCompletions().filter(c => c.date === today);
};

export const toggleHabitCompletion = (habitId: string): boolean => {
  const today = getTodayDateString();
  const completions = getCompletions();
  
  const existingIndex = completions.findIndex(c => c.habitId === habitId && c.date === today);
  
  if (existingIndex >= 0) {
    // Toggle existing completion
    completions[existingIndex].completed = !completions[existingIndex].completed;
    completions[existingIndex].completedAt = completions[existingIndex].completed 
      ? new Date().toISOString() 
      : undefined;
  } else {
    // Create new completion
    completions.push({
      habitId,
      date: today,
      completed: true,
      completedAt: new Date().toISOString()
    });
  }
  
  saveCompletions(completions);
  updateStreaks();
  
  return completions.find(c => c.habitId === habitId && c.date === today)?.completed || false;
};

// Streak management
export const getStreaks = (): HabitStreak[] => {
  const stored = localStorage.getItem(STREAKS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveStreaks = (streaks: HabitStreak[]): void => {
  localStorage.setItem(STREAKS_KEY, JSON.stringify(streaks));
};

export const updateStreaks = (): void => {
  const habits = getHabits();
  const completions = getCompletions();
  const streaks = getStreaks();
  
  const updatedStreaks = habits.map(habit => {
    const existingStreak = streaks.find(s => s.habitId === habit.id) || {
      habitId: habit.id,
      currentStreak: 0,
      longestStreak: 0
    };
    
    // Calculate current streak
    let currentStreak = 0;
    let date = new Date();
    
    // Check consecutive days going backwards
    while (true) {
      const dateStr = date.toISOString().split('T')[0];
      const completion = completions.find(c => c.habitId === habit.id && c.date === dateStr);
      
      if (completion && completion.completed) {
        currentStreak++;
        date.setDate(date.getDate() - 1);
      } else {
        break;
      }
    }
    
    // Find last completed date
    const lastCompleted = completions
      .filter(c => c.habitId === habit.id && c.completed)
      .sort((a, b) => b.date.localeCompare(a.date))[0];
    
    return {
      habitId: habit.id,
      currentStreak,
      longestStreak: Math.max(existingStreak.longestStreak, currentStreak),
      lastCompletedDate: lastCompleted?.date
    };
  });
  
  saveStreaks(updatedStreaks);
};

// Daily progress management
export const getDailyProgress = (date?: string): DailyProgress | null => {
  const targetDate = date || getTodayDateString();
  const stored = localStorage.getItem(DAILY_PROGRESS_KEY);
  const allProgress: DailyProgress[] = stored ? JSON.parse(stored) : [];
  return allProgress.find(p => p.date === targetDate) || null;
};

export const saveDailyProgress = (progress: DailyProgress): void => {
  const stored = localStorage.getItem(DAILY_PROGRESS_KEY);
  const allProgress: DailyProgress[] = stored ? JSON.parse(stored) : [];
  
  const existingIndex = allProgress.findIndex(p => p.date === progress.date);
  if (existingIndex >= 0) {
    allProgress[existingIndex] = progress;
  } else {
    allProgress.push(progress);
  }
  
  localStorage.setItem(DAILY_PROGRESS_KEY, JSON.stringify(allProgress));
};

export const calculateTodayProgress = (): DailyProgress => {
  const today = getTodayDateString();
  const habits = getHabits();
  const completions = getTodayCompletions();
  
  const completedHabits = completions.filter(c => c.completed).length;
  const totalHabits = habits.length;
  const completionRate = totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0;
  
  return {
    date: today,
    completions,
    totalHabits,
    completedHabits,
    completionRate,
    endedDay: false
  };
};