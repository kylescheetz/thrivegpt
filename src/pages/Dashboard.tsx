import React, { useState } from 'react';
import { Plus, MessageCircle, Brain, Target, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DailyCheckIn } from '@/components/wellness/daily-check-in';
import { HabitTracker } from '@/components/wellness/habit-tracker';

export default function Dashboard() {
  const [showCheckIn, setShowCheckIn] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20">
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            ThriveGPT
          </h1>
          <p className="text-muted-foreground text-sm">Where Habits Meet Intelligence</p>
        </div>

        {/* Welcome Card */}
        <Card className="bg-gradient-primary text-white shadow-wellness border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-1">Good morning! 🌅</h2>
                <p className="text-white/80 text-sm">Ready to thrive today?</p>
              </div>
              <Button
                onClick={() => setShowCheckIn(true)}
                variant="secondary"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <Plus className="h-4 w-4 mr-2" />
                Check-In
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="shadow-card hover:shadow-wellness transition-all duration-300 cursor-pointer">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-gradient-wellness rounded-full flex items-center justify-center mx-auto mb-2">
                <Brain className="h-6 w-6 text-accent-foreground" />
              </div>
              <h3 className="font-medium text-sm">AI Coach</h3>
              <p className="text-xs text-muted-foreground">Quick chat</p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-wellness transition-all duration-300 cursor-pointer">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-2">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-medium text-sm">Journal</h3>
              <p className="text-xs text-muted-foreground">Reflect</p>
            </CardContent>
          </Card>
        </div>

        {/* Today's Progress */}
        <div>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Today's Progress
          </h2>
          <HabitTracker />
        </div>

        {/* Wellness Insights */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Today's Insight</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-wellness rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-lg">💡</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Your morning routine streak is at 12 days! Consistency is building momentum.
                </p>
                <Button size="sm" variant="outline">
                  Learn More
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Floating AI Coach Button */}
        <Button
          className="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-gradient-primary shadow-float hover:shadow-wellness transition-all duration-300 animate-pulse-wellness"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>

        {/* Daily Check-In Modal */}
        <DailyCheckIn 
          isOpen={showCheckIn} 
          onClose={() => setShowCheckIn(false)} 
        />
      </div>
    </div>
  );
}