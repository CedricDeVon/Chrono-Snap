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
  const { theme, changeTheme, currentStyleTheme, activeTab, updateActiveTab, storageTab, updateStorageTab } = useMainStore();

  const handleAddResource = async () => {
    try {
      await ImagePicker.requestMediaLibraryPermissionsAsync();

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: false,
        allowsEditing: false,
        quality: 1,
        exif: false,
      });

      if (result.canceled) {
        alert('Image Selection Canceled');
        return;
      }

      const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, { encoding: FileSystem.EncodingType.Base64 });
      const buffer = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
      const authUserResult = await supabase.auth.getUser();
      if (authUserResult.error) {
        alert(authUserResult.error.message);
        return;
      }
      
      result = await supabase
        .storage
        .from('resources')
        .upload(`RESOURCE-${Date.now()}`, buffer, { contentType: result.assets[0].mimeType })
      if (result.error) {
        alert(result.error.message);
        return;
      }
      
      result = await supabase.from('resource').insert({ id: result.data.path, user_email: authUserResult.data.user.email })
      if (result.error) {
        alert(result.error.message);
        return;
      }

      alert('Resource Added');
      handleLoadingResources();

    } catch (error: any) {
      alert(error.message);
    }
  }

  const handleLoadingResources = async () => {
    const authUserResult = await supabase.auth.getUser();
    if (authUserResult.error) {
      alert(authUserResult.error.message);
      return;
    }
  
    supabase
      .from('resource')
      .select('id, timestamp_created')
      .eq('user_email', authUserResult.data.user.email)
      .order('timestamp_created', { ascending: false })
      .then((response: any) => {
        if (response.error) {
          alert(response.error.message);
          return;
        }
        let temporary = {};
        response.data.forEach((item, index) => {
          const dateTime = new Date(item.timestamp_created).toDateString()
          if (!temporary[dateTime]) {
            temporary[dateTime] = [];
          }
          supabase
            .storage
            .from('resources')
            .createSignedUrl(item.id, 3600, {transform: {
              width: 100,
              height: 100,
            }})
            .then((res) => {
              item['url'] = res.data.signedUrl;
          })
          temporary[dateTime].push(item);
        })
        updateStorageTab({ loadingStatus: 'off', resources: temporary || [] });
      })
  }

  useEffect(() => {
    
    handleLoadingResources();
    if (storageTab.resources.length === 0) {
    }
  }, [])

  return (
    <>
      <CommonHeader showLogo={true}/>
      <YStack flex={1} alignItems="center" justifyContent="center">
        <YStack gap="$5" width="80%" height="100%">
          <View></View>
          <H6 textAlign="center">Display</H6>
          <View height="65%">
            <YStack alignItems="center" justifyContent="center" height="100%" gap="$2">
              <ImageOff size="$3" color={(currentStyleTheme === 'dark') ? '$white2' : '$black2'}/>
              <Paragraph size="$1">None Selected</Paragraph>
            </YStack>
          </View>
          <YStack alignItems="flex-start">
            <Button
              onPress={handleAddResource}
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
