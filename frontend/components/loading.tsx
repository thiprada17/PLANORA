import { View } from 'react-native';
import LottieView from 'lottie-react-native';

type LoadingProps = {
  visible: boolean;
};

export default function Loading({ visible }: LoadingProps) {
  if (!visible) return null;

  return (
    <View className="absolute inset-0 z-50 items-center justify-center bg-white/60">
      <LottieView
        source={require('../assets/lottie/Star Loader 2.json')}
        autoPlay
        loop
        style={{ width: 150, height: 150 }}
      />
    </View>
  );
}
