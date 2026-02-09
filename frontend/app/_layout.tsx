import { Stack } from "expo-router";
import "./global.css"
import { useFonts } from "expo-font";


export default function Layout() {
  const [fontsLoaded] = useFonts({
    KanitBold: require("../assets/fonts/KanitBold.ttf"),
    KanitSemiBold: require("../assets/fonts/Kanit-SemiBold.ttf"),
    KanitMedium: require("../assets/fonts/Kanit-Medium.ttf"),
    KanitRegular: require("../assets/fonts/KanitRegular.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}