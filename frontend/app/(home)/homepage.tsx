import { View, Text, Pressable, Image, Modal, ScrollView } from "react-native";
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
      // const response = await fetch(`http://172.20.10.3:3000/display/projects/${userId}`);
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

  const [date, setDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [fontsLoaded] = useFonts({
    KanitBold: require("../../assets/fonts/KanitBold.ttf"),
    KanitRegular: require("../../assets/fonts/KanitRegular.ttf"),
  });

  if (!fontsLoaded) return null;

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

        <View className="px-2 py-2 mb-3">
          <View className="flex-row justify-end items-center">
            <View style={{ width: 110, zIndex: 50, marginRight: 8 }}>
              <DropDownPicker
                open={statusOpen}
                value={statusValue}
                items={statusItems}
                setOpen={setStatusOpen}
                setValue={setStatusValue}
                listMode="SCROLLVIEW"
                containerStyle={{
                  height: FILTER_HEIGHT,
                }}
                style={{
                  height: FILTER_HEIGHT,
                  minHeight: FILTER_HEIGHT,       // มันชอบอ้วน ต้องดักทาง
                  borderRadius: FILTER_RADIUS,
                  borderColor: "#D1D5DB",
                  paddingHorizontal: 10,
                  backgroundColor: "#fff",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                textStyle={{
                  fontSize: FILTER_TEXT_SIZE,
                  lineHeight: FILTER_TEXT_SIZE + 1,
                  color: "#000000",
                }}
                labelStyle={{
                  fontSize: FILTER_TEXT_SIZE,
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
            <View className="h-[30px] w-[110px] rounded-[11px] border border-gray-300 px-2.5 flex-row items-center bg-white mr-2">
              <Pressable
                style={{ flex: 1 }}
                onPress={() => setShowDatePicker(true)}>
                <Text
                  style={{ fontSize: FILTER_TEXT_SIZE, color: "#000" }}
                  numberOfLines={1}>
                  <Text
                    style={{
                      fontSize: FILTER_TEXT_SIZE,
                      color: date ? "#000" : "#6B7280",
                    }}
                    numberOfLines={1}>
                    {date ? date.toLocaleDateString() : "Deadline"}
                  </Text>
                </Text>
              </Pressable>
              {date && (
                <Pressable onPress={() => setDate(null)}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#6B7280",
                      marginHorizontal: 4,
                    }}>
                    Any
                  </Text>
                </Pressable>
              )}
              <Image source={icons.arrow_down} className="w-3 h-3" />
              {showDatePicker && (
                <View
                  style={{
                    position: "absolute",
                    top: FILTER_HEIGHT + 8,
                    right: 0,
                    backgroundColor: "#E5E7EB",
                    borderRadius: 16,
                    padding: 8,
                    zIndex: 100,
                  }}
                >
                  <DateTimePicker
                    value={date ?? new Date()}
                    mode="date"
                    display="default"
                    onChange={(_, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) setDate(selectedDate);
                    }}
                  />
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
              <View className="pt-1">
                <Image source={icons.filter} className="w-6 h-6" />
              </View>
            </Pressable>
          </View>
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
                  {projects.map((item) => (
                    <View
                      key={item.project_id}
                      className="w-[150px] h-[150px] mt-4"
                    >
                      <ProjectCard
                        project_id={item.project_id}
                        project_name={item.project_name}
                        subject={item.subject}
                        deadline={item.deadline}
                        members={item.members}
                      // onPress={() => router.push()ยังไม่ทราบว่าจะยังอไรรยังไง}
                      // members={item.members ?? []}
                      />
                    </View>
                  ))}

                </View>
              </ScrollView>
            </View>
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
    </SafeAreaView>
  );
}
