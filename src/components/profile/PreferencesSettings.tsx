import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Bell, Clock, Palette, Globe, Shield, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { UserProfile, UserPreferences, ReminderFrequency } from '@/types/profile';
import { ProfileStorage } from '@/utils/profileStorage';
import { notificationService } from '@/services/notificationService';

interface PreferencesSettingsProps {
  onPreferencesChange?: () => void;
}

export const PreferencesSettings: React.FC<PreferencesSettingsProps> = ({ onPreferencesChange }) => {
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = () => {
    const userProfile = ProfileStorage.getProfile();
    if (userProfile) {
      setProfile(userProfile);
      setPreferences(userProfile.preferences);
    }
  };

  const updatePreference = async <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    if (!preferences) return;

    const updatedPreferences = { ...preferences, [key]: value };
    
    try {
      setIsLoading(true);
      const updatedProfile = ProfileStorage.updatePreferences({ [key]: value });
      setProfile(updatedProfile);
      setPreferences(updatedProfile.preferences);

      // Special handling for reminder frequency changes
      if (key === 'reminderFrequency') {
        await notificationService.scheduleAllNotifications();
      }

      onPreferencesChange?.();
      
      toast({
        title: 'Preferences updated',
        description: `${key.replace(/([A-Z])/g, ' $1').toLowerCase()} has been updated.`,
      });
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast({
        title: 'Error',
        description: 'Failed to update preferences.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = () => {
    try {
      const data = ProfileStorage.exportAllData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `thrivegpt-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Data exported',
        description: 'Your data has been downloaded as a JSON file.',
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: 'Export failed',
        description: 'Failed to export your data.',
        variant: 'destructive',
      });
    }
  };

  const testVoiceInput = () => {
    if (!preferences?.voiceInputEnabled) {
      toast({
        title: 'Voice input disabled',
        description: 'Please enable voice input first.',
        variant: 'destructive',
      });
      return;
    }

    // Check if Web Speech API is supported
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: 'Not supported',
        description: 'Voice input is not supported in your browser.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Voice input test',
      description: 'Voice input is enabled and ready to use!',
    });
  };

  if (!profile || !preferences) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading preferences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Preferences</h3>
        <p className="text-sm text-muted-foreground">
          Customize your ThriveGPT experience
        </p>
      </div>

      {/* Voice Input Settings */}
      <Card className="shadow-wellness">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5 text-primary" />
            Voice Input
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="voice-input">Enable GPT voice input</Label>
              <p className="text-sm text-muted-foreground">
                Use voice commands to interact with your AI coach
              </p>
            </div>
            <Switch
              id="voice-input"
              checked={preferences.voiceInputEnabled}
              onCheckedChange={(checked) => updatePreference('voiceInputEnabled', checked)}
              disabled={isLoading}
            />
          </div>

          {preferences.voiceInputEnabled && (
            <div className="pl-4 border-l-2 border-primary/20 space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MicOff className="h-4 w-4" />
                <span>Voice recognition is browser-dependent</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={testVoiceInput}
                className="w-full"
              >
                Test Voice Input
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reminder Frequency */}
      <Card className="shadow-wellness">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Reminder Frequency
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reminder-frequency">How often should we remind you?</Label>
            <Select
              value={preferences.reminderFrequency}
              onValueChange={(value) => updatePreference('reminderFrequency', value as ReminderFrequency)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="never">Never</SelectItem>
                <SelectItem value="daily">Once daily</SelectItem>
                <SelectItem value="twice-daily">Twice daily (Morning & Evening)</SelectItem>
                <SelectItem value="custom">Custom schedule</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              {preferences.reminderFrequency === 'never' && 'You won\'t receive any reminder notifications'}
              {preferences.reminderFrequency === 'daily' && 'You\'ll get one reminder per day'}
              {preferences.reminderFrequency === 'twice-daily' && 'You\'ll get morning and evening reminders'}
              {preferences.reminderFrequency === 'custom' && 'Set your own reminder schedule in notification settings'}
            </p>
          </div>

          {preferences.reminderFrequency !== 'never' && (
            <div className="pl-4 border-l-2 border-primary/20">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = '/notification-settings'}
                className="w-full"
              >
                <Clock className="h-4 w-4 mr-2" />
                Customize Reminder Times
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Appearance & Language */}
      <Card className="shadow-wellness">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            Appearance & Language
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <Select
              value={preferences.theme}
              onValueChange={(value) => updatePreference('theme', value as 'light' | 'dark' | 'system')}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select
              value={preferences.language}
              onValueChange={(value) => updatePreference('language', value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="zh">中文</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select
              value={preferences.timezone}
              onValueChange={(value) => updatePreference('timezone', value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="America/New_York">Eastern Time</SelectItem>
                <SelectItem value="America/Chicago">Central Time</SelectItem>
                <SelectItem value="America/Denver">Mountain Time</SelectItem>
                <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                <SelectItem value="Europe/London">London</SelectItem>
                <SelectItem value="Europe/Paris">Paris</SelectItem>
                <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                <SelectItem value="Asia/Shanghai">Shanghai</SelectItem>
                <SelectItem value="Australia/Sydney">Sydney</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Data */}
      <Card className="shadow-wellness">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Privacy & Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="data-sharing">Share anonymous usage data</Label>
              <p className="text-sm text-muted-foreground">
                Help improve ThriveGPT by sharing anonymous usage statistics
              </p>
            </div>
            <Switch
              id="data-sharing"
              checked={preferences.dataSharing}
              onCheckedChange={(checked) => updatePreference('dataSharing', checked)}
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="personalized-insights">Personalized insights</Label>
              <p className="text-sm text-muted-foreground">
                Enable AI-powered personalized recommendations and insights
              </p>
            </div>
            <Switch
              id="personalized-insights"
              checked={preferences.personalizedInsights}
              onCheckedChange={(checked) => updatePreference('personalizedInsights', checked)}
              disabled={isLoading}
            />
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="font-medium">Data Management</h4>
            <Button
              variant="outline"
              onClick={handleExportData}
              className="w-full justify-start"
            >
              <Download className="h-4 w-4 mr-3" />
              Export My Data
            </Button>
            <p className="text-xs text-muted-foreground">
              Download all your ThriveGPT data including goals, habits, and progress history
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Account Info */}
      <Card className="shadow-wellness">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Member since:</span>
              <p className="text-muted-foreground">
                {new Date(profile.joinDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <span className="font-medium">Profile ID:</span>
              <p className="text-muted-foreground font-mono text-xs">
                {profile.id}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};