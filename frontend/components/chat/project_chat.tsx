import React, { useState } from "react";
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
  Pressable
} from "react-native";
import { icons } from "@/constants/icons";

export default function ProjectChatModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [message, setMessage] = useState("");

  const messages = [
    { id: 1, user: "user 1", text: "hello สวัสดีจ้า", isMe: false },
    { 
      id: 2, 
      user: "user 2", 
      text: "hello สวัสดีจ้า hello สวัสดีจ้า hello สวัสดีจ้า hello สวัสดีจ้า hello สวัสดีจ้า hello สวัสดีจ้า hello สวัสดีจ้า hello สวัสดีจ้า", 
      isMe: true 
    },
    { 
      id: 3, 
      user: "user 3", 
      text: "hello สวัสดีจ้า hello สวัสดีจ้า hello สวัสดีจ้า hello สวัสดีจ้า hello สวัสดีจ้า hello สวัสดีจ้า", 
      isMe: false 
    },
    { id: 4, user: "user 3", text: "hello สวัสดีจ้า hello สวัสดีจ้า", isMe: false },
  ];

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/40 justify-center items-center px-6" onPress={onClose}>
        <Pressable 
          className="w-full h-[65%] bg-white rounded-[40px] p-6 shadow-xl" 
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <Text className="font-kanitMedium text-center text-[16px] mb-6 tracking-widest text-gray-600">
            PROJECT NAME CHAT
          </Text>

          {/* Chat Messages */}
          <ScrollView className="flex-1 mb-4" showsVerticalScrollIndicator={false}>
            {messages.map((msg) => (
              <View key={msg.id} className={`mb-4 ${msg.isMe ? "items-end" : "items-start"}`}>
                <Text className="text-gray-400 text-[10px] mb-1 ml-1">{msg.user}</Text>
                <View
                  className={`px-4 py-3 rounded-[20px] max-w-[85%] border border-black/5 ${
                    msg.isMe ? "bg-white" : "bg-[#D7EFE0]"
                  }`}
                >
                  <Text className="font-kanitRegular text-black text-[14px]">{msg.text}</Text>
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
              />
              <TouchableOpacity className="bg-[#B4B4FF] w-[50px] h-[50px] rounded-2xl justify-center items-center">
                <Image source={icons.send} style={{ width: 24, height: 24, tintColor: 'white' }} />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}