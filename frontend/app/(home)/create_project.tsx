import { View, Text, TextInput, TouchableOpacity, Pressable } from "react-native";
import { useState } from "react";
import { useFonts } from "expo-font";
import { icons } from "@/constants/icons";
import { Image } from "react-native";

export default function CreateProject() {
const [fontsLoaded] = useFonts({
    KanitBold: require("../../assets/fonts/KanitBold.ttf"),
    KanitRegular: require("../../assets/fonts/KanitRegular.ttf"),
    KanitMed: require("../../assets/fonts/KanitMediumItalic.ttf"),
  });

  const [project, setProject] = useState({
    name: "",
    deadline: "",
    subject: "",
    assign: [],
  });

  const [step, setStep] = useState(1);

  if (!fontsLoaded) return null;
  const getStepCircleStyle = (currentStep: number, stepNumber: number) => {
    if (currentStep > stepNumber) {
      // ผ่านแล้ว
      return "w-10 h-10 rounded-full bg-GREEN items-center justify-center";
    }

    if (currentStep === stepNumber) {
      // step ปัจจุบัน
      return "w-10 h-10 rounded-full border-2 border-GREEN items-center justify-center";
    }

    // ยังไม่ถึง
    return "w-10 h-10 rounded-full border-2 border-neutral-300 items-center justify-center";
  };

  const getLineStyle = (currentStep: number, stepNumber: number) => {
    return currentStep > stepNumber
      //ผ่านเส้นนี้แล้ว
      ? "w-10 h-0.5 bg-GREEN ml-[7px] mr-[7px]"

      //ยังมะผ่าน
      : "w-10 h-0.5 bg-neutral-300 ml-[7px] mr-[7px]";
  };

  const CheckButton = () => (
    <Pressable
      className="bg-GREEN ml-2 px-6 py-3 rounded-lg w-1 items-center justify-center"
      onPress={() => step < 4 && setStep(step + 1)}>

      <Image source={icons.check} className="items-center justify-center w-6 h-6" />
    </Pressable>
  )

  const ProjectName = () => (
    <View>
      <Text className="font-kanitMed color-BLACK mb-2">
        Project Name
      </Text>

      <View className="flex-row">
        <TextInput
          placeholder="JerseyJamTU"
          className="border rounded-xl px-4 py-3 border-neutral-300 w-[85%]"
          value={project.name}
          onChangeText = {(text) =>
            setProject({ ...project, name: text})
          }
        />
        <CheckButton />
      </View>
    </View>
  );



  return (
    <View className="flex-1 bg-neutral-100 items-center pt-[8rem]">
      <Text className="font-kanitBold text-xl color-BLACK mb-7">CREATE PROJECT</Text>
      <View className="w-[90%] min-h-[280px] bg-white border border-neutral-300 rounded-2xl mt-6 px-6 py-6">

        <View className="flex-row justify-center items-start mt-4">


          <View className="flex-row items-center">
            <View className={getStepCircleStyle(step, 1)}>
              <Image source={icons.folder} className="w-5 h-5" />
            </View>
            <View className={getLineStyle(step, 1)} />
          </View>

          <View className="flex-row items-center">
            <View className={getStepCircleStyle(step, 2)}>
              <Image source={icons.deadline} className="w-5 h-5" />
            </View>
            <View className={getLineStyle(step, 2)} />
          </View>

          <View className="flex-row items-center">
            <View className={getStepCircleStyle(step, 3)}>
              <Image source={icons.topic} className="w-5 h-5" />
            </View>
            <View className={getLineStyle(step, 3)} />
          </View>

          <View className={getStepCircleStyle(step, 4)}>
            <Image source={icons.person_add} className="w-5 h-5" />
          </View>

        </View>

        <View className="flex-1 justify-center">
          {step === 1 && <ProjectName />}
        </View>


        {/* BUTTONS */}
        <Pressable
          className="w-5 absolute top-4 left-4"
          onPress={() => step > 1 && setStep(step - 1)}
        >
          <Image source={icons.back} className="w-4 h-4" />
        </Pressable>
      </View>


    </View >

  );
}
