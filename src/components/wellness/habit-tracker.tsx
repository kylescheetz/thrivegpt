import React, { useState } from 'react';
import { Check, Plus, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface Habit {
  id: string;
  name: string;
  emoji: string;
  completed: boolean;
}

const defaultHabits: Habit[] = [
  { id: '1', name: 'Hydration', emoji: '💧', completed: false },
  { id: '2', name: 'Workout', emoji: '🏋️', completed: true },
  { id: '3', name: 'Meditation', emoji: '🧘', completed: false },
  { id: '4', name: 'Morning Routine', emoji: '☀️', completed: true },
  { id: '5', name: 'Cold Plunge', emoji: '❄️', completed: false },
];

export function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>(defaultHabits);
  const [showWrapUp, setShowWrapUp] = useState(false);

  const toggleHabit = (id: string) => {
    setHabits(prev => prev.map(habit => 
      habit.id === id ? { ...habit, completed: !habit.completed } : habit
    ));
  };

  const completedCount = habits.filter(h => h.completed).length;
  const totalCount = habits.length;

  const handleEndDay = () => {
    setShowWrapUp(true);
  };

  if (showWrapUp) {
    return (
      <Card className="shadow-wellness">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="text-4xl">🎉</div>
            <h3 className="text-xl font-semibold">Day Complete!</h3>
            <p className="text-muted-foreground">
              You nailed {completedCount}/{totalCount} habits today! Great work.
            </p>
            
            <Card className="bg-gradient-wellness border-0 shadow-card">
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <span className="text-lg">💡</span>
                  <div className="text-left">
                    <h4 className="font-medium text-sm mb-1">Tomorrow's Focus</h4>
                    <p className="text-sm text-muted-foreground">
                      Try focusing on meditation - consistency builds strength.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={() => setShowWrapUp(false)}
              className="w-full"
              variant="secondary"
            >
              Back to Habits
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-wellness">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold">Today's Habits</CardTitle>
        <Button variant="ghost" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg border transition-all duration-300",
                habit.completed 
                  ? "bg-gradient-wellness border-primary/30 shadow-card" 
                  : "bg-card border-border hover:border-primary/50"
              )}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{habit.emoji}</span>
                <span className={cn(
                  "font-medium",
                  habit.completed && "text-primary"
                )}>
                  {habit.name}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                {habit.completed && (
                  <div className="text-primary animate-bounce-soft">
                    <Check className="h-4 w-4" />
                  </div>
                )}
                <Switch
                  checked={habit.completed}
                  onCheckedChange={() => toggleHabit(habit.id)}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </div>
          ))}
        </div>

        <Button variant="outline" className="w-full" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Habit
        </Button>

        <div className="pt-2">
          <Button 
            onClick={handleEndDay}
            className="w-full bg-gradient-primary hover:shadow-wellness transition-all duration-300"
          >
            End My Day
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-2">
            {completedCount}/{totalCount} habits completed
          </p>
        </div>
      </CardContent>
    </Card>
  );
}