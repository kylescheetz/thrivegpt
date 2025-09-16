import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Droplets, 
  Coffee, 
  Footprints, 
  Book, 
  Utensils, 
  Dumbbell,
  Brain,
  Sun,
  Timer,
  Heart
} from 'lucide-react';

interface Habit {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

const HABIT_LIBRARY: Habit[] = [
  {
    id: 'water',
    title: 'Drink Water',
    description: '8 glasses throughout the day',
    icon: Droplets,
    category: 'Health',
    difficulty: 'Easy'
  },
  {
    id: 'morning-walk',
    title: 'Morning Walk',
    description: '10-minute walk after waking up',
    icon: Footprints,
    category: 'Movement',
    difficulty: 'Easy'
  },
  {
    id: 'meditation',
    title: 'Daily Meditation',
    description: '5 minutes of mindfulness',
    icon: Brain,
    category: 'Mindfulness',
    difficulty: 'Medium'
  },
  {
    id: 'reading',
    title: 'Read Daily',
    description: '15 minutes of reading',
    icon: Book,
    category: 'Growth',
    difficulty: 'Easy'
  },
  {
    id: 'healthy-breakfast',
    title: 'Healthy Breakfast',
    description: 'Nutritious morning meal',
    icon: Utensils,
    category: 'Nutrition',
    difficulty: 'Medium'
  },
  {
    id: 'exercise',
    title: 'Exercise',
    description: '20 minutes of physical activity',
    icon: Dumbbell,
    category: 'Movement',
    difficulty: 'Medium'
  },
  {
    id: 'gratitude',
    title: 'Gratitude Practice',
    description: "Write 3 things you're grateful for",
    icon: Heart,
    category: 'Mindfulness',
    difficulty: 'Easy'
  },
  {
    id: 'morning-sun',
    title: 'Morning Sunlight',
    description: '10 minutes of natural light exposure',
    icon: Sun,
    category: 'Health',
    difficulty: 'Easy'
  },
  {
    id: 'pomodoro',
    title: 'Pomodoro Focus',
    description: '25-minute focused work sessions',
    icon: Timer,
    category: 'Productivity',
    difficulty: 'Medium'
  }
];

interface HabitsStepProps {
  selectedHabits: string[];
  onHabitToggle: (habitId: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const HabitsStep: React.FC<HabitsStepProps> = ({
  selectedHabits,
  onHabitToggle,
  onNext,
  onBack
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Choose your starter habits</h2>
        <p className="text-muted-foreground">
          Select 3-5 habits to begin your wellness journey. You can add more later!
        </p>
        <div className="mt-2">
          <Badge variant="outline">
            {selectedHabits.length}/5 selected
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {HABIT_LIBRARY.map((habit) => {
          const IconComponent = habit.icon;
          const isSelected = selectedHabits.includes(habit.id);
          const isDisabled = selectedHabits.length >= 5 && !isSelected;
          
          return (
            <Card 
              key={habit.id} 
              className={`transition-all duration-200 ${
                isDisabled 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'cursor-pointer hover:shadow-wellness'
              } ${
                isSelected 
                  ? 'ring-2 ring-primary bg-primary/5 shadow-wellness' 
                  : 'hover:bg-accent/50'
              }`}
              onClick={() => !isDisabled && onHabitToggle(habit.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Checkbox 
                    checked={isSelected} 
                    disabled={isDisabled}
                    className="mt-1"
                  />
                  <div className={`p-2 rounded-lg ${
                    isSelected 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-accent text-accent-foreground'
                  }`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-sm">{habit.title}</h3>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${getDifficultyColor(habit.difficulty)}`}
                      >
                        {habit.difficulty}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {habit.description}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {habit.category}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button 
          onClick={onNext} 
          disabled={selectedHabits.length < 3}
          size="lg"
          className="px-8"
        >
          Continue ({selectedHabits.length} habits)
        </Button>
      </div>
    </div>
  );
};