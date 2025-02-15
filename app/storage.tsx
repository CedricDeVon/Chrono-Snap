import { router } from 'expo-router';
import { View } from 'react-native'
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase'
import useMainStore from '@/store/mainStore';
import { Check as CheckIcon, Trash, Folder, ChartBar, Settings, Filter, Sun, Plus, Camera, Moon, ImageOff } from '@tamagui/lucide-icons'
import { ScrollView, Paragraph, Checkbox, Label, Image, Button, H1, H6, XStack, YStack, Input, Spinner, Form } from 'tamagui';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from "expo-file-system";

import Logo from '../assets/images/logos-main/png/snack.png';

import { CommonHeader } from '@/components/CommonHeader';
import { TabsSelectionFooter } from '@/components/TabsSelectionFooter';

export default function Storage() {
  const { currentStyleTheme, storageTab, updateStorageTab } = useMainStore();

  const handleAddingResource = async () => {
    try {
      updateStorageTab({ loadingStatus: 'loading', resourceUrl: '', resourceUri: '' });

      await ImagePicker.requestMediaLibraryPermissionsAsync();

      const imagePickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: false,
        allowsEditing: false,
        quality: 1,
        exif: false,
      });
      if (imagePickerResult.canceled) {
        alert('Image Selection Canceled');
        updateStorageTab({ loadingStatus: 'off' });
        return;
      }
      updateStorageTab({ loadingStatus: 'off', resourceUrl: '', resourceUri: imagePickerResult.assets[0].uri })

      const base64 = await FileSystem.readAsStringAsync(imagePickerResult.assets[0].uri, {
        encoding: FileSystem.EncodingType.Base64
      });
      const buffer = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
      const authUserResult = await supabase.auth.getUser();
      if (authUserResult.error) {
        alert(authUserResult.error.message);
        updateStorageTab({ loadingStatus: 'off', resourceUrl: '', resourceUri: '' });
        return;
      }
      
      supabase
        .storage
        .from('resources')
        .upload(`${Date.now()}`, buffer, {
            contentType: imagePickerResult.assets[0].mimeType
          }).then((resourcesResponse: any) => {
            if (resourcesResponse.error) {
              alert(resourcesResponse.error.message);
              updateStorageTab({ loadingStatus: 'off', resourceUrl: '', resourceUri: '' });
              return;
            }
            supabase
              .from('resource')
              .insert({
                id: resourcesResponse.data.path,
                user_email: authUserResult.data.user.email,
                size_in_bytes: imagePickerResult.assets[0].fileSize,
                file_type: imagePickerResult.assets[0].mimeType
              }).then((resourceResponse: any) => {
                if (resourceResponse.error) {
                  alert(resourceResponse.error.message);
                  updateStorageTab({ loadingStatus: 'off', resourceUrl: '', resourceUri: '' });
                  return;
                }
                supabase
                  .from('user')
                  .update({
                    resource_id: resourcesResponse.data.path,
                    timestamp_modified: new Date().toISOString()
                  })
                  .eq('email', authUserResult.data.user.email)
                  .then((updateUserResponse: any) => {
                    if (updateUserResponse.error) {
                      alert(updateUserResponse.error.message);
                      updateStorageTab({ loadingStatus: 'off', resourceUrl: '', resourceUri: '' });
                      return;
                    }
                })
            }) 
        })

    } catch (error: any) {
      alert(error.message);
    }
  }

  const handleLoadingResource = async () => {
    try {
      updateStorageTab({ loadingStatus: 'loading', resourceUrl: '', resourceUri: '' });

      const authUserResult = await supabase.auth.getUser();
      if (authUserResult.error) {
        alert(authUserResult.error.message);
        return;
      }

      supabase
        .from('user')
        .select('resource_id')
        .eq('email', authUserResult.data.user.email)
        .then((userResponse: any) => {
          if (userResponse.error) {
            alert(userResponse.error.message);
            updateStorageTab({ loadingStatus: 'off', resourceUrl: '', resourceUri: '' });
            return;
          }
          const userResult = userResponse.data[0];
          if (userResult.resource_id === '') {
            updateStorageTab({ loadingStatus: 'off', resourceUrl: '', resourceUri: '' });
            return;
          }

          supabase
            .storage
            .from('resources')
            .createSignedUrl(userResult.resource_id, 86400, {
              transform: {
                width: 100,
                height: 100,
              }
            })
            .then((resourcesResponse: any) => {
              if (resourcesResponse.error) {
                alert(resourcesResponse.error.message);
                updateStorageTab({ loadingStatus: 'off', resourceUrl: '', resourceUri: '' });
                return;
              }
              
              updateStorageTab({
                loadingStatus: 'off',
                resourceUrl: resourcesResponse.data.signedUrl
              });
          })
        })

    } catch (error: any) {
      alert(error.message);
    }
  }

  useEffect(() => {
    handleLoadingResource();
  }, [])

  return (
    <>
      <CommonHeader showLogo={true}/>
      <YStack flex={1} alignItems="center" justifyContent="center">
        <YStack gap="$5" width="80%" height="100%">
          <View></View>
          <H6 textAlign="center">Display</H6>
          <View height="65%">
          {
            (storageTab.loadingStatus === 'loading') ?
              <YStack alignItems="center" justifyContent="center" height="100%" gap="$2">
                <Spinner size="large" color={(currentStyleTheme === 'dark') ? '$white2' : '$black2'}/>
              </YStack> :
                (storageTab.resourceUrl === '' && storageTab.resourceUri === '') ?
                  <YStack alignItems="center" justifyContent="center" height="100%" gap="$2">
                    <ImageOff size="$3" color={(currentStyleTheme === 'dark') ? '$white2' : '$black2'}/>
                    <Paragraph size="$1">No Image</Paragraph>
                  </YStack> :
                    <YStack alignItems="center" justifyContent="center" height="100%" gap="$2">
                      <Image source={{ uri: (storageTab.resourceUrl) ? storageTab.resourceUrl : storageTab.resourceUri }} width={320} height={320} resizeMode="fit" />
                    </YStack>
          }
          </View>
          <YStack alignItems="flex-start">
            <Button
              onPress={handleAddingResource}
              position="absolute"
              top={0}
              width={64}
              height={64}
              borderRadius={5}
              backgroundColor={'$blue9'}
              pressStyle={{ backgroundColor: "$blue8" }}>
                <Plus size="$2" color="$white2"/>
            </Button>
          </YStack>
          </YStack>
        </YStack>
      <TabsSelectionFooter />
    </>
  )
}
