import React from 'react';
import { ArrowLeft, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DailyHabitTracker } from '@/components/habits/DailyHabitTracker';

export default function Habits() {
  const navigate = useNavigate();

  const handleEndDay = (summary: string) => {
    console.log('Daily summary:', summary);
    // You could navigate to a summary page or show a modal here
  };

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
            <h1 className="text-xl font-semibold">Daily Habits</h1>
          </div>
          <Button variant="ghost" size="sm">
            <Edit3 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto">
        <DailyHabitTracker onEndDay={handleEndDay} />
      </div>
    </div>
  );
}