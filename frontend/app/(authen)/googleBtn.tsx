import { Pressable, Text, View, Image } from 'react-native';
import { icons } from '@/constants/icons';

export default function GoogleButton({
  onPress,
}: {
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="mt-0 w-full flex-row items-center justify-center rounded-xl bg-white py-3 border border-gray-300"
    >
      <Image
        source={icons.google}
        className="mr-3 h-5 w-5"
        resizeMode="contain"
      />
      <Text className="font-kanitBold text-black">
        Continue with Google
      </Text>
    </Pressable>
  );
}
