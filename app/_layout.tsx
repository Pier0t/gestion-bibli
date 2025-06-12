import 'react-native-url-polyfill/auto';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts } from 'expo-font';
import { DatabaseProvider } from '@/providers/DatabaseProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded] = useFonts({
    // Add custom fonts here if needed
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <DatabaseProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </DatabaseProvider>
    </ThemeProvider>
  );
}
