import React, { useState, useRef, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, PanResponder, Animated, Pressable } from "react-native";
import { icons } from "@/constants/icons";

type Task = {
  id: string;
  task_name: string;
  deadline: string;
  status: string;
  task_assign: { user_id: number; avatar_url: string }[];
};

type Props = {
  tasks: any[];
  setModalVisible: (v: boolean) => void;
  onTaskPress: (task: any) => void;
};

type ColumnLayout = { x: number; width: number };

const Column = [
  { id: "to-do", title: "To-do" },
  { id: "progress", title: "On Progress" },
  { id: "review", title: "In Review" },
  { id: "complete", title: "Complete" },
];

export default function KanbanBoard({
  tasks: initialTasks,
  setModalVisible,
  onTaskPress,
}: Props) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [highlightCol, setHighlightCol] = useState<string | null>(null);

  const columnLayouts = useRef<Record<string, ColumnLayout>>({});
  const columnRefs = useRef<Record<string, any>>({});
  const scrollX = useRef(0);

  const moveTask = (taskId: string, toColumnId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: toColumnId } : t))
    );
  };

  const getColumnAtX = (pageX: number): string | null => {
    for (const [colId, layout] of Object.entries(columnLayouts.current)) {
      if (pageX >= layout.x && pageX <= layout.x + layout.width) {
        return colId;
      }
    }
    return null;
  };

    const createPanResponder = (taskId: string) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => setDraggingId(taskId),
      onPanResponderMove: (evt) => setHighlightCol(getColumnAtX(evt.nativeEvent.pageX)),
      onPanResponderRelease: (evt) => {
        const col = getColumnAtX(evt.nativeEvent.pageX);
        if (col) moveTask(taskId, col);
        setDraggingId(null);
        setHighlightCol(null);
      },
      onPanResponderTerminate: () => {
        setDraggingId(null);
        setHighlightCol(null);
      },
    });

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  return (
 <ScrollView
      horizontal
      showsHorizontalScrollIndicator
      contentContainerStyle={{
        marginHorizontal: 24,
        alignItems: "flex-start",
      }}
      onScroll={(e) => {
        scrollX.current = e.nativeEvent.contentOffset.x;
        Object.entries(columnRefs.current).forEach(([colId, ref]) => {
          ref?.measure((_x: number, _y: number, width: number, _h: number, pageX: number) => {
            columnLayouts.current[colId] = { x: pageX, width };
          });
        });
      }}
      scrollEventThrottle={16}
    >
      {Column.map((col) => {
        const columnTasks = tasks.filter((task) => task.status === col.id);
        const isHighlighted = highlightCol === col.id;

        return (
          <View
            key={col.id}
            ref={(r) => { columnRefs.current[col.id] = r; }}
            onLayout={(e) => {
              e.target.measure((_x, _y, width, _height, pageX) => {
                columnLayouts.current[col.id] = { x: pageX, width };
              });
            }}
  //           showsVerticalScrollIndicator={false}
  // scrollEnabled={draggingId === null}
            // className="w-[210px] h-[540px] mr-7 p-4 rounded-2xl border-[1px] border-neutral-100 bg-[#C9EAD5]"
            // className="mr-7 p-4 rounded-2xl border-[1px] border-neutral-100"
 style={{
              shadowColor: "#000",
              shadowOpacity: 0.5,
              shadowRadius: 2,
              shadowOffset: { width: 0, height: 2 },
              backgroundColor: isHighlighted ? "#a8d5b5" : "#C9EAD5",
              width: 210,
              marginRight: 28,
              padding: 16,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: isHighlighted ? "#5aad78" : "#f5f5f5",
              alignSelf: "flex-start", 
              minHeight: 80,
            }}
          >
            {/* Column Header */}
            <View className="flex-row items-center justify-between">
              <Text className="font-KanitMedium text-xl text-[#222222]">{col.title}</Text>
              {/* <View className="flex-row gap-1"/> */}
            </View>

            <View className="h-[1px] bg-neutral-600 my-3 mt-2" />

                        <ScrollView
              style={{ maxHeight: 400 }}
              showsVerticalScrollIndicator={false}
              scrollEnabled={draggingId === null}
            >

              {columnTasks.length === 0 && (
                <Text style={{ color: "#9ca3af", textAlign: "center", marginTop: 8 }}>
                  No task here
                </Text>
              )}

               {columnTasks.map((task) => {
                const panResponder = createPanResponder(task.id);
                const isDragging = draggingId === task.id;

                return (
                  <Animated.View
                    key={task.id}
                    {...panResponder.panHandlers}
                    style={{
                      opacity: isDragging ? 0.4 : 1,
                      shadowColor: "#000",
                      shadowOpacity: 0.6,
                      shadowRadius: 2,
                      shadowOffset: { width: 0, height: 2 },
                      elevation: 2,
                    }}
                    className="mb-3 rounded-3xl border border-neutral-500 bg-[#F0F0F0] pt-1.5 pb-1.5 px-1.5"
                  >
                    <Pressable onPress={() => onTaskPress(task)}>
                      <View className="mt-4 rounded-3xl border border-black bg-white">
                        <Text className="font-kanitMedium text-xl mt-5 mx-2 px-2">
                          {task.task_name ?? "Untitled Task"}
                        </Text>

                        <View className="flex-row items-center gap-1 mb-5 mx-2 px-2">
                          <Image source={icons.calenCircle} style={{ width: 17, height: 17 }} />
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
                    </Pressable>
                  </Animated.View>
                );
              })}
              </ScrollView>

              <TouchableOpacity
                className="flex-row items-center gap-2 mt-2"
                onPress={() => setModalVisible(true)}
              >
                <Text className="font-KanitMedium text-neutral-500 text-md">+ Add Task</Text>
              </TouchableOpacity>
            </View>
        );
      })}
    </ScrollView>
  );
}
