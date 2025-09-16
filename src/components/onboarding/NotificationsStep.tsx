import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Bell, Smartphone, Mail, MessageSquare } from 'lucide-react';

interface NotificationSettings {
  dailyReminders: boolean;
  habitReminders: boolean;
  weeklyReports: boolean;
  motivationalMessages: boolean;
  reminderTime: string;
  frequency: string;
}

interface NotificationsStepProps {
  settings: NotificationSettings;
  onSettingChange: (key: keyof NotificationSettings, value: boolean | string) => void;
  onFinish: () => void;
  onBack: () => void;
}

export const NotificationsStep: React.FC<NotificationsStepProps> = ({
  settings,
  onSettingChange,
  onFinish,
  onBack
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Set up notifications</h2>
        <p className="text-muted-foreground">
          Stay motivated with personalized reminders and progress updates
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-primary" />
            Daily Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="daily-reminders">Daily habit reminders</Label>
              <p className="text-sm text-muted-foreground">
                Get reminded to complete your daily habits
              </p>
            </div>
            <Switch
              id="daily-reminders"
              checked={settings.dailyReminders}
              onCheckedChange={(checked) => onSettingChange('dailyReminders', checked)}
            />
          </div>

          {settings.dailyReminders && (
            <div className="pl-4 border-l-2 border-primary/20 space-y-3">
              <div className="flex items-center gap-4">
                <Label className="text-sm">Reminder time:</Label>
                <Select 
                  value={settings.reminderTime} 
                  onValueChange={(value) => onSettingChange('reminderTime', value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning (9 AM)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (2 PM)</SelectItem>
                    <SelectItem value="evening">Evening (6 PM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="motivational">Motivational messages</Label>
              <p className="text-sm text-muted-foreground">
                Receive encouraging words and tips
              </p>
            </div>
            <Switch
              id="motivational"
              checked={settings.motivationalMessages}
              onCheckedChange={(checked) => onSettingChange('motivationalMessages', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Progress Reports
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="weekly-reports">Weekly progress reports</Label>
              <p className="text-sm text-muted-foreground">
                Get detailed insights about your wellness journey
              </p>
            </div>
            <Switch
              id="weekly-reports"
              checked={settings.weeklyReports}
              onCheckedChange={(checked) => onSettingChange('weeklyReports', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="habit-reminders">Habit streak updates</Label>
              <p className="text-sm text-muted-foreground">
                Celebrate your consistency and milestones
              </p>
            </div>
            <Switch
              id="habit-reminders"
              checked={settings.habitReminders}
              onCheckedChange={(checked) => onSettingChange('habitReminders', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-subtle border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <p className="text-sm font-medium">Smart Recommendations</p>
              <p className="text-xs text-muted-foreground">
                We'll analyze your progress and suggest optimizations
              </p>
            </div>
            <Badge variant="secondary">Always On</Badge>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button 
          onClick={onFinish} 
          size="lg"
          className="px-8 bg-gradient-primary hover:opacity-90"
        >
          Complete Setup
        </Button>
      </div>
    </div>
  );
};