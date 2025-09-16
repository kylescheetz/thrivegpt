import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  getHabits, 
  getTodayCompletions, 
  toggleHabitCompletion, 
  getStreaks,
  calculateTodayProgress,
  getDailyProgress,
  saveDailyProgress
} from '@/utils/habitStorage';
import { Habit, HabitStreak, DailyProgress } from '@/types/habit';
import { 
  Flame, 
  Target, 
  Calendar,
  Moon,
  Sparkles,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface DailyHabitTrackerProps {
  onEndDay?: (summary: string) => void;
}

export const DailyHabitTracker: React.FC<DailyHabitTrackerProps> = ({ onEndDay }) => {
  const { toast } = useToast();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<string[]>([]);
  const [streaks, setStreaks] = useState<HabitStreak[]>([]);
  const [progress, setProgress] = useState<DailyProgress | null>(null);
  const [isEndingDay, setIsEndingDay] = useState(false);
  const [dayEnded, setDayEnded] = useState(false);
  const [summary, setSummary] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const habitsData = getHabits();
    const completionsData = getTodayCompletions();
    const streaksData = getStreaks();
    const progressData = getDailyProgress();
    
    setHabits(habitsData);
    setCompletions(completionsData.filter(c => c.completed).map(c => c.habitId));
    setStreaks(streaksData);
    setProgress(progressData || calculateTodayProgress());
    setDayEnded(progressData?.endedDay || false);
    setSummary(progressData?.summary || '');
  };

  const handleToggleHabit = (habitId: string) => {
    const newCompleted = toggleHabitCompletion(habitId);
    
    if (newCompleted) {
      setCompletions(prev => [...prev.filter(id => id !== habitId), habitId]);
      toast({
        title: "Great job! 🎉",
        description: "Habit completed successfully.",
      });
    } else {
      setCompletions(prev => prev.filter(id => id !== habitId));
    }
    
    // Reload data to get updated streaks and progress
    setTimeout(loadData, 100);
  };

  const getHabitStreak = (habitId: string): number => {
    return streaks.find(s => s.habitId === habitId)?.currentStreak || 0;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const handleEndDay = async () => {
    if (dayEnded) return;
    
    setIsEndingDay(true);
    
    try {
      // Create daily summary (in a real app, this would call GPT API)
      const currentProgress = calculateTodayProgress();
      const completedCount = currentProgress.completedHabits;
      const totalCount = currentProgress.totalHabits;
      const completionRate = Math.round(currentProgress.completionRate);
      
      // Generate a simple summary (placeholder for GPT integration)
      const generatedSummary = generateDailySummary(completedCount, totalCount, completionRate, habits, completions);
      
      // Save progress with summary
      const finalProgress: DailyProgress = {
        ...currentProgress,
        endedDay: true,
        summary: generatedSummary
      };
      
      saveDailyProgress(finalProgress);
      setProgress(finalProgress);
      setSummary(generatedSummary);
      setDayEnded(true);
      
      toast({
        title: "Day completed! 🌙",
        description: "Your progress has been saved and analyzed.",
      });
      
      onEndDay?.(generatedSummary);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to end day. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsEndingDay(false);
    }
  };

  // Simple summary generation (placeholder for GPT integration)
  const generateDailySummary = (completed: number, total: number, rate: number, habits: Habit[], completedIds: string[]): string => {
    const completedHabits = habits.filter(h => completedIds.includes(h.id));
    const missedHabits = habits.filter(h => !completedIds.includes(h.id));
    
    let summary = `🎯 Daily Progress: ${completed}/${total} habits completed (${rate}%)\n\n`;
    
    if (completedHabits.length > 0) {
      summary += "✅ Completed Today:\n";
      completedHabits.forEach(habit => {
        const streak = getHabitStreak(habit.id);
        summary += `• ${habit.icon} ${habit.title}${streak > 1 ? ` (${streak} day streak!)` : ''}\n`;
      });
      summary += "\n";
    }
    
    if (missedHabits.length > 0) {
      summary += "⏰ Missed Opportunities:\n";
      missedHabits.forEach(habit => {
        summary += `• ${habit.icon} ${habit.title}\n`;
      });
      summary += "\n";
    }
    
    // Add motivational message based on performance
    if (rate >= 80) {
      summary += "🌟 Outstanding work! You're building incredible momentum. Keep this energy going tomorrow!";
    } else if (rate >= 60) {
      summary += "💪 Great effort today! Focus on the habits you missed for an even stronger tomorrow.";
    } else if (rate >= 40) {
      summary += "🎯 Good start! Tomorrow is a fresh opportunity to build on today's foundation.";
    } else {
      summary += "🌱 Every journey starts with small steps. Tomorrow is your chance to grow stronger!";
    }
    
    return summary;
  };

  if (habits.length === 0) {
    return (
      <Card className="shadow-wellness">
        <CardContent className="p-6 text-center">
          <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Habits Yet</h3>
          <p className="text-muted-foreground mb-4">
            Complete the onboarding process to set up your daily habits.
          </p>
          <Button onClick={() => window.location.href = '/onboarding'}>
            Get Started
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Progress Overview */}
      <Card className="shadow-wellness bg-gradient-subtle">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Today's Progress
            </CardTitle>
            <Badge variant="secondary" className="text-sm">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'short', 
                day: 'numeric' 
              })}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Completion Rate</span>
              <span className="font-medium">
                {progress?.completedHabits || 0}/{progress?.totalHabits || 0} 
                ({Math.round(progress?.completionRate || 0)}%)
              </span>
            </div>
            <Progress value={progress?.completionRate || 0} className="h-3" />
          </div>
          
          {!dayEnded && (
            <Button 
              onClick={handleEndDay}
              disabled={isEndingDay || (progress?.completedHabits || 0) === 0}
              className="w-full mt-4 bg-gradient-primary hover:opacity-90"
              size="lg"
            >
              {isEndingDay ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing Your Day...
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4 mr-2" />
                  End My Day
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Daily Summary (shown after ending day) */}
      {dayEnded && summary && (
        <Card className="shadow-wellness border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Daily Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea 
              value={summary}
              readOnly
              className="min-h-[200px] bg-background/50 border-0 resize-none"
            />
          </CardContent>
        </Card>
      )}

      {/* Habit List */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          Daily Habits
        </h3>
        
        {habits.map((habit) => {
          const isCompleted = completions.includes(habit.id);
          const streak = getHabitStreak(habit.id);
          
          return (
            <Card 
              key={habit.id} 
              className={`transition-all duration-200 ${
                isCompleted 
                  ? 'shadow-wellness bg-primary/5 border-primary/20' 
                  : 'hover:shadow-card'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{habit.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{habit.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {habit.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getDifficultyColor(habit.difficulty)}`}
                        >
                          {habit.difficulty}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {habit.category}
                        </Badge>
                        {streak > 0 && (
                          <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">
                            <Flame className="h-3 w-3 mr-1" />
                            {streak} day{streak > 1 ? 's' : ''}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {isCompleted && (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    )}
                    <Switch
                      checked={isCompleted}
                      onCheckedChange={() => handleToggleHabit(habit.id)}
                      disabled={dayEnded}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};