import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  Alert,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";
import { icons } from "@/constants/icons";

export default function setting() {
  const [projectName, setProjectName] = useState("Apple Jack");

  const [deadline, setDeadline] = useState<Date | null>(new Date("2026-02-11"));
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [statusOpen, setStatusOpen] = useState(false);
  const [statusValue, setStatusValue] = useState("COMPLETE");

  // check status เหมือนหน้า homepage แล้ว
  const statusItems = [
    { label: "Process", value: "PROCESS" },
    { label: "Complete", value: "COMPLETE" },
  ];

  const [subjectOpen, setSubjectOpen] = useState(false);
  const [subjectValue, setSubjectValue] = useState("SF222");

  // check subject เหมือนหน้า homepage แล้ว
  const subjectItems = [
    { label: "CN321", value: "CN321" },
    { label: "CN334", value: "CN334" },
    { label: "CN311", value: "CN311" },
    { label: "SF231", value: "SF231" },
    { label: "SF222", value: "SF222" },
  ];

  // เงาเหงางำไง
  const styles = StyleSheet.create({
    shadow: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 2,
      elevation: 3,
    },
  });

  return (
    <SafeAreaView className="flex-1 bg-white px-5 pt-4">
      {/* HEADER */}
      <View className="mb-5">
        <Pressable className="mb-2">
          <Image source={icons.menu} className="w-7 h-7" />
        </Pressable>

        <Text className="text-[40px] font-kanitMedium text-black">
          Project Setting
        </Text>
      </View>

      {/* Form */}
      <View className="space-y-4 ">
        {/* Project Name */}
        <View>
          <Text className="text-gray-500 mb-2">Project Name:</Text>
          <TextInput
            value={projectName}
            onChangeText={setProjectName}
            className="h-[48px] text-gray-500 border border-black rounded-md px-4 py-3 mb-5 font-kanitRegular"
          />
        </View>

        {/* Deadline */}
        <View>
          <Text className="text-gray-500 mb-2">Deadline:</Text>
          <Pressable
            onPress={() => setShowDatePicker(true)}
            className="h-[48px] text-gray-500 border border-black rounded-md px-4 py-3 mb-5 flex-row justify-between items-center"
          >
            <Text className="text-gray-500 font-kanitRegular">
              {deadline ? deadline.toLocaleDateString("en-GB") : "Select date"}
            </Text>
            <Image source={icons.calendar} className="w-6 h-6" />
          </Pressable>
        </View>

        {/* Status */}
        <View style={{ zIndex: 30, width: "100%" }}>
          <Text className="text-gray-500 mb-2">Status:</Text>
          <DropDownPicker
            open={statusOpen}
            value={statusValue}
            items={statusItems}
            setOpen={setStatusOpen}
            setValue={setStatusValue}
            textStyle={{
              color: "#6c727f",
              fontFamily: "KanitRegular",
            }}
            style={{
              borderColor: "#000000",
              borderRadius: 5,
              minHeight: 50,
              marginBottom: 15,
            }}
            dropDownContainerStyle={{
              borderColor: "#000000",
              borderRadius: 5,
            }}
          />
        </View>

        {/* Subject */}
        <View style={{ zIndex: 20, width: "100%" }}>
          <Text className="text-gray-500 mb-2">Subject:</Text>
          <DropDownPicker
            open={subjectOpen}
            value={subjectValue}
            items={subjectItems}
            setOpen={setSubjectOpen}
            setValue={setSubjectValue}
            textStyle={{
              color: "#6c727f",
              fontFamily: "KanitRegular",
            }}
            style={{
              borderColor: "#000000",
              borderRadius: 5,
              minHeight: 50,
              marginBottom: 230,
            }}
            dropDownContainerStyle={{
              borderColor: "#000000",
              borderRadius: 5,
            }}
          />
        </View>
      </View>

      {/* Button */}
      <View className="flex-row justify-between ">
        <Pressable
          onPress={() => Alert.alert("Saved")}
          className="flex-row items-center bg-[#98DAAA] px-6 py-3 rounded-lg drop-shadow-lg shadow-black/30 elevation-5"
          style={styles.shadow}
        >
          <Image source={icons.download} className="w-5 h-5 mr-2" />
          <Text className="text-[15px] text-[#E9FCEF] font-kanitRegular">
            Save Project
          </Text>
        </Pressable>

        <Pressable
          onPress={() => Alert.alert("Deleted")}
          className="flex-row items-center bg-[#C84E44] px-6 py-3 rounded-lg"
          style={styles.shadow}
        >
          <Image source={icons.delete_forever} className="w-5 h-5 mr-2" />
          <Text className="text-[15px] text-[#FFBCB7] font-kanitRegular">
            Delete Project
          </Text>
        </Pressable>
      </View>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={deadline ?? new Date()}
          mode="date"
          onChange={(_, date) => {
            setShowDatePicker(false);
            if (date) setDeadline(date);
          }}
        />
      )}
    </SafeAreaView>
  );
}
