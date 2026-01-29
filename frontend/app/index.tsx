import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
   <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-blue-500">
        Welcome to Nativewind!
      </Text>

      <Link href="/(home)/create_project">create project</Link>
      <Link href="/(authen)/login">LOGIN</Link>
      <Link href="/(home)/homepage">HOMEPAGE</Link>

    </View>
    
  );
}
