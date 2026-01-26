import { View, Text, Pressable, Image, Modal } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { icons } from "@/constants/icons";
import { useFonts } from "expo-font";

export default function HomePage() {
    const router = useRouter();
    const [openFilter, setOpenFilter] = useState(false);

    const [fonts] = useFonts({
        KanitBold: require("../../assets/fonts/KanitBold.ttf"),
        KanitRegular: require("../../assets/fonts/KanitRegular.ttf"),
    });

    if (!fonts) return null;

    return (
        <View className="flex-1 bg-neutral-100 pt-14 px-5">

            {/*header*/}
            <View className="flex-row justify-between items-center mb-6">

                <View className="flex-row items-center">
                    <View className="w-10 h-10 rounded-full items-center justify-center mr-3">
                        <Image source={icons.profile} className="w-5 h-5" />
                    </View>
                    <Text className="font-kanitBold text-xl text-black">
                        Planora
                    </Text>
                </View>

                <View className="flex-row items-center">
                    <Image source={icons.home_garden} className="w-5 h-5 mr-2" />
                    <Text className="font-kanitRegular text-black">
                        Pony's Homepage
                    </Text>
                </View>
            </View>

            {/*filter*/}
            <View className="flex-row items-center justify-between mb-6">
                <Pressable className="border border-neutral-300 rounded-full px-4 py-2">
                    <Text className="text-sm">Status: All</Text>
                </Pressable>

                <Pressable className="border border-neutral-300 rounded-full px-4 py-2">
                    <Text className="text-sm">Deadline: Any</Text>
                </Pressable>

                <Pressable
                    className="border border-neutral-300 rounded-full p-2"
                    onPress={() => setOpenFilter(true)}
                >
                    <Image source={icons.filter} className="w-5 h-5" />
                </Pressable>
            </View>

            {/*กล่องโปรเจคตรงกลางจ้า*/}
            <View className="flex-1 bg-neutral-200 rounded-3xl p-4 shadow-inner">
                <Pressable
                    onPress={() => router.push("/(home)/create_project")}
                    className="w-[160px] h-[160px] border-2 border-dashed border-neutral-400 rounded-3xl items-center justify-center bg-neutral-100"
                >
                    <Text className="text-4xl text-neutral-400">+</Text>
                </Pressable>
            </View>

            <Modal transparent animationType="slide" visible={openFilter}>
                <Pressable
                    className="flex-1 bg-black/30"
                    onPress={() => setOpenFilter(false)}
                >
                    <View className="absolute bottom-0 w-full bg-white rounded-t-3xl p-6 h-[250px]">
                        <Text className="font-kanitBold text-lg mb-2">
                            Filter
                        </Text>
                        <Text className="text-neutral-500">
                            ยังไม่มีอะไรจ้า
                        </Text>
                    </View>
                </Pressable>
            </Modal>

        </View>
    );
}
