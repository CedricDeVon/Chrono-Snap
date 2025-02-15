import { View } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/utils/supabase';
import { Folder, ChartBar, Settings, Image } from '@tamagui/lucide-icons';
import { Paragraph, Button, XStack, YStack, Input } from 'tamagui';

import useMainStore from '@/store/mainStore';

export function TabsSelectionFooter() {
    const { currentStyleTheme, currentActiveTab, updateCurrentActiveTab } = useMainStore();

    const handleNavigatingToStorage = () => {
        if (currentActiveTab !== 'storage') {
            updateCurrentActiveTab('storage');
            router.navigate('storage');
        }
    }

    const handleNavigatingToInsights = () => {
        if (currentActiveTab !== 'insights') {
            updateCurrentActiveTab('insights');
            router.navigate('insights');
        }
    }

    const handleNavigationToUserSettings = () => {
        if (currentActiveTab !== 'user-settings') {
            updateCurrentActiveTab('user-settings');
            router.navigate('user-settings');
        }
    }

    return (
        <YStack backgroundColor={(currentStyleTheme === 'dark') ? "$black1" : '$white2' } height={80} alignItems="center" justifyContent="center">
            <XStack width="80%" height="100%" alignItems="center" justifyContent="space-around" >
                <Button height="100%" backgroundColor={(currentStyleTheme === 'dark') ? "$black1" : '$white2' } onPress={handleNavigatingToStorage}>
                    <YStack alignItems="center" gap="$1">
                        <Image size="$1" color={(currentActiveTab === 'storage') ? '$blue10' : '$color'}/>
                        <Paragraph size="$1" color={(currentActiveTab === 'storage') ? '$blue10' : '$color'}>Display</Paragraph>
                    </YStack>
                </Button>
                <Button height="100%" backgroundColor={(currentStyleTheme === 'dark') ? "$black1" : '$white2' } onPress={handleNavigatingToInsights}>
                    <YStack alignItems="center" gap="$1">
                        <ChartBar size="$1" color={(currentActiveTab === 'insights') ? '$blue10' : '$color'}/>
                        <Paragraph size="$1" color={(currentActiveTab === 'insights') ? '$blue10' : '$color'}>Insights</Paragraph>
                    </YStack>
                </Button>
                <Button height="100%" backgroundColor={(currentStyleTheme === 'dark') ? "$black1" : '$white2' } onPress={handleNavigationToUserSettings}>
                    <YStack alignItems="center" gap="$1">
                        <Settings size="$1" color={(currentActiveTab === 'user-settings') ? '$blue10' : '$color'}/>
                        <Paragraph size="$1" color={(currentActiveTab === 'user-settings') ? '$blue10' : '$color'}>Settings</Paragraph>
                    </YStack>
                </Button>
            </XStack>
        </YStack>
    );
}
