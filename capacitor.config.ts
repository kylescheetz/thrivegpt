import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.ba4ea96d835f4468a252915bc991f1dd',
  appName: 'ThriveGPT',
  webDir: 'dist',
  server: {
    url: 'https://ba4ea96d-835f-4468-a252-915bc991f1dd.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#4BA3F2',
      androidSplashResourceName: 'splash',
      showSpinner: false
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#4BA3F2',
      sound: 'beep.wav'
    }
  }
};

export default config;