import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Focus, Moon, Heart } from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const WELLNESS_GOALS: Goal[] = [
  {
    id: 'energy',
    title: 'Energy',
    description: 'Boost vitality and combat fatigue',
    icon: Zap
  },
  {
    id: 'focus',
    title: 'Focus',
    description: 'Enhance concentration and productivity',
    icon: Focus
  },
  {
    id: 'sleep',
    title: 'Sleep',
    description: 'Improve sleep quality and rest',
    icon: Moon
  },
  {
    id: 'longevity',
    title: 'Longevity',
    description: 'Build long-term health and wellness',
    icon: Heart
  }
];

interface GoalsStepProps {
  selectedGoals: string[];
  onGoalToggle: (goalId: string) => void;
  onNext: () => void;
}

export const GoalsStep: React.FC<GoalsStepProps> = ({
  selectedGoals,
  onGoalToggle,
  onNext
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">What are your wellness goals?</h2>
        <p className="text-muted-foreground">
          Select all that apply. We'll personalize your experience based on your goals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {WELLNESS_GOALS.map((goal) => {
          const IconComponent = goal.icon;
          const isSelected = selectedGoals.includes(goal.id);
          
          return (
            <Card 
              key={goal.id} 
              className={`cursor-pointer transition-all duration-200 hover:shadow-wellness ${
                isSelected 
                  ? 'ring-2 ring-primary bg-primary/5 shadow-wellness' 
                  : 'hover:bg-accent/50'
              }`}
              onClick={() => onGoalToggle(goal.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${
                    isSelected 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-accent text-accent-foreground'
                  }`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{goal.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {goal.description}
                    </p>
                    {isSelected && (
                      <Badge variant="secondary" className="mt-2">
                        Selected
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-center pt-6">
        <Button 
          onClick={onNext} 
          disabled={selectedGoals.length === 0}
          size="lg"
          className="px-8"
        >
          Continue ({selectedGoals.length} selected)
        </Button>
      </div>
    </div>
  );
};