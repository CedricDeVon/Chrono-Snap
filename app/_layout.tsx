import "../assets/styles/global.css";

import { Stack } from "expo-router";
import { useFonts } from 'expo-font';
import { TamaguiProvider } from 'tamagui';
import { useEffect, useState } from 'react'
import { useColorScheme, BackHandler } from 'react-native';
import { tamaguiConfig } from '../tamagui.config';
import * as SplashScreen from 'expo-splash-screen';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import useMainStore from '../store/mainStore'
import NetInfo from "@react-native-community/netinfo";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { networkStatus, updateNetworkStatus, currentStyleTheme } = useMainStore();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      updateNetworkStatus(state);
    });
    return () => unsubscribe();

  }, []);

  const [loaded, error] = useFonts({
    'Ubuntu': require('../assets/fonts/Ubuntu/Ubuntu-Light.ttf'),
  });
  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
    const backAction = () => true; // Prevent back navigation

    BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => BackHandler.removeEventListener("hardwareBackPress", backAction);

  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={currentStyleTheme!}>
      <ThemeProvider value={currentStyleTheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false, animation: "none" }}>
          <Stack.Screen name="index" options={{ headerShown: false, animation: "none" }} />
          <Stack.Screen name="log-in" options={{ headerShown: false, animation: "none" }} />
          <Stack.Screen name="sign-up" options={{ headerShown: false, animation: "none" }} />
          <Stack.Screen name="storage" options={{ headerShown: false, animation: "none" }} />
          <Stack.Screen name="insights" options={{ headerShown: false, animation: "none" }} />
          <Stack.Screen name="user-settings" options={{ headerShown: false, animation: "none" }} />
          <Stack.Screen name="+not-found" options={{ headerShown: false, animation: "none" }} />
        </Stack>
      </ThemeProvider>
    </TamaguiProvider>)
}

