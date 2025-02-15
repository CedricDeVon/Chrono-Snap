import { View } from 'react-native'
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { BarChart } from "react-native-gifted-charts";
import { Paragraph, H6, XStack, YStack, } from 'tamagui';

import { supabase } from '@/utils/supabase'
import useMainStore from '@/store/mainStore';
import { CommonHeader } from '@/components/CommonHeader';
import { TabsSelectionFooter } from '@/components/TabsSelectionFooter';

export default function Insights() {
  const { insights, updateInsights } = useMainStore();

  const handleLoadingResource = async () => {
    try {
      updateInsights({ filesUploaded: 0, fileTypesDataset: [] });

      const authUserResult = await supabase.auth.getUser();
      if (authUserResult.error) {
        alert(authUserResult.error.message);
        updateInsights({ filesUploaded: 0, fileTypesDataset: [] });
        return;
      }
      supabase
        .from('resource')
        .select('id,file_type')
        .eq('user_email', authUserResult.data.user.email)
        .then((resourceResponse: any) => {
          if (resourceResponse.error) {
            alert(resourceResponse.error.message);
            updateInsights({ filesUploaded: 0, fileTypesDataset: [] });
            return;
          }
          const fileTypesPartialResults = {};
          resourceResponse.data.forEach((item) => {
            fileTypesPartialResults[item.file_type] = (!fileTypesPartialResults[item.file_type]) ? 1 : fileTypesPartialResults[item.file_type] + 1;
          })
          const fileTypesDataset = [];
          for (const fileTypeResult in fileTypesPartialResults) {
            fileTypesDataset.push({ value: fileTypesPartialResults[fileTypeResult], label: fileTypeResult });
          }
          updateInsights({ filesUploaded: resourceResponse.data.length, fileTypesDataset });
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
