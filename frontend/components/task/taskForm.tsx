import { View, Text, TextInput, Pressable, Image } from "react-native";
import { useEffect, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { icons } from "@/constants/icons";
import { useFonts } from "expo-font";
import DropDownPicker from "react-native-dropdown-picker";

type TaskFormProps = {
  onCancel: () => void;
  projectId: number;
  onSuccess: () => void;
};

export default function TaskForm({
  onCancel,
  projectId,
  onSuccess,
}: TaskFormProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [pickerType, setPickerType] = useState<"start" | "end" | null>(null);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string[]>([]);
  const [items, setItems] = useState<
    {
      label: string;
      value: string;
      avatar_url: string;
    }[]
  >([]);

  const [task, setTask] = useState({
    task_name: "",
    start_date: "",
    deadline: "",
  });

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const res = await fetch(
          `https://freddy-unseconded-kristan.ngrok-free.dev/assign/member/${projectId}`,
          {
            headers: { "ngrok-skip-browser-warning": "true" },
          }
        );

        const data = await res.json();

        const formatted = data.map((m: any) => ({
          label: m.username,
          value: m.user_id.toString(),
          avatar_url: m.avatar_url,
        }));

        setItems(formatted);
      } catch (error) {
        console.log("Load Members Error:", error);
      }
    };

    if (projectId) {
      loadMembers();
    }
  }, [projectId]);

  const handleCreateTask = async () => {
    try {
      if (!task.task_name || !task.start_date || !task.deadline) {
        alert("กรอกข้อมูลให้ครบ");
        return;
      }

      const selectedMembers = value.map((id) => {
        const member = items.find((item) => item.value === id);
        return {
          user_id: Number(id),
          username: member?.label,
          avatar_url: member?.avatar_url,
        };
      });

      const payload = {
        name: task.task_name,
        start_date: task.start_date,
        deadline: task.deadline,
        projectId: projectId,
        members: selectedMembers,
      };

      const res = await fetch(
        "https://freddy-unseconded-kristan.ngrok-free.dev/create/task",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      console.log("CREATE TASK:", data);

      alert("Task Created!");
      onSuccess(); // refresh board
      onCancel(); // close modal
    } catch (error) {
      console.log("Create Task Error:", error);
    }
  };

  const [fonts] = useFonts({
    KanitBold: require("@/assets/fonts/KanitBold.ttf"),
    KanitRegular: require("@/assets/fonts/KanitRegular.ttf"),
  });

  if (!fonts) return null;

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (!selectedDate) return;

    const type = pickerType;

    setPickerType(null);
    setShowPicker(false);

    const formattedDate = selectedDate.toISOString().split("T")[0];

    if (type === "start") {
      setTask({ ...task, start_date: formattedDate });
    } else if (type === "end") {
      setTask({ ...task, deadline: formattedDate });
    }
  };

  return (
    <View className="gap-4 p-2">
      {/* HEADER */}
      <View className="items-center mb-2">
        <Text className="font-kanitBold text-2xl text-black">
          Create Task
        </Text>
      </View>

      {/* TASK NAME */}
      <View>
        <View className="flex-row items-center gap-2 mb-2">
          <Image source={icons.label} className="w-5 h-5" />
          <Text className="font-kanitBold text-black">Task name</Text>
        </View>

        <TextInput
          placeholder="JerseyJamTU"
          className="font-kanitRegular border border-neutral-400 rounded-xl px-4 py-3 text-neutral-700 bg-white"
          value={task.task_name}
          onChangeText={(text) =>
            setTask({ ...task, task_name: text })
          }
        />
      </View>

      {/* START DATE */}
      <View>
        <View className="flex-row items-center gap-2 mb-2">
          <Image source={icons.calendar} className="w-5 h-5" />
          <Text className="font-kanitBold text-black">Start date</Text>
        </View>

        <Pressable
          onPress={() => {
            setPickerType("start"); 
            setShowPicker(true);
          }}
          className="border border-neutral-400 rounded-xl px-4 py-3 bg-white"
        >
          <Text
            className={`font-kanitRegular ${
              task.start_date ? "text-black" : "text-neutral-400"
            }`}
          >
            {task.start_date || "DD/MM/YY"}
          </Text>
        </Pressable>
      </View>

      {/* END DATE */}
      <View>
        <View className="flex-row items-center gap-2 mb-2">
          <Image source={icons.calendar} className="w-5 h-5" />
          <Text className="font-kanitBold text-black">End date</Text>
        </View>

        <Pressable
          onPress={() => {
            setPickerType("end"); 
            setShowPicker(true);
          }}
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

      {/* ASSIGN */}
      <View style={{ zIndex: 5000 }}>
        <View className="flex-row items-center gap-2 mb-2">
          <Image source={icons.person_add} className="w-5 h-5" />
          <Text className="font-kanitBold text-black">Assign</Text>
        </View>

        <DropDownPicker
          multiple={true}
          min={0}
          max={10}
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          listMode="SCROLLVIEW"
          placeholder="Select members..."
          mode="BADGE"
          style={{
            borderColor: "#A3A3A3",
            borderRadius: 12,
            minHeight: 50,
            backgroundColor: "white",
          }}
          dropDownContainerStyle={{
            borderColor: "#D4D4D8",
            backgroundColor: "white",
            elevation: 5,
          }}
          placeholderStyle={{
            color: "#A3A3A3",
            fontFamily: "KanitRegular",
          }}
          labelStyle={{
            fontFamily: "KanitRegular",
            color: "#404040",
          }}
          badgeColors={["#F0F0F0"]}
          badgeTextStyle={{
            fontFamily: "KanitRegular",
            color: "#3d3737",
            fontSize: 12,
          }}
          badgeStyle={{
            borderRadius: 8,
            paddingHorizontal: 8,
            paddingVertical: 2,
            margin: 2,
            borderWidth: 1,
            borderColor: "#E5E5E5",
          }}
        />

        <Text className="text-[10px] text-neutral-400 mt-1">
          * You can select multiple members
        </Text>
      </View>

      {/* SUBMIT */}
      <View className="flex-row justify-end mt-4">
        <Pressable
          onPress={handleCreateTask}
          className="bg-[#A8D5BA] border border-black rounded-lg p-2 w-10 h-10 items-center justify-center shadow-sm"
        >
          <Image source={icons.check} className="w-5 h-5" />
        </Pressable>
      </View>
    </View>
  );
}