import React, { useState, useMemo } from "react";
import { View, Text, Pressable, Modal } from "react-native";

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

    const calendarTasks = useMemo(() => {
        return tasks.map(task => {
            const start = new Date(task.start_date);
            const end = new Date(task.deadline);
            const startDay = start.getDate();
            const endDay = end.getDate();
            const span =
                (end.getTime() - start.getTime()) /
                (1000 * 60 * 60 * 24) + 1

            return {
                ...task,
                startDay,
                span: endDay - startDay + 1
            };
        });
    }, [tasks]);

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
            {/* grid */}
            <View className="flex-row flex-wrap border border-neutral-300">
                {cells.map((day, i) => {
                    return (
                        <View key={i} className="w-[14.28%] h-28 border border-neutral-200 p-1">
                            {day && <Text className="text-xs">{day}</Text>}
                        </View>
                    );
                })}
                {/*  ไอยาวๆ */}
                {calendarTasks.map(task => {
                    const left = (firstDay + task.startDay - 1) * (100 / 7);
                    return (
                        <Pressable
                            key={task.id}
                            onPress={() => setSelectedTask(task)}
                            style={{
                                position: "absolute",
                                left: `${left}%`,
                                top: 40,
                                width: `${task.span * 14.28}%`,
                                backgroundColor: statusColor[task.status],
                                padding: 3,
                                borderRadius: 4
                            }}>
                            <Text numberOfLines={1} style={{ fontSize: 10 }}>
                                {task.task_name}
                            </Text>
                        </Pressable>
                    );
                })}
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