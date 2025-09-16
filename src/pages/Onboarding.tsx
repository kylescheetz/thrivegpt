import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProgressBar } from '@/components/onboarding/ProgressBar';
import { GoalsStep } from '@/components/onboarding/GoalsStep';
import { HabitsStep } from '@/components/onboarding/HabitsStep';
import { NotificationsStep } from '@/components/onboarding/NotificationsStep';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface OnboardingData {
  goals: string[];
  habits: string[];
  notifications: {
    dailyReminders: boolean;
    habitReminders: boolean;
    weeklyReports: boolean;
    motivationalMessages: boolean;
    reminderTime: string;
    frequency: string;
  };
}

const STEP_LABELS = ['Goals', 'Habits', 'Notifications'];

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    goals: [],
    habits: [],
    notifications: {
      dailyReminders: true,
      habitReminders: true,
      weeklyReports: false,
      motivationalMessages: true,
      reminderTime: 'morning',
      frequency: 'daily'
    }
  });

  // Check if user has already completed onboarding
  useEffect(() => {
    const completed = localStorage.getItem('onboarding_completed');
    if (completed === 'true') {
      navigate('/');
    }
  }, [navigate]);

  const handleGoalToggle = (goalId: string) => {
    setOnboardingData(prev => ({
      ...prev,
      goals: prev.goals.includes(goalId)
        ? prev.goals.filter(id => id !== goalId)
        : [...prev.goals, goalId]
    }));
  };

  const handleHabitToggle = (habitId: string) => {
    setOnboardingData(prev => ({
      ...prev,
      habits: prev.habits.includes(habitId)
        ? prev.habits.filter(id => id !== habitId)
        : prev.habits.length < 5 
          ? [...prev.habits, habitId]
          : prev.habits
    }));
  };

  const handleNotificationChange = (key: keyof OnboardingData['notifications'], value: boolean | string) => {
    setOnboardingData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
  };

  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleFinish = () => {
    // Save onboarding data to localStorage
    localStorage.setItem('onboarding_data', JSON.stringify(onboardingData));
    localStorage.setItem('onboarding_completed', 'true');
    
    toast({
      title: "Welcome to ThriveGPT! 🎉",
      description: "Your wellness journey begins now. Let's build healthy habits together!",
    });

    // Navigate to dashboard
    navigate('/');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <GoalsStep
            selectedGoals={onboardingData.goals}
            onGoalToggle={handleGoalToggle}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <HabitsStep
            selectedHabits={onboardingData.habits}
            onHabitToggle={handleHabitToggle}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <NotificationsStep
            settings={onboardingData.notifications}
            onSettingChange={handleNotificationChange}
            onFinish={handleFinish}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Welcome to ThriveGPT</h1>
          <p className="text-muted-foreground">
            Let's personalize your wellness journey in just a few steps
          </p>
        </div>

        {/* Progress Bar */}
        <ProgressBar 
          currentStep={currentStep} 
          totalSteps={3} 
          stepLabels={STEP_LABELS} 
        />

        {/* Main Content */}
        <Card className="shadow-wellness border-0">
          <CardContent className="p-8">
            {renderCurrentStep()}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          Your data is stored locally and never shared without your permission
        </div>
      </div>
    </div>
  );
};

export default Onboarding;