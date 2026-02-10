import { View, Image, Text } from "react-native";
import { icons } from "@/constants/icons";


export default function DashBoard() {


  return (
  <View>
    <View className="flex-row items-center mx-6 pt-10">
        <Image source={icons.menu} className="w-full h-6 " resizeMode="contain" />
        <Text className="text-[36px] font-kanitBold">Dashboard</Text>
    </View>



  </View>
)
}
