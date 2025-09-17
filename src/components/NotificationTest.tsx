import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { notificationService } from '@/services/notificationService';
import { TestTube, Bell, CheckCircle, XCircle } from 'lucide-react';

export const NotificationTest: React.FC = () => {
  const { toast } = useToast();
  const [hasPermission, setHasPermission] = useState(false);
  const [pendingNotifications, setPendingNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    const permission = await notificationService.checkPermissions();
    setHasPermission(permission);
    
    const pending = await notificationService.getPendingNotifications();
    setPendingNotifications(pending);
  };

  const requestPermissions = async () => {
    setIsLoading(true);
    try {
      const granted = await notificationService.requestPermissions();
      setHasPermission(granted);
      
      if (granted) {
        toast({
          title: 'Permissions granted',
          description: 'You can now receive notifications!',
        });
      } else {
        toast({
          title: 'Permissions denied',
          description: 'Please enable notifications in your device settings.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to request permissions.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const scheduleTestNotification = async () => {
    try {
      await notificationService.scheduleTestNotification();
      toast({
        title: 'Test notification scheduled',
        description: 'You should receive it in 5 seconds!',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to schedule test notification.',
        variant: 'destructive',
      });
    }
  };

  const scheduleAllNotifications = async () => {
    try {
      await notificationService.scheduleAllNotifications();
      await checkStatus();
      toast({
        title: 'Notifications scheduled',
        description: 'All notifications have been set up according to your preferences.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to schedule notifications.',
        variant: 'destructive',
      });
    }
  };

  const showWebNotification = async () => {
    try {
      await notificationService.showWebNotification(
        'ThriveGPT Web Test 🌐',
        'This is a web notification test!'
      );
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to show web notification.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5" />
          Notification Test Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Permission Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Permission Status:</span>
          {hasPermission ? (
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              <CheckCircle className="h-3 w-3 mr-1" />
              Granted
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-red-100 text-red-700">
              <XCircle className="h-3 w-3 mr-1" />
              Denied
            </Badge>
          )}
        </div>

        {/* Pending Notifications Count */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Scheduled Notifications:</span>
          <Badge variant="outline">{pendingNotifications.length}</Badge>
        </div>

        {/* Platform Info */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Platform Support:</span>
          <Badge variant={notificationService.isSupported() ? 'default' : 'secondary'}>
            {notificationService.isSupported() ? 'Native' : 'Web Only'}
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {!hasPermission && (
            <Button 
              onClick={requestPermissions}
              disabled={isLoading}
              className="w-full"
              variant="outline"
            >
              <Bell className="h-4 w-4 mr-2" />
              {isLoading ? 'Requesting...' : 'Request Permissions'}
            </Button>
          )}

          <Button 
            onClick={scheduleTestNotification}
            disabled={!hasPermission}
            className="w-full"
            variant="outline"
          >
            <TestTube className="h-4 w-4 mr-2" />
            Test Notification (5s)
          </Button>

          <Button 
            onClick={scheduleAllNotifications}
            disabled={!hasPermission}
            className="w-full"
            variant="outline"
          >
            Schedule All Reminders
          </Button>

          <Button 
            onClick={showWebNotification}
            className="w-full"
            variant="outline"
          >
            Test Web Notification
          </Button>

          <Button 
            onClick={checkStatus}
            className="w-full"
            variant="ghost"
            size="sm"
          >
            Refresh Status
          </Button>
        </div>

        {/* Debug Info */}
        {pendingNotifications.length > 0 && (
          <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
            <strong>Scheduled:</strong>
            <ul className="mt-1 space-y-1">
              {pendingNotifications.map((notif, index) => (
                <li key={index}>
                  • {notif.title} (ID: {notif.id})
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};