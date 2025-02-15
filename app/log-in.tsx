import { View } from 'react-native';
import { router } from 'expo-router';
import { Paragraph, Button, XStack, YStack, Input, Spinner, Form } from 'tamagui';

import { supabase } from '@/utils/supabase';
import useMainStore from '@/store/mainStore';
import { CommonHeader } from '../components/CommonHeader';
import { CommonFooter } from '../components/CommonFooter';
import { BrandingTitle } from '../components/BrandingTitle';
import { LargeApplicationLogo } from '../components/LargeApplicationLogo';

export default function LogIn() {
  const { currentStyleTheme, logInForm, updateLogInForm } = useMainStore();

  const handleNavigatingToHome = () => {
    router.navigate('/');
  }

  const handleLogInFormSubmission = async () => {
    try {
      updateLogInForm({ status: 'submitting' })

      if (!logInForm.email || !logInForm.password) {
        updateLogInForm({ status: 'off', message: "Enter Your Email And Password" });
        return;
      }
      
      const result = await supabase.auth.signInWithPassword({
        email: logInForm.email,
        password: logInForm.password,
      })
      
      if (result.error) {
        updateLogInForm({ status: 'off', message: (result.error.status) ? result.error.message : "Connect to Log In" });
        return;
      }
      
      router.navigate('storage');
      updateLogInForm({ status: 'off', email: '', password: '', message: '' });

    } catch (error: any) {
      updateLogInForm({ status: 'off', message: (result.error.status) ? result.error.message : "Connect to Log In" });
    }
  }
  
  return (
    <>
      <CommonHeader />
      <YStack flex={1} alignItems="center" justifyContent="center">
        <Form onSubmit={handleLogInFormSubmission}>
          <YStack gap="$5" alignItems="center" justifyContent="center">
            <BrandingTitle />
              {(logInForm.message) ?
                (
                  <YStack alignItems="center" justifyContent="space-between" width={200}>
                    <Paragraph fontSize={12} color="$red11" textAlign="center" lineHeight={15}>{logInForm.message}</Paragraph>
                  </YStack>

                ) : undefined 
              }
            <YStack width={200} gap="$3">
              <Input placeholder="Email" value={logInForm.email} onChangeText={(value: any) => { updateLogInForm({ email: value }) }} size="$4" borderWidth={1} />
              <Input secureTextEntry placeholder="Password" value={logInForm.password} onChangeText={(value: any) => { updateLogInForm({ password: value }) }} size="$4" borderWidth={1}/>
              <View></View>
              <Form.Trigger asChild disabled={logInForm.status !== 'off'}>
                <Button color="$white2" backgroundColor="$blue9" pressStyle={{ backgroundColor: "$blue8" }} icon={(logInForm.status === 'submitting') ? () => <Spinner color="$white2" /> : undefined}>
                  Log In
                </Button>
              </Form.Trigger>
            </YStack>
            <View></View>
            <YStack width={200} gap="$3">
                <Button disabled={logInForm.status !== 'off'} onPress={handleNavigatingToHome}>Go Back</Button>
            </YStack>
          </YStack>
        </Form>
      </YStack>
      <CommonFooter />
    </>
  )
}
