import { View, Text, TextInput, TouchableOpacity, Pressable, Button, ScrollView } from "react-native";
import { useState } from "react";
import { useFonts } from "expo-font";
import { icons } from "@/constants/icons";
import { Image } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from "react-native-dropdown-picker";
import { Stack } from "expo-router";
import { Animated } from "react-native";
import { useRef, useEffect } from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { SearchBar } from "react-native-screens";

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";

export default function CreateProject() {
  const [showPicker, setShowPicker] = useState(false);
  const router = useRouter();


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
    project_name: "",
    deadline: "",
    subject: "",
    member: [] as { id: number; name: string, email: string }[]
  });

  const [step, setStep] = useState(1);

  const [emailInput, setEmailInput] = useState("");

  const getStepCircleStyle = (currentStep: number, stepNumber: number) => {
    if (currentStep > stepNumber) {
      // ผ่านแล้ว
      return "w-10 h-10 rounded-full bg-GREEN items-center justify-center";
    }

    if (currentStep == stepNumber) {
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



  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      setProject({ ...project, deadline: formattedDate });
    }
};

  const readytocreate = !(project.project_name.trim() == "") && project.deadline !== "" && project.subject !== "" && (project.member.length > 0)

  if (!fonts) return null;


 const handleAddMember = async () => {
  const email = emailInput.trim();
  if (!email) return;

  try {
    const memsearch = await searchMember(email);

    if (!memsearch?.found) {
      alert("user not found");
      return;
    }

    const user_id = memsearch.user_id;

    if (project.member.some(m => m.id === user_id)) {
      setEmailInput("");
      return;
    }

    setProject(prev => ({
      ...prev,
      member: [
        ...prev.member,
        {
          id: memsearch.user_id,
          name: memsearch.username,
          email: memsearch.email
        }
      ]
    }));

    setEmailInput("");

  } catch (err) {
    console.log(err);
  }
};

  const searchMember = async (email: string) => {
    try {
      const res = await fetch('https://freddy-unseconded-kristan.ngrok-free.dev/search/member', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      })

      return await res.json()
    } catch (error) {

    }
  }

const handleSubmit = async () => {
  console.log("yes")
  const userId = await AsyncStorage.getItem('userId');
  try {
    await fetch('https://freddy-unseconded-kristan.ngrok-free.dev/create/post', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(project)
    })

    alert('yayy')
  } catch (error) {
    console.log(error)
  }
}

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="flex-1 bg-neutral-100 items-center pt-[50px]">

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
            {step == 1 && <View>
              <Text className="font-kanitRegular color-BLACK mb-2">
                Project Name
              </Text>

              <View className="flex-row">
                <TextInput
                  placeholder="JerseyJamTU"
                  className="font-kanitRegular border rounded-xl px-4 py-3 color-neutral-700 border-neutral-300 w-[85%]"
                  value={project.project_name}
                  onChangeText={(text) =>
                    setProject({ ...project, project_name: text })
                  }
                />
                <CheckButton nothaveinput={project.project_name.trim().length == 0} />
              </View>
            </View>

            }
            {step == 2 && <View>
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
            </View>}
            {step == 3 && <View>
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
            }
            {step == 4 && <View className="flex-1">

              <Text className="font-kanitRegular color-BLACK mb-2">Add member (Email)</Text>

              <View className="flex-row flex-wrap items-center border rounded-xl p-2 border-neutral-300 bg-white max-h-[60px]">
                <ScrollView
                  contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}
                  showsVerticalScrollIndicator={true}
                >
                  {project.member.map((mail, index) => (
                    <View
                      key={index}
                      className="flex-row items-center bg-[#EBEBEB] px-2 py-1 rounded-md mr-2 my-1"
                    >
                      <Text className="font-kanitRegular text-[12px] mr-1">{mail.name}</Text>
                      <Pressable onPress={() => setProject({
                        ...project,
                        member: project.member.filter((_, i) => i !== index),
                      })}>
                        <Text className="text-red-500 font-bold ml-1">×</Text>
                      </Pressable>
                    </View>
                  ))}

                  <TextInput
                    placeholder={project.member.length === 0 ? "example@mail.com" : ""}
                    className="font-kanitRegular color-neutral-700 flex-1 min-w-[100px]"
                    value={emailInput}
                    onChangeText={setEmailInput}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    onSubmitEditing={handleAddMember}
                    blurOnSubmit={false}
                  />

                </ScrollView>
              </View>


              <Text className="text-[10px] text-neutral-400 mt-1">* Enter to add email</Text>

              <Pressable
                className={`mb-7 px-6 py-3 pt-2 h-[30px] mt-5 rounded-xl items-center ${readytocreate ? "bg-GREEN" : ""}`}
                disabled={!readytocreate}
                onPress={() => {
                  handleSubmit()
                  console.log("Create project:", project);
                }}
              >
                <Text
                  className={`font-kanitBold text-[10px] ${readytocreate ? "text-BLACK" : "text-neutral-500"}`}>
                  {readytocreate ? "CREATE PROJECT" : ""}
                </Text>
              </Pressable>
            </View>


            }
          </View>

          <Pressable
            className="w-5 absolute top-4 left-4"
            onPress={() => step > 1 && setStep(step - 1)}
          >
            <Image source={icons.back} className="w-4 h-4" />
          </Pressable>
        </View>


      </View >
    </TouchableWithoutFeedback>
  );
}