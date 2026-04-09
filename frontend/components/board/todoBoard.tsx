import { icons } from "@/constants/icons";
import React from "react";
import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";

interface TodoBoardProps {
  tasks: any[];
  setModalVisible: (visible: boolean) => void;
  onTaskPress: (task: any) => void; 
}

export default function TodoBoard({ tasks, onTaskPress }: TodoBoardProps) {

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => onTaskPress(item)} 
      className="flex-row items-center bg-[#C9EAD5] border border-gray-100 rounded-xl p-3 mb-3 shadow-sm"
    >
      {/* Checkbox */}
      <View className="w-5 h-5 border border-gray-400 rounded bg-white mr-3" />

      {/* Task Name */}
      <Text
        className="flex-1 font-KanitMedium text-black text-[14px]"
        numberOfLines={1}
      >
        {item.task_name || "Untitled Task"}
      </Text>

      {/* End Date */}
      <Text className="w-20 text-center text-black font-KanitMedium text-[12px] mr-2">
        {item.deadline || "DD/MM/YY"}
      </Text>

      {/* Avatar */}
      <View className="flex-row items-center w-[80px] justify-center">
        {item.task_assign?.length > 0 ? (
          item.task_assign.slice(0, 3).map((user: any, index: number) => (
            <View
              key={user.user_id || index}
              className={`${index !== 0 ? "-ml-2" : ""}`}
            >
              <Image
                source={{
                  uri:
                    user.avatar_url ||
                    "https://via.placeholder.com/30",
                }}
                className="w-7 h-7 rounded-full border border-white"
              />
            </View>
          ))
        ) : (
          <View className="w-7 h-7 rounded-full bg-white border border-gray-300" />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 mx-6 mt-4">
      {/* Header */}
      <View className="flex-row items-center px-3 mb-2">
        <View className="w-5 mr-3" />
        <Text className="flex-1 text-gray-400 font-KanitMedium text-[12px]">
          Task Name
        </Text>
        <Text className="w-20 text-center text-gray-400 font-KanitMedium text-[12px] mr-2">
          End Date
        </Text>
        <Text className="w-[80px] text-center text-gray-400 font-KanitMedium text-[12px]">
          Assign To
        </Text>
      </View>

      {/* List */}
      <FlatList
        data={tasks}
        keyExtractor={(item, index) =>
          item.id?.toString() || index.toString()
        }
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        ListEmptyComponent={() => (
          <View className="mt-10 items-center">
            <Text className="font-KanitRegular text-gray-400">
              No tasks found
            </Text>
          </View>
        )}
      />
    </View>
  );
}