import { View, Text, Pressable, Image, Modal, ScrollView, Alert } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { icons } from "@/constants/icons";
import { useFonts } from "expo-font";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import ProjectCard from "@/components/projectCard";



type Member = {
  id: string;
  avatar?: string | null;
};

type Project = {
  project_id: string;
  project_name: string;
  subject: string;
  deadline: Date | null;
  members: Member[];
};

export default function HomePage() {

  const router = useRouter();

  const [user, setUser] = useState({
    name: null as string | null,
    email: null as string | null,
    profile: null as string | null
  });

  useEffect(() => {
    const loaduser = async () => {
      const username = await AsyncStorage.getItem('username')
      const email = await AsyncStorage.getItem('email')
      const profile = await AsyncStorage.getItem('profile')

      setUser({
        name: username,
        email: email,
        profile: profile

      })

      console.log(profile)
    }

    loaduser()

  }, [])

  const [projects, setProjects] = useState<Project[]>([]);
  //ชั่วคราว
  // const mockMembers = [
  //   { id: 1 },
  //   { id: 2 },
  //   { id: 3 },
  // ];

  const fetchProjects = async () => {
    const userId = await AsyncStorage.getItem("user_id")
    try {
      const response = await fetch(`https://freddy-unseconded-kristan.ngrok-free.dev/display/projects/${userId}`);
      const text = await response.text()
      console.log("RAW RESPONSE:", text)
      const data = JSON.parse(text)
      const formattedProjects = Array.isArray(data) ? data.map((p) => ({
        ...p,
        deadline: p.deadline ? new Date(p.deadline + "T00:00:00") : null,
        members: p.members ?? []

      })) : [];

      // deadline: p.deadline ? new Date(p.deadline) : null,
      //     members: []
      //   }))
      // : []

      setProjects(formattedProjects);
    } catch (error) {
      console.error("Fetch error:", error);
      setProjects([]);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchProjects();
    }, []));

  // const projects = mockProjects;

  const [openFilter, setOpenFilter] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [statusValue, setStatusValue] = useState("ALL");

  const statusItems = [
    { label: "Status: ALL", value: "ALL" },
    { label: "Status: PROCESS", value: "PROCESS" },
    { label: "Status: COMPLETE", value: "COMPLETE" },];

  const [showDeadlineCard, setShowDeadlineCard] = useState(false);
  const [activePicker, setActivePicker] = useState<"from" | "to" | null>(null);

  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [appliedFromDate, setAppliedFromDate] = useState<Date | null>(null);
  const [appliedToDate, setAppliedToDate] = useState<Date | null>(null);


  const deadlineLabel =
    appliedFromDate && appliedToDate
      ? `${appliedFromDate.toLocaleDateString()} - ${appliedToDate.toLocaleDateString()}`
      : "Any";



  const FILTER_HEIGHT = 30;
  const FILTER_RADIUS = 11;
  const FILTER_TEXT_SIZE = 9;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-5 pb-8 pt-4">
        <View className="flex-row justify-between items-start mb-2">
          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-full items-center justify-center">
              <Image source={user.profile ? { uri: user.profile } : icons.profile} className={user.profile ? "w-12 h-12 rounded-full mr-2" : "w-6 h-6 mr-2"} />

            </View>
            <View>
              <Text className="font-kanitBold text-base leading-[17px] text-black">{user.name}</Text>
              <Text className="font-kanitRegular text-xs leading-[10px] text-neutral-500">{user.email}</Text>
            </View>
          </View>
          <Pressable
            className="flex-row items-center mt-2"
            onPress={() => router.replace("/login")}
          >
            <Image source={icons.door_open} className="w-5 h-5 mr-1" />
            <Text className="text-red-500 font-kanitRegular">Log out</Text>
          </Pressable>
        </View>

        <View className="flex-row items-baseline justify-between px-1 mt-2">
          <Text className="font-kanitBold text-[50px] leading-[56px] text-black">Planora</Text>
          <View className="flex-row items-center">
            <Image source={icons.home_garden} className="w-3.5 h-3.5 mr-1.5" />
            <Text className="font-kanitRegular text-sm text-black">
              Homepage
            </Text>
          </View>
        </View>

        <View className="px-2 py-2 mb-3 relative">
          <View className="flex-row justify-end items-center">

            <View className="mr-1" style={{ width: 110, zIndex: 50 }}>
              <DropDownPicker
                open={statusOpen}
                value={statusValue}
                items={statusItems}
                setOpen={setStatusOpen}
                setValue={setStatusValue}
                listMode="SCROLLVIEW"
                containerStyle={{ height: FILTER_HEIGHT }} 
                style={{
                  height: FILTER_HEIGHT,
                  minHeight: FILTER_HEIGHT,       // มันชอบอ้วน ต้องดักทาง
                  borderRadius: FILTER_RADIUS,
                  borderColor: "#D1D5DB",
                  paddingHorizontal: 10,
                  backgroundColor: "#fff",
                }}
                textStyle={{
                  fontSize: FILTER_TEXT_SIZE,
                  lineHeight: FILTER_TEXT_SIZE + 1,
                }}
                ArrowDownIconComponent={() => (
                  <Image source={icons.arrow_down} className="w-3 h-3" />
                )}
                dropDownContainerStyle={{
                  borderRadius: 14,
                  borderColor: "#D1D5DB",
                  backgroundColor: "#fff",
                  marginTop: 6,
                }}
              />
            </View>

            <View className="relative mr-1">
              <Pressable
                onPress={() => setShowDeadlineCard((prev) => !prev)}
                className="h-[30px] px-3 rounded-[11px] border border-gray-300 flex-row items-center bg-white"
              >
                <Text className="text-[9px] mr-1">Deadline:</Text>
                <Text
                  className={`text-[9px] ${deadlineLabel === "Any" ? "text-gray-400" : "text-black"
                    }`}
                >
                  {deadlineLabel}
                </Text>
                <Image source={icons.arrow_down} className="w-3 h-3 ml-1" />
              </Pressable>

              {/* ไอการ์ดกรอกวัน */}
              {showDeadlineCard && (
                <View className="absolute right-0 top-[38px] z-50 w-[230px] bg-white rounded-2xl p-4 border border-gray-300 shadow">
                  <Text className="font-kanitBold text-sm mb-3">
                    Deadline range
                  </Text>

                  {/* แบบฟอร์มกรอกวันคับ ขอเปนสีพื้นๆไปก่อนเน้อ อันนี้น้องจากวันนที่*/}
                  <Pressable
                    onPress={() => setActivePicker("from")}
                    className="border rounded-lg px-3 py-2 mb-2"
                  >
                    <Text className="text-xs">
                      From: {fromDate ? fromDate.toLocaleDateString() : "Select date"}
                    </Text>
                  </Pressable>

                  {/* ถึงวันที่ */}
                  <Pressable
                    onPress={() => setActivePicker("to")}
                    className="border rounded-lg px-3 py-2 mb-4"
                  >
                    <Text className="text-xs">
                      To: {toDate ? toDate.toLocaleDateString() : "Select date"}
                    </Text>
                  </Pressable>

                  <View className="flex-row justify-between space-x-2">
                    <Pressable
                      onPress={() => {
                        setFromDate(null);
                        setToDate(null);
                        setAppliedFromDate(null);
                        setAppliedToDate(null);
                        setShowDeadlineCard(false);
                      }}
                      className="flex-1 bg-gray-100 rounded-lg py-2"
                    >
                      <Text className="text-center text-xs text-gray-600">
                        Clear
                      </Text>
                    </Pressable>

                    <Pressable
                      onPress={() => {
                        if (!fromDate || !toDate) {
                          Alert.alert("Incomplete", "Please select both dates");
                          return;
                        }

                        setAppliedFromDate(fromDate);
                        setAppliedToDate(toDate);
                        setShowDeadlineCard(false);
                      }}
                      className="flex-1 bg-black rounded-lg py-2"
                    >
                      <Text className="text-center text-xs text-white">
                        Apply
                      </Text>
                    </Pressable>
                  </View>
                </View>
              )}
            </View>
            <Pressable
              onPress={() => setOpenFilter(true)}
              style={{
                height: FILTER_HEIGHT,
                width: FILTER_HEIGHT,
                borderRadius: FILTER_RADIUS,
                borderWidth: 1,
                borderColor: "#D1D5DB",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#fff",
              }}
            >
              <Image source={icons.filter} className="w-6 h-6" />
            </Pressable>
          </View>

          {/*datepic */}
          {activePicker && (
            <DateTimePicker
              value={
                activePicker === "from"
                  ? fromDate ?? new Date()
                  : toDate ?? new Date()
              }
              mode="date"
              onChange={(_, date) => {
                if (!date) return setActivePicker(null);

                if (activePicker === "to" && fromDate && date < fromDate) {
                  Alert.alert("error date", "To date must be after From date");
                  return setActivePicker(null);
                }
                activePicker === "from"
                  ? setFromDate(date)
                  : setToDate(date);

                setActivePicker(null);
              }}
            />
          )}

        </View>
        <View className="flex-1 bg-white rounded-3xl p-0.5">
          <View className="flex-1 bg-gray-200 rounded-[22px] p-0.5">
            <View className="flex-1 bg-gray-100 rounded-[21px] overflow-hidden">
              <ScrollView
                contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
                showsVerticalScrollIndicator={false}
              >
                <View className="flex-row flex-wrap justify-between">
                  <Pressable
                    onPress={() => router.push("/(home)/create_project")}
                    className="w-[150px] h-[150px] mt-4 rounded-3xl border-2 border-dashed border-neutral-400 bg-white items-center justify-center"
                  >
                    <Text className="text-4xl text-neutral-400">+</Text>
                  </Pressable>
                  {/* {projects.map((item) => (
                  {/* {projects.map((item) => (
                    <Pressable
                      key={item.project_id}
                      href={`../project/${item.project_id}/board`}
                      asChild
                      href={`../project/${item.project_id}/board`}
                      asChild
                    >
                      <Text className="font-kanitBold text-center">{item.project_name}</Text>
                      <Text className="font-kanitRegular text-xs text-gray-500">{item.subject}</Text>
                      <ProjectCard
                        key={item.project_id}
                        name={item.project_name}
                        subject={item.subject}
                        deadline={item.deadline}
                        members={item.members}
                      onPress={() => router.push()}ยังไม่ทราบว่าจะยังอไรรยังไง
                      />
                      <ProjectCard
                        key={item.project_id}
                        name={item.project_name}
                        subject={item.subject}
                        deadline={item.deadline}
                        members={item.members}
                      onPress={() => router.push()}ยังไม่ทราบว่าจะยังอไรรยังไง
                      />
                    </Pressable>
                  ))} */}
                 {filteredProjects.map((item) => (
                  <View key={item.project_id}className="w-[150px] h-[150px] mt-4">
                    <ProjectCard
                    project_id={item.project_id}
                    project_name={item.project_name}
                    subject={item.subject}
                    deadline={item.deadline}
                    members={item.members}
                    onPress={() =>
                      router.push({
                        pathname: "/project/[projectId]/dashBoard",
                        params: { projectId: item.project_id },})
                      }/>
                      </View>
                    ))}
                </View>
              </ScrollView>
            </View>
          </View>

          <Modal transparent animationType="slide" visible={openFilter}>
            <Pressable
              className="flex-1 bg-black/30"
              onPress={() => setOpenFilter(false)}>
              <View className="absolute bottom-0 w-full bg-white rounded-t-3xl p-6 h-[250px]">
                <Text className="font-kanitBold text-lg mb-2">Filter</Text>
                <Text className="text-neutral-500">ยังไม่มีอะไรจ้า</Text>
              </View>
            </Pressable>
          </Modal>
        </View>
      </View>
    </SafeAreaView>
  );
}
