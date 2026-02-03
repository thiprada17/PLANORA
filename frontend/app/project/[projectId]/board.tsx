import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Image,
  Dimensions,
  Pressable,
} from "react-native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { Pressable } from "react-native";
import { useState } from "react";
import CreateTaskModal from "@/components/task/create_task";

// element: icons
const icons = {
  add: require("../../../assets/icons/add.png"),
  arrow_forward: require("../../../assets/icons/arrow_forward.png"),
  date: require("../../../assets/icons/date_range.png"),
  delete: require("../../../assets/icons/delete.png"),
  user: require("../../../assets/icons/face.png"),
  filter: require("../../../assets/icons/filter_list.png"),
  custom_pen: require("../../../assets/icons/ink_pen.png"),
  kanban: require("../../../assets/icons/view_kanban.png"),
  menu: require("../../../assets/icons/menu.png"),
};

const Icon = ({
  name,
  size = 18,
  style,
}: {
  name: keyof typeof icons;
  size?: number;
  style?: any;
}) => (
  <Image
    source={icons[name]}
    style={[
      {
        width: size,
        height: size,
      },
      style,
    ]}
  />
);

// responsive
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const BASE_WIDTH = 393;

const scale = (size: number) => (SCREEN_WIDTH / BASE_WIDTH) * size;

const spacing = {
  xxs: scale(6),
  xs: scale(8),
  sm: scale(12),
  md: scale(16),
  lg: scale(24),
  xl: scale(32),
  margin_horizontal: scale(64),
};

// column
const Column = [
  {
    id: "todo",
    title: "To-do",
    tasks: [1, 2, 3, 4],
  },
  {
    id: "progress",
    title: "On Progress",
    tasks: [1],
  },
  {
    id: "review",
    title: "In Review",
    tasks: [1],
  },
  {
    id: "complete",
    title: "Complete",
    tasks: [1],
  },
];

const users = [1, 2, 3]; // mock

export default function BoardScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  // element: fonts
  const [fontsLoaded] = useFonts({
    kanitMedium: require("../../../assets/fonts/Kanit-Medium.ttf"),
  });

  if (!fontsLoaded) return null;

  function setModalVisible(arg0: boolean): void {
    throw new Error("Function not implemented.");
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View className="flex-row items-center mx-6 mt-12">
        <TouchableOpacity className="mr-3">
          <Icon name="menu" size={24} />
        </TouchableOpacity>

        <Text className="flex-1 font-kanitMedium text-[36px] text-black">
          Board
        </Text>

        <Pressable
          onPress={() => setModalVisible(true)}
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 2,
          }}
          className="border-2 border-black rounded-lg px-3 py-2 mt bg-white active:bg-gray-100"
        >
          <Text className="font-kanitMedium">+ Create Task</Text>
        </Pressable>

        <CreateTaskModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        />
      </View>

      {/* Tab */}
      <View className="flex-row items-center justify-between mx-6 mt-2 mb-6 px-5 py-2 border border-[#8E8E8E] rounded-xl bg-[#F0F0F0]">
        <View className="flex-row items-center gap-2">
          <Icon name="kanban" size={18} />
          <Text className="font-kanitMedium text-xl">Kanban</Text>
        </View>

        <Pressable className="border border-[#8E8E8E] rounded-2xl px-2 py-2 bg-[#F0F0F0]">
          <Icon name="filter" size={17} />
        </Pressable>
      </View>

      {/* Board */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.board}
      >
        {Column.map((col) => (
          <View
            key={col.id}
            style={{
              shadowColor: "#000",
              shadowOpacity: 0.5,
              shadowRadius: 2,
              shadowOffset: { width: 0, height: 2 },
            }}
            className="w-[250px] h-[550px] mr-7 mx p-4 rounded-2xl border border-black bg-[#CAEAD5]"
          >
            {/* Column Header */}
            <View className="flex-row items-center justify-between mb pb-2">
              <Text className="font-kanitMedium text-2xl">{col.title}</Text>

              <View className="flex-row gap">
                <TouchableOpacity className="border border-black rounded-md px-2 py-2 mx-1 my-1 mt-4 mb-4 bg-white">
                  <Icon name="custom_pen" size={20} />
                </TouchableOpacity>

                <TouchableOpacity className="border border-black rounded-md px-2 py-2 mt-4 mb-4 bg-[#F07166]">
                  <Icon name="delete" size={20} />
                </TouchableOpacity>
              </View>
            </View>

            <View className="h-[2px] bg-black my-3 mt-2" />

            {/* Cards */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
              style={{ flexGrow: 0 }}
            >
              {col.tasks.map((_, i) => (
                <View
                  key={i}
                  style={{
                    shadowColor: "#000",
                    shadowOpacity: 0.6,
                    shadowRadius: 2,
                    shadowOffset: { width: 0, height: 2 },
                  }}
                  className="mb-4 rounded-3xl border border-black bg-[#F0F0F0] pt-6 pb-2 px-2 "
                >
                  <View className="rounded-3xl border border-black bg-white p">
                    <Text className="font-kanitMedium text-2xl mt-7 mx-2 px-2">
                      Task name
                    </Text>

                    <View className="flex-row items-center gap-1 mb-7 mx-2 px-2 ">
                      <View className="border border-black rounded-full p-1 bg-white">
                        <Icon name="date" size={8} />
                      </View>
                      <Text className="font-kanitRegular text-xs text-black">
                        DD/MM/YY
                      </Text>
                    </View>

                    <Text className="font-kanitRegular text-xs text-black mx-2 mb-2 px-2">
                      Assign to
                    </Text>

                    <View className="flex-row items-center mx-3 mb-5">
                      {users.map((u, i) => (
                        <View
                          key={i}
                          style={{
                            shadowColor: "#000",
                            shadowOpacity: 0.5,
                            shadowRadius: 1.5,
                            shadowOffset: { width: 0, height: 2.5 },
                          }}
                          className={`w-[30px] h-[30px] rounded-full bg-white ${
                            i !== 0 ? "-ml-2.5" : ""
                          }`}
                        />
                      ))}
                    </View>
                  </View>
                </View>
              ))}

              {/* Add task */}
              <TouchableOpacity className="flex-row items-center gap-2 mt-2" onPress={() => setModalVisible(true)}>
                <Text className="font-kanitMedium text-md">+ Add Task</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  board: {
    marginHorizontal: spacing.lg,
    alignItems: "flex-start",
  },
});
