import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  Platform,
} from "react-native";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { icons } from "@/constants/icons";
import { useFonts } from "expo-font";

type TaskFormProps = {
  onCancel: () => void;
};

export default function TaskForm({ onCancel }: TaskFormProps) {
  const [showPicker, setShowPicker] = useState(false);

  const [task, setTask] = useState({
    name: "",
    deadline: "",
  });

  const [fonts] = useFonts({
    KanitBold: require("@/assets/fonts/KanitBold.ttf"),
    KanitRegular: require("@/assets/fonts/KanitRegular.ttf"),
  });

  if (!fonts) return null;

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      const formattedDate = `${selectedDate.getDate()}/${
        selectedDate.getMonth() + 1
      }/${selectedDate.getFullYear().toString().slice(-2)}`;
      setTask({ ...task, deadline: formattedDate });
    }
  };

  const handleCreateTask = async () => {
    console.log(task);
    try {
      await fetch(
        "https://freddy-unseconded-kristan.ngrok-free.dev/create/task",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(task),
        },
      );

      alert("yayy");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View className="gap-4">
      <View className="items-center mb-2">
        <Text className="font-kanitBold text-2xl text-black">Create Task</Text>
      </View>

      {/* Task name */}
      <View>
        <View className="flex-row items-center gap-2 mb-2">
          <Image
            source={icons.label}
            className="w-5 h-5"
            resizeMode="contain"
          />
          <Text className="font-kanitBold text-black">Task name</Text>
        </View>
        <TextInput
          placeholder="JerseyJamTU"
          className="font-kanitRegular border border-neutral-400 rounded-xl px-4 py-3 text-neutral-700 bg-white"
          value={task.name}
          onChangeText={(text) => setTask({ ...task, name: text })}
        />
      </View>

      {/* End date */}
      <View>
        <View className="flex-row items-center gap-2 mb-2">
          <Image
            source={icons.calendar}
            className="w-5 h-5"
            resizeMode="contain"
          />
          <Text className="font-kanitBold text-black">End date</Text>
        </View>

        <Pressable
          onPress={() => setShowPicker(true)}
          className="border border-neutral-400 rounded-xl px-4 py-3 bg-white"
        >
          <Text
            className={`font-kanitRegular ${
              task.deadline ? "text-black" : "text-neutral-400"
            }`}
          >
            {task.deadline || "DD/MM/YY"}
          </Text>
        </Pressable>

        {showPicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
      </View>

      {/* Assign */}
      <View>
        <View className="flex-row items-center gap-2 mb-2">
          <Image
            source={icons.person_add}
            className="w-5 h-5"
            resizeMode="contain"
          />
          <Text className="font-kanitBold text-black">Assign</Text>
        </View>
        <View className="border border-neutral-400 rounded-xl px-4 py-3 h-[50px] bg-white" />
      </View>

      <View className="flex-row justify-end mt-2">
        <Pressable
          onPress={() => {
            handleCreateTask();
            console.log("Task Created:", task);
          }}
          className="bg-[#A8D5BA] border border-black rounded-lg p-2 w-10 h-10 items-center justify-center shadow-sm"
        >
          <Image
            source={icons.check}
            className="w-5 h-5"
            resizeMode="contain"
          />
        </Pressable>
      </View>
    </View>
  );
}
