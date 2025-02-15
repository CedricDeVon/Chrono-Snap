import { View } from 'react-native'
import { router } from 'expo-router';
import { BarChart } from "react-native-gifted-charts";
import { Paragraph, H6, XStack, YStack, } from 'tamagui';

import { supabase } from '@/utils/supabase'
import useMainStore from '@/store/mainStore';
import { CommonHeader } from '@/components/CommonHeader';
import { TabsSelectionFooter } from '@/components/TabsSelectionFooter';

export default function Insights() {
  const { insights } = useMainStore();
  
  return (
    <>
      <CommonHeader showLogo={true}/>
      <YStack flex={1} alignItems="center" justifyContent="center">
        <YStack width="80%" height="85%" flex={1} position="relative">
          <YStack gap="$5">
            <View></View>
            <H6 textAlign="center">Insights</H6>
            <View></View>
            <XStack alignItems="center" justifyContent="space-between">
              <Paragraph>Files Uploaded</Paragraph>
              <Paragraph>{insights.filesUploaded}</Paragraph>
            </XStack>
            <YStack gap="$3">
              <Paragraph>File Types {(insights.filesUploaded) ? undefined : '(None)'}</Paragraph>
              <YStack alignItems="center" justifyContent="center">
                <BarChart
                  showFractionalValue
                  showYAxisIndices
                  noOfSections={5}
                  width={240}
                  spacing={50}
                  data={insights.fileTypesDataset}
                  isAnimated
                  animateOnDataChange
                  animationDuration={1000}
                  onDataChangeAnimationDuration={300}
                  rulesColor="gray"
                  rulesType="solid"
                  yAxisTextStyle={{ color: 'gray' }}
                  xAxisLabelTextStyle={{ color: 'gray' }}
                  xAxisColor="gray"
                  yAxisColor="gray"
                  showGradient
                  gradientColor={'hsl(209, 100%, 60.6%)'}
                  frontColor='rgba(0, 0, 0, 0)'
                />
              </YStack>
            </YStack>
          </YStack>
        </YStack>
      </YStack>
      <TabsSelectionFooter />
    </>
  )
}
