import React from "react";
import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import { icons } from "@/constants/icons";

interface TodoBoardProps {
  tasks: any[];
  setModalVisible: (visible: boolean) => void;
}

export default function TodoBoard({ tasks, setModalVisible }: TodoBoardProps) {
  
  const renderItem = ({ item }: { item: any }) => (
    <View className="flex-row items-center bg-GREEN border border-gray-100 rounded-xl p-3 mb-3 shadow-sm">
      {/* Checkbox */}
      <TouchableOpacity className="w-5 h-5 border border-gray-400 rounded bg-white mr-3" />

      {/* Task Name */}
      <Text className="flex-1 font-KanitMedium text-black text-[14px]" numberOfLines={1}>
        {item.title || item.name || "Untitled Task"}
      </Text>

      {/* End Date */}
      <Text className="w-20 text-center text-black font-KanitMedium text-[12px] mr-2">
        {item.end_date || "DD/MM/YY"}
      </Text>

      {/* Assign To & Actions */}
      <View className="flex-row items-center gap-2">
        {/* Avatar */}
        <View className="w-8 h-8 bg-white rounded-full border border-gray-200 items-center justify-center">
          <Image source={icons.profile || {uri: 'https://via.placeholder.com/30'}} className="w-6 h-6 rounded-full" />
        </View>

        {/* Edit Button */}
        <TouchableOpacity className="w-8 h-8 bg-white border border-gray-300 rounded-lg items-center justify-center">
          <Image source={icons.custom_pen} style={{ width: 14, height: 14 }} />
        </TouchableOpacity>

        {/* Delete Button */}
        <TouchableOpacity className="w-8 h-8 bg-[#FF6B6B] border border-black rounded-lg items-center justify-center shadow-sm">
          <Image source={icons.delete} style={{ width: 14, height: 14, tintColor: 'white' }} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 mx-6 mt-4">
      {/* Table Header */}
      <View className="flex-row items-center px-3 mb-2">
        <View className="w-5 mr-3" />
        <Text className="flex-1 text-gray-400 font-KanitMedium text-[12px]">Task Name</Text>
        <Text className="w-20 text-center text-gray-400 font-KanitMedium text-[12px] mr-2">End Date</Text>
        <Text className="w-[80px] text-center text-gray-400 font-KanitMedium text-[12px]">Assign To</Text>
      </View>

      {/* Task List */}
      <FlatList
        data={tasks}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        ListEmptyComponent={() => (
          <View className="mt-10 items-center">
            <Text className="font-kanitRegular text-gray-400">No tasks found</Text>
          </View>
        )}
      />
    </View>
  );
}