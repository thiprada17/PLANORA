import { Stack } from "expo-router";
import "./global.css"
import { useFonts } from "expo-font";
import { GestureHandlerRootView } from "react-native-gesture-handler";



export default function Layout() {
  const [fontsLoaded] = useFonts({
    KanitBold: require("../assets/fonts/KanitBold.ttf"),
    KanitSemiBold: require("../assets/fonts/Kanit-SemiBold.ttf"),
    KanitMedium: require("../assets/fonts/Kanit-Medium.ttf"),
    KanitRegular: require("../assets/fonts/KanitRegular.ttf"),
    KanitExtraBold: require("../assets/fonts/KanitExtraBold.ttf")
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
        <GestureHandlerRootView style={{ flex: 1 }}>
    <Stack screenOptions={{ headerShown: false }} />
    </GestureHandlerRootView>
  );
}