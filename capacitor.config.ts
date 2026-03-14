import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.agro.app',
  appName: 'Agro_sathi',
  webDir: 'dist',
  plugins: {
    App: {
      overrideBackButton: true,
    }
  }
};

export default config;
