import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Animated,
  Pressable,
  Dimensions,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "@/constants/icons";

const { width, height } = Dimensions.get("window");
const TABBAR_WIDTH = width * 0.8;

const Icon = ({
  name,
  size = 20,
}: {
  name: keyof typeof icons;
  size?: number;
}) => (
  <Image
    source={icons[name]}
    style={{ width: size, height: size }}
    resizeMode="contain"
  />
);

type TabBarProps = {
  visible: boolean;
  onClose: () => void;
};

export default function TabBar({ visible, onClose }: TabBarProps) {
  const translateX = useRef(new Animated.Value(-TABBAR_WIDTH)).current;

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: visible ? 0 : -TABBAR_WIDTH,
      duration: 280,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  if (!visible) return null;

  return (
    <View className="absolute inset-0 z-50">
      <Pressable
        className="absolute inset-0 bg-black/40"
        onPress={onClose}
      />

      {/* tab bar */}
      <Animated.View
        style={{
          transform: [{ translateX }],
          width: TABBAR_WIDTH,
        }}
        className="h-full bg-white rounded-r-3xl shadow-xl"
      >
        <SafeAreaView className="flex-1 px-6">
          <View className="flex-row items-center justify-between mt-4 mb-8">
            <Text className="text-[32px] font-bold">
              Planora
            </Text>

            <Pressable onPress={onClose}>
              <Icon name="menu" size={22} />
            </Pressable>
          </View>

          {/* Menu */}
          <View className="space-y-6">
            <Pressable className="flex-row items-center space-x-3">
              <Icon name="home_garden" size={20} />
              <Text className="text-[18px] font-medium">
                Pony's Homepage
              </Text>
            </Pressable>

            {/* Project */}
            <View>
              <View className="flex-row items-center space-x-3 mb-4">
                <Icon name="folder" size={20} />
                <Text className="text-[18px] font-medium">
                  Project
                </Text>
              </View>

              <View className="ml-6 pl-4 border-l border-gray-300 space-y-4">
                <TreeItem icon="dashboard" label="DashBoard" />
                <TreeItem icon="board" label="Board" />
                <TreeItem icon="chat" label="Chat" />
                <TreeItem icon="settings" label="Setting" />
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
}

function TreeItem({
  icon,
  label,
}: {
  icon: keyof typeof icons;
  label: string;
}) {
  return (
    <Pressable className="flex-row items-center space-x-3">
      <Icon name={icon} size={18} />
      <Text className="text-[17px]">
        {label}
      </Text>
    </Pressable>
  );
}
