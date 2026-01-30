import { View, Text, Pressable, Image, Modal, ScrollView } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { icons } from "@/constants/icons";
import { useFonts } from "expo-font";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";

export default function HomePage() {
  const router = useRouter();
  const user = {
    name: "Pony",
    email: "pony@gmail.com",
  };
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
    <View className="flex-1 bg-white px-5 pb-8">
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-row items-center">
          <View className="w-12 h-12 rounded-full items-center justify-center">
            <Image source={icons.profile} className="w-6 h-6 mr-2" />
          </View>
          <View>
            <Text className="font-kanitBold text-base leading-[17px] text-black">{user.name}</Text>
            <Text className="font-kanitRegular text-xs leading-[10px] text-neutral-500">{user.email}</Text>
          </View>
        </View>
        <Pressable
          className="flex-row items-center mt-2"
          onPress={() => router.replace("/login")}>
          <Image source={icons.door_open} className="w-5 h-5 mr-1" />
          <Text className="text-red-500 font-kanitRegular">Log out</Text>
        </Pressable>
      </View>
      <View className="flex-row items-baseline justify-between px-1 mt-2">
        <Text className="font-kanitBold text-[50px] leading-[56px] text-black">Planora</Text>
        <View className="flex-row items-center">
          <Image source={icons.home_garden} className="w-3.5 h-3.5 mr-1.5" />
          <Text className="font-kanitRegular text-sm text-black">
            {user.name}'s Homepage
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
                color: "#6B7280",
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
              <Pressable
                onPress={() => router.push("/(home)/create_project")}
                className="w-[150px] h-[150px] mt-4 rounded-3xl
                     border-2 border-dashed border-neutral-400
                     bg-white items-center justify-center"
              >
                <Text className="text-4xl text-neutral-400">+</Text>
              </Pressable>
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
  );
}
