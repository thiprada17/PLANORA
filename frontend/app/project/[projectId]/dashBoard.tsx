import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "@/constants/icons";
import { useState } from "react";
import TabBar from "@/components/tabBar";

import CalendarPart from "@/components/dashboard/calendar";
import StatsCards from "@/components/dashboard/allCard";
import TaskOverview from "@/components/dashboard/taskOverview";
import MyTeam from "@/components/dashboard/myTeam";

export default function DashBoard() {
  const [openTab, setOpenTab] = useState(false);
  const bottomShadow = {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-2">
      <ScrollView showsVerticalScrollIndicator={false}>

        <View className="flex-col items-right px-6 pt-4 mb-2">
          <TouchableOpacity onPress={() => setOpenTab(true)}>
            <Image source={icons.menu} className="w-6 h-6" />
          </TouchableOpacity>
          <Text className="text-[36px] font-kanitBold">Project name</Text>
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
              March 1, 2026
            </Text>
          </View>

          <View className="flex-row">
            <Text className="w-24 font-kanitRegular text-sm">
              Subject
            </Text>
            <Text className="font-kanitBold text-sm">
              SF222
            </Text>
          </View>
        </View>

        {/* calendar ja */}
        <CalendarPart shadowStyle={bottomShadow} />
        {/* การ์ดสถิติสี่อัน */}
        <StatsCards
          shadowStyle={bottomShadow}
          overdue={1}
          totalTasks={20}
          countdownDays={30}
          myAssignments={4}
        />

        {/* task Overview */}
        <TaskOverview
          shadowStyle={bottomShadow}
          data={[
            { label: "Not Started", value: 3 },
            { label: "On Progress", value: 6 },
            { label: "In Review", value: 1 },
            { label: "Complete", value: 10 },
          ]}
        />

        {/* สมาชิกในปจ */}
        <MyTeam
          shadowStyle={bottomShadow}
          members={[
            { name: "1" },
            { name: "2" },
            { name: "3" },
            { name: "4" },
            { name: "5" },
            { name: "6" },
          ]}
        />

      </ScrollView>
      <TabBar
        visible={openTab}
        onClose={() => setOpenTab(false)}
      />
    </SafeAreaView>
  );
}