import { View } from 'react-native';
import { Link, Stack } from 'expo-router';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen/>
      <View>
        <Link href="/" className="color-white">
            Go Back
        </Link>
      </View>
    </>
)};