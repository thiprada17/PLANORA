import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { useFonts } from "expo-font";

export default function CreateProject() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");

    const [fonts] = useFonts({
    KanitBold: require("../../assets/fonts/KanitBold.ttf"),
  });

  const steps = [
    { icon: "folder" },
    { icon: "clipboard" },
    { icon: "trello" },
    { icon: "user-plus" },
  ];

  return (
    <View className="flex-1 bg-neutral-100 items-center pt-20">
      <Text className="font-kanitBold text-2xl color-BLACK">Create Project</Text>

    </View>
  );
}
