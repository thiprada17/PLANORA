import { View, Text, TextInput, TouchableOpacity, Pressable, Button } from "react-native";
import { useState } from "react";
import { useFonts } from "expo-font";
import { icons } from "@/constants/icons";
import { Image } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from "react-native-dropdown-picker";
import { Stack } from "expo-router";

export default function CreateProject() {
  const [showPicker, setShowPicker] = useState(false);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "CN321", value: "CN321" },
    { label: "CN334", value: "CN334" },
    { label: "CN311", value: "CN311" },
    { label: "SF222", value: "SF222" },
    { label: "SF231", value: "SF231" },
    { label: "SF251", value: "SF251" },
  ]);


  const [fonts] = useFonts({
    KanitBold: require("../../assets/fonts/KanitBold.ttf"),
    KanitRegular: require("../../assets/fonts/KanitRegular.ttf"),
  });


  const [project, setProject] = useState({
    name: "",
    deadline: "",
    subject: "",
    assign: [],
  });

  const [step, setStep] = useState(1);

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



  const CheckButton = ({ nothaveinput }: { nothaveinput: boolean }) => (
    <Pressable
      className={`bg-GREEN ml-2 px-6 py-3 rounded-lg w-1 items-center justify-center ${nothaveinput ? 'opacity-50' : ''}`}
      onPress={() => {
        if (!nothaveinput && step < 4) {
          setStep(step + 1)
        }
      }}>

      <Image source={icons.check} className="items-center justify-center w-6 h-6" />
    </Pressable>
  )

  const ProjectName = () => (
    <View>
      <Text className="font-kanitRegular color-BLACK mb-2">
        Project Name
      </Text>

      <View className="flex-row">
        <TextInput
          placeholder="JerseyJamTU"
          className="font-kanitRegular border rounded-xl px-4 py-3 color-neutral-700 border-neutral-300 w-[85%]"
          value={project.name}
          onChangeText={(text) =>
            setProject({ ...project, name: text })
          }
        />
        <CheckButton nothaveinput={project.name.trim().length == 0} />
      </View>
    </View>
  )

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      const formattedDate = `${selectedDate.getDate()}/${selectedDate.getMonth() + 1}/${selectedDate.getFullYear().toString().slice(-2)}`;
      setProject({ ...project, deadline: formattedDate });
    }
  };

  const Deadline = () => (
    <View>
      <Text className="font-kanitRegular color-BLACK mb-2">Deadline</Text>

      <View className="flex-row items-center">
        <Pressable
          onPress={() => setShowPicker(true)}
          className="flex-row items-center border rounded-xl px-4 py-3 color-neutral-700 border-neutral-300 w-[85%] bg-white justify-between"
        >
          <Text className={`font-kanitRegular ${project.deadline ? 'text-black' : 'text-neutral-400'}`} >
            {project.deadline || "DD/MM/YY"}
          </Text>

          <Image source={icons.calendar} className="w-5 h-5 opacity-50" />
        </Pressable>
        <CheckButton nothaveinput={!project.deadline} />

      </View>

      {showPicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}
    </View>
  )

  const Subject = () => (
    <View>
      <Text className="font-kanitRegular color-BLACK mb-2">
        Subject
      </Text>

      <View className="flex-row items-center" style={{ zIndex: 1000 }}>
        <View className="w-[85%] ">
          <DropDownPicker
            style={{
              borderColor: "#d4d4d8",
              borderRadius: 12,
              minHeight: 43,

            }}
            dropDownContainerStyle={{
              borderColor: "#d4d4d8",
              borderRadius: 12,
            }}
            textStyle={{
              fontFamily: "KanitRegular",
              color: "#404040",
            }}
            placeholderStyle={{
              color: "#A3A3A3",
              fontFamily: "KanitRegular",
            }}
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            placeholder="SFXXX"
            onChangeValue={(val) => {
              if (val) setProject({ ...project, subject: val });
            }}
            listMode="SCROLLVIEW"
          />

        </View>
        <CheckButton nothaveinput={!project.subject} />
      </View>
    </View>

    
  )

  const Assign = () => (
    <View>
      <Text className="font-kanitRegular color-BLACK mb-2">
        Assign
      </Text>

      <View className="flex-row">
        <TextInput
          placeholder="JerseyJamTU"
          className="font-kanitRegular border rounded-xl px-4 py-3 color-neutral-700 border-neutral-300 w-[85%]"
          value={project.name}
          onChangeText={(text) =>
            setProject({ ...project, name: text })
          }
        />
        <CheckButton nothaveinput={project.name.trim().length == 0} />
      </View>
    </View>
  )

  

  if (!fonts) return null;


  return (
    <View className="flex-1 bg-neutral-100 items-center pt-[150px]">

            <Stack.Screen options={{ headerShown: false }} />
      <Text className="font-kanitBold text-xl color-BLACK mb-7">CREATE PROJECT</Text>
      <View className="w-[90%] min-h-[280px] bg-white border border-neutral-900 rounded-2xl mt-2 px-6 py-6 shadow-sm">

        <View className="flex-row justify-center items-start mt-2 mb-8">


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

        <View className="flex-1 justify-start pt-3">
          {step == 1 && ProjectName()}
          {step == 2 && Deadline()}
          {step == 3 && Subject()}
                   {step == 4 && Assign()}
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
