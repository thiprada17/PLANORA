import { View, Text, Pressable, Image, Modal } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { icons } from "@/constants/icons";
import { useFonts } from "expo-font";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function HomePage() {
  const router = useRouter();

  const [openFilter, setOpenFilter] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [status, setStatus] = useState<"All" | "Process" | "Complete">("All");

  const [date, setDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [fonts] = useFonts({
    KanitBold: require("../../assets/fonts/KanitBold.ttf"),
    KanitRegular: require("../../assets/fonts/KanitRegular.ttf"),
  });

  if (!fonts) return null;

  return (
    <View className="flex-1 pt-0 px-5">
      <View className="flex-row justify-between items-start mb-6">

        {/*PROFILE*/}
        <View className="flex-row items-center">
          <View className="w-12 h-12 rounded-full items-center justify-center mr-3">
            <Image source={icons.profile} className="w-6 h-6" />
          </View>

          <View>
            <Text className="font-kanitBold text-base text-black">
              Pony
            </Text>
            <Text className="font-kanitRegular text-xs text-neutral-500">
              pony@gmail.com
            </Text>
          </View>
        </View>

        <Pressable className="flex-row items-center">
          <Image source={icons.door_open} className="w-5 h-5 mr-1" />
          <Text className="text-red-500 font-kanitRegular">
            Log out
          </Text>
        </Pressable>
      </View>

      <View className="flex-row justify-between items-center">
        <Text className="font-kanitBold text-[50px] text-black">
          Planora
        </Text>

        <View className="flex-row items-center top-3">
          <Image source={icons.home_garden} className="w-4 h-4 mr-2" />
          <Text className="font-kanitRegular text-black">
            Pony's Homepage
          </Text>
        </View>
      </View>

      <View className="flex-row justify-end items-center mb-6 space-x-2">

        {/*STATUS*/}
        <Pressable
          className="flex-row items-center border border-neutral-300 rounded-full px-4 py-2"
          onPress={() => setOpenStatus(!openStatus)}
        >
          <Text className="text-sm mr-2">Status: {status}</Text>
          <Image source={icons.arrow_down} className="w-3 h-3" />
        </Pressable>

        {/*DEADLINE*/}
        <Pressable
          className="flex-row items-center border border-neutral-300 rounded-full px-4 py-2"
          onPress={() => setShowDatePicker(true)}
        >
          <Text className="text-sm mr-2">
            {date ? date.toDateString() : "Deadline"}
          </Text>
          <Image source={icons.arrow_down} className="w-3 h-3" />
        </Pressable>

        <Pressable
          className="border border-neutral-300 rounded-full p-3"
          onPress={() => setOpenFilter(true)}
        >
          <Image source={icons.filter} className="w-6 h-6" />
        </Pressable>
      </View>

      {openStatus && (
        <View className="absolute top-[265px] right-24 bg-white border border-neutral-200 rounded-xl shadow-lg z-50">
          {["All", "Process", "Complete"].map((item) => (
            <Pressable
              key={item}
              className="px-4 py-3"
              onPress={() => {
                setStatus(item as any);
                setOpenStatus(false);
              }}
            >
              <Text>{item}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {showDatePicker && (
        <DateTimePicker
          value={date ?? new Date()}
          mode="date"
          onChange={(_, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <View
        className="
          flex-1 
          bg-neutral-200 
          rounded-3xl 
          p-4
          shadow-inner
        "
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.25,
          shadowRadius: 6,
        }}
      >
        <Pressable
          onPress={() => router.push("/(home)/create_project")}
          className="w-[160px] h-[160px] border-2 border-dashed border-neutral-400 rounded-3xl items-center justify-center bg-neutral-100"
        >
          <Text className="text-4xl text-neutral-400">+</Text>
        </Pressable>
      </View>

      <Modal transparent animationType="slide" visible={openFilter}>
        <Pressable
          className="flex-1 bg-black/30"
          onPress={() => setOpenFilter(false)}
        >
          <View className="absolute bottom-0 w-full bg-white rounded-t-3xl p-6 h-[250px]">
            <Text className="font-kanitBold text-lg mb-2">
              Filter
            </Text>
            <Text className="text-neutral-500">
              ยังไม่มีอะไรจ้า
            </Text>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
