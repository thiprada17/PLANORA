import React, { useRef } from "react";
import { View, Text, Pressable, Image, Animated } from "react-native";
import { icons } from "@/constants/icons";

// พิมบ่อยเกินมันล่ก
type TabType = "kanban" | "todo" | "calendar";
type Props = {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onFilterPress?: () => void;
};

export default function BoardBar({
  activeTab,
  onTabChange,
  onFilterPress,
}: Props) {
// ตั้งค่าของอนิเมชั่น
  const translateX = useRef(new Animated.Value(0)).current;
  const tabLayouts = useRef<any>({});

  const moveUnderline = (tab: TabType) => {
    const layout = tabLayouts.current[tab];

    if (!layout) return;

    Animated.spring(translateX, {
      toValue: layout.x,
      useNativeDriver: true,
    }).start();
  };

  const TabItem = ({
    id,
    label,
    icon,
  }: {
    id: TabType;
    label: string;
    icon: any;
  }) => (
    <Pressable
      onLayout={(e) => {
        tabLayouts.current[id] = e.nativeEvent.layout;

        if (id === activeTab) {
          moveUnderline(id);
        }
      }}
      onPress={() => {
        onTabChange(id);
        moveUnderline(id);
      }}
      className="flex-row items-center mr-5"
    >
      <Image source={icon} style={{ width: 17, height: 17 }} />
      <Text className="ml-1 font-KanitMedium text-[15px]">
        {label}
      </Text>
    </Pressable>
  );

  return (
    <View className="mx-6 mt-4 mb-6 border-[0.7px] border-[#8E8E8E] rounded-xl bg-[#F0F0F0]">

      {/*ก้อนใหญ่ */}
      <View className="flex-row items-center justify-between px-3 py-2">

        {/* Tabs */}
        <View className="flex-row items-center">
          <TabItem id="kanban" label="Kanban" icon={icons.kanban} />
          <TabItem id="todo" label="To-do" icon={icons.bookmark} />
          <TabItem id="calendar" label="Calendar" icon={icons.calendar} />
        </View>

        {/* filter */}
        <Pressable onPress={onFilterPress}
          className="border border-[#8E8E8E] rounded-2xl px-2 py-2 bg-[#F0F0F0]">
          <Image source={icons.filter} style={{ width: 17, height: 17 }} />
        </Pressable>
      </View>

      {/* อนิเมชั่นเส้น*/}
      <Animated.View
        style={{
          transform: [{ translateX }],
        }}
        className="ml-5 h-[2px] w-[70px] bg-black/60 rounded-full"
      />

    </View>
  );
}