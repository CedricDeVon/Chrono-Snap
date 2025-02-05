import "../assets/styles/global.css";
// import '../tamagui-web.css'

import { useEffect } from 'react';
import { Stack } from "expo-router";
import { useFonts } from 'expo-font';
import { TamaguiProvider } from 'tamagui';
import { useColorScheme } from 'react-native';
import { tamaguiConfig } from '../tamagui.config';
import * as SplashScreen from 'expo-splash-screen';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  let colorScheme = 'light' || useColorScheme()
  const [loaded, error] = useFonts({
    'Ubuntu': require('../assets/fonts/Ubuntu/Ubuntu-Light.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme!}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack
          screenOptions={{ headerShown: false }}
        >
        <Stack.Screen
          name="index" options={{ headerShown: false }}
        />
      </Stack>
    </ThemeProvider>
  </TamaguiProvider>);
}
