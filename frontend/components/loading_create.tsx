import { View } from "react-native";
import LottieView from "lottie-react-native";

type LoadingProps = {
  visible: boolean;
};

export default function LoadingCreate({ visible }: LoadingProps) {
  if (!visible) return null;

  return (
    <View className="absolute inset-0 z-50 items-center justify-center bg-white/40">
      <LottieView
        source={require("../assets/lottie/trail_loading.json")}
        autoPlay
        loop
        style={{ width: 120, height: 120 }}
      />
    </View>
  );
}
