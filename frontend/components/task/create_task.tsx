import {Modal, View, KeyboardAvoidingView, Platform,
  TouchableWithoutFeedback, Keyboard} from "react-native";
import TaskForm from "./taskForm";

type CreateTaskModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function CreateTaskModal({
  visible,
  onClose,
}: CreateTaskModalProps) {
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View className="flex-1 bg-black/40">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 justify-center items-center px-4"
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="bg-white rounded-[30px] p-6 w-full shadow-lg">
              <TaskForm onCancel={onClose} />
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}