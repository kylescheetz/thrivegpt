import React from 'react';
import { Progress } from '@/components/ui/progress';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  currentStep, 
  totalSteps, 
  stepLabels 
}) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between mb-4">
        {stepLabels.map((label, index) => (
          <div 
            key={index}
            className={`text-sm font-medium transition-colors ${
              index + 1 <= currentStep 
                ? 'text-primary' 
                : 'text-muted-foreground'
            }`}
          >
            {label}
          </div>
        ))}
      </div>
      <Progress value={progress} className="h-2" />
      <div className="text-center mt-2 text-xs text-muted-foreground">
        Step {currentStep} of {totalSteps}
      </div>
    </div>
  );
};