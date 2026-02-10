import React, { lazy, useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Keyboard
} from "react-native";
import { useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { icons } from "@/constants/icons";
import io, { Socket } from "socket.io-client"
import AsyncStorage from "@react-native-async-storage/async-storage";

// ต่อ back
const socket = io("https://freddy-unseconded-kristan.ngrok-free.dev", {
  transports: ["websocket"],
  forceNew: true,
})

export default function ProjectChatModal({
  visible,
  onClose,
  projectId,
}: {
  visible: boolean;
  onClose: () => void;
  projectId: number;
}) {
  const [message, setMessage] = useState("")
  const [chat, setChat] = useState<any[]>([])
  const [username, setUsername] = useState<string>("")
  const [userId, setUserId] = useState<string | null>(null);

  // console.log('chat connect ' + projectId)
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (!projectId) return

    socket.emit("join_project", projectId)

    return () => {
      socket.off("receive_message")
    }
  }, [projectId])

  useEffect(() => {
    const loadUser = async () => {
      const name = await AsyncStorage.getItem("username");
      if (name) setUsername(name);
      const user_id = await AsyncStorage.getItem("user_id");
      if (user_id) setUserId(user_id);

    };

    loadUser();
  }, []);

  // ส่งข้อความ
  const sendMessage = () => {
    if (!message.trim()) return
    // ส่งไป back
    socket.emit("send_message", {
      text: message,
      name: username,
      senderId: socket.id,
      projectId: projectId,
      user_id: userId,
      time: new Date().toLocaleTimeString()
    })

    setMessage("")
    Keyboard.dismiss()
  }


  // รับข้อความจากน้องถุงเท้า
  useEffect(() => {

    const GetMessage = (data: any) => {
      setChat(prev => [...prev, { ...data, isMe: data.user_id === userId }])
    }

    // มีข้อความเข้าเรียก getMassage
    socket.on("receive_message", GetMessage)


    return () => {
      socket.off("receive_message", GetMessage)
    }
  }, [userId])



  useEffect(() => {
    if (!visible || !projectId) return;

    const chatHistory = async () => {
      const res = await fetch(`https://freddy-unseconded-kristan.ngrok-free.dev/chat/history/${projectId}`)
      const data = await res.json()

      setChat(data.map((msg: any) => ({
        ...msg,
        isMe: msg.user_id === userId
      })));
    }
    chatHistory()
  }, [visible, projectId, userId])

  return (
    (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/40 justify-center items-center px-6" onPress={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="w-full h-[65%]"
        >
          <Pressable className="flex-1 bg-white rounded-[40px] shadow-xl overflow-hidden">
            <View className="overflow-hidden rounded-t-[40px]">
              <LinearGradient
                colors={[
                  "#E6F5ED",
                  "rgba(230,245,237,0.6)",
                  "rgba(255,255,255,0)",
                ]}
                locations={[0, 0.6, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{ paddingTop: 32, paddingBottom: 40 }}
              >
                <Text className="font-kanitMedium text-center text-[16px] tracking-widest text-gray-700">
                  PROJECT NAME CHAT
                </Text>
              </LinearGradient>
            </View>

            <ScrollView
              ref={scrollRef}
              className="flex-1 px-4"
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              onContentSizeChange={() =>
                scrollRef.current?.scrollToEnd({ animated: true })
              }
            >
              {chat.map((msg, index) => (
                <View
                  key={index}
                  className={`mb-4 ${msg.isMe ? "items-end" : "items-start"}`}
                >
                  <Text className="text-gray-400 text-[10px] mb-1 ml-1">
                    {msg.name}
                  </Text>
                  <View
                    className={`px-4 py-3 rounded-[20px] max-w-[85%] border border-black/5 ${
                      msg.isMe ? "bg-white" : "bg-[#D7EFE0]"
                    }`}
                  >
                    <Text className="font-kanitRegular text-black text-[14px]">
                      {msg.text}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            <View className="p-6 pb-8 bg-white">
              <View className="flex-row items-center gap-2">
                <TextInput
                  className="flex-1 bg-[#D7EFE0] rounded-2xl px-4 py-3 font-kanitRegular h-[50px]"
                  placeholder="Type a message..."
                  value={message}
                  onChangeText={setMessage}
                  onSubmitEditing={sendMessage}
                  returnKeyType="send"
                />
                <TouchableOpacity
                  onPress={sendMessage}
                  className="bg-[#B4B4FF] w-[50px] h-[50px] rounded-2xl justify-center items-center"
                >
                  <Image
                    source={icons.send}
                    style={{ width: 24, height: 24, tintColor: "white" }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  ))
}