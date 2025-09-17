import React, { useState, useEffect } from 'react';
import { ArrowLeft, Bell, Clock, Calendar, TestTube, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { notificationService } from '@/services/notificationService';
import { NotificationSettings as NotificationSettingsType } from '@/types/notifications';

const timeOptions = [
  { value: '06:00', label: '6:00 AM' },
  { value: '07:00', label: '7:00 AM' },
  { value: '08:00', label: '8:00 AM' },
  { value: '09:00', label: '9:00 AM' },
  { value: '10:00', label: '10:00 AM' },
  { value: '18:00', label: '6:00 PM' },
  { value: '19:00', label: '7:00 PM' },
  { value: '20:00', label: '8:00 PM' },
  { value: '21:00', label: '9:00 PM' },
  { value: '22:00', label: '10:00 PM' }
];

const weekDayOptions = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' }
];

export default function NotificationSettings() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [settings, setSettings] = useState<NotificationSettingsType>(notificationService.getSettings());
  const [hasPermission, setHasPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    checkPermissionStatus();
    loadPendingNotifications();
  }, []);

  const checkPermissionStatus = async () => {
    const permission = await notificationService.checkPermissions();
    setHasPermission(permission);
  };

  const loadPendingNotifications = async () => {
    const pending = await notificationService.getPendingNotifications();
    setPendingCount(pending.length);
  };

  const handleSettingChange = async <K extends keyof NotificationSettingsType>(
    key: K,
    value: NotificationSettingsType[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    try {
      await notificationService.updateSettings(newSettings);
      await loadPendingNotifications();
      toast({
        title: 'Settings updated',
        description: 'Your notification preferences have been saved.',
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to update notification settings.',
        variant: 'destructive',
      });
    }
  };

  const requestPermissions = async () => {
    setIsLoading(true);
    try {
      const granted = await notificationService.requestPermissions();
      setHasPermission(granted);
      
      if (granted) {
        await notificationService.scheduleAllNotifications();
        await loadPendingNotifications();
        toast({
          title: 'Permissions granted',
          description: 'Notifications are now enabled!',
        });
      } else {
        toast({
          title: 'Permissions denied',
          description: 'Please enable notifications in your device settings.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
      toast({
        title: 'Error',
        description: 'Failed to request notification permissions.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testNotification = async () => {
    try {
      if (!hasPermission) {
        toast({
          title: 'No permissions',
          description: 'Please enable notifications first.',
          variant: 'destructive',
        });
        return;
      }

      await notificationService.scheduleTestNotification();
      toast({
        title: 'Test notification scheduled',
        description: 'You should receive it in 5 seconds!',
      });
    } catch (error) {
      console.error('Error testing notification:', error);
      toast({
        title: 'Test failed',
        description: 'Could not schedule test notification.',
        variant: 'destructive',
      });
    }
  };

  const rescheduleAll = async () => {
    setIsLoading(true);
    try {
      await notificationService.scheduleAllNotifications();
      await loadPendingNotifications();
      toast({
        title: 'Notifications rescheduled',
        description: 'All notifications have been updated.',
      });
    } catch (error) {
      console.error('Error rescheduling notifications:', error);
      toast({
        title: 'Error',
        description: 'Failed to reschedule notifications.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
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
              onClick={() => navigate('/profile')}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">Notification Settings</h1>
          </div>
          <div className="flex items-center gap-2">
            {hasPermission ? (
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                <CheckCircle className="h-3 w-3 mr-1" />
                Enabled
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-red-100 text-red-700">
                <XCircle className="h-3 w-3 mr-1" />
                Disabled
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto space-y-6">
        {/* Permission Status */}
        {!hasPermission && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Bell className="h-5 w-5 text-orange-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-medium text-orange-900">Notifications Disabled</h3>
                  <p className="text-sm text-orange-700 mt-1">
                    Enable notifications to receive reminders and updates about your wellness journey.
                  </p>
                  <Button 
                    onClick={requestPermissions} 
                    disabled={isLoading}
                    className="mt-3 bg-orange-600 hover:bg-orange-700"
                    size="sm"
                  >
                    {isLoading ? 'Requesting...' : 'Enable Notifications'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Daily Reminders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Daily Reminders
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="daily-reminders">Enable daily reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Get reminded to log your goals and track habits
                </p>
              </div>
              <Switch
                id="daily-reminders"
                checked={settings.dailyReminders}
                onCheckedChange={(checked) => handleSettingChange('dailyReminders', checked)}
              />
            </div>

            {settings.dailyReminders && (
              <div className="pl-4 border-l-2 border-primary/20 space-y-4">
                <div>
                  <Label className="text-sm font-medium">Morning reminder time</Label>
                  <Select 
                    value={settings.morningTime} 
                    onValueChange={(value) => handleSettingChange('morningTime', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.slice(0, 5).map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    "Ready to start strong? Log your goals."
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium">Evening reminder time</Label>
                  <Select 
                    value={settings.eveningTime} 
                    onValueChange={(value) => handleSettingChange('eveningTime', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.slice(5).map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    "Time to reflect & track your habits?"
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weekly Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Weekly Reports
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="weekly-reports">Weekly progress summaries</Label>
                <p className="text-sm text-muted-foreground">
                  Get insights about your weekly wellness journey
                </p>
              </div>
              <Switch
                id="weekly-reports"
                checked={settings.weeklyReports}
                onCheckedChange={(checked) => handleSettingChange('weeklyReports', checked)}
              />
            </div>

            {settings.weeklyReports && (
              <div className="pl-4 border-l-2 border-primary/20 space-y-4">
                <div>
                  <Label className="text-sm font-medium">Day of the week</Label>
                  <Select 
                    value={settings.weeklyDay?.toString()} 
                    onValueChange={(value) => handleSettingChange('weeklyDay', parseInt(value))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      {weekDayOptions.map(option => (
                        <SelectItem key={option.value} value={option.value.toString()}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Time</Label>
                  <Select 
                    value={settings.weeklyTime} 
                    onValueChange={(value) => handleSettingChange('weeklyTime', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.slice(0, 5).map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    "Your ThriveGPT summary is ready!"
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
                onCheckedChange={(checked) => handleSettingChange('habitReminders', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="motivational">Motivational messages</Label>
                <p className="text-sm text-muted-foreground">
                  Receive encouraging words and wellness tips
                </p>
              </div>
              <Switch
                id="motivational"
                checked={settings.motivationalMessages}
                onCheckedChange={(checked) => handleSettingChange('motivationalMessages', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Status & Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5 text-primary" />
              Testing & Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Scheduled notifications</span>
              <Badge variant="outline">{pendingCount}</Badge>
            </div>

            <Separator />

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={testNotification}
                disabled={!hasPermission}
                className="flex-1"
              >
                <TestTube className="h-4 w-4 mr-2" />
                Test Notification
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={rescheduleAll}
                disabled={isLoading || !hasPermission}
                className="flex-1"
              >
                {isLoading ? 'Updating...' : 'Refresh All'}
              </Button>
            </div>

            {!notificationService.isSupported() && (
              <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded">
                ℹ️ Notifications work best on mobile devices. Web notifications are limited.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}