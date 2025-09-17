import { 
  UserProfile, 
  Goal, 
  TrackedHabit, 
  WeeklySummary, 
  DEFAULT_USER_PREFERENCES, 
  DEFAULT_USER_STATS,
  GoalStatus,
  HabitCompletion,
  WELLNESS_GOALS,
  HABIT_LIBRARY,
  calculateGoalProgress,
  calculateHabitCompletionRate
} from '../types/profile';

const PROFILE_KEY = 'thrive_user_profile';
const GOALS_KEY = 'thrive_user_goals';
const HABITS_KEY = 'thrive_tracked_habits';
const WEEKLY_SUMMARIES_KEY = 'thrive_weekly_summaries';

export class ProfileStorage {
  // Profile Management
  static getProfile(): UserProfile | null {
    try {
      const stored = localStorage.getItem(PROFILE_KEY);
      if (stored) {
        const profile = JSON.parse(stored);
        // Merge with defaults to ensure all properties exist
        return {
          ...profile,
          preferences: { ...DEFAULT_USER_PREFERENCES, ...profile.preferences },
          stats: { ...DEFAULT_USER_STATS, ...profile.stats }
        };
      }
    } catch (error) {
      console.warn('Error loading profile:', error);
    }
    return null;
  }

  static saveProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  }

  static createDefaultProfile(name: string, email: string): UserProfile {
    const profile: UserProfile = {
      id: `user_${Date.now()}`,
      name,
      email,
      joinDate: new Date().toISOString(),
      preferences: DEFAULT_USER_PREFERENCES,
      stats: DEFAULT_USER_STATS
    };
    this.saveProfile(profile);
    return profile;
  }

  static updateProfile(updates: Partial<UserProfile>): UserProfile {
    const currentProfile = this.getProfile();
    if (!currentProfile) {
      throw new Error('No profile found');
    }
    
    const updatedProfile = { ...currentProfile, ...updates };
    this.saveProfile(updatedProfile);
    return updatedProfile;
  }

  static updatePreferences(preferences: Partial<UserProfile['preferences']>): UserProfile {
    const currentProfile = this.getProfile();
    if (!currentProfile) {
      throw new Error('No profile found');
    }
    
    const updatedProfile = {
      ...currentProfile,
      preferences: { ...currentProfile.preferences, ...preferences }
    };
    this.saveProfile(updatedProfile);
    return updatedProfile;
  }

  // Goals Management
  static getGoals(): Goal[] {
    try {
      const stored = localStorage.getItem(GOALS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('Error loading goals:', error);
      return [];
    }
  }

  static saveGoals(goals: Goal[]): void {
    try {
      localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
    } catch (error) {
      console.error('Error saving goals:', error);
    }
  }

  static addGoal(goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>): Goal {
    const goals = this.getGoals();
    const newGoal: Goal = {
      ...goalData,
      id: `goal_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    goals.push(newGoal);
    this.saveGoals(goals);
    return newGoal;
  }

  static updateGoal(goalId: string, updates: Partial<Goal>): Goal | null {
    const goals = this.getGoals();
    const goalIndex = goals.findIndex(g => g.id === goalId);
    
    if (goalIndex === -1) return null;
    
    const updatedGoal = {
      ...goals[goalIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    goals[goalIndex] = updatedGoal;
    this.saveGoals(goals);
    return updatedGoal;
  }

  static deleteGoal(goalId: string): boolean {
    const goals = this.getGoals();
    const filteredGoals = goals.filter(g => g.id !== goalId);
    
    if (filteredGoals.length === goals.length) return false;
    
    this.saveGoals(filteredGoals);
    return true;
  }

  static getActiveGoals(): Goal[] {
    return this.getGoals().filter(goal => goal.status === 'active');
  }

  static completeGoal(goalId: string): Goal | null {
    return this.updateGoal(goalId, {
      status: 'completed' as GoalStatus,
      completedAt: new Date().toISOString()
    });
  }

  // Habits Management
  static getTrackedHabits(): TrackedHabit[] {
    try {
      const stored = localStorage.getItem(HABITS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('Error loading tracked habits:', error);
      return [];
    }
  }

  static saveTrackedHabits(habits: TrackedHabit[]): void {
    try {
      localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
    } catch (error) {
      console.error('Error saving tracked habits:', error);
    }
  }

  static addTrackedHabit(habitData: Omit<TrackedHabit, 'id' | 'createdAt' | 'streak' | 'completedToday' | 'completionHistory'>): TrackedHabit {
    const habits = this.getTrackedHabits();
    const newHabit: TrackedHabit = {
      ...habitData,
      id: `habit_${Date.now()}`,
      createdAt: new Date().toISOString(),
      streak: 0,
      completedToday: false,
      completionHistory: []
    };
    
    habits.push(newHabit);
    this.saveTrackedHabits(habits);
    return newHabit;
  }

  static updateTrackedHabit(habitId: string, updates: Partial<TrackedHabit>): TrackedHabit | null {
    const habits = this.getTrackedHabits();
    const habitIndex = habits.findIndex(h => h.id === habitId);
    
    if (habitIndex === -1) return null;
    
    const updatedHabit = { ...habits[habitIndex], ...updates };
    habits[habitIndex] = updatedHabit;
    this.saveTrackedHabits(habits);
    return updatedHabit;
  }

  static completeHabitToday(habitId: string, value?: number, notes?: string): TrackedHabit | null {
    const habits = this.getTrackedHabits();
    const habitIndex = habits.findIndex(h => h.id === habitId);
    
    if (habitIndex === -1) return null;
    
    const habit = habits[habitIndex];
    const today = new Date().toISOString().split('T')[0];
    
    // Check if already completed today
    const existingCompletion = habit.completionHistory.find(c => c.date === today);
    if (existingCompletion && existingCompletion.completed) {
      return habit; // Already completed
    }
    
    // Add or update today's completion
    const completion: HabitCompletion = {
      date: today,
      completed: true,
      value,
      notes
    };
    
    if (existingCompletion) {
      const completionIndex = habit.completionHistory.findIndex(c => c.date === today);
      habit.completionHistory[completionIndex] = completion;
    } else {
      habit.completionHistory.push(completion);
    }
    
    // Update streak and completion status
    const updatedHabit = {
      ...habit,
      completedToday: true,
      lastCompletedAt: new Date().toISOString(),
      streak: this.calculateStreak(habit.completionHistory),
      completionHistory: habit.completionHistory.sort((a, b) => a.date.localeCompare(b.date))
    };
    
    habits[habitIndex] = updatedHabit;
    this.saveTrackedHabits(habits);
    return updatedHabit;
  }

  static removeTrackedHabit(habitId: string): boolean {
    const habits = this.getTrackedHabits();
    const filteredHabits = habits.filter(h => h.id !== habitId);
    
    if (filteredHabits.length === habits.length) return false;
    
    this.saveTrackedHabits(filteredHabits);
    return true;
  }

  private static calculateStreak(completionHistory: HabitCompletion[]): number {
    if (completionHistory.length === 0) return 0;
    
    const sortedHistory = completionHistory
      .filter(c => c.completed)
      .sort((a, b) => b.date.localeCompare(a.date));
    
    if (sortedHistory.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < sortedHistory.length; i++) {
      const completionDate = new Date(sortedHistory[i].date);
      const daysDiff = Math.floor((today.getTime() - completionDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (i === 0 && daysDiff <= 1) {
        streak = 1;
      } else if (i > 0) {
        const prevCompletionDate = new Date(sortedHistory[i - 1].date);
        const daysBetween = Math.floor((prevCompletionDate.getTime() - completionDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysBetween === 1) {
          streak++;
        } else {
          break;
        }
      } else {
        break;
      }
    }
    
    return streak;
  }

  // Weekly Summary Management
  static getWeeklySummaries(): WeeklySummary[] {
    try {
      const stored = localStorage.getItem(WEEKLY_SUMMARIES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('Error loading weekly summaries:', error);
      return [];
    }
  }

  static saveWeeklySummary(summary: WeeklySummary): void {
    try {
      const summaries = this.getWeeklySummaries();
      const existingIndex = summaries.findIndex(s => s.weekStart === summary.weekStart);
      
      if (existingIndex >= 0) {
        summaries[existingIndex] = summary;
      } else {
        summaries.push(summary);
      }
      
      // Keep only last 12 weeks
      summaries.sort((a, b) => b.weekStart.localeCompare(a.weekStart));
      const recentSummaries = summaries.slice(0, 12);
      
      localStorage.setItem(WEEKLY_SUMMARIES_KEY, JSON.stringify(recentSummaries));
    } catch (error) {
      console.error('Error saving weekly summary:', error);
    }
  }

  static getLatestWeeklySummary(): WeeklySummary | null {
    const summaries = this.getWeeklySummaries();
    return summaries.length > 0 ? summaries[0] : null;
  }

  // Data Management
  static exportAllData(): string {
    const data = {
      profile: this.getProfile(),
      goals: this.getGoals(),
      habits: this.getTrackedHabits(),
      weeklySummaries: this.getWeeklySummaries(),
      exportedAt: new Date().toISOString()
    };
    
    return JSON.stringify(data, null, 2);
  }

  static importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.profile) this.saveProfile(data.profile);
      if (data.goals) this.saveGoals(data.goals);
      if (data.habits) this.saveTrackedHabits(data.habits);
      if (data.weeklySummaries) {
        data.weeklySummaries.forEach((summary: WeeklySummary) => {
          this.saveWeeklySummary(summary);
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  static clearAllData(): void {
    try {
      localStorage.removeItem(PROFILE_KEY);
      localStorage.removeItem(GOALS_KEY);
      localStorage.removeItem(HABITS_KEY);
      localStorage.removeItem(WEEKLY_SUMMARIES_KEY);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }

  // Initialization from Onboarding
  static initializeFromOnboarding(): void {
    try {
      const onboardingData = localStorage.getItem('onboarding_data');
      if (!onboardingData) return;
      
      const data = JSON.parse(onboardingData);
      
      // Create goals from onboarding selection
      if (data.goals && Array.isArray(data.goals)) {
        const goals: Goal[] = data.goals.map((goalId: string) => {
          const goalTemplate = WELLNESS_GOALS.find(g => g.id === goalId);
          if (!goalTemplate) return null;
          
          return {
            id: `goal_${goalId}_${Date.now()}`,
            title: goalTemplate.title,
            description: goalTemplate.description,
            icon: goalTemplate.icon,
            category: goalTemplate.category,
            priority: 'medium' as const,
            status: 'active' as const,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
        }).filter(Boolean);
        
        this.saveGoals(goals);
      }
      
      // Create tracked habits from onboarding selection
      if (data.habits && Array.isArray(data.habits)) {
        const habits: TrackedHabit[] = data.habits.map((habitId: string) => {
          const habitTemplate = HABIT_LIBRARY.find(h => h.id === habitId);
          if (!habitTemplate) return null;
          
          return {
            id: `habit_${habitId}_${Date.now()}`,
            title: habitTemplate.title,
            description: habitTemplate.description,
            icon: habitTemplate.icon,
            category: habitTemplate.category,
            difficulty: habitTemplate.difficulty,
            frequency: 'daily' as const,
            streak: 0,
            completedToday: false,
            createdAt: new Date().toISOString(),
            completionHistory: []
          };
        }).filter(Boolean);
        
        this.saveTrackedHabits(habits);
      }
      
    } catch (error) {
      console.error('Error initializing from onboarding:', error);
    }
  }
}