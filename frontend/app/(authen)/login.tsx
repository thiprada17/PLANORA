import {
    View,
    Text,
    Pressable,
    Animated,
    Dimensions,
    useColorScheme,
    TextInput
} from 'react-native';
import { useRef, useState } from 'react';
import { useFonts } from 'expo-font';
import GoogleButton from '../(authen)/googleBtn';

const screenHeight = Dimensions.get('window').height;

export default function Index() {
    const [isSignupOpen, setIsSignupOpen] = useState(false);
    const loginY = useRef(new Animated.Value(0)).current;
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const openSignup = () => {
        Animated.timing(loginY, {
            toValue: 360,
            duration: 300,
            useNativeDriver: true,
        }).start();
        setIsSignupOpen(true);
    };

    const openLogin = () => {
        Animated.timing(loginY, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
        setIsSignupOpen(false);
    };
    const [fonts] = useFonts({
        KanitBold: require("../../assets/fonts/KanitBold.ttf"),
        KanitRegular: require("../../assets/fonts/KanitRegular.ttf"),
    });

    if (!fonts) return null;

    return (
        <View className="flex-1 bg-white">
            <View
                className="items-center justify-center"
                style={{ height: screenHeight * 0.15 }}
            >
                <Text className="font-kanitBold text-[30px]">
                    Plandora
                </Text>


            </View>

            {/*Card*/}
            <View className="flex-1 items-center">
                <View className="absolute -top-4 h-full w-[90%] rounded-t-[28px] bg-GREEN px-5 pt-4 shadow-sm">
                    <Pressable className="py-3" onPress={openSignup}>
                        <Text className="font-kanitBold text-xl">
                            Sign Up
                        </Text>
                    </Pressable>

                    {isSignupOpen && (
                        <View className="mt-6">
                            <TextInput
                                placeholder="Username"
                                placeholderTextColor="#9CA3AF"
                                autoCapitalize="none"
                                className="mb-4 rounded-xl border border-gray-300 bg-white px-4 py-3 font-kanitRegular"
                            />
                            <TextInput
                                placeholder="Email"
                                placeholderTextColor="#9CA3AF"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                className="mb-4 rounded-xl border border-gray-300 bg-white px-4 py-3 font-kanitRegular"
                            />
                            <TextInput
                                placeholder="Password"
                                placeholderTextColor="#9CA3AF"
                                secureTextEntry
                                className="mb-4 rounded-xl border border-gray-300 bg-white px-4 py-3 font-kanitRegular"
                            />
                            <Pressable className="rounded-xl bg-black py-3">
                                <Text className="text-center font-kanitBold text-white">
                                    Sign Up
                                </Text>
                            </Pressable>

                            <View className="my-4 flex-row items-center">
                                <View className="h-px flex-1 bg-gray-300" />
                                <Text className="mx-2 font-kanitRegular text-sm text-gray-500">
                                    or
                                </Text>
                                <View className="h-px flex-1 bg-gray-300" />
                            </View>
                            <GoogleButton onPress={() => console.log('Google signup')} />
                        </View>
                    )}
                </View>

                {/*login*/}
                <Animated.View
                    className="absolute top-14 h-full w-[90%] rounded-t-[28px] border border-neutral-900 shadow-sm bg-GRAY px-5 pt-4 shadow-lg"
                    style={{ transform: [{ translateY: loginY }] }}
                >
                    <Pressable className="py-3" onPress={openLogin}>
                        <Text className="font-kanitBold text-xl">
                            Login
                        </Text>
                    </Pressable>

                    {!isSignupOpen && (
                        <View className="mt-6">
                            <TextInput
                                placeholder="Email"
                                placeholderTextColor="#9CA3AF"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                className="mb-4 rounded-xl border border-gray-300 bg-white px-4 py-3 font-kanitRegular"
                            />

                            <TextInput
                                placeholder="Password"
                                placeholderTextColor="#9CA3AF"
                                secureTextEntry
                                className="mb-4 rounded-xl border border-gray-300 bg-white px-4 py-3 font-kanitRegular"
                            />

                            <Pressable className="rounded-xl bg-black py-3">
                                <Text className="text-center font-kanitBold text-white">
                                    Login
                                </Text>
                            </Pressable>

                            {/*ไอเส้นๆ*/}
                            <View className="my-4 flex-row items-center">
                                <View className="h-px flex-1 bg-gray-300" />
                                <Text className="mx-2 font-kanitRegular text-sm text-gray-500">
                                    or
                                </Text>
                                <View className="h-px flex-1 bg-gray-300" />
                            </View>
                            <GoogleButton onPress={() => console.log('Google login')} />
                        </View>
                    )}
                </Animated.View>

            </View>
        </View>
    );
}
