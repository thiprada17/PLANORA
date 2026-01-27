import { View, Text, Pressable, Image, Modal, ScrollView } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { icons } from "@/constants/icons";
import { useFonts } from "expo-font";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";
import { useWindowDimensions } from "react-native";

export default function HomePage() {
  const router = useRouter();

  const [openFilter, setOpenFilter] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [statusValue, setStatusValue] = useState("ALL");

  const statusItems = [
    { label: "Status: ALL", value: "ALL" },
    { label: "Status: PROCESS", value: "PROCESS" },
    { label: "Status: COMPLETE", value: "COMPLETE" },
  ];

  const [date, setDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { width } = useWindowDimensions();
  const isSmallScreen = width < 360;

  const [fontsLoaded] = useFonts({
    KanitBold: require("../../assets/fonts/KanitBold.ttf"),
    KanitRegular: require("../../assets/fonts/KanitRegular.ttf"),
  });

  if (!fontsLoaded) return null;

  const FILTER_HEIGHT = 32;
  const FILTER_RADIUS = 18;
  const FILTER_TEXT_SIZE = 11;

  return (
<ScrollView
  className="flex-1 bg-white"
  contentContainerStyle={{
    paddingHorizontal: 20,
    paddingBottom: 32,
  }}
  showsVerticalScrollIndicator={false}
>
      <View className="flex-row justify-between items-start mt-2 mb-2">
        <View className="flex-row items-center">
          <View className="w-12 h-12 rounded-full items-center justify-center mr-3">
            <Image source={icons.profile} className="w-6 h-6" />
          </View>
          <View>
            <Text className="font-kanitBold text-base text-black">Pony</Text>
            <Text className="font-kanitRegular text-xs text-neutral-500">
              pony@gmail.com
            </Text>
          </View>
        </View>

        <Pressable className="flex-row items-center mt-2">
          <Image source={icons.door_open} className="w-5 h-5 mr-1" />
          <Text className="text-red-500 font-kanitRegular">Log out</Text>
        </Pressable>
      </View>

      <View className="flex-row justify-between items-center mb-2">
        <Text className="font-kanitBold text-[48px] text-black">Planora</Text>

        <View className="flex-row items-center mt-4">
          <Image source={icons.home_garden} className="w-4 h-4 mr-2" />
          <Text className="font-kanitRegular text-black">
            Pony&apos;s Homepage
          </Text>
        </View>
      </View>

      {/*FILTER*/}
      <View className="px-2 py-2 mb-3">
        <View className="flex-row justify-end items-center space-x-2">

          {/* STATUS */}
          <View style={{ width: 150, zIndex: 50, marginRight: 8 }}>
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
                lineHeight: FILTER_TEXT_SIZE + 2,
                color: "#000",
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

          {/* DEADLINE */}
          <View
            style={{
              height: FILTER_HEIGHT,
              width: 150,
              borderRadius: FILTER_RADIUS,
              borderWidth: 1,
              borderColor: "#D1D5DB",
              paddingHorizontal: 10,
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#fff",
              marginRight: 8,
            }}
          >
            <Pressable
              style={{ flex: 1 }}
              onPress={() => setShowDatePicker(true)}
            >
              <Text
                style={{ fontSize: FILTER_TEXT_SIZE, color: "#000" }}
                numberOfLines={1}
              >
                <Text
                  style={{
                    fontSize: FILTER_TEXT_SIZE,
                    color: date ? "#000" : "#6B7280",
                  }}
                  numberOfLines={1}
                >
                  {date
                    ? `Deadline: ${date.toLocaleDateString()}`
                    : "Deadline"}
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
                  }}
                >
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

          {/* FILTER ICON */}
          <Pressable
            onPress={() => setOpenFilter(true)}   // 🔥 เพิ่มบรรทัดนี้
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
            <Image source={icons.filter} className="w-5 h-5" />
          </Pressable>
        </View>
      </View>

      <View className="flex-1 rounded-3xl bg-white overflow-hidden relative">
        <View
          pointerEvents="none"
          className="absolute inset-0 rounded-3xl"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.2,
            shadowRadius: 12,
          }}
        />

        <View
          pointerEvents="none"
          className="absolute inset-[2px] rounded-[22px] border border-black/5"
        />
        <View className="flex-1 p-4 bg-GRAY" >
          <Pressable
            onPress={() => router.push("/(home)/create_project")}
            className="w-[160px] h-[160px] mt-4 rounded-3xl
                       border-2 border-dashed border-neutral-400
                       bg-white items-center justify-center"
          >
            <Text className="text-4xl text-neutral-400">+</Text>
          </Pressable>
        </View>
      </View>

      <Modal transparent animationType="slide" visible={openFilter}>
        <Pressable
          className="flex-1 bg-black/30"
          onPress={() => setOpenFilter(false)}
        >
          <View className="absolute bottom-0 w-full bg-white rounded-t-3xl p-6 h-[250px]">
            <Text className="font-kanitBold text-lg mb-2">Filter</Text>
            <Text className="text-neutral-500">ยังไม่มีอะไรจ้า</Text>
          </View>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}
