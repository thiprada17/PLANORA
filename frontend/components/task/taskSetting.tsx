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
  start_date: string;
  deadline: string;
  members: Member[];
};

type TaskSettingProps = {
  visible: boolean;
  onClose: () => void;
  projectId: number;
  task: TaskData | null;
  onSuccess?: () => void;
};

export default function TaskSetting({
  visible,
  onClose,
  projectId,
  task,
  onSuccess,
}: TaskSettingProps) {
  const [pickerType, setPickerType] = useState<"start" | "end" | null>(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string[]>([]);
  const [items, setItems] = useState<
    { label: string; value: string; avatar_url: string }[]
  >([]);
  const [taskForm, setTaskForm] = useState({
    task_name: "",
    start_date: "",
    deadline: "",
  });

  const [tasktName, settaskName] = useState<String | null>(null);


  // sync ข้อมูลเดิมของ task เข้า form ทุกครั้งที่ task เปลี่ยน
  useEffect(() => {
    if (task) {
      setTaskForm({
        task_name: task.task_name,
        start_date: task.start_date,
        deadline: task.deadline,
      });
      setValue(task.members.map((m) => m.user_id));
    }
  }, [task]);

  useEffect(() => {
    if (!projectId) return;
    const loadMembers = async () => {
      try {
        const res = await fetch(
          // `https://freddy-unseconded-kristan.ngrok-free.dev/assign/member/${projectId}`,
          // { headers: { "ngrok-skip-browser-warning": "true" } },
          `http://192.168.100.166:3000/assign/member/${projectId}`,
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
          `http://192.168.100.166:3000/taskname/${task.task_id}`,
        );
        const data = await res.json();

        settaskName(data);
        console.log("test" + data[0].task_name);
      } catch (error) {
        console.log("Load Members:", error);
      }
    };
    taskname();
  }, [projectId, task]);

  const onDateChange = (event: any, selectedDate?: Date) => {
  if (event.type === "dismissed" || !selectedDate) return;

  const type = pickerType;

  setPickerType(null);

  const year = selectedDate.getFullYear();
  const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
  const day = String(selectedDate.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;

  if (type === "start") {
    if (taskForm.deadline && formattedDate > taskForm.deadline) {
      alert("Start date cannot be later than End date");
      return;
    }
    setTaskForm((prev) => ({ ...prev, start_date: formattedDate }));
  } else if (type === "end") {
    if (taskForm.start_date && formattedDate < taskForm.start_date) {
      alert("End date cannot be earlier than Start date");
      return;
    }
    setTaskForm((prev) => ({ ...prev, deadline: formattedDate }));
  }
};

  const handleUpdateTask = async () => {
    try {
      if (!taskForm.start_date || !taskForm.deadline) {
        alert("Please select both dates");
        return;
      }
      const selectedMembers = value.map((id) => {
        const member = items.find((item) => item.value === id);
        return {
          user_id: id,
          username: member?.label,
          avatar_url: member?.avatar_url,
        };
      });

      await fetch(
        // `https://freddy-unseconded-kristan.ngrok-free.dev/update/task/${task?.task_id}`,
        `http://192.168.100.166:3000/task/${task?.task_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: taskForm.task_name,
            start_date: taskForm.start_date,
            deadline: taskForm.deadline,
            projectId,
            members: selectedMembers,
          }),
        },
      );
      alert("Task Updated!");
      onSuccess?.();
      onClose();
    } catch (error) {
      console.log("Update Task Error:", error);
    }
  };

  const handleDeleteTask = async () => {
    try {
      await fetch(
        // `https://freddy-unseconded-kristan.ngrok-free.dev/api/task/${task?.task_id}`,
        `http://192.168.100.166:3000/api/task/${task?.task_id}`,
        { method: "DELETE" },
      );
      alert("Task Deleted!");
      onSuccess?.();
      onClose();
    } catch (error) {
      console.log("Delete Task Error:", error);
    }
  };

  if (!task) return null;

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
                  className="font-KanitMedium text-3xl text-black pb"
                  multiline
                  style={{ minHeight: 60 }}
                />
              </View>

              <View className="h-[1px] bg-[#000000] mb-2" />

              {/* Start date */}
              <View className="mb-4 mt-3">
                <View className="flex-row items-center gap-2 mb-2">
                  <Image source={icons.calendar} className="w-5 h-5" />
                  <Text className="font-KanitBold text-black">Start date</Text>
                </View>

                <Pressable
                  onPress={() => setPickerType("start")}
                  className="border border-neutral-400 rounded-xl px-4 py-3 bg-white"
                >
                  <Text
                    className={`font-KanitRegular ${
                      taskForm.start_date ? "text-black" : "text-neutral-400"
                    }`}
                  >
                    {taskForm.start_date || "DD/MM/YY"}
                  </Text>
                </Pressable>
              </View>

              {/* Deadline */}
              <View className="mb-4 mt-3">
                <View className="flex-row items-center gap-2 mb-2">
                  <Image
                    source={icons.calendar}
                    className="w-5 h-5"
                    resizeMode="contain"
                  />
                  <Text className="font-KanitBold text-black">End date</Text>
                </View>
                <Pressable
                  onPress={() => setPickerType("end")}
                  className="border border-neutral-400 rounded-xl px-4 py-3 bg-white"
                >
                  <Text
                    className={`font-KanitRegular ${taskForm.deadline ? "text-black" : "text-neutral-400"}`}
                  >
                    {taskForm.deadline || "DD/MM/YY"}
                  </Text>
                </Pressable>
                {pickerType && (
                  <DateTimePicker
                    value={
                      pickerType === "start"
                        ? taskForm.start_date
                          ? new Date(taskForm.start_date)
                          : new Date()
                        : taskForm.deadline
                          ? new Date(taskForm.deadline)
                          : new Date()
                    }
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
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
                  <Text className="font-KanitBold text-black">Assign</Text>
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
                <Text className="text-[10px] text-neutral-400 mt-1 font-KanitRegular">
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
