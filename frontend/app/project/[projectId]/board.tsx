import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions, Pressable,
} from "react-native";
import { useFonts } from "expo-font";
import { useState } from "react";
import CreateTaskModal from "@/components/task/create_task";
import ProjectChatModal from "@/components/chat/project_chat";
import { icons } from "@/constants/icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import TabBar from "@/components/tabBar";

import { useLocalSearchParams } from "expo-router";


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
    id: "to-do",
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

  const { projectId } = useLocalSearchParams<{ projectId: string }>();

  const projectID = Number(projectId);

  const [modalVisible, setModalVisible] = useState(false);
  const [tabBarVisible, setTabBarVisible] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  const [tasks, setTasks] = useState<any[]>([])

  // element: fonts
  const [fontsLoaded] = useFonts({
    kanitMedium: require("../../../assets/fonts/Kanit-Medium.ttf"),
    kanitRegular: require("../../../assets/fonts/KanitRegular.ttf"),
  });

  if (!fontsLoaded) return null;

  // function setModalVisible(arg0: boolean): void {
  //   throw new Error("Function not implemented.");
  // }
useEffect(() => {
  if (!projectID) return;

  const fetchTask = async () => {
    try {
      const res = await fetch(
        `https://freddy-unseconded-kristan.ngrok-free.dev/get/task/${projectID}`
      );

      if (!res.ok) {
        throw new Error("Network response not ok");
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        setTasks(data);
      } else if (Array.isArray(data.tasks)) {
        setTasks(data.tasks);
      } else {
        setTasks([]);
      }

      console.log(data)

    } catch (err) {
      console.log("Fetch error:", err);
      setTasks([]);
    }
  };

  fetchTask();
}, [projectID]);




  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center mx-6 pt-10">
        <TouchableOpacity className="mr-3" onPress={() => setTabBarVisible(true)}>
          <Icon name="menu" size={24} />
        </TouchableOpacity>

        <Text className="flex-1 font-kanitMedium text-[36px] text-black">Board</Text>

        <Pressable
          onPress={() => setModalVisible(true)}
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 2,
          }}
          className="border-2 border-black rounded-lg px-3 py-2 bg-white active:bg-gray-100"
        >
          <Text className="font-kanitMedium">+ Create Task</Text>
        </Pressable>
        <CreateTaskModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          projectId={projectID}
        />
      </View>

      {/* Tab */}
      <View className="flex-row items-center justify-between mx-6 mt-4 mb-6 px-5 py-2 border border-[#8E8E8E] rounded-xl bg-[#F0F0F0]">
        <View className="flex-row items-center justify-center gap-2">
          {/* <Icon name="kanban" size={18} /> */}
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
        {Column.map((col) => {
          const columnTasks = tasks.filter(
            (task) => task.status === col.id
          );

          return (

            <View
              key={col.id}
              style={{
                shadowColor: "#000",
                shadowOpacity: 0.5,
                shadowRadius: 2,
                shadowOffset: { width: 0, height: 2 },
              }}
              className="w-[210px] h-[540px] mr-7 mx p-4 rounded-2xl border border-neutral-400 bg-[#CAEAD5]">

              {/* Column Header */}
              <View className="flex-row items-center justify-between">
                <Text className="font-kanitMedium text-xl">{col.title}</Text>

                <View className="flex-row gap-1">
                  <TouchableOpacity className="border border-black rounded-md px-2 py-2 mx-1 my-1 mt-4 mb-3 bg-white">
                    <Icon name="custom_pen" size={15} />
                  </TouchableOpacity>

                  <TouchableOpacity className="border border-black rounded-md px-2 py-2 mt-4 mb-3 bg-[#F07166]">
                    <Icon name="delete" size={15} />
                  </TouchableOpacity>
                </View>
              </View>
              <View className="h-[1.5px] bg-black my-3 mt-2" />
              {/* Cards */}
              <ScrollView
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled
                style={{ flexGrow: 0 }}
              >
                {columnTasks.map((task) => (
                  <View
                    key={task.id}
                    style={{
                      shadowColor: "#000",
                      shadowOpacity: 0.6,
                      shadowRadius: 2,
                      shadowOffset: { width: 0, height: 2 },
                    }}
                    className="mb-3 rounded-3xl border border-black bg-[#F0F0F0] pt-1.5 pb-1 px-1 "
                  >
                    <View
                      style={{
                        shadowColor: "#000",
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                        shadowOffset: { width: 0, height: 3 },
                        elevation: 4,
                      }}
                      className="mt-4 rounded-3xl border border-black bg-white">
                      <Text className="font-kanitMedium text-xl mt-7 mx-2 px-2">
                    {task.task_name ?? "Untitled Task"}

                      </Text>

                      <View className="flex-row items-center gap-1 mb-5 mx-2 px-2 ">
                        <View className="border border-black rounded-full p-1 bg-white">
                          {/* <Icon name="date" size={8} /> */}
                        </View>
                        <Text className="font-kanitRegular text-xs text-black">
                          {task.deadline ?? "-"}
                        </Text>
                      </View>

                      <Text className="font-kanitRegular text-xs text-black mx-2 mb-2 px-2">
                        Assign to
                      </Text>

                     <View className="flex-row items-center mx-3 mb-5">
  {task.task_assign?.map((user: any, i: number) => (
    <View
      key={user.user_id}
      style={{
        shadowColor: "#000",
        shadowOpacity: 0.4,
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 2 },
      }}
      className={`${i !== 0 ? "-ml-3" : ""}`}
    >
      <Image
        source={{ uri: user.avatar_url }}
        style={{
          width: 28,
          height: 28,
          borderRadius: 14,
          borderWidth: 1.5,
          borderColor: "black",
        }}
      />
    </View>
  ))}
</View>

                    </View>
                  </View>
                ))}

                {/* Add task */}
                <TouchableOpacity className="flex-row items-center gap-2 mt-2"
                  onPress={() => setModalVisible(true)}
                >
                  <Text className="font-kanitMedium text-md">+ Add Task</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          )})}
      </ScrollView>
      <TabBar
        visible={tabBarVisible}
        onClose={() => setTabBarVisible(false)}
      />

      <ProjectChatModal
        visible={chatVisible}
        projectId={projectID}
        onClose={() => setChatVisible(false)} />

      <Pressable
        onPress={() => setChatVisible(true)}
        style={{
          position: "absolute",
          right: 24,
          bottom: 90,
          shadowColor: "#000",
          shadowOpacity: 0.3,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 3 },
        }}
        className="w-[56px] h-[56px] rounded-full bg-white justify-center items-center">
        <Image
          source={icons.chat} style={{ width: 26, height: 26 }} />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  board: {
    marginHorizontal: spacing.lg,
    alignItems: "flex-start",
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
});
