import React, { useState } from 'react';
import { Plus, MessageCircle, Brain, Target, BookOpen, Calendar, TrendingUp, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { DailyCheckIn } from '@/components/wellness/daily-check-in';
import { HabitTracker } from '@/components/wellness/habit-tracker';

// Mock data for visualization
const weeklyHabitData = [
  { day: 'Mon', completed: 4, total: 5 },
  { day: 'Tue', completed: 5, total: 5 },
  { day: 'Wed', completed: 3, total: 5 },
  { day: 'Thu', completed: 4, total: 5 },
  { day: 'Fri', completed: 5, total: 5 },
  { day: 'Sat', completed: 2, total: 5 },
  { day: 'Sun', completed: 4, total: 5 }
];

const monthlyHabitData = [
  { week: 'Week 1', completed: 27, total: 35 },
  { week: 'Week 2', completed: 32, total: 35 },
  { week: 'Week 3', completed: 25, total: 35 },
  { week: 'Week 4', completed: 30, total: 35 }
];

const moodData = [
  { day: 'Mon', mood: 4, energy: 6 },
  { day: 'Tue', mood: 5, energy: 8 },
  { day: 'Wed', mood: 3, energy: 4 },
  { day: 'Thu', mood: 4, energy: 7 },
  { day: 'Fri', mood: 5, energy: 9 },
  { day: 'Sat', mood: 3, energy: 5 },
  { day: 'Sun', mood: 4, energy: 6 }
];

const biohackData = [
  { name: 'Cold Shower', effectiveness: 4.2, sessions: 5 },
  { name: 'Box Breathing', effectiveness: 4.8, sessions: 7 },
  { name: 'Blue Light Blocking', effectiveness: 3.9, sessions: 6 },
  { name: 'Intermittent Fasting', effectiveness: 4.5, sessions: 3 }
];

const getMoodEmoji = (mood: number) => {
  if (mood >= 5) return '😊';
  if (mood >= 4) return '🙂';
  if (mood >= 3) return '😐';
  if (mood >= 2) return '🙁';
  return '😢';
};

export default function Dashboard() {
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [viewPeriod, setViewPeriod] = useState<'week' | 'month'>('week');

  const habitChartData = viewPeriod === 'week' ? weeklyHabitData : monthlyHabitData;
  const completionRate = Math.round((habitChartData.reduce((acc, day) => acc + day.completed, 0) / habitChartData.reduce((acc, day) => acc + day.total, 0)) * 100);

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

        {/* Time Period Toggle */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Your Progress</h2>
          <Tabs value={viewPeriod} onValueChange={(value) => setViewPeriod(value as 'week' | 'month')}>
            <TabsList className="grid w-32 grid-cols-2">
              <TabsTrigger value="week" className="text-xs">Week</TabsTrigger>
              <TabsTrigger value="month" className="text-xs">Month</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* GPT Summary Card */}
        <Card className="bg-gradient-wellness shadow-wellness border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Your {viewPeriod === 'week' ? 'Week' : 'Month'} in Review
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-sm mb-2">🎯 Highlights</h4>
              <p className="text-sm text-muted-foreground">
                {viewPeriod === 'week' 
                  ? "Perfect Tuesday! All 5 habits completed. Your Box Breathing streak is now at 7 days."
                  : "Strong month with 87% habit completion. Cold shower routine showing 4.2★ effectiveness."}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm mb-2">🔍 Patterns Noticed</h4>
              <p className="text-sm text-muted-foreground">
                {viewPeriod === 'week'
                  ? "Weekends tend to be your challenging days. Energy levels peak on Fridays."
                  : "First week of each month shows highest motivation. Mid-month dips are common."}
              </p>
            </div>

            <div>
              <h4 className="font-medium text-sm mb-2">💡 Recommendations</h4>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  • {viewPeriod === 'week' 
                      ? "Try meal prepping Sunday to support Monday momentum"
                      : "Schedule mid-month check-ins to maintain consistency"}
                </p>
                <p className="text-sm text-muted-foreground">
                  • Consider adding a weekend accountability partner
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="shadow-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{completionRate}%</div>
              <p className="text-xs text-muted-foreground">Completion</p>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">12</div>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl">😊</div>
              <p className="text-xs text-muted-foreground">Avg Mood</p>
            </CardContent>
          </Card>
        </div>

        {/* Habit Progress Chart */}
        <Card className="shadow-wellness">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Habit Completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={habitChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey={viewPeriod === 'week' ? 'day' : 'week'} 
                  fontSize={12}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis fontSize={12} stroke="hsl(var(--muted-foreground))" />
                <Bar dataKey="completed" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="total" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} opacity={0.3} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Mood & Energy Trends */}
        <Card className="shadow-wellness">
          <CardHeader>
            <CardTitle className="text-lg">Mood & Energy Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={moodData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" fontSize={12} stroke="hsl(var(--muted-foreground))" />
                  <YAxis domain={[0, 10]} fontSize={12} stroke="hsl(var(--muted-foreground))" />
                  <Line 
                    type="monotone" 
                    dataKey="mood" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="energy" 
                    stroke="hsl(var(--secondary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--secondary))', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              
              <div className="flex justify-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span>Mood</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-secondary"></div>
                  <span>Energy</span>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                {moodData.map((day, index) => (
                  <div key={index} className="text-center">
                    <div className="text-lg mb-1">{getMoodEmoji(day.mood)}</div>
                    <div className="text-xs text-muted-foreground">{day.day}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Biohack Effectiveness */}
        <Card className="shadow-wellness">
          <CardHeader>
            <CardTitle className="text-lg">Biohack Effectiveness</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {biohackData.map((biohack, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{biohack.name}</h4>
                    <p className="text-xs text-muted-foreground">{biohack.sessions} sessions</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium">{biohack.effectiveness}</span>
                      <span className="text-yellow-500">★</span>
                    </div>
                    <Badge 
                      variant={biohack.effectiveness >= 4.5 ? 'default' : biohack.effectiveness >= 4.0 ? 'secondary' : 'outline'}
                      className="text-xs"
                    >
                      {biohack.effectiveness >= 4.5 ? 'Excellent' : biohack.effectiveness >= 4.0 ? 'Good' : 'Okay'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Card 
            className="shadow-card hover:shadow-wellness transition-all duration-300 cursor-pointer"
            onClick={() => window.location.href = '/coach'}
          >
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-gradient-wellness rounded-full flex items-center justify-center mx-auto mb-2">
                <Brain className="h-6 w-6 text-accent-foreground" />
              </div>
              <h3 className="font-medium text-sm">Biohacking Coach</h3>
              <p className="text-xs text-muted-foreground">Science routines</p>
            </CardContent>
          </Card>

          <Card 
            className="shadow-card hover:shadow-wellness transition-all duration-300 cursor-pointer"
            onClick={() => window.location.href = '/journal'}
          >
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-2">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-medium text-sm">Journal</h3>
              <p className="text-xs text-muted-foreground">Reflect</p>
            </CardContent>
          </Card>
        </div>

        {/* Today's Habits */}
        <div>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Today's Habits
          </h2>
          <HabitTracker />
        </div>

        {/* Daily Check-In Button */}
        <Button
          onClick={() => setShowCheckIn(true)}
          className="w-full bg-gradient-primary hover:shadow-wellness transition-all duration-300"
        >
          <Plus className="h-4 w-4 mr-2" />
          Daily Check-In
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