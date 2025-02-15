import { Image, Button, H3, XStack, YStack, Paragraph } from 'tamagui';

export function CommonFooter(props: any) {
    return (
        <YStack alignItems="center" justifyContent="center" height={100}>
            <XStack width="80%" alignItems="flex-end" justifyContent="center">
            <Paragraph color="$black8">{props.text || ''}</Paragraph>
            </XStack>
        </YStack>
    )
}
