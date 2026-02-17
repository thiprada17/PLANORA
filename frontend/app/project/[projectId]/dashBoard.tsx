import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "@/constants/icons";
import { useState } from "react";
import TabBar from "@/components/tabBar";

import CalendarPart from "@/components/dashboard/calendar";
import StatsCards from "@/components/dashboard/allCard";
import TaskOverview from "@/components/dashboard/taskOverview";
import MyTeam from "@/components/dashboard/myTeam";

import { useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function DashBoard() {
  const [openTab, setOpenTab] = useState(false);
  const bottomShadow = {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  };

  const { projectId } = useLocalSearchParams<{ projectId: string }>();
  const [project, setProject] = useState<any>(null);
  const [stats, setStats] = useState({
  overdue: 0,
  totalTasks: 0,
  countdownDays: 0,
  myAssignments: 0,
});
const [overview, setOverview] = useState<any[]>([]);
const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        console.log("🚀 กำลังดึงข้อมูลสำหรับ Project:", projectId);
        
        const userId = await AsyncStorage.getItem("user_id");
        if (!userId) {
          console.log("❌ ไม่พบ user_id ใน Storage");
          return;
        }

        // const res = await fetch(`http://10.0.2.2:3000/dashboard/${projectId}/${userId}`);
        const res = await fetch(`http://10.0.2.2:3000/dashboard/${projectId}/${userId}`);

        if (!res.ok) {
          throw new Error(`Server Error: ${res.status}`);
        }

        const data = await res.json();
        console.log("✅ ข้อมูลที่ได้รับ:", data);

        setProject(data.project);
        setStats(data.stats);
        setOverview(data.overview);
        setMembers(data.members);

      } catch (error) {
        console.error("❌ Fetch Error:", error);
      }
    };

    if (projectId) {
      fetchDashboard();
    }
  }, [projectId]);

  return (
    <SafeAreaView className="flex-1 bg-white px-2">
      <ScrollView showsVerticalScrollIndicator={false}>

        <View className="flex-col items-right px-6 pt-4 mb-2">
          <TouchableOpacity onPress={() => setOpenTab(true)}>
            <Image source={icons.menu} className="w-6 h-6" />
          </TouchableOpacity>
          <Text className="text-[36px] font-kanitBold">{project?.project_name ?? "Loading..."}</Text>
        </View>
        {/* header */}
        <View className="px-6 mb-5 ">

          <View className="flex-row mb-1">
            <Text className="w-24 font-kanitRegular text-sm">
              Status
            </Text>

            <View className="bg-[#E6BB2D] px-5 py-1 rounded-full">
              <Text className="text-xs font-kanitRegular text-white">
                ● On Progress
              </Text>
            </View>
          </View>

          <View className="flex-row mb-1">
            <Text className="w-24 font-kanitRegular text-sm">
              Deadline
            </Text>

            <Text className="font-kanitBold text-sm">
              {project?.deadline ?? "-"}
            </Text>
          </View>

          <View className="flex-row">
            <Text className="w-24 font-kanitRegular text-sm">
              Subject
            </Text>
            <Text className="font-kanitBold text-sm">
              {project?.subject ?? "-"}
            </Text>
          </View>
        </View>

        {/* calendar ja */}
        <CalendarPart shadowStyle={bottomShadow} />
        {/* การ์ดสถิติสี่อัน */}
      <StatsCards
      shadowStyle={bottomShadow}
      overdue={stats.overdue}
      totalTasks={stats.totalTasks}
      countdownDays={stats.countdownDays}
      myAssignments={stats.myAssignments}
      />

        {/* task Overview */}
        <TaskOverview
        shadowStyle={bottomShadow}
        data={overview}
        />

        {/* สมาชิกในปจ */}
        <MyTeam
        shadowStyle={bottomShadow}
        members={members}
        />

      </ScrollView>
      <TabBar
        visible={openTab}
        onClose={() => setOpenTab(false)}
      />
    </SafeAreaView>
  );
}
