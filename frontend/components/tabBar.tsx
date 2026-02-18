import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    Animated,
    Pressable,
    Dimensions,
    Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "@/constants/icons";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from "expo-router";


const { width } = Dimensions.get("window");
const TABBAR_WIDTH = width * 0.8;

const Icon = ({
    name,
    size = 20,
}: {
    name: keyof typeof icons;
    size?: number;
}) => (
    <Image
        source={icons[name]}
        style={{ width: size, height: size }}
        resizeMode="contain"
    />
);

type TabBarProps = {
    visible: boolean;
    onClose: () => void;
    projectId: number
};

export default function TabBar({ visible, onClose , projectId}: TabBarProps) {
    const router = useRouter();
    const [user, setUser] = useState<{
        name: string | null;
        email: string | null;
        profile: string | null;
    }>({
        name: null,
        email: null,
        profile: null,
    });
    useEffect(() => {
        const loadUser = async () => {
            const username = await AsyncStorage.getItem("username");
            const email = await AsyncStorage.getItem("email");
            const profile = await AsyncStorage.getItem("profile");

            setUser({
                name: username,
                email,
                profile,
            });
        };

        loadUser();
    }, []);

    const translateX = useRef(new Animated.Value(-TABBAR_WIDTH)).current;
    const [shouldRender, setShouldRender] = useState(visible);

    useEffect(() => {
        if (visible) {
            setShouldRender(true);
        }

        Animated.timing(translateX, {
            toValue: visible ? 0 : -TABBAR_WIDTH,
            duration: 280,
            useNativeDriver: true,
        }).start(() => {
            if (!visible) {
                setShouldRender(false);
            }
        });
    }, [visible]);
    if (!shouldRender) return null;

    return (
        <View className="absolute inset-0 z-50">
            <Pressable
                className="absolute inset-0 bg-GRAY/80"
                onPress={onClose}
            />
            {/* tab bar */}
            <Animated.View
                style={{
                    transform: [{ translateX }],
                    width: TABBAR_WIDTH,
                }}
                className="h-full bg-white rounded-r-3xl shadow-xl">
                <SafeAreaView className="flex-1 px-8">
                    <View className="flex-1 ">
                        <View className="flex-row items-center justify-between mb-8 pt-10">
                            <Text className="text-[32px] font-kanitBold">
                                Planora
                            </Text>
                            <Pressable onPress={onClose}>
                                <Icon name="menu" size={22} />
                            </Pressable>
                        </View>
                        {/* Menu */}
                        <View className="space-y-6">
                            <Pressable className="flex-row items-center space-x-3 mb-3" 
                            onPress={() => {
                                onClose();
                                router.push("/(home)/homepage");
                            }}>
                                <Icon name="home_garden" size={23} />
                                <Text className="text-[18px] font-kanitMedium ml-2">
                                    {user.name ?? "Guest"}'s Homepage
                                </Text>
                            </Pressable>
                            {/* Project */}
                            <View>
                                <View className="flex-row items-center space-x-3 mb-1">
                                    <Icon name="folder" size={23} />
                                    <Text className="text-[18px] font-kanitMedium ml-2">
                                        Project
                                    </Text>
                                </View>
                                <View className="ml-0 mt-1.5">
                                    <TreeItem icon="dashboard" label="Dashboard" 
                                    onPress={() => {
                                onClose();

                                
                                router.push(`/project/${projectId}/dashBoard`);
                            }} />
                                    <TreeItem icon="board" label="Board" onPress={() => {
                                onClose();
                                router.push(`/project/${projectId}/board`);
                            }}/>
                                    <TreeItem icon="chat" label="Chat" onPress={() => {
                                onClose();
                           router.push(`/project/${projectId}/board`);
                            }} />
                                    <TreeItem icon="settings" label="Setting" isLast onPress={() => {
                                onClose();
                               router.push(`/project/${projectId}/setting`);
                            }} />
                                </View>
                            </View>
                        </View>
                    </View>
                    <View className="border-t border-gray-200 pt-4 pb-6">
                        <View className="flex-row items-center">
                            <Image
                                source={user.profile ? { uri: user.profile } : icons.profile}
                                className={
                                    user.profile
                                        ? "w-10 h-10 rounded-full mr-3"
                                        : "w-6 h-6 mr-3"
                                }
                            />
                            <View className="flex-1">
                                <Text className="font-kanitMedium text-sm text-black">
                                    {user.name ?? "Guest"}
                                </Text>
                                <Text className="font-kanitRegular text-xs text-neutral-500">
                                    {user.email ?? ""}
                                </Text>
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            </Animated.View>
        </View>
    );
}

function TreeItem({
  icon,
  label,
  isLast = false,
  onPress,
}: {
  icon: keyof typeof icons;
  label: string;
  isLast?: boolean;
  onPress?: () => void;
}) {
    return (
        <View className="flex-row h-10">
            <View className="relative w-6 items-center">
                <View className="absolute top-0 w-[2px] h-1/2 bg-GRAY" />
                {/* อันล่างสุด */}
                {!isLast && (
                    <View className="absolute bottom-0 w-[2px] h-1/2 bg-GRAY" />
                )}
                <View className="absolute top-1/2 w-4 h-[2px] bg-GRAY left-1/2" />
            </View>
            <Pressable className="flex-row items-center space-x-3 ml-2" onPress={onPress}>
                <Icon name={icon} size={20} />
                <Text className="text-[17px] font-kanitMedium pl-2">
                    {label}
                </Text>
            </Pressable>
        </View>
    );
}
