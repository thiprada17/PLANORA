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
    member: [] as { id: number; name: string }[]
  });

  const [emailInput, setEmailInput] = useState("");

  const handleAddMember = async () => {
    const email = emailInput.trim();
    if (!email) return;

    console.log("test " + email)

    try {
      const memsearch = await searchMember(email);

      if (!memsearch?.found) {
        alert("user not found");
        return;
      }

      const user_id = memsearch.user_id;

      if (task.member.some((m) => m.id === user_id)) {
        setEmailInput("");
        return;
      }

      setTask((prev) => ({
        ...prev,
        member: [
          ...prev.member,
          {
            id: memsearch.user_id,
            name: memsearch.username,
          },
        ],
      }));

      setEmailInput("");
    } catch (err) {
      console.log(err);
    }
  };

  const searchMember = async (email: string) => {
    try {
      const res = await fetch(
        "http://172.20.10.2:3000/assign/member",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        },
      );

      return await res.json();
    } catch (error) {}
  };
  const handleCreateTask = async () => {
    console.log("yes");
    try {
      await fetch("http://172.20.10.2:3000/create/task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });

      alert("yayy");
    } catch (error) {
      console.log(error);
    }
  };

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

        <View className="border border-neutral-400 rounded-xl px-2 h-[50px] bg-white" >

          {task.member.map((mail, index) => (
            <View
              key={index}
              className="flex-row items-center bg-[#EBEBEB] px-2 py-1 rounded-md mr-2 my-1"
            >
            <Text className="font-kanitRegular text-[10px] mr-1 ">
              {mail.name}
            </Text>
            <Pressable
              onPress={() =>
                setTask({
                  ...task,
                  member: task.member.filter((_, i) => i !== index),
                })
              }
            >
              <Text className="text-red-500 font-bold ml-1">×</Text>
            </Pressable>
          </View>
        ))}

        <TextInput
          placeholder={task.member.length === 0 ? "example@mail.com" : ""}
          className="font-kanitRegular color-neutral-700 flex-1 min-w-[100px] "
          value={emailInput}
          onChangeText={setEmailInput}
          autoCapitalize="none"
          keyboardType="email-address"
          onSubmitEditing={handleAddMember}
          blurOnSubmit={false}
        />
      </View>
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
