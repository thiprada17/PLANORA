import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  Image,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { icons } from "@/constants/icons";

export default function ProjectChatModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [message, setMessage] = useState("");

  const messages = [
    { id: 1, user: "user 1", text: "hello สวัสดีจ้า", isMe: false },
    {
      id: 2,
      user: "user 2",
      text: "hello สวัสดีจ้า hello สวัสดีจ้า hello สวัสดีจ้า",
      isMe: true,
    },
    {
      id: 3,
      user: "user 3",
      text: "hello สวัสดีจ้า hello สวัสดีจ้า hello สวัสดีจ้า",
      isMe: false,
    },
    { id: 4, user: "user 3", text: "hello สวัสดีจ้า", isMe: false },
  ];

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      {/* backdrop */}
      <Pressable
        className="flex-1 bg-black/40 px-6"
        onPress={onClose}
      >
        {/* bottom sheet container */}
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Pressable
            onPress={(e) => e.stopPropagation()}
            className="w-full bg-white rounded-[32px] shadow-xl overflow-hidden"
            style={{ maxHeight: 520 }}
          >
            {/* Header */}
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

            {/* BODY = ใช้ KeyboardAwareScrollView ตัวเดียว */}
            <KeyboardAwareScrollView
              enableOnAndroid
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              extraScrollHeight={24}
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: "flex-end",
                paddingHorizontal: 24,
                paddingBottom: 16,
              }}
            >
              {/* Messages */}
              {messages.map((msg) => (
                <View
                  key={msg.id}
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
                    <Text style={{ fontSize: 14, color: "#000" }}>
                      {msg.text}
                    </Text>
                  </View>
                </View>
              ))}

              {/* Input */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 8,
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
  );
}
