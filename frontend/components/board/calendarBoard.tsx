import React, { useState, useMemo } from "react";
import { View, Text, Pressable, Modal } from "react-native";

type Task = {
    id: string;
    task_name: string;
    start_date: string;
    deadline: string;
    status: "todo" | "progress" | "review" | "done";
};

type Props = { tasks: Task[] };

const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const statusColor: Record<Task["status"], string> = {
    todo: "#F0F0F0",
    progress: "#C2E9FF",
    review: "#FFF5A6",
    done: "#B4F3C9",
};

export default function CalendarBoard({ tasks }: Props) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [selectedTasks, setSelectedTasks] = useState<Task[] | null>(null);
    const [containerWidth, setContainerWidth] = useState(0);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const monthName = currentDate.toLocaleString("default", { month: "long" });

    const cellW = containerWidth / 7;
    const totalRows = Math.ceil((firstDay + totalDays) / 7);

    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let i = 1; i <= totalDays; i++) cells.push(i);

    const changeMonth = (dir: number) => {
        const d = new Date(currentDate);
        d.setMonth(month + dir);
        setCurrentDate(d);
    };

    // แปลง tasks เปน segments ตัดตาม row ถ้าข้ามอาทิตย์
    const layoutTasks = useMemo(() => {
        return tasks.flatMap((task) => {
            const start = task.start_date ? new Date(task.start_date) : new Date(task.deadline);
            const end = new Date(task.deadline);
            if (isNaN(start.getTime()) || isNaN(end.getTime())) return [];

            const clampStart = start < new Date(year, month, 1) ? new Date(year, month, 1) : start;
            const clampEnd = end > new Date(year, month + 1, 0) ? new Date(year, month + 1, 0) : end;
            if (clampStart > clampEnd) return [];

            const segments = [];
            let cursor = new Date(clampStart);
            while (cursor <= clampEnd) {
                const cellIndex = firstDay + cursor.getDate() - 1;
                const col = cellIndex % 7;
                const row = Math.floor(cellIndex / 7);
                const span = Math.min(7 - col, Math.floor((clampEnd.getTime() - cursor.getTime()) / 86400000) + 1);
                segments.push({ task, row, col, span });
                cursor = new Date(cursor.getTime() + span * 86400000);
            }
            return segments;
        });
    }, [tasks, year, month, firstDay]);

    // จัด slot ไม่ให้ task ทับกัน ค่า
    const slottedTasks = useMemo(() => {
        const slotMap: Record<string, number[]> = {};
        return layoutTasks.map((seg) => {
            let slot = 0;
            while (true) {
                let conflict = false;
                for (let c = seg.col; c < seg.col + seg.span; c++) {
                    if (slotMap[`${seg.row}-${c}`]?.includes(slot)) { conflict = true; break; }
                }
                if (!conflict) break;
                slot++;
            }
            for (let c = seg.col; c < seg.col + seg.span; c++) {
                const k = `${seg.row}-${c}`;
                if (!slotMap[k]) slotMap[k] = [];
                slotMap[k].push(slot);
            }
            return { ...seg, slot };
        });
    }, [layoutTasks]);

    // นับ slot สูงสุดต่อ cell สำหรับ +more โอ้ย
    const slotCountByCell = useMemo(() => {
        const map: Record<string, number> = {};
        slottedTasks.forEach(({ row, col, span, slot }) => {
            for (let c = col; c < col + span; c++) {
                const k = `${row}-${c}`;
                map[k] = Math.max(map[k] ?? 0, slot + 1);
            }
        });
        return map;
    }, [slottedTasks]);

    return (
        <View className="mx-6 mt-1 p-4 border rounded-2xl bg-white">
            {/* header */}
            <View className="flex-row items-center justify-between mb-3">
                <Pressable onPress={() => changeMonth(-1)} hitSlop={8}>
                    <Text className="text-xl px-2">{"<"}</Text>
                </Pressable>
                <Text className="text-xl font-kanitMedium">{monthName} {year}</Text>
                <Pressable onPress={() => changeMonth(1)} hitSlop={8}>
                    <Text className="text-xl px-2">{">"}</Text>
                </Pressable>
            </View>

            {/* weekday headers */}
            <View className="flex-row mb-1">
                {days.map((d) => (
                    <Text key={d} className="flex-1 text-center text-xs font-kanitMedium text-gray-500">{d}</Text>
                ))}
            </View>

            {/* grid */}
            <View
                style={{ position: "relative" }}
                onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
            >
                {/* cell backgrounds + วันที่ */}
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    {cells.map((day, i) => (
                        <View key={i} style={{
                            width: cellW,
                            height: 85,
                            backgroundColor: "white",
                            padding: 3
                        }}>
                            {day && <Text style={{ fontSize: 11, fontWeight: "500" }}>{day}</Text>}
                        </View>
                    ))}
                </View>

                {/* grid lines */}
                {containerWidth > 0 && (
                    <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
                        pointerEvents="none">
                        {Array.from({ length: totalRows + 1 }, (_, r) => (
                            <View key={`h${r}`} style={{
                                position: "absolute",
                                left: 0,
                                right: 0,
                                top: r * 85,
                                height: 0.5,
                                backgroundColor: "#ddd"
                            }} />
                        ))}
                        {Array.from({ length: 8 }, (_, c) => (
                            <View key={`v${c}`} style={{
                                position: "absolute",
                                top: 0,
                                bottom: 0,
                                left: c * cellW,
                                width: 0.5,
                                backgroundColor: "#ddd"
                            }} />
                        ))}
                    </View>
                )}

                {/* task bars */}
                {containerWidth > 0 && (
                    <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
                        pointerEvents="box-none">

                        {slottedTasks.map((seg, idx) => {
                            if (seg.slot >= 2) return null;
                            return (
                                <Pressable
                                    key={idx}
                                    onPress={() => setSelectedTask(seg.task)}
                                    style={{
                                        position: "absolute",
                                        left: seg.col * cellW + 2,
                                        top: seg.row * 85 + 24 + seg.slot * 19,
                                        width: seg.span * cellW - 4,
                                        height: 20,
                                        backgroundColor: statusColor[seg.task.status],
                                        borderRadius: 4,
                                        justifyContent: "center",
                                        paddingHorizontal: 4,
                                        borderWidth: 1,
                                        borderColor: "#666",
                                    }}
                                >
                                    <Text numberOfLines={1} style={{ fontSize: 10, color: "#000" }}>
                                        {seg.task.task_name || "Untitled"}
                                    </Text>
                                </Pressable>
                            );
                        })}

                        {/* +more */}
                        {cells.map((day, i) => {
                            if (!day) return null;
                            const row = Math.floor(i / 7);
                            const col = i % 7;
                            const count = slotCountByCell[`${row}-${col}`] ?? 0;
                            if (count <= 2) return null;
                            const cellTasks = slottedTasks
                                .filter(s => s.row === row && s.col <= col && col < s.col + s.span)
                                .map(s => s.task);
                            return (
                                <Pressable
                                    key={`more-${i}`}
                                    onPress={() => setSelectedTasks(cellTasks)}
                                    style={{
                                        position: "absolute",
                                        left: col * cellW + 2,
                                        top: row * 85 + 24 + 2 * 19,
                                        width: cellW - 4,
                                        height: 13,
                                        backgroundColor: "#E5E7EB",
                                        borderRadius: 3,
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <Text style={{ fontSize: 9, color: "#555" }}>+{count - 2} more</Text>
                                </Pressable>
                            );
                        })}
                    </View>
                )}
            </View>

            {/* Modal*/}
            <Modal visible={!!selectedTasks} transparent animationType="fade">
                <Pressable style={{
                    flex: 1,
                    backgroundColor: "rgba(0,0,0,0.4)",
                    justifyContent: "center",
                    alignItems: "center"
                }}
                    onPress={() => setSelectedTasks(null)}>
                    <Pressable style={{ backgroundColor: "white", padding: 24, borderRadius: 12, width: "80%" }} onPress={() => { }}>
                        <Text className="text-lg font-kanitMedium mb-3">Tasks</Text>
                        {selectedTasks?.map((t) => (
                            <Pressable key={t.id} onPress={() => { setSelectedTasks(null); setSelectedTask(t); }}
                                style={{ backgroundColor: statusColor[t.status], padding: 8, borderRadius: 6, marginBottom: 6 }}>
                                <Text style={{ fontSize: 12 }}>{t.task_name || "Untitled"}</Text>
                            </Pressable>
                        ))}
                        <Pressable onPress={() => setSelectedTasks(null)} className="bg-black rounded-lg px-4 py-2 mt-2">
                            <Text className="text-white text-center">Close</Text>
                        </Pressable>
                    </Pressable>
                </Pressable>
            </Modal>

            <Modal visible={!!selectedTask} transparent animationType="fade">
                <Pressable style={{
                    flex: 1,
                    backgroundColor: "rgba(0,0,0,0.4)",
                    justifyContent: "center",
                    alignItems: "center"
                }}
                    onPress={() => setSelectedTask(null)}>

                    <Pressable style={{
                        backgroundColor: "white",
                        padding: 24,
                        borderRadius: 12,
                        width: "80%"
                    }}
                        onPress={() => { }}>
                        <Text className="text-lg font-kanitMedium mb-3">{selectedTask?.task_name || "Untitled"}</Text>
                        <View style={{
                            backgroundColor: statusColor[selectedTask?.status ?? "todo"],
                            paddingHorizontal: 10,
                            paddingVertical: 4,
                            borderRadius: 6,
                            alignSelf: "flex-start",
                            marginBottom: 12
                        }}>
                            <Text style={{ fontSize: 12 }}>{selectedTask?.status}</Text>
                        </View>
                        <Text style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Start: {selectedTask?.start_date || "-"}</Text>
                        <Text style={{ fontSize: 12, color: "#666" }}>Due: {selectedTask?.deadline || "-"}</Text>
                        <Pressable onPress={() => setSelectedTask(null)} className="bg-black rounded-lg px-4 py-2 mt-4">
                            <Text className="text-white text-center">Close</Text>
                        </Pressable>
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
}