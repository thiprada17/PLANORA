import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { useEffect, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { icons } from "@/constants/icons";
import { useFonts } from "expo-font";
import DropDownPicker from "react-native-dropdown-picker";

type Member = {
  user_id: string;
  username: string;
  avatar_url: string;
};

type TaskData = {
  task_id: number;
  task_name: string;
  deadline: string;
  members: Member[];
};

type TaskSettingProps = {
  visible: boolean;
  onClose: () => void;
  projectId: number;
  task: TaskData | null;
};

export default function TaskSetting({
  visible,
  onClose,
  projectId,
  task,
}: TaskSettingProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string[]>([]);
  const [items, setItems] = useState<
    { label: string; value: string; avatar_url: string }[]
  >([]);
  const [taskForm, setTaskForm] = useState({ task_name: "", deadline: "" });

  const [fonts] = useFonts({
    KanitBold: require("@/assets/fonts/KanitBold.ttf"),
    KanitRegular: require("@/assets/fonts/KanitRegular.ttf"),
  });
  const [tasktName, settaskName] = useState<String | null>(null);

  // sync ข้อมูลเดิมของ task เข้า form ทุกครั้งที่ task เปลี่ยน
  useEffect(() => {
    if (task) {
      setTaskForm({ task_name: task.task_name, deadline: task.deadline });
      setValue(task.members.map((m) => m.user_id));
    }
  }, [task]);

  useEffect(() => {
    if (!projectId) return;
    const loadMembers = async () => {
      try {
        const res = await fetch(
          `https://freddy-unseconded-kristan.ngrok-free.dev/assign/member/${projectId}`,
          { headers: { "ngrok-skip-browser-warning": "true" } },
        );
        const data = await res.json();
        setItems(
          data.map((m: any) => ({
            label: m.username,
            value: m.user_id.toString(),
            avatar_url: m.avatar_url,
          })),
        );
      } catch (error) {
        console.log("Load Members Error:", error);
      }
    };
    loadMembers();

    if (!task?.task_id) return;
    console.log(task?.task_id);
    const taskname = async () => {
      try {
        const res = await fetch(
          `http://172.25.46.112:3000/taskname/${task?.task_id}`,
          { headers: { "ngrok-skip-browser-warning": "true" } },
        );
        const data = await res.json();

        settaskName(data);
        console.log("test" + data[0].task_name);
      } catch (error) {
        console.log("Load Members:", error);
      }
    };
    taskname();
  }, [projectId]);

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      setTaskForm({
        ...taskForm,
        deadline: selectedDate.toISOString().split("T")[0],
      });
    }
  };

  const handleUpdateTask = async () => {
    try {
      const selectedMembers = value.map((id) => {
        const member = items.find((item) => item.value === id);
        return {
          user_id: id,
          username: member?.label,
          avatar_url: member?.avatar_url,
        };
      });

      await fetch(
        `https://freddy-unseconded-kristan.ngrok-free.dev/update/task/${task?.task_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: taskForm.task_name,
            deadline: taskForm.deadline,
            projectId,
            members: selectedMembers,
          }),
        },
      );
      alert("Task Updated!");
      onClose();
    } catch (error) {
      console.log("Update Task Error:", error);
    }
  };

  const handleDeleteTask = async () => {
    try {
      await fetch(
        `https://freddy-unseconded-kristan.ngrok-free.dev/api/task/${task?.task_id}`,
        { method: "DELETE" },
      );
      alert("Task Deleted!");
      onClose();
    } catch (error) {
      console.log("Delete Task Error:", error);
    }
  };

  if (!fonts || !task) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <Pressable onPress={onClose} style={{ flex: 1 }}>
        <View className="flex-1 bg-black/40">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 justify-center items-center px-4"
          >
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                Keyboard.dismiss();
              }}
              className="bg-white rounded-[30px] p-6 pl-10 pr-10 pt-5 w-full shadow-lg"
            >
              {/* Task Name */}
              <View className="mb">
                <TextInput
                  value={taskForm.task_name}
                  onChangeText={(text) =>
                    setTaskForm({ ...taskForm, task_name: text })
                  }
                  className="font-kanitMedium text-3xl text-black pb"
                  multiline
                  style={{ minHeight: 60 }}
                />
              </View>

              <View className="h-[1px] bg-[#000000] mb-2" />

              {/* Deadline */}
              <View className="mb-4 mt-3">
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
                    className={`font-kanitRegular ${taskForm.deadline ? "text-black" : "text-neutral-400"}`}
                  >
                    {taskForm.deadline || "DD/MM/YY"}
                  </Text>
                </Pressable>
                {showPicker && (
                  <DateTimePicker
                    value={
                      taskForm.deadline
                        ? new Date(taskForm.deadline)
                        : new Date()
                    }
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                  />
                )}
              </View>

              {/* Assign */}
              <View style={{ zIndex: 5000 }} className="mb-4">
                <View className="flex-row items-center gap-2 mb-2">
                  <Image
                    source={icons.person_add}
                    className="w-5 h-5"
                    resizeMode="contain"
                  />
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
                  labelStyle={{ fontFamily: "KanitRegular", color: "#404040" }}
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
                  badgeDotStyle={{
                    width: 0,
                    height: 0,
                    display: "none",
                  }}
                />
                <Text className="text-[10px] text-neutral-400 mt-1">
                  * You can select multiple members
                </Text>
              </View>

              {/* Buttons */}
              <View className="flex-row justify-between mt mb-4">
                <Pressable
                  onPress={handleDeleteTask}
                  className="bg-[#F07166] border border-black rounded-lg p-2 w-10 h-10 items-center justify-center shadow-sm"
                >
                  <Image
                    source={icons.delete}
                    className="w-5 h-5"
                    resizeMode="contain"
                  />
                </Pressable>
                <Pressable
                  onPress={handleUpdateTask}
                  className="bg-[#A8D5BA] border border-black rounded-lg p-2 w-10 h-10 items-center justify-center shadow-sm"
                >
                  <Image
                    source={icons.check}
                    className="w-5 h-5"
                    resizeMode="contain"
                  />
                </Pressable>
              </View>
            </Pressable>
          </KeyboardAvoidingView>
        </View>
      </Pressable>
    </Modal>
  );
}
