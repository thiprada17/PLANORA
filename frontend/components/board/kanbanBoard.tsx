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
  onTaskStatusChange?: (taskId: string, status: string) => void;
};

type ColumnLayout = { x: number; width: number };

const Column = [
  { id: "to-do", title: "To-do" },
  { id: "progress", title: "On Progress" },
  { id: "review", title: "In Review" },
  { id: "complete", title: "Complete" },
];

const TASK_CARD_HEIGHT = 180;
const HEADER_HEIGHT = 60;
const ADD_BUTTON_HEIGHT = 36;
const MAX_COL_HEIGHT = 500;

export default function KanbanBoard({ tasks: initialTasks, setModalVisible, onTaskPress, onTaskStatusChange }: Props) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [highlightCol, setHighlightCol] = useState<string | null>(null);

  const columnLayouts = useRef<Record<string, ColumnLayout>>({});
  const columnRefs = useRef<Record<string, any>>({});
  const scrollX = useRef(0);

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const getColumnAtX = (pageX: number): string | null => {
    for (const [colId, layout] of Object.entries(columnLayouts.current)) {
      if (pageX >= layout.x && pageX <= layout.x + layout.width) {
        return colId;
      }
    }
    return null;
  };

const moveTask = (taskId: string, toColumnId: string) => {
  // อัปเดต state local ของ KanbanBoard
  setTasks(prev =>
    prev.map(t => (t.id === taskId ? { ...t, status: toColumnId } : t))
  );

  // เรียก parent callback เพื่ออัปเดต server
  if (onTaskStatusChange) {
    onTaskStatusChange(taskId, toColumnId);
  }
};

const createPanResponder = (taskId: string) =>
  PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => setDraggingId(taskId),
    onPanResponderMove: (evt) => setHighlightCol(getColumnAtX(evt.nativeEvent.pageX)),
    onPanResponderRelease: (evt) => {
      const col = getColumnAtX(evt.nativeEvent.pageX);
      if (col) moveTask(taskId, col); // อัปเดต state + server
      setDraggingId(null);
      setHighlightCol(null);
    },
    onPanResponderTerminate: () => {
      setDraggingId(null);
      setHighlightCol(null);
    },
  });

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

        const columnHeight = columnTasks.length === 0
          ? HEADER_HEIGHT + ADD_BUTTON_HEIGHT + 40 // ความสูงขั้นต่ำเมื่อไม่มี task
          : Math.min(
            columnTasks.length * TASK_CARD_HEIGHT + HEADER_HEIGHT + ADD_BUTTON_HEIGHT,
            MAX_COL_HEIGHT
          );

        return (
          <View
            key={col.id}
            ref={(r) => { columnRefs.current[col.id] = r; }}
            onLayout={(e) => {
              e.target.measure((_x, _y, width, _height, pageX) => {
                columnLayouts.current[col.id] = { x: pageX, width };
              });
            }}
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
              height: columnHeight,
            }}
          >
            <View className="flex-row items-center justify-between">
              <Text className="font-KanitMedium text-xl text-[#222222]">{col.title}</Text>
            </View>

            <View className="h-[1px] bg-neutral-600 my-3 mt-2" />

            <ScrollView
              style={{ height: columnHeight - HEADER_HEIGHT - ADD_BUTTON_HEIGHT }}
              showsVerticalScrollIndicator={false}
              scrollEnabled={draggingId === null}
              nestedScrollEnabled
            >
              {columnTasks.length === 0 && (
                <Text style={{ color: "#9ca3af", textAlign: "center", marginTop: 8 }} className="font-KanitRegular">
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
                          {task.task_assign?.map((user: any, i: number) => {
                            const userKey = user.user_id ?? i;  // fallback เป็น index ถ้า user_id เป็น null ไม่ว่าทำไร มันerror เลยกันไว้ก่อน
                            const taskKey = task.id ?? "task-" + i;
                            return (
                              <View key={`${taskKey}-${userKey}`} className={`${i !== 0 ? "-ml-3" : ""}`}>
                                <Image
                                  source={{ uri: user.avatar_url }}
                                  style={{ width: 28, height: 28, borderRadius: 14, borderWidth: 1, borderColor: "gray" }}
                                />
                              </View>
                            );
                          })}
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