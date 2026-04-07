import React, { useState, useMemo } from "react";
import { View, Text, Pressable, Modal } from "react-native";

type Task = {
    id: string;
    task_name: string;
    start_date: string;
    deadline: string;
    status: "to-do" | "progress" | "review" | "done";
};

type Props = { tasks: Task[] };

const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const statusColor: Record<Task["status"], string> = {
    "to-do": "#F0F0F0",
    "progress": "#C2E9FF",
    "review": "#FFF5A6",
    "done": "#B4F3C9",
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
                    <Text className="text-xl px-2">
                        {"<"}
                    </Text>
                </Pressable>
                <Text className="text-xl font-KanitMedium">{monthName}
                    {year}
                </Text>
                <Pressable onPress={() => changeMonth(1)} hitSlop={8}>
                    <Text className="text-xl px-2">
                        {">"}
                    </Text>
                </Pressable>
            </View>

            {/* weekday headers */}
            <View className="flex-row mb-1">
                {days.map((d) => (
                    <Text key={d} className="flex-1 text-center text-xs font-KanitMedium text-gray-500">
                        {d}
                    </Text>
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

                        <View key={i} className="p-[3px]" style={{ width: cellW, height: 85 }}>
                            {day && <Text className="text-[11px] font-KanitRegular">{day}</Text>}
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
                    <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, marginBottom: 1 }}
                        pointerEvents="box-none">

                        {slottedTasks.map((seg, idx) => {
                            if (seg.slot >= 2) return null;

                            const taskBarHeight = 18;
                            const taskBarSpacing = 2; // เว้น 2px

                            return (
                                <Pressable
                                    key={idx}
                                    onPress={() => setSelectedTask(seg.task)}
                                    className="font-KanitRegular"
                                    style={{
                                        position: "absolute",
                                        left: seg.col * cellW + 2,
                                        top: seg.row * 85 + 24 + seg.slot * (taskBarHeight + taskBarSpacing),
                                        width: seg.span * cellW - 4,
                                        height: taskBarHeight,
                                        backgroundColor: statusColor[seg.task.status],
                                        borderRadius: 4,
                                        justifyContent: "center",
                                        paddingHorizontal: 4,
                                        borderWidth: 1,
                                        borderColor: "#666",
                                    }}
                                >
                                    <Text numberOfLines={1} className="text-[10px] text-black font-KanitRegular">
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

                            // เพิ่ม offset เล็กน้อยให้ห่างจาก task bars
                            const topOffset = row * 85 + 24 + 2 * 19 + 3; // +3px

                            return (
                                <Pressable
                                    key={`more-${i}`}
                                    onPress={() => setSelectedTasks(cellTasks)}
                                    style={{
                                        position: "absolute",
                                        left: col * cellW + 2,
                                        top: topOffset,
                                        width: cellW - 4,
                                        height: 13,
                                        backgroundColor: "#E5E7EB",
                                        borderRadius: 3,
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <Text className="text-[9px] text-gray-500 font-KanitRegular">
                                        +{count - 2} more
                                    </Text>
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
                        <Text className="text-lg font-KanitMedium mb-3">
                            Tasks
                            </Text>
                        {selectedTasks?.map((t) => (
                            <Pressable key={t.id} onPress={() => { setSelectedTasks(null); setSelectedTask(t); }}
                                className="px-2 py-2 mb-1 rounded-[6px]"
                                style={{ backgroundColor: statusColor[t.status] }}>
                                <Text className="text-[12px] font-KanitRegular">
                                    {t.task_name || "Untitled"}
                                </Text>
                            </Pressable>
                        ))}
                        <Pressable onPress={() => setSelectedTasks(null)} className="bg-black rounded-lg px-4 py-2 mt-2">
                            <Text className="text-white text-center">
                                Close
                            </Text>
                        </Pressable>
                    </Pressable>
                </Pressable>
            </Modal>

            <Modal visible={!!selectedTask} transparent animationType="fade">
                <Pressable
                    style={{
                        flex: 1,
                        backgroundColor: "rgba(0,0,0,0.4)",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    onPress={() => setSelectedTask(null)}
                >
                    <Pressable
                        style={{
                            backgroundColor: "white",
                            padding: 24,
                            borderRadius: 12,
                            width: "80%",
                        }}
                        onPress={() => { }}
                    >
                        {/* Task name */}
                        <Text className="text-lg font-KanitMedium mb-3">
                            {selectedTask?.task_name || "Untitled"}
                        </Text>

                        {/* Status */}
                        <View
                            className="px-2 py-1 rounded-[6px] self-start mb-3"
                            style={{
                                backgroundColor: statusColor[selectedTask?.status ?? "to-do"],
                            }}
                        >
                            <Text className="text-[12px] font-KanitRegular">
                                {selectedTask?.status}
                            </Text>
                        </View>

                        {/* Dates */}
                        <Text className="text-[12px] font-KanitRegular text-gray-600 mb-1">
                            Start: {selectedTask?.start_date || "-"}
                        </Text>
                        <Text className="text-[12px] font-KanitRegular text-gray-600 mb-4">
                            Due: {selectedTask?.deadline || "-"}
                        </Text>

                        {/* Close button */}
                        <Pressable
                            onPress={() => setSelectedTask(null)}
                            className="bg-black rounded-lg px-4 py-2"
                        >
                            <Text className="text-white text-center">
                                Close
                            </Text>
                        </Pressable>
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
}