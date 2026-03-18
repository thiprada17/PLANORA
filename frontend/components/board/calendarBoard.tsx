import React, { useState, useMemo } from "react";
import { View, Text, Pressable, Modal, Dimensions } from "react-native";

type Task = {
    id: string;
    task_name: string;
    start_date: string;
    deadline: string;
    status: "todo" | "progress" | "review" | "done";
};

type Props = { tasks: Task[]; };
const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const statusColor = {
    todo: "#D1D5DB",
    progress: "#60A5FA",
    review: "#FACC15",
    done: "#4ADE80"
};

export default function CalendarBoard({ tasks }: Props) {

    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const monthName = currentDate.toLocaleString("default", { month: "long" });

    const cells: (number | null)[] = [];

    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let i = 1; i <= totalDays; i++) cells.push(i);

    const changeMonth = (dir: number) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(month + dir);
        setCurrentDate(newDate);
    };

    const SCREEN_WIDTH = Dimensions.get("window").width;
    const CALENDAR_PADDING = 48 + 32; // กะๆ ก่อน
    const CELL_WIDTH = (SCREEN_WIDTH - CALENDAR_PADDING) / 7;

    const calendarTasks = useMemo(() => {
        return tasks.map(task => {
            const start = task.start_date
                ? new Date(task.start_date)
                : new Date(task.deadline);
            const end = new Date(task.deadline);

            // อันนี้กันพัง
            if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;
            if (start > end) return null;

            if (
                start.getMonth() !== month &&
                end.getMonth() !== month
            ) return null;

            const startDay = start.getDate();
            const span =
                Math.floor(
                    (end.getTime() - start.getTime()) /
                    (1000 * 60 * 60 * 24)
                ) + 1;

            return {
                ...task,
                startDay,
                span
            };
        }).filter(
            (task): task is Task & { startDay: number; span: number } => task !== null);
    }, [tasks, month]);

    const CELL_HEIGHT = 96;
    const CELL_PADDING_TOP = 10;

    return (
        <View className="mx-6 mt-4 p-4 border rounded-2xl bg-white">
            {/* header */}
            <View className="flex-row items-center justify-between mb-3">
                <Pressable onPress={() => changeMonth(-1)}>
                    <Text className="text-xl">{"<"}</Text>
                </Pressable>

                <Text className="text-xl font-kanitMedium">
                    {monthName} {year}
                </Text>

                <Pressable onPress={() => changeMonth(1)}>
                    <Text className="text-xl">{">"}</Text>
                </Pressable>
            </View>
            {/* weekday */}
            <View className="flex-row">
                {days.map(d => (
                    <Text key={d} className="flex-1 text-center text-xs font-kanitMedium">
                        {d}
                    </Text>
                ))}
            </View>
=            <View className="relative">
                {/* GRID */}
                <View className="flex-row flex-wrap border border-neutral-300">
                    {cells.map((day, i) => (
                        <View
                            key={i}
                            className="w-[14.28%] h-24 border border-neutral-200 p-1 overflow-hidden"
                        >
                            {day && <Text className="text-xs">{day}</Text>}
                        </View>
                    ))}
                </View>

                {/* TASK LAYER */}
                <View style={{ position: "absolute", top: 0, left: 0, right: 0 }}>

                    {calendarTasks.map((task) => {
                        const startIndex = firstDay + task.startDay - 1;
                        const row = Math.floor(startIndex / 7);
                        const col = startIndex % 7;

                        const maxSpan = 7 - col;
                        const renderSpan = Math.min(task.span, maxSpan);

                        // จำกัด 2 task ต่อ cell
                        const sameCellTasks = calendarTasks.filter(t => {
                            const idx = firstDay + t.startDay - 1;
                            return Math.floor(idx / 7) === row && (idx % 7) === col;
                        });

                        const indexInCell = sameCellTasks.findIndex(t => t.id === task.id);

                        if (indexInCell > 1) return null; // ก้ถ้าเกิน 2 ไม่แสดง

                        return (
                            <Pressable
                                key={task.id}
                                onPress={() => setSelectedTask(task)}
                                style={{
                                    position: "absolute",
                                    left: `${col * (100 / 7)}%`,
                                    width: `${renderSpan * (100 / 7.8)}%`,
                                    top:
                                        row * CELL_HEIGHT +
                                        CELL_PADDING_TOP +
                                        (indexInCell === 0 ? 0 : 18),
                                    backgroundColor: "#CAEAD5",
                                    borderWidth: 0.7,
                                    borderColor: "#000",
                                    height: 16,
                                    justifyContent: "center",
                                    paddingHorizontal: 6,
                                    borderRadius: 6,
                                    overflow: "hidden",
                                    zIndex: 10,
                                    transform: [{ translateX: 2 }],
                                }}
                            >
                                <Text numberOfLines={1} style={{ fontSize: 10 }}>
                                    {task.task_name || "Untitled"}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>
            </View>

            {/* modalชั่วคราวๆ */}
            <Modal
                visible={!!selectedTask}
                transparent
                animationType="fade">
                <View className="flex-1 bg-black/40 items-center justify-center">
                    <View className="bg-white p-6 rounded-xl w-[80%]">
                        <Text className="text-lg font-kanitMedium mb-2">
                            {selectedTask?.task_name}
                        </Text>
                        <Text className="text-sm mb-1">
                            Start: {selectedTask?.start_date}
                        </Text>
                        <Text className="text-sm mb-3">
                            Deadline: {selectedTask?.deadline}
                        </Text>
                        <Pressable
                            onPress={() => setSelectedTask(null)}
                            className="bg-black rounded-lg px-4 py-2">
                            <Text className="text-white text-center">
                                Close
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
}