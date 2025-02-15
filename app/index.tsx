import { router } from 'expo-router';
import Storage from 'expo-sqlite/kv-store';
import { BackHandler, View } from 'react-native';
import { Image, Button, H3, XStack, YStack } from 'tamagui';

import Logo from '../assets/images/logos-main/png/snack.png';
import useMainStore from '@/store/mainStore';
import { CommonHeader } from '../components/CommonHeader';
import { CommonFooter } from '../components/CommonFooter';
import { BrandingTitle } from '../components/BrandingTitle';
import { LargeApplicationLogo } from '../components/LargeApplicationLogo';

export default function Index() {
  const handleNavigatingToLogIn = () => {
    router.navigate('log-in');
  }
  
  const handleNavigatingToSignUp = () => {
    router.navigate('sign-up');
  }
  
  const handleNavigatingToExit = () => {
    BackHandler.exitApp();
  }

  return (
    <>
      <CommonHeader />
      <YStack flex={1} alignItems="center" justifyContent="center">
        <YStack gap="$5" alignItems="center" justifyContent="center">
          <BrandingTitle />
          <YStack width={200} gap="$3">
            <Button onPress={handleNavigatingToLogIn}>Log In</Button>
            <Button onPress={handleNavigatingToSignUp}>Sign Up</Button>
          </YStack>
          <View></View>
          <YStack width={200} gap="$3">
            <Button onPress={handleNavigatingToExit}>Exit</Button>
          </YStack>
        </YStack>
      </YStack>
      <CommonFooter />
    </>
  )
}
