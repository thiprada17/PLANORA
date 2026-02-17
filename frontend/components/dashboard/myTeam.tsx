import { View, Text, ScrollView, Image, ViewStyle } from "react-native";
import { icons } from "@/constants/icons";

type Props = {
  shadowStyle?: ViewStyle;
  members: { name: string }[];
};

export default function MyTeam({ shadowStyle, members }: Props) {
  return (
    <View className="mb-16 items-center" style={shadowStyle}>
      <View
        className="w-[85%] border border-dashed border-black rounded-2xl p-4"
      >
        <Text className="font-kanitBold text-xl mb-4 text-center">
          My Team
        </Text>

        <ScrollView
          className="h-[180px]"
          nestedScrollEnabled
          showsVerticalScrollIndicator
          contentContainerStyle={{
            alignItems: "center",
            paddingBottom: 10,
          }}
        >
          {members.map((member, index) => (
            <View
              key={index}
              className="flex-row items-center justify-center mb-3 w-full"
            >
              <Image
                source={icons.face}
                className="w-10 h-10 rounded-full mr-3"
              />
              <Text className="font-kanitRegular text-sm">
                {member.name}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
