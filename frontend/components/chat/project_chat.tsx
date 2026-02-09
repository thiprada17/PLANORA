import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  Image,
  Pressable,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import io from "socket.io-client";
import { icons } from "@/constants/icons";

/* socket ของท่าน (ไม่แตะ) */
const socket = io("https://freddy-unseconded-kristan.ngrok-free.dev", {
  transports: ["websocket"],
  forceNew: true,
});

type ChatMessage = {
  text: string;
  user: string;
  senderId: string;
  time?: string;
  isMe?: boolean;
};

export default function ProjectChatModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [username, setUsername] = useState("");

  /* load username */
  useEffect(() => {
    const loadUser = async () => {
      const name = await AsyncStorage.getItem("username");
      if (name) setUsername(name);
    };
    loadUser();
  }, []);

  /* receive message */
  useEffect(() => {
    const onReceiveMessage = (data: ChatMessage) => {
      setChat((prev) => [
        ...prev,
        { ...data, isMe: data.senderId === socket.id },
      ]);
    };

    socket.on("receive_message", onReceiveMessage);
    return () => {
      socket.off("receive_message", onReceiveMessage);
    };
  }, []);

  /* send message */
  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("send_message", {
      text: message,
      user: username,
      senderId: socket.id,
      time: new Date().toLocaleTimeString(),
    });

    setMessage("");
  };

return (
  <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
  {/* backdrop */}
  <Pressable className="flex-1 bg-black/40 px-6" onPress={onClose}>
    <View className="flex-1 justify-center items-center">
      <Pressable
        onPress={(e) => e.stopPropagation()}
        className="w-full bg-white rounded-[32px] overflow-hidden"
        style={{ height: 520 }}
      >
        {/* header */}
        <LinearGradient
          colors={["#CAEAD5", "#FFFFFF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{ paddingTop: 20, paddingBottom: 12 }}
        >
          <Text className="font-kanitMedium text-center text-[16px] tracking-widest text-gray-600">
            PROJECT NAME CHAT
          </Text>
        </LinearGradient>

        {/* 👇 ตัวเดียว จบ */}
        <KeyboardAwareScrollView
          enableOnAndroid
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          extraScrollHeight={Platform.OS === "ios" ? 20 : 80}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingTop: 16,
            paddingBottom: 16,
          }}
        >
          {/* message area */}
          {chat.map((msg, index) => (
            <View
              key={`${msg.time}-${index}`}
              style={{
                marginBottom: 16,
                alignItems: msg.isMe ? "flex-end" : "flex-start",
              }}
            >
              <Text style={{ fontSize: 10, color: "#9CA3AF", marginBottom: 4 }}>
                {msg.user}
              </Text>

              <View
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderRadius: 20,
                  maxWidth: "85%",
                  backgroundColor: msg.isMe ? "#FFFFFF" : "#D7EFE0",
                  borderWidth: 1,
                  borderColor: "rgba(0,0,0,0.05)",
                }}
              >
                <Text style={{ fontSize: 14 }}>{msg.text}</Text>
              </View>
            </View>
          ))}

          {/* input area ต้องอยู่ข้างใน */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginTop: "auto",
            }}
          >
            <TextInput
              placeholder="Type a message..."
              value={message}
              onChangeText={setMessage}
              style={{
                flex: 1,
                height: 50,
                backgroundColor: "#D7EFE0",
                borderRadius: 16,
                paddingHorizontal: 16,
                fontSize: 14,
              }}
            />

            <TouchableOpacity
              onPress={sendMessage}
              style={{
                width: 50,
                height: 50,
                borderRadius: 16,
                backgroundColor: "#B4B4FF",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={icons.send}
                style={{ width: 24, height: 24, tintColor: "white" }}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </Pressable>
    </View>
  </Pressable>
</Modal>
);}