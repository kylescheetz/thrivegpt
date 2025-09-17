import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, BookOpen, Zap, Target, RefreshCw, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface BiohackingRoutine {
  id: string;
  title: string;
  category: 'focus' | 'energy' | 'recovery';
  summary: string;
  science: string;
  duration: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  equipment: string;
  rating?: number;
  tried?: boolean;
  triedDate?: Date;
}

const biohackingRoutines: BiohackingRoutine[] = [
  {
    id: '1',
    title: 'Cold Shower Protocol',
    category: 'energy',
    summary: '2-3 minutes of cold water exposure to boost alertness and metabolism.',
    science: 'Cold exposure triggers norepinephrine release, increasing alertness by up to 530% and boosting brown fat for better metabolism.',
    duration: '2-3 minutes',
    difficulty: 'Medium',
    equipment: 'None'
  },
  {
    id: '2',
    title: 'Magnesium Glycinate Evening',
    category: 'recovery',
    summary: '200-400mg before bed to improve sleep quality and muscle recovery.',
    science: 'Magnesium activates GABA receptors and regulates melatonin, improving deep sleep phases by 23% in studies.',
    duration: 'Daily',
    difficulty: 'Easy',
    equipment: 'Supplement'
  },
  {
    id: '3',
    title: 'Blue Light Blocking',
    category: 'recovery',
    summary: 'Wear blue light glasses 2 hours before bed to optimize circadian rhythm.',
    science: 'Blue light suppresses melatonin production. Blocking it increases melatonin by 58% and improves sleep onset.',
    duration: '2 hours before bed',
    difficulty: 'Easy',
    equipment: 'Blue light glasses'
  },
  {
    id: '4',
    title: 'Box Breathing Focus',
    category: 'focus',
    summary: '4-4-4-4 breathing pattern for 5 minutes to enhance cognitive clarity.',
    science: 'Controlled breathing activates the prefrontal cortex and reduces cortisol, improving focus by up to 40%.',
    duration: '5 minutes',
    difficulty: 'Easy',
    equipment: 'None'
  },
  {
    id: '5',
    title: 'Intermittent Fasting 16:8',
    category: 'energy',
    summary: 'Fast for 16 hours, eat in 8-hour window to boost energy and mental clarity.',
    science: 'Fasting triggers autophagy and ketone production, increasing BDNF and energy production in brain cells.',
    duration: 'Daily',
    difficulty: 'Medium',
    equipment: 'None'
  },
  {
    id: '6',
    title: 'Red Light Therapy',
    category: 'recovery',
    summary: '10-15 minutes of 660nm red light for cellular repair and inflammation reduction.',
    science: 'Red light stimulates mitochondrial cytochrome oxidase, increasing ATP production by 25% and accelerating healing.',
    duration: '10-15 minutes',
    difficulty: 'Easy',
    equipment: 'Red light device'
  }
];

const goals = [
  { id: 'focus', label: 'Focus', icon: Target, color: 'bg-blue-500' },
  { id: 'energy', label: 'Energy', icon: Zap, color: 'bg-yellow-500' },
  { id: 'recovery', label: 'Recovery', icon: RefreshCw, color: 'bg-green-500' }
];

export default function Coach() {
  const navigate = useNavigate();
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [routines, setRoutines] = useState<BiohackingRoutine[]>([]);
  const [showGoalSelection, setShowGoalSelection] = useState(true);

  useEffect(() => {
    // Load saved data from localStorage
    const savedRoutines = localStorage.getItem('biohacking-routines');
    const savedGoals = localStorage.getItem('biohacking-goals');
    
    if (savedRoutines) {
      setRoutines(JSON.parse(savedRoutines));
    } else {
      setRoutines(biohackingRoutines);
    }
    
    if (savedGoals) {
      setSelectedGoals(JSON.parse(savedGoals));
      setShowGoalSelection(false);
    }
  }, []);

  const handleGoalToggle = (goalId: string) => {
    setSelectedGoals(prev => 
      prev.includes(goalId)
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const handleGoalSave = () => {
    localStorage.setItem('biohacking-goals', JSON.stringify(selectedGoals));
    setShowGoalSelection(false);
  };

  const handleTryRoutine = (routineId: string) => {
    const updatedRoutines = routines.map(routine => 
      routine.id === routineId 
        ? { ...routine, tried: true, triedDate: new Date() }
        : routine
    );
    setRoutines(updatedRoutines);
    localStorage.setItem('biohacking-routines', JSON.stringify(updatedRoutines));
  };

  const handleRateRoutine = (routineId: string, rating: number) => {
    const updatedRoutines = routines.map(routine => 
      routine.id === routineId 
        ? { ...routine, rating }
        : routine
    );
    setRoutines(updatedRoutines);
    localStorage.setItem('biohacking-routines', JSON.stringify(updatedRoutines));
  };

  const filteredRoutines = routines.filter(routine => 
    selectedGoals.length === 0 || selectedGoals.includes(routine.category)
  );

  const canRate = (routine: BiohackingRoutine) => {
    if (!routine.tried || !routine.triedDate) return false;
    const daysSinceTrying = Math.floor((Date.now() - routine.triedDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysSinceTrying >= 1;
  };

  if (showGoalSelection) {
    return (
      <div className="min-h-screen bg-background pb-20">
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
              <h1 className="text-xl font-semibold">Biohacking Coach</h1>
            </div>
          </div>
        </div>

        <div className="p-4 max-w-md mx-auto space-y-6">
          <Card className="shadow-wellness bg-gradient-primary text-white border-0">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-3">🧬</div>
              <h2 className="text-xl font-semibold mb-2">Welcome to Biohacking</h2>
              <p className="text-white/80 text-sm">
                Science-backed routines to optimize your biology
              </p>
            </CardContent>
          </Card>

          <div>
            <h3 className="text-lg font-semibold mb-4">What do you want to optimize?</h3>
            <div className="space-y-3">
              {goals.map((goal) => {
                const Icon = goal.icon;
                const isSelected = selectedGoals.includes(goal.id);
                
                return (
                  <Card
                    key={goal.id}
                    className={cn(
                      "cursor-pointer transition-all duration-200",
                      isSelected
                        ? "border-primary bg-primary/10 shadow-wellness"
                        : "hover:border-primary/50 hover:bg-muted/50"
                    )}
                    onClick={() => handleGoalToggle(goal.id)}
                  >
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", goal.color)}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{goal.label}</h4>
                        <p className="text-sm text-muted-foreground">
                          Optimize your {goal.label.toLowerCase()}
                        </p>
                      </div>
                      {isSelected && (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <Button
            onClick={handleGoalSave}
            disabled={selectedGoals.length === 0}
            className="w-full"
          >
            Get My Routines
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
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
            <h1 className="text-xl font-semibold">Biohacking Coach</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowGoalSelection(true)}
          >
            Goals
          </Button>
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto space-y-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedGoals.map(goalId => {
            const goal = goals.find(g => g.id === goalId);
            if (!goal) return null;
            const Icon = goal.icon;
            
            return (
              <Badge key={goalId} variant="secondary" className="flex items-center gap-1">
                <Icon className="h-3 w-3" />
                {goal.label}
              </Badge>
            );
          })}
        </div>

        {filteredRoutines.map((routine) => (
          <Card key={routine.id} className="shadow-wellness">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{routine.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {routine.difficulty}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {routine.duration}
                    </Badge>
                  </div>
                </div>
                {routine.tried && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm">{routine.summary}</p>
              
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">The Science</span>
                </div>
                <p className="text-xs text-muted-foreground">{routine.science}</p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Equipment: {routine.equipment}
                </span>
              </div>

              {!routine.tried ? (
                <Button
                  onClick={() => handleTryRoutine(routine.id)}
                  className="w-full"
                  variant="outline"
                >
                  Try This
                </Button>
              ) : (
                <div className="space-y-2">
                  {routine.rating ? (
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-sm">Your rating:</span>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            "h-4 w-4",
                            star <= routine.rating!
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground"
                          )}
                        />
                      ))}
                    </div>
                  ) : canRate(routine) ? (
                    <div className="space-y-2">
                      <p className="text-sm text-center">How did it work for you?</p>
                      <div className="flex justify-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Button
                            key={star}
                            variant="ghost"
                            size="sm"
                            className="p-1"
                            onClick={() => handleRateRoutine(routine.id, star)}
                          >
                            <Star className="h-5 w-5 text-yellow-400" />
                          </Button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-center text-muted-foreground">
                      Come back in a day to rate this routine
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}