import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { icons } from "@/constants/icons";

type Props = {
  tasks: any[];
  setModalVisible: (v: boolean) => void;
};

const Column = [
  { id: "to-do", title: "To-do" },
  { id: "progress", title: "On Progress" },
  { id: "review", title: "In Review" },
  { id: "complete", title: "Complete" },
];

export default function KanbanBoard({ tasks, setModalVisible }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator
      contentContainerStyle={{ marginHorizontal: 24 }}
    >
      {Column.map((col) => {
        const columnTasks = tasks.filter((task) => task.status === col.id);

        return (
          <View
            key={col.id}
            style={{
              shadowColor: "#000",
              shadowOpacity: 0.5,
              shadowRadius: 2,
              shadowOffset: { width: 0, height: 2 },
            }}
            className="w-[210px] h-[540px] mr-7 p-4 rounded-2xl border-[1px] border-neutral-100 bg-[#C9EAD5]"
          >
            {/* Column Header */}
            <View className="flex-row items-center justify-between">
              <Text className="font-KanitMedium text-xl text-[#222222]">{col.title}</Text>
              <View className="flex-row gap-1">
                {/* <TouchableOpacity className="border border-black rounded-md px-2 py-2 mx-1 my-1 mt-4 mb-3 bg-white">
                  <Image source={icons.custom_pen} style={{ width: 17, height: 17 }} />
                </TouchableOpacity>

                <TouchableOpacity className="border border-black rounded-md px-2 py-2 mt-4 mb-3 bg-[#F07166]">
                  <Image source={icons.delete} style={{ width: 17, height: 17 }} />
                </TouchableOpacity> */}
              </View>
            </View>

            <View className="h-[1px] bg-neutral-600 my-3 mt-2" />

            <ScrollView showsVerticalScrollIndicator={false}>
              {columnTasks.map((task) => (
                <View
                  key={task.id}
                  style={{
                    shadowColor: "#000",
                    shadowOpacity: 0.6,
                    shadowRadius: 2,
                    shadowOffset: { width: 0, height: 2 },
                    elevation: 4
                  }}
                  className="mb-3 rounded-3xl border border-neutral-500 bg-[#F0F0F0] pt-1.5 pb-1.5 px-1.5"
                >
                  <View className="mt-4 rounded-3xl border border-black bg-white">
                    <Text className="font-KanitMedium text-xl mt-5 mx-2 px-2">
                      {task.task_name ?? "Untitled Task"}
                    </Text>

                    <View className="flex-row items-center gap-1 mb-5 mx-2 px-2">
                      <Image source={icons.calenCircle} style={{ width: 17, height: 17 }} />
                      <Text className="font-KanitRegular text-xs text-black">
                        {task.deadline ?? "-"}
                      </Text>
                    </View>

                    <Text className="font-KanitRegular text-xs text-black mx-2 mb-2 px-2">
                      Assign to
                    </Text>

                    <View className="flex-row items-center mx-3 mb-5">
                      {task.task_assign?.map((user: any, i: number) => (
                        <View
                          key={user.user_id}
                          className={`${i !== 0 ? "-ml-3" : ""}`}
                        >
                          <Image
                            source={{ uri: user.avatar_url }}
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: 14,
                              borderWidth: 1,
                              borderColor: "gray",
                            }}
                          />
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              ))}

              <TouchableOpacity
                className="flex-row items-center gap-2 mt-2"
                onPress={() => setModalVisible(true)}
              >
                <Text className="font-KanitMedium text-neutral-500 text-md">+ Add Task</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        );
      })}
    </ScrollView>
  );
}

