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

  // console.log('chat connect ' + projectId)

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
    };

    loadUser();
  }, []);

  // ส่งข้อความ
  const sendMessage = () => {
    if (!message.trim()) return
    // ส่งไป back
    socket.emit("send_message", {
    text: message,
    user: username,
    senderId: socket.id,
    projectId: projectId,
    time: new Date().toLocaleTimeString()
    })

    setMessage("")
    Keyboard.dismiss()
  }


  // รับข้อความจากน้องถุงเท้า
  useEffect(() => {

    const GetMessage = (data: any) => {
      setChat(prev => [...prev, { ...data, isMe: data.senderId === socket.id }])
    }

    console.log(chat)
    // มีข้อความเข้าเรียก getMassage
    socket.on("receive_message", GetMessage)


    return () => {
      socket.off("receive_message", GetMessage)
    }
  }, [])

  useEffect(() => {
    if(!visible || !projectId) return;

    const chatHistory = async () => {
      const res = await fetch(`https://freddy-unseconded-kristan.ngrok-free.dev/chat/history/${projectId}`)
        const data = await res.json()
        setChat(data);
    }

    chatHistory()
  })


  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/40 justify-center items-center px-6" onPress={onClose}>
        <Pressable
          className="w-full h-[65%] bg-white rounded-[40px] p-6 shadow-xl pb-10"
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <Text className="font-kanitMedium text-center text-[16px] mb-6 tracking-widest text-gray-600">
            PROJECT NAME CHAT
          </Text>

          {/* Chat Messages */}
          <ScrollView className="flex-1 mb-4" showsVerticalScrollIndicator={false}>
            {chat.map((msg, index) => (
              <View
                key={index}
                className={`mb-4 ${msg.isMe ? "items-end" : "items-start"}`}
              >
                <Text className="text-gray-400 text-[10px] mb-1 ml-1">
                  {msg.user}
                </Text>

                <View
                  className={`px-4 py-3 rounded-[20px] max-w-[85%] border border-black/5 ${msg.isMe ? "bg-white" : "bg-[#D7EFE0]"
                    }`}
                >
                  <Text className="font-kanitRegular text-black text-[14px]">
                    {msg.text}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Input Box */}
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
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
                <Image source={icons.send} style={{ width: 24, height: 24, tintColor: "white" }} />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}