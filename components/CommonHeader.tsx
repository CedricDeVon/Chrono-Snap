import { Sun, Moon } from '@tamagui/lucide-icons';
import { BackHandler, View } from 'react-native';
import { Button, XStack, YStack, Paragraph, Image } from 'tamagui';

import Logo from '../assets/images/logos-main/png/snack.png';
import useMainStore from '@/store/mainStore';

export function CommonHeader(props: any) {
    const { currentStyleTheme, changeCurrentStyleTheme } = useMainStore();

    return (
        <YStack alignItems="center" justifyContent="center" height={60}>
            <XStack width="80%" alignItems="center" justifyContent="space-between">
                {(props.showLogo) ? <Image source={Logo} width={24} height={24}/> : <View></View>}
                <Button backgroundColor="transparent" onPress={changeCurrentStyleTheme}>
                    {(currentStyleTheme === 'dark') ? <Sun size="$1"/> : <Moon size="$1"/>}
                </Button>
            </XStack>
        </YStack>
    );
}
