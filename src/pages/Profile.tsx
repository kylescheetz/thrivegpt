import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Settings, Download, Share2, Bell, Shield, HelpCircle, LogOut, Camera, TrendingUp, Target, CheckCircle2, Cog } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { GoalManagement } from '@/components/profile/GoalManagement';
import { HabitManagement } from '@/components/profile/HabitManagement';
import { PreferencesSettings } from '@/components/profile/PreferencesSettings';
import { WeeklySummary } from '@/components/profile/WeeklySummary';
import { UserProfile, DEFAULT_USER_PREFERENCES, DEFAULT_USER_STATS } from '@/types/profile';
import { ProfileStorage } from '@/utils/profileStorage';

export default function Profile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: ''
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    loadProfile();
  }, [refreshTrigger]);

  const loadProfile = () => {
    let userProfile = ProfileStorage.getProfile();
    
    // Create default profile if none exists
    if (!userProfile) {
      userProfile = ProfileStorage.createDefaultProfile('Alex Thompson', 'alex@example.com');
      
      // Initialize from onboarding data if available
      ProfileStorage.initializeFromOnboarding();
    }
    
    setProfile(userProfile);
    setEditForm({
      name: userProfile.name,
      email: userProfile.email
    });
  };

  const handleEditProfile = () => {
    if (!profile || !editForm.name.trim() || !editForm.email.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const updatedProfile = ProfileStorage.updateProfile({
        name: editForm.name,
        email: editForm.email
      });
      
      setProfile(updatedProfile);
      setIsEditProfileOpen(false);
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile.',
        variant: 'destructive',
      });
    }
  };

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="flex items-center justify-between p-4 max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">Profile & Settings</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={handleRefresh}>
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 max-w-4xl mx-auto">
        {/* Profile Header */}
        <Card className="shadow-wellness mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile.avatar || undefined} />
                  <AvatarFallback className="text-xl bg-gradient-wellness">
                    {profile.name.split(' ').map(n => n[0]).join('')}
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
                <h2 className="text-xl font-semibold">{profile.name}</h2>
                <p className="text-muted-foreground">{profile.email}</p>
                <p className="text-sm text-muted-foreground">
                  Member since {new Date(profile.joinDate).toLocaleDateString()}
                </p>
                
                <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="mt-2">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={editForm.name}
                          onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsEditProfileOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleEditProfile}>
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 rounded-lg bg-muted/30">
                  <div className="text-2xl mb-1">🔥</div>
                  <div className="font-semibold text-lg">{profile.stats.currentStreak}</div>
                  <div className="text-xs text-muted-foreground">Day Streak</div>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <div className="text-2xl mb-1">✅</div>
                  <div className="font-semibold text-lg">{profile.stats.totalHabitsCompleted}</div>
                  <div className="text-xs text-muted-foreground">Completed</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="goals" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="goals" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Goals
            </TabsTrigger>
            <TabsTrigger value="habits" className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Habits
            </TabsTrigger>
            <TabsTrigger value="summary" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Summary
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Cog className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="goals">
              <GoalManagement onGoalsChange={handleRefresh} />
            </TabsContent>

            <TabsContent value="habits">
              <HabitManagement onHabitsChange={handleRefresh} />
            </TabsContent>

            <TabsContent value="summary">
              <WeeklySummary onSummaryChange={handleRefresh} />
            </TabsContent>

            <TabsContent value="settings">
              <PreferencesSettings onPreferencesChange={handleRefresh} />
            </TabsContent>
          </div>
        </Tabs>

        {/* Quick Actions */}
        <Card className="shadow-wellness mt-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col gap-2"
              onClick={() => navigate('/notification-settings')}
            >
              <Bell className="h-6 w-6" />
              <span className="text-sm">Notifications</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col gap-2"
              onClick={() => {
                const data = ProfileStorage.exportAllData();
                const blob = new Blob([data], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `thrivegpt-backup-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                toast({ title: 'Data exported', description: 'Your backup has been downloaded.' });
              }}
            >
              <Download className="h-6 w-6" />
              <span className="text-sm">Export Data</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col gap-2"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'ThriveGPT',
                    text: 'Check out my wellness journey with ThriveGPT!',
                    url: window.location.origin
                  });
                } else {
                  toast({ title: 'Share not supported', description: 'Your browser doesn\'t support sharing.' });
                }
              }}
            >
              <Share2 className="h-6 w-6" />
              <span className="text-sm">Share Progress</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col gap-2"
            >
              <HelpCircle className="h-6 w-6" />
              <span className="text-sm">Help & Support</span>
            </Button>
          </CardContent>
        </Card>

        {/* App Info */}
        <div className="text-center mt-8 text-xs text-muted-foreground space-y-1">
          <p>ThriveGPT v1.0.0</p>
          <p>Made with ❤️ for your wellness journey</p>
        </div>
      </div>
    </div>
  );
}