import {Modal, View, KeyboardAvoidingView, Platform,
  TouchableWithoutFeedback, Keyboard,
  Pressable} from "react-native";
import TaskForm from "./taskForm";

type CreateTaskModalProps = {
  visible: boolean;
  onClose: () => void;
  projectId: number
};

export default function CreateTaskModal({
  visible,
  onClose,
  projectId
}: CreateTaskModalProps) {
    
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <Pressable onPress={onClose} style={{ flex: 1 }}>
      <View className="flex-1 bg-black/40">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 justify-center items-center px-4"
        >
          {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="bg-white rounded-[30px] p-6 w-full shadow-lg">
              <TaskForm onCancel={onClose} />
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView> */}
        <Pressable onPress={(e) => {e.stopPropagation(); Keyboard.dismiss();}} className="bg-white rounded-[30px] p-6 w-full shadow-lg"> 
          <TaskForm onCancel={onClose} projectId={projectId}/>
        </Pressable>
      </KeyboardAvoidingView>
      </View>
      </Pressable>
    </Modal>
  );
}