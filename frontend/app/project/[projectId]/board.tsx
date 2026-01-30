import { View, Text, Pressable } from "react-native";
import { useState } from "react";
import CreateTaskModal from "@/components/task/create_task";

export default function BoardPage() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View className="flex-1 bg-white pt-12 px-4">
      
      {/* Header: */}
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row items-center">
          <Text className="text-gray-400 text-lg font-kanitRegular">
            Project {" > "}
          </Text>
          <Text className="text-3xl font-kanitBold">Board</Text>
        </View>

        {/* ปุ่ม Create Task (ลูกกรุ) */}
        <Pressable
          onPress={() => setModalVisible(true)}
          className="border border-black rounded-xl px-3 py-2 bg-white active:bg-gray-100"
        >
          <Text className="font-kanitRegular">+ Create Task</Text>
        </Pressable>
      </View>

      {/* Add Task Button (ลูกกรุ) */}
      <Pressable
        onPress={() => setModalVisible(true)}
        className="flex-row items-center mt-2"
      >
        <Text className="font-kanitBold text-lg mr-2">+</Text>
        <Text className="font-kanitBold">Add Task</Text>
      </Pressable>

      {/* Modal(ลูกกรุ) */}
      <CreateTaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />

    </View>
  );
}