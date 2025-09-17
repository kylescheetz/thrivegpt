import React, { useState, useEffect } from 'react';
import { Calendar, Download, Share2, TrendingUp, Target, CheckCircle2, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { WeeklySummary as WeeklySummaryType, Goal, TrackedHabit } from '@/types/profile';
import { ProfileStorage } from '@/utils/profileStorage';

interface WeeklySummaryProps {
  onSummaryChange?: () => void;
}

export const WeeklySummary: React.FC<WeeklySummaryProps> = ({ onSummaryChange }) => {
  const { toast } = useToast();
  const [summaries, setSummaries] = useState<WeeklySummaryType[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<string>('');
  const [currentSummary, setCurrentSummary] = useState<WeeklySummaryType | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    loadSummaries();
  }, []);

  useEffect(() => {
    if (selectedWeek && summaries.length > 0) {
      const summary = summaries.find(s => s.weekStart === selectedWeek);
      setCurrentSummary(summary || null);
    }
  }, [selectedWeek, summaries]);

  const loadSummaries = () => {
    const weeklySummaries = ProfileStorage.getWeeklySummaries();
    setSummaries(weeklySummaries);
    
    if (weeklySummaries.length > 0) {
      setSelectedWeek(weeklySummaries[0].weekStart);
    }
  };

  const generateCurrentWeekSummary = async () => {
    setIsGenerating(true);
    
    try {
      const goals = ProfileStorage.getGoals();
      const habits = ProfileStorage.getTrackedHabits();
      
      // Calculate week start (Monday)
      const now = new Date();
      const dayOfWeek = now.getDay();
      const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - daysToMonday);
      weekStart.setHours(0, 0, 0, 0);
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);
      
      // Generate goal progress
      const goalsProgress = goals
        .filter(goal => goal.status === 'active')
        .map(goal => ({
          goalId: goal.id,
          goalTitle: goal.title,
          progressPercentage: goal.targetValue && goal.currentValue 
            ? Math.min((goal.currentValue / goal.targetValue) * 100, 100)
            : 0,
          completed: goal.status === 'completed'
        }));

      // Generate habit summaries
      const habitsCompleted = habits.map(habit => {
        const weekCompletions = habit.completionHistory.filter(completion => {
          const completionDate = new Date(completion.date);
          return completionDate >= weekStart && completionDate <= weekEnd && completion.completed;
        });
        
        const completionRate = (weekCompletions.length / 7) * 100;
        
        return {
          habitId: habit.id,
          habitTitle: habit.title,
          completionRate,
          streak: habit.streak,
          daysCompleted: weekCompletions.length
        };
      });

      // Calculate overall score
      const goalScore = goalsProgress.length > 0 
        ? goalsProgress.reduce((sum, goal) => sum + goal.progressPercentage, 0) / goalsProgress.length
        : 0;
      const habitScore = habitsCompleted.length > 0
        ? habitsCompleted.reduce((sum, habit) => sum + habit.completionRate, 0) / habitsCompleted.length
        : 0;
      const overallScore = Math.round((goalScore + habitScore) / 2);

      // Generate insights
      const insights = generateInsights(goalsProgress, habitsCompleted, overallScore);

      // Generate achievements
      const achievements = generateAchievements(habitsCompleted, goalsProgress);

      const summary: WeeklySummaryType = {
        weekStart: weekStart.toISOString().split('T')[0],
        weekEnd: weekEnd.toISOString().split('T')[0],
        goalsProgress,
        habitsCompleted,
        overallScore,
        insights,
        achievements
      };

      ProfileStorage.saveWeeklySummary(summary);
      loadSummaries();
      setSelectedWeek(summary.weekStart);
      onSummaryChange?.();
      
      toast({
        title: 'Summary generated',
        description: 'Your weekly summary has been created!',
      });
    } catch (error) {
      console.error('Error generating summary:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate weekly summary.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateInsights = (goalsProgress: any[], habitsCompleted: any[], overallScore: number): string[] => {
    const insights: string[] = [];
    
    if (overallScore >= 80) {
      insights.push("🎉 Exceptional week! You're crushing your wellness goals.");
    } else if (overallScore >= 60) {
      insights.push("👍 Great progress this week! Keep up the momentum.");
    } else if (overallScore >= 40) {
      insights.push("📈 Good effort! There's room for improvement next week.");
    } else {
      insights.push("💪 Every journey has its challenges. Let's refocus for next week.");
    }

    const bestHabit = habitsCompleted.reduce((best, habit) => 
      habit.completionRate > best.completionRate ? habit : best, 
      { completionRate: 0, habitTitle: '' }
    );
    
    if (bestHabit.completionRate > 0) {
      insights.push(`🏆 Your strongest habit: ${bestHabit.habitTitle} (${Math.round(bestHabit.completionRate)}% completion)`);
    }

    const strugglingHabits = habitsCompleted.filter(h => h.completionRate < 50);
    if (strugglingHabits.length > 0) {
      insights.push(`🎯 Focus area: ${strugglingHabits[0].habitTitle} needs more attention`);
    }

    const streakHabits = habitsCompleted.filter(h => h.streak >= 7);
    if (streakHabits.length > 0) {
      insights.push(`🔥 ${streakHabits.length} habit${streakHabits.length > 1 ? 's' : ''} on a 7+ day streak!`);
    }

    return insights;
  };

  const generateAchievements = (habitsCompleted: any[], goalsProgress: any[]): any[] => {
    const achievements: any[] = [];
    
    // Perfect week achievement
    const perfectHabits = habitsCompleted.filter(h => h.completionRate === 100);
    if (perfectHabits.length > 0) {
      achievements.push({
        id: `perfect_week_${Date.now()}`,
        title: 'Perfect Week',
        description: `Completed ${perfectHabits.length} habit${perfectHabits.length > 1 ? 's' : ''} every day!`,
        icon: '💯',
        unlockedAt: new Date().toISOString(),
        type: 'habit'
      });
    }

    // Streak achievements
    const longStreaks = habitsCompleted.filter(h => h.streak >= 14);
    if (longStreaks.length > 0) {
      achievements.push({
        id: `streak_master_${Date.now()}`,
        title: 'Streak Master',
        description: `Maintained ${longStreaks.length} habit streak${longStreaks.length > 1 ? 's' : ''} for 2+ weeks`,
        icon: '🔥',
        unlockedAt: new Date().toISOString(),
        type: 'streak'
      });
    }

    // Goal completion
    const completedGoals = goalsProgress.filter(g => g.completed);
    if (completedGoals.length > 0) {
      achievements.push({
        id: `goal_crusher_${Date.now()}`,
        title: 'Goal Crusher',
        description: `Completed ${completedGoals.length} goal${completedGoals.length > 1 ? 's' : ''} this week`,
        icon: '🎯',
        unlockedAt: new Date().toISOString(),
        type: 'goal'
      });
    }

    return achievements;
  };

  const exportSummary = (format: 'json' | 'txt' = 'txt') => {
    if (!currentSummary) return;

    try {
      let content: string;
      let filename: string;
      let mimeType: string;

      if (format === 'json') {
        content = JSON.stringify(currentSummary, null, 2);
        filename = `thrivegpt-summary-${currentSummary.weekStart}.json`;
        mimeType = 'application/json';
      } else {
        content = generateTextSummary(currentSummary);
        filename = `thrivegpt-summary-${currentSummary.weekStart}.txt`;
        mimeType = 'text/plain';
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Summary exported',
        description: `Your weekly summary has been downloaded as ${format.toUpperCase()}.`,
      });
    } catch (error) {
      console.error('Error exporting summary:', error);
      toast({
        title: 'Export failed',
        description: 'Failed to export your summary.',
        variant: 'destructive',
      });
    }
  };

  const generateTextSummary = (summary: WeeklySummaryType): string => {
    const weekStart = new Date(summary.weekStart).toLocaleDateString();
    const weekEnd = new Date(summary.weekEnd).toLocaleDateString();
    
    return `
ThriveGPT Weekly Summary
Week of ${weekStart} - ${weekEnd}

OVERALL SCORE: ${summary.overallScore}/100

GOALS PROGRESS:
${summary.goalsProgress.map(goal => 
  `• ${goal.goalTitle}: ${Math.round(goal.progressPercentage)}%${goal.completed ? ' ✅ COMPLETED' : ''}`
).join('\n')}

HABITS COMPLETED:
${summary.habitsCompleted.map(habit => 
  `• ${habit.habitTitle}: ${Math.round(habit.completionRate)}% (${habit.daysCompleted}/7 days, ${habit.streak} day streak)`
).join('\n')}

INSIGHTS:
${summary.insights.map(insight => `• ${insight}`).join('\n')}

ACHIEVEMENTS:
${summary.achievements.map(achievement => 
  `• ${achievement.icon} ${achievement.title}: ${achievement.description}`
).join('\n')}

Generated by ThriveGPT on ${new Date().toLocaleDateString()}
    `.trim();
  };

  const shareSummary = async () => {
    if (!currentSummary) return;

    const shareText = `Check out my ThriveGPT weekly summary! Overall score: ${currentSummary.overallScore}/100 🎯`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ThriveGPT Weekly Summary',
          text: shareText,
          url: window.location.origin
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        toast({
          title: 'Copied to clipboard',
          description: 'Summary text copied! You can paste it anywhere.',
        });
      } catch (error) {
        toast({
          title: 'Share not supported',
          description: 'Your browser doesn\'t support sharing.',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Weekly Summary</h3>
          <p className="text-sm text-muted-foreground">
            Review your progress and insights
          </p>
        </div>
        <Button
          onClick={generateCurrentWeekSummary}
          disabled={isGenerating}
          size="sm"
        >
          <BarChart3 className="h-4 w-4 mr-2" />
          {isGenerating ? 'Generating...' : 'Generate This Week'}
        </Button>
      </div>

      {summaries.length > 0 && (
        <div className="flex items-center gap-4">
          <Select value={selectedWeek} onValueChange={setSelectedWeek}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select week" />
            </SelectTrigger>
            <SelectContent>
              {summaries.map((summary) => (
                <SelectItem key={summary.weekStart} value={summary.weekStart}>
                  {new Date(summary.weekStart).toLocaleDateString()} - {' '}
                  {new Date(summary.weekEnd).toLocaleDateString()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {currentSummary && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportSummary('txt')}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={shareSummary}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          )}
        </div>
      )}

      {currentSummary ? (
        <div className="space-y-6">
          {/* Overall Score */}
          <Card className="shadow-wellness">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {currentSummary.overallScore}/100
                </div>
                <h4 className="text-lg font-semibold mb-1">Overall Score</h4>
                <p className="text-muted-foreground">
                  Week of {new Date(currentSummary.weekStart).toLocaleDateString()} - {' '}
                  {new Date(currentSummary.weekEnd).toLocaleDateString()}
                </p>
                <Progress 
                  value={currentSummary.overallScore} 
                  className="mt-4 h-3"
                />
              </div>
            </CardContent>
          </Card>

          {/* Goals Progress */}
          {currentSummary.goalsProgress.length > 0 && (
            <Card className="shadow-wellness">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Goals Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentSummary.goalsProgress.map((goal) => (
                  <div key={goal.goalId} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{goal.goalTitle}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{Math.round(goal.progressPercentage)}%</span>
                        {goal.completed && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                      </div>
                    </div>
                    <Progress value={goal.progressPercentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Habits Summary */}
          {currentSummary.habitsCompleted.length > 0 && (
            <Card className="shadow-wellness">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  Habits Completed
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentSummary.habitsCompleted.map((habit) => (
                  <div key={habit.habitId} className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{habit.habitTitle}</span>
                      <div className="text-sm text-muted-foreground">
                        {habit.daysCompleted}/7 days • {habit.streak} day streak
                      </div>
                    </div>
                    <Badge 
                      variant={habit.completionRate >= 70 ? "default" : "secondary"}
                      className={habit.completionRate >= 70 ? "bg-green-600" : ""}
                    >
                      {Math.round(habit.completionRate)}%
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Insights */}
          {currentSummary.insights.length > 0 && (
            <Card className="shadow-wellness">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {currentSummary.insights.map((insight, index) => (
                    <li key={index} className="text-sm">
                      {insight}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Achievements */}
          {currentSummary.achievements.length > 0 && (
            <Card className="shadow-wellness bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-800">
                  🏆 Achievements Unlocked
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentSummary.achievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div>
                        <h5 className="font-semibold">{achievement.title}</h5>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ) : summaries.length === 0 ? (
        <Card className="shadow-wellness">
          <CardContent className="p-8 text-center">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h4 className="font-semibold mb-2">No summaries yet</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Generate your first weekly summary to track your progress!
            </p>
            <Button onClick={generateCurrentWeekSummary} disabled={isGenerating}>
              <BarChart3 className="h-4 w-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Generate This Week'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-wellness">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Select a week to view summary</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};