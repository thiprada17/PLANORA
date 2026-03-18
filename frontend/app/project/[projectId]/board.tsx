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
import { useState } from "react";
import CreateTaskModal from "@/components/task/create_task";
import ProjectChatModal from "@/components/chat/project_chat";
import { icons } from "@/constants/icons";
import { SafeAreaView } from "react-native-safe-area-context";
import TabBar from "@/components/tabBar";
import BoardBar from "@/components/board/boardBar";
import KanbanBoard from "@/components/board/kanbanBoard";
import CalendarBoard from "@/components/board/calendarBoard";

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

  const [modalVisible, setModalVisible] = useState(false);
  const [tabBarVisible, setTabBarVisible] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  const [tasks, setTasks] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<"kanban" | "todo" | "calendar">("kanban");

  // function setModalVisible(arg0: boolean): void {
  //   throw new Error("Function not implemented.");
  // }

  const { projectId } = useLocalSearchParams<{ projectId: string }>();

  const projectID = Number(projectId);
  useEffect(() => {

    const fetchTask = async () => {
      try {
        const res = await fetch(`https://freddy-unseconded-kristan.ngrok-free.dev/get/task/${projectID}`);
        // const res = await fetch(`http://192.168.1.154:3000/get/task/${projectID}`);

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

  if (!projectID) return;

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
      <BoardBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onFilterPress={() => console.log("filter")}
      />
      {/* kanban */}
      {activeTab === "kanban" && (
        <KanbanBoard
          tasks={tasks}
          setModalVisible={setModalVisible}
        />
      )}
      {/* todo */}
      {activeTab === "todo" && (
        <View className="mx-6 mt-4">
          <Text className="font-kanitMedium text-xl">Todo List</Text>
        </View>
      )}
      {/* calendar */}
      {activeTab === "calendar" && (
        <CalendarBoard tasks={tasks} />
      )}
      <TabBar
        visible={tabBarVisible}
        onClose={() => setTabBarVisible(false)}
        projectId={projectID}
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

