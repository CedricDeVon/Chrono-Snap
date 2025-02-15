import { View } from 'react-native'
import { router } from 'expo-router';
import { Paragraph, Button, H6, XStack, YStack, Input, Spinner, Form } from 'tamagui';

import Logo from '@/assets/images/logos-main/png/snack.png';
import { supabase } from '@/utils/supabase'
import useMainStore from '@/store/mainStore';
import { CommonHeader } from '@/components/CommonHeader';
import { Validators } from '@/library/validators/validators';
import { TabsSelectionFooter } from '@/components/TabsSelectionFooter';

export default function UserSettings() {
  const { updateCurrentActiveTab, userSettingsChangePasswordForm, updateUserSettingsChangePasswordForm, resetUserSettingsChangePasswordForm } = useMainStore();

  const handleChangingUserPassword = async () => {
    try {
      updateUserSettingsChangePasswordForm({ status: 'changing-user-password', errorMessage: '' });

      let result = (await Validators.passwordValidator.validate(userSettingsChangePasswordForm.password));
      if (!result.isSuccessful){
        updateUserSettingsChangePasswordForm({ status: 'off', errorMessage: result.error });
        return;
      }
      if (!userSettingsChangePasswordForm.password || !userSettingsChangePasswordForm.confirmPassword ||
          userSettingsChangePasswordForm.password !== userSettingsChangePasswordForm.confirmPassword) {
            updateUserSettingsChangePasswordForm({ status: 'off', errorMessage: "Both Passwords Must Match" });
        return;
      }
      
      result = await supabase.auth.updateUser({
        password: userSettingsChangePasswordForm.password
      })
      if (result.error) {
        updateUserSettingsChangePasswordForm({ status: 'off', errorMessage: result.error.message });
        return;
      }

      router.navigate('/');
      resetUserSettingsChangePasswordForm();
      updateCurrentActiveTab('storage');

    } catch (error: any) {
      updateUserSettingsChangePasswordForm({ status: 'off', errorMessage: error.message });
    }
  }

  const handleLoggingOut = async () => {
    try {
      updateUserSettingsChangePasswordForm({ status: 'logging-out', errorMessage: '' });

      const result = await supabase.auth.signOut();
      if (result.error) {
        updateUserSettingsChangePasswordForm({ status: 'off', errorMessage: result.error.message });
        return;
      }

      router.navigate('/');
      resetUserSettingsChangePasswordForm();
      updateCurrentActiveTab('storage');

    } catch (error: any) {
      updateUserSettingsChangePasswordForm({ status: 'off', errorMessage: error.message });
    }
  }

  return (
    <>
      <CommonHeader showLogo={true}/>
      <YStack flex={1} alignItems="center">
        <Form width="100%" onSubmit={handleChangingUserPassword} alignItems="center">
          <YStack gap="$5" width="80%" alignItems="center" justifyContent="center">
            <View></View>
            <H6 textAlign="center">User Settings</H6>
            {(userSettingsChangePasswordForm.errorMessage) ?
            (
              <YStack width="80%" alignItems="center" justifyContent="space-between">
                <Paragraph size="$1" color="$red11" textAlign="center" lineHeight={15}>{userSettingsChangePasswordForm.errorMessage}</Paragraph>
              </YStack>
            ) : undefined 
            }
            <YStack width="80%" gap="$3">
              <Input secureTextEntry placeholder="New Password" value={userSettingsChangePasswordForm.password} onChangeText={(value: any) => { updateUserSettingsChangePasswordForm({ password: value }) }}/>
              <Input secureTextEntry placeholder="Confirm Password" value={userSettingsChangePasswordForm.confirmPassword} onChangeText={(value: any) => { updateUserSettingsChangePasswordForm({ confirmPassword: value }) }} />
            </YStack>
            <Form.Trigger width="80%" asChild disabled={userSettingsChangePasswordForm.status !== 'off'}>
              <Button backgroundColor="$blue9" pressStyle={{ backgroundColor: "$blue8" }} icon={userSettingsChangePasswordForm.status === 'changing-user-password' ? () => <Spinner color="$white2"/> : undefined}>
                <Paragraph color="$white2">Save and Log In</Paragraph>
              </Button>
            </Form.Trigger>
            <View></View>
            <Button width="80%" pressStyle={{ backgroundColor: "$red8" }} disabled={userSettingsChangePasswordForm.status !== 'off'} onPress={handleLoggingOut} backgroundColor="$red9" icon={(userSettingsChangePasswordForm.status === 'logging-out') ? () => <Spinner color="$white2"/> : undefined}>
              <Paragraph color="$white2">Log Out</Paragraph>
            </Button>
          </YStack>
        </Form>
      </YStack>
      <TabsSelectionFooter />
    </>
  )
}

