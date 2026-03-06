import React from "react";
import { View, Text } from "react-native";

export default function CalendarBoard() {
  return (
    <View className="mx-6 mt-4 p-6 border rounded-2xl border-neutral-300">
      <Text className="font-kanitMedium text-2xl mb-3">Calendar</Text>

      <Text className="font-kanitRegular text-gray-600">
        Calendar view will appear here
      </Text>
    </View>
  );
}