import React from 'react';
import { ArrowLeft, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const habitData = [
  {
    id: '1',
    name: 'Hydration',
    emoji: '💧',
    streak: [true, true, true, false, true, true, true], // Last 7 days
    weeklyCompletion: 86
  },
  {
    id: '2',
    name: 'Workout',
    emoji: '🏋️',
    streak: [true, false, true, true, false, true, true],
    weeklyCompletion: 71
  },
  {
    id: '3',
    name: 'Meditation',
    emoji: '🧘',
    streak: [false, true, false, true, true, false, true],
    weeklyCompletion: 57
  },
  {
    id: '4',
    name: 'Sleep Routine',
    emoji: '😴',
    streak: [true, true, false, false, true, false, true],
    weeklyCompletion: 57
  }
];

const DayBubble = ({ completed, index }: { completed: boolean; index: number }) => (
  <div
    className={cn(
      "w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-medium transition-all",
      completed
        ? "bg-primary border-primary text-primary-foreground shadow-wellness"
        : "bg-muted border-muted-foreground/30 text-muted-foreground"
    )}
  >
    {completed ? '✓' : 'X'}
  </div>
);

const HabitStreakCard = ({ habit }: { habit: typeof habitData[0] }) => (
  <Card className="shadow-wellness">
    <CardContent className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{habit.emoji}</span>
          <span className="font-medium">{habit.name}</span>
        </div>
        <span className="text-sm text-muted-foreground">
          {habit.weeklyCompletion}% this week
        </span>
      </div>
      
      <div className="space-y-3">
        {/* Day bubbles */}
        <div className="flex justify-between gap-1">
          {habit.streak.map((completed, index) => (
            <DayBubble key={index} completed={completed} index={index} />
          ))}
        </div>
        
        {/* Progress bar */}
        <div className="space-y-1">
          <Progress value={habit.weeklyCompletion} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Mon</span>
            <span>Sun</span>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function Habits() {
  const navigate = useNavigate();

  const topPerformers = habitData
    .filter(h => h.weeklyCompletion >= 70)
    .sort((a, b) => b.weeklyCompletion - a.weeklyCompletion);

  const needsAttention = habitData
    .filter(h => h.weeklyCompletion < 70)
    .sort((a, b) => a.weeklyCompletion - b.weeklyCompletion);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="flex items-center justify-between p-4 max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">Progress</h1>
          </div>
          <Button variant="ghost" size="sm">
            <Edit3 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto space-y-6">
        {/* Habit Streak Cards */}
        <div className="space-y-4">
          {habitData.map((habit) => (
            <HabitStreakCard key={habit.id} habit={habit} />
          ))}
        </div>

        {/* Weekly Summary */}
        <Card className="shadow-wellness bg-gradient-wellness border-0">
          <CardHeader>
            <CardTitle className="text-lg">Weekly Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topPerformers.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-2 text-primary">Strong Habits 💪</h4>
                <div className="space-y-1">
                  {topPerformers.map((habit) => (
                    <div key={habit.id} className="flex justify-between text-sm">
                      <span>{habit.emoji} {habit.name}</span>
                      <span className="font-medium">{habit.weeklyCompletion}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {needsAttention.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-2 text-orange-600">Needs Focus 🎯</h4>
                <div className="space-y-1">
                  {needsAttention.map((habit) => (
                    <div key={habit.id} className="flex justify-between text-sm">
                      <span>{habit.emoji} {habit.name}</span>
                      <span className="font-medium">{habit.weeklyCompletion}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Habits Button */}
        <Button className="w-full" variant="outline">
          <Edit3 className="h-4 w-4 mr-2" />
          Edit Habits
        </Button>
      </div>
    </div>
  );
}