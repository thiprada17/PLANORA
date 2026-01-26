import { View, Text, Pressable, Image, Modal } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { icons } from "@/constants/icons";
import { useFonts } from "expo-font";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";

export default function HomePage() {
  const router = useRouter();

  const [openFilter, setOpenFilter] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [statusValue, setStatusValue] = useState<string | null>("all");
  const [statusItems, setStatusItems] = useState([
    { label: "All", value: "all" },
    { label: "Process", value: "process" },
    { label: "Complete", value: "complete" },
  ]);

  const [date, setDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [fontsLoaded] = useFonts({
    KanitBold: require("../../assets/fonts/KanitBold.ttf"),
    KanitRegular: require("../../assets/fonts/KanitRegular.ttf"),
  });

  if (!fontsLoaded) return null;

  return (
    <View className="flex-1 px-5">
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

      <View className="flex-row justify-between items-center mb-4">
        <Text className="font-kanitBold text-[48px] text-black">Planora</Text>

        <View className="flex-row items-center mt-4">
          <Image source={icons.home_garden} className="w-4 h-4 mr-2" />
          <Text className="font-kanitRegular text-black">
            Pony&apos;s Homepage
          </Text>
        </View>
      </View>

      {/* FILTER BAR*/}
      <View className="flex-row justify-end items-start mb-6 space-x-2 z-50">

        {/* STATUS */}
        <View className="w-[150px]">
          <DropDownPicker
            open={statusOpen}
            value={statusValue}
            items={statusItems}
            setOpen={setStatusOpen}
            setValue={setStatusValue}
            setItems={setStatusItems}
            placeholder="Status"
            listMode="SCROLLVIEW"
            style={{
              borderColor: "#D1D5DB",
              borderRadius: 999,
              minHeight: 40,
            }}
            dropDownContainerStyle={{
              borderColor: "#D1D5DB",
              borderRadius: 16,
              marginTop: 4,
            }}
            ArrowDownIconComponent={() => (
              <Image source={icons.arrow_down} className="w-3 h-3" />
            )}
          />
        </View>

        {/* DEADLINE */}
        <View className="relative">
          <Pressable
            className="flex-row items-center border border-neutral-300 rounded-full px-4 py-2 h-[40px]"
            onPress={() => setShowDatePicker(true)}
          >
            <Text className="text-sm mr-2">
              {date ? date.toDateString() : "Deadline"}
            </Text>
            <Image source={icons.arrow_down} className="w-3 h-3" />
          </Pressable>

          {showDatePicker && (
            <View className="absolute top-12 right-0 bg-white rounded-xl shadow-lg z-50">
              <DateTimePicker
                value={date ?? new Date()}
                mode="date"
                display="calendar"
                onChange={(_, selectedDate) => {
                  if (selectedDate) setDate(selectedDate);
                  setShowDatePicker(false);
                }}
              />
            </View>
          )}
        </View>

        <Pressable
          className="border border-neutral-300 rounded-full p-3"
          onPress={() => setOpenFilter(true)}
        >
          <Image source={icons.filter} className="w-6 h-6" />
        </Pressable>
      </View>

      <View className="flex-1 rounded-3xl bg-neutral-200 overflow-hidden relative">

        <View
          pointerEvents="none"
          className="absolute inset-0 rounded-3xl"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.12,
            shadowRadius: 12,
          }}
        />

        <View
          pointerEvents="none"
          className="absolute inset-[2px] rounded-[22px] border border-black/5"
        />

        <View className="flex-1 p-4">
          <Pressable
            onPress={() => router.push("/(home)/create_project")}
            className="w-[160px] h-[160px] mt-4 rounded-3xl
                       border-2 border-dashed border-neutral-400
                       bg-neutral-100 items-center justify-center"
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
    </View>
  );
}
