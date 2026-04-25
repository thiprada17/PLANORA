import {
  View,
  Text,
  Pressable,
  Image,
  Modal,
  ScrollView,
  Alert,
} from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { icons } from "@/constants/icons";
import { useFonts } from "expo-font";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  status?: string;
};

export default function HomePage() {
  const router = useRouter();

  const [user, setUser] = useState({
    name: null as string | null,
    email: null as string | null,
    profile: null as string | null,
  });

  useEffect(() => {
    const loaduser = async () => {
      const username = await AsyncStorage.getItem("username");
      const email = await AsyncStorage.getItem("email");
      const profile = await AsyncStorage.getItem("profile");

      setUser({
        name: username,
        email: email,
        profile: profile,
      });

      console.log(profile);
    };

    loaduser();
  }, []);

  const [projects, setProjects] = useState<Project[]>([]);
  //ชั่วคราว
  // const mockMembers = [
  //   { id: 1 },
  //   { id: 2 },
  //   { id: 3 },
  // ];

  const fetchProjects = async () => {
    const userId = await AsyncStorage.getItem("user_id");
    // a566dae5-5e72-4b94-b778-7d5ea9e6d763
    if (!userId) return;
    try {
      const response = await fetch(
        `https://planora-4qj8.onrender.com/display/projects/${userId}`,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",},
          }
        // `http://172.20.10.6:3000/display/projects/${userId}`,
      );
      if (!response.ok) {
        const text = await response.text();
        console.error("API ERROR:", text);
        setProjects([]);
        return;
      }
      const data = await response.json();
      const formattedProjects = Array.isArray(data)
        ? data.map((p) => ({
            ...p,
            deadline: p.deadline ? new Date(p.deadline) : null,
            members: p.members ?? [],
          }))
        : [];

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

  useFocusEffect(
    useCallback(() => {
      fetchProjects();
    }, []),
  );

  // const projects = mockProjects;

  // const [statusOpen, setStatusOpen] = useState(false);
  const [statusValue, setStatusValue] = useState("ALL");
  // const [subjectOpen, setSubjectOpen] = useState(false);
  const [subjectFilter, setSubjectFilter] = useState("ALL");
  const [showStatusCard, setShowStatusCard] = useState(false);
  const [showSubjectCard, setShowSubjectCard] = useState(false);

  const statusItems = [
    { label: "ALL", value: "ALL" },
    { label: "On Process", value: "On Process" },
    { label: "Complete", value: "Complete" },
    { label: "LAZY", value: "LAZY" },
    { label: "Almost Dead", value: "Almost Dead" },
  ];

    const subjectItems = [
    { label: "ALL", value: "ALL" },
    ...Array.from(new Set(projects.map((p) => p.subject))).map((sub) => ({
      label: sub,
      value: sub,
    })),
  ];

  const [showDeadlineCard, setShowDeadlineCard] = useState(false);
  const [activePicker, setActivePicker] = useState<"from" | "to" | null>(null);

  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [appliedFromDate, setAppliedFromDate] = useState<Date | null>(null);
  const [appliedToDate, setAppliedToDate] = useState<Date | null>(null);

  const normalize = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const filteredProjects = projects.filter((project) => {
    // status filter
    if (
      statusValue !== "ALL" &&
      (project.status ?? "").toLowerCase() !== statusValue.toLowerCase()
    ) {
      return false;
    }

    // subject filter
    if (
      subjectFilter !== "ALL" &&
      project.subject.toLowerCase() !== subjectFilter.toLowerCase()
    ) {
      return false;
    }

    // deadline filter
    if (appliedFromDate && appliedToDate && project.deadline) {
      const from = normalize(appliedFromDate);
      const to = normalize(appliedToDate);
      const projectDate = normalize(new Date(project.deadline));

      if (projectDate < from || projectDate > to) {
        return false;
      }
    }

    return true;
  });

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
              <Image
                source={user.profile ? { uri: user.profile } : icons.profile}
                className={
                  user.profile ? "w-12 h-12 rounded-full mr-2" : "w-6 h-6 mr-2"
                }
              />
            </View>
            <View>
              <Text className="font-KanitBold text-base leading-[17px] text-black">
                {user.name}
              </Text>
              <Text className="font-KanitRegular text-xs leading-[10px] text-neutral-500">
                {user.email}
              </Text>
            </View>
          </View>
          <Pressable
            className="flex-row items-center mt-2"
            onPress={() => router.replace("/login")}
          >
            <Image source={icons.door_open} className="w-5 h-5 mr-1" />
            <Text className="text-red-500 font-KanitRegular">Log out</Text>
          </Pressable>
        </View>

        <View className="flex-row items-baseline justify-between px-1 mt-2">
          <Text className="font-KanitBold text-[50px] leading-[56px] text-black">
            Planora
          </Text>
          <View className="flex-row items-center">
            <Image source={icons.home_garden} className="w-3.5 h-3.5 mr-1.5" />
            <Text className="font-KanitRegular text-sm text-black">
              Homepage
            </Text>
          </View>
        </View>

        <View className="px-2 py-2 mb-3 relative">
          <View className="flex-row justify-end items-center">
            {/* status ver.1 */}
            {/* <View className="mr-1" style={{ width: 110, zIndex: 50 }}>
              <DropDownPicker
                open={statusOpen}
                value={subjectFilter}
                items={subjectItems}
                setOpen={setStatusOpen}
                setValue={setSubjectFilter}
                listMode="SCROLLVIEW"
                containerStyle={{ height: FILTER_HEIGHT }}
                style={{
                  height: FILTER_HEIGHT,
                  minHeight: FILTER_HEIGHT, // มันชอบอ้วน ต้องดักทาง
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
            </View> */}

            {/* status ver.2 */}
            <View className="relative mr-1">
              <Pressable
                onPress={() => {
                  setShowStatusCard((prev) => !prev);
                  setShowSubjectCard(false);
                }}
                className="h-[30px] px-3 rounded-[11px] border border-gray-300 flex-row items-center bg-white"
              >
                <Text className="text-[9px]">Status: </Text>
                <Text
                  className={`text-[9px] ${statusValue === "ALL" ? "text-gray-400" : "text-black"}`}
                >
                  {statusValue}
                </Text>
                <Image source={icons.arrow_down} className="w-3 h-3 ml-1" />
              </Pressable>

              {showStatusCard && (
                <View className="absolute left-0 top-[38px] z-50 w-[150px] bg-white rounded-2xl py-2 border border-gray-300 shadow">
                  {statusItems.map((item) => (
                    <Pressable
                      key={item.value}
                      onPress={() => {
                        setStatusValue(item.value);
                        setShowStatusCard(false);
                      }}
                      className="px-4 py-2 flex-row justify-between items-center"
                    >
                      <Text className="text-xs">{item.label}</Text>
                      {statusValue === item.value && (
                        <Text className="text-xs">✓</Text>
                      )}
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            {/* deadline */}
            <View className="relative mr-1">
              <Pressable
                onPress={() => {
                  setShowDeadlineCard((prev) => !prev);
                  setShowStatusCard(false);
                  setShowSubjectCard(false);
                }}
                className="h-[30px] px-3 rounded-[11px] border border-gray-300 flex-row items-center bg-white"
              >
                <Text className="text-[9px] mr-1">Deadline:</Text>
                <Text
                  className={`text-[9px] ${
                    deadlineLabel === "Any" ? "text-gray-400" : "text-black"
                  }`}
                >
                  {deadlineLabel}
                </Text>
                <Image source={icons.arrow_down} className="w-3 h-3 ml-1" />
              </Pressable>

              {/* ไอการ์ดกรอกวัน */}
              {showDeadlineCard && (
                <View className="absolute right-0 top-[38px] z-50 w-[230px] bg-white rounded-2xl p-4 border border-gray-300 shadow">
                  <Text className="font-KanitBold text-sm mb-3">
                    Deadline range
                  </Text>

                  <Pressable
                    onPress={() => setActivePicker("from")}
                    className="border border-gray-300 rounded-lg px-3 py-2 mb-2"
                  >
                    <Text className="text-xs">
                      From:{" "}
                      {fromDate ? fromDate.toLocaleDateString() : "Select date"}
                    </Text>
                  </Pressable>

                  {/* ถึงวันที่ */}
                  <Pressable
                    onPress={() => setActivePicker("to")}
                    className="border border-gray-300 rounded-lg px-3 py-2 mb-4"
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
                      className="flex-1 bg-[#D95246] rounded-lg border border-[#595858] py-2 mr-3"
                    >
                      <Text className="text-center text-xs text-white">
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
                      className="flex-1 bg-[#75C791] border border-[#595858] rounded-lg py-2"
                    >
                      <Text className="text-center text-xs text-white">
                        Apply
                      </Text>
                    </Pressable>
                  </View>
                </View>
              )}
            </View>

            {/* subject ver.1 */}
            {/* <View style={{ width: 100, zIndex: 40 }}>
              <DropDownPicker
                open={subjectOpen}
                value={subjectFilter}
                items={subjectItems}
                setOpen={setSubjectOpen}
                setValue={setSubjectFilter}
                listMode="SCROLLVIEW"
                containerStyle={{ height: FILTER_HEIGHT }}
                style={{
                  height: FILTER_HEIGHT,
                  minHeight: FILTER_HEIGHT,
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
                onOpen={() => setStatusOpen(false)}
              />
            </View>
          </View> */}

            {/* subject ver.2 */}
            <View className="relative">
              <Pressable
                onPress={() => {
                  setShowSubjectCard((prev) => !prev);
                  setShowStatusCard(false);
                  setShowDeadlineCard(false);
                }}
                style={{
                  height: FILTER_HEIGHT,
                  width: FILTER_HEIGHT,
                  borderRadius: FILTER_RADIUS,
                  borderWidth: 1,
                  borderColor: subjectFilter !== "ALL" ? "#000" : "#D1D5DB",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: subjectFilter !== "ALL" ? "#000" : "#fff",
                }}
              >
                <Image
                  source={icons.filter}
                  className="w-4 h-4"
                  style={
                    subjectFilter !== "ALL" ? { tintColor: "#fff" } : undefined
                  }
                />
              </Pressable>

              {showSubjectCard && (
                <View className="absolute right-0 top-[38px] z-50 w-[150px] bg-white rounded-2xl py-2 border border-gray-300 shadow">
                  {subjectItems.map((item) => (
                    <Pressable
                      key={item.value}
                      onPress={() => {
                        setSubjectFilter(item.value);
                        setShowSubjectCard(false);
                      }}
                      className="px-4 py-2 flex-row justify-between items-center"
                    >
                      <Text className="text-xs">{item.label}</Text>
                      {subjectFilter === item.value && (
                        <Text className="text-xs">✓</Text>
                      )}
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/*datepic */}
          {activePicker && (
            <DateTimePicker
              value={
                activePicker === "from"
                  ? (fromDate ?? new Date())
                  : (toDate ?? new Date())
              }
              mode="date"
              onChange={(_, date) => {
                if (!date) return setActivePicker(null);

                if (activePicker === "to" && fromDate && date < fromDate) {
                  Alert.alert("error date", "To date must be after From date");
                  return setActivePicker(null);
                }
                activePicker === "from" ? setFromDate(date) : setToDate(date);

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
                    <Pressable
                      key={item.project_id}
                      href={`../project/${item.project_id}/board`}
                      asChild
                      href={`../project/${item.project_id}/board`}
                      asChild
                    >
                      <Text className="font-KanitBold text-center">{item.project_name}</Text>
                      <Text className="font-KanitRegular text-xs text-gray-500">{item.subject}</Text>
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
                        status={item.status}
                        onPress={() =>
                          router.push(`../project/${item.project_id}/dashBoard`)
                        }
                      />
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>

          {/* <Modal transparent animationType="slide" visible={openFilter}>
            <Pressable
              className="flex-1 bg-black/30"
              onPress={() => setOpenFilter(false)}
            >
              <View className="absolute bottom-0 w-full bg-white rounded-t-3xl p-6 h-[250px]">
                <Text className="font-KanitBold text-lg mb-2">Filter</Text>
                <Text className="text-neutral-500">ยังไม่มีอะไรจ้า</Text>
              </View>
            </Pressable>
          </Modal> */}
        </View>
      </View>
    </SafeAreaView>
  );
}