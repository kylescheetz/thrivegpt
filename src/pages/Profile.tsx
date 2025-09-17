import React, { useState } from 'react';
import { ArrowLeft, Edit, Settings, Download, Share2, Bell, Shield, HelpCircle, LogOut, Camera, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

const profileData = {
  name: 'Alex Thompson',
  email: 'alex@example.com',
  joinDate: 'March 2024',
  streakDays: 28,
  totalHabits: 12,
  completedSessions: 156,
  avatar: null
};

const wellnessStats = [
  { label: 'Current Streak', value: '28 days', icon: '🔥' },
  { label: 'Habits Completed', value: '156', icon: '✅' },
  { label: 'Journal Entries', value: '42', icon: '📝' },
  { label: 'AI Coaching Sessions', value: '23', icon: '🤖' }
];

const settingSections = [
  {
    title: 'Notifications',
    items: [
      { label: 'Daily Reminders', enabled: true },
      { label: 'Achievement Alerts', enabled: true },
      { label: 'Weekly Reports', enabled: false }
    ]
  },
  {
    title: 'Privacy',
    items: [
      { label: 'Share Anonymous Data', enabled: true },
      { label: 'Personalized Insights', enabled: true }
    ]
  }
];

export default function Profile() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState({
    daily: true,
    achievements: true,
    weekly: false
  });
  const [privacy, setPrivacy] = useState({
    anonymousData: true,
    personalizedInsights: true
  });

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
            <h1 className="text-xl font-semibold">Profile</h1>
          </div>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto space-y-6">
        {/* Profile Header */}
        <Card className="shadow-wellness">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profileData.avatar || undefined} />
                  <AvatarFallback className="text-xl bg-gradient-wellness">
                    {profileData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{profileData.name}</h2>
                <p className="text-muted-foreground">{profileData.email}</p>
                <p className="text-sm text-muted-foreground">Member since {profileData.joinDate}</p>
                
                <Button variant="outline" size="sm" className="mt-2">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Wellness Stats */}
        <Card className="shadow-wellness">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Your Wellness Journey
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            {wellnessStats.map((stat, index) => (
              <div key={index} className="text-center p-3 rounded-lg bg-muted/30">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="font-semibold text-lg">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Current Goal Progress */}
        <Card className="shadow-wellness bg-gradient-wellness border-0">
          <CardContent className="p-4">
            <h3 className="font-medium mb-3">Current Goal: Build Consistent Habits</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>28/30 days</span>
              </div>
              <Progress value={93} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Just 2 more days to reach your monthly goal! 🎯
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Settings Sections */}
        {settingSections.map((section, sectionIndex) => (
          <Card key={sectionIndex} className="shadow-wellness">
            <CardHeader>
              <CardTitle className="text-lg">{section.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-center justify-between">
                  <span className="text-sm">{item.label}</span>
                  <Switch
                    checked={item.enabled}
                    onCheckedChange={(checked) => {
                      // Handle toggle logic here
                      console.log(`${item.label}: ${checked}`);
                    }}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}

        {/* Action Buttons */}
        <Card className="shadow-wellness">
          <CardContent className="p-4 space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Download className="h-4 w-4 mr-3" />
              Export My Data
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Share2 className="h-4 w-4 mr-3" />
              Share Progress
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/notification-settings')}
            >
              <Bell className="h-4 w-4 mr-3" />
              Notification Settings
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Shield className="h-4 w-4 mr-3" />
              Privacy & Security
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <HelpCircle className="h-4 w-4 mr-3" />
              Help & Support
            </Button>
            
            <Separator className="my-4" />
            
            <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
              <LogOut className="h-4 w-4 mr-3" />
              Sign Out
            </Button>
          </CardContent>
        </Card>

        {/* App Info */}
        <div className="text-center text-xs text-muted-foreground space-y-1">
          <p>ThriveGPT v1.0.0</p>
          <p>Made with ❤️ for your wellness journey</p>
        </div>
      </div>
    </div>
  );
}