import { H3, XStack } from 'tamagui';

import { LargeApplicationLogo } from '../components/LargeApplicationLogo';

export function BrandingTitle() {
    return (
        <XStack gap="$3" justifyContent="center">
            <LargeApplicationLogo />
            <H3>NimBit</H3>
        </XStack>
    )
}
