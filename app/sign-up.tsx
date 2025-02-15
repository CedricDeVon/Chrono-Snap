import { View } from 'react-native';
import { router } from 'expo-router';
import { Paragraph, Button, XStack, YStack, Input, Spinner, Form } from 'tamagui';

import { supabase } from '@/utils/supabase';
import useMainStore from '@/store/mainStore';
import { CommonHeader } from '@/components/CommonHeader';
import { CommonFooter } from '@/components/CommonFooter';
import { BrandingTitle } from '@/components/BrandingTitle';
import { Validators } from '@/library/validators/validators';
import { LargeApplicationLogo } from '@/components/LargeApplicationLogo';

export default function SignUp() {
  const { currentStyleTheme, signUpForm, updateSignUpForm } = useMainStore();

  const handleNavigatingToHome = () => {
    router.navigate('/');
  }

  const handleSignUpFormSubmission = async () => {
    try {
      updateSignUpForm({ status: 'submitting' });

      let result = await Validators.emailValidator.validate(signUpForm.email);
      if (!result.isSuccessful){
        updateSignUpForm({ status: 'off', message: result.error });
        return;
      }
      result = (await Validators.passwordValidator.validate(signUpForm.password));
      if (!result.isSuccessful){
        updateSignUpForm({ status: 'off', message: result.error });
        return;
      }
      if (!signUpForm.password || !signUpForm.confirmPassword ||
          signUpForm.password !== signUpForm.confirmPassword) {
        updateSignUpForm({ status: 'off', message: "Both Passwords Must Match" });
        return;
      }

      result = await supabase.auth.signUp({ email: signUpForm.email, password: signUpForm.password })
      if (result.error) {
        updateSignUpForm({ status: 'off', message: (result.error.status) ? result.error.message : "Connect to Log In" });
        return;
      }
      result = await supabase.from('user').insert({ email: signUpForm.email })
      if (result.error) {
        updateSignUpForm({ status: 'off', message: (result.error.status) ? result.error.message : "Connect to Log In" });
        return;
      }

      router.navigate('storage');
      updateSignUpForm({ status: 'off', email: '', password: '', confirmPassword: '', message: '' });

    } catch (error: any) {
      updateSignUpForm({ status: 'off', message: error.message });
    }
  }
  
  return (
    <>
      <CommonHeader />
      <YStack flex={1} alignItems="center" justifyContent="center">
        <Form onSubmit={handleSignUpFormSubmission}>
          <YStack gap="$5" alignItems="center" justifyContent="center">
            <BrandingTitle />
            {(signUpForm.message) ?
              (
                <YStack width={200} alignItems="center" justifyContent="space-between">
                  <Paragraph fontSize={12} color="$red11" textAlign="center" lineHeight={15}>{signUpForm.message}</Paragraph>
                </YStack>
              ) : undefined 
            }
            <YStack width={200} gap="$3">
              <Input placeholder="Email" borderWidth={1} value={signUpForm.email} onChangeText={(value: any) => { updateSignUpForm({ email: value }) }} />
              <Input secureTextEntry placeholder="Password" value={signUpForm.password} onChangeText={(value: any) => { updateSignUpForm({ password: value }) }} />
              <Input secureTextEntry placeholder="Confirm Password" value={signUpForm.confirmPassword} onChangeText={(value: any) => { updateSignUpForm({ confirmPassword: value }) }} />
              <View></View>
              <Form.Trigger asChild disabled={signUpForm.status !== 'off'}>
                <Button color="$white2" backgroundColor="$blue9" pressStyle={{ backgroundColor: "$blue8" }} icon={signUpForm.status === 'submitting' ? () => <Spinner color="$white2"/> : undefined}>
                  Sign Up
                </Button>
              </Form.Trigger>
            </YStack>
            <View></View>
            <YStack width={200} gap="$3">
              <Button disabled={signUpForm.status !== 'off'} onPress={handleNavigatingToHome}>Go Back</Button>
            </YStack>
          </YStack>
        </Form>
      </YStack>
      <CommonFooter />
    </>
  )
}
