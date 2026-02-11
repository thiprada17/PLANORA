import { View, Text, ViewStyle } from "react-native";

type Props = {
  shadowStyle?: ViewStyle;
  data: { label: string; value: number }[];
};

export default function TaskOverview({ shadowStyle, data }: Props) {
  return (
    <View className="mb-10 items-center">
      <View className="w-[85%] relative" style={shadowStyle}>
        <View className="absolute top-4 left-3 w-full h-full bg-GREEN rounded-2xl border -z-10" style={shadowStyle} />
        <View className="bg-white rounded-2xl border border-black px-6 py-4">
          <Text className="font-kanitBold text-xl mb-3 text-center">
            Tasks Overview
          </Text>

          {data.map((item) => (
            <View
              key={item.label}
              className="flex-row justify-between mb-1"
            >
              <Text className="font-kanitRegular">
                {item.label}
              </Text>
              <Text className="font-kanitBold">
                {item.value} tasks
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

    