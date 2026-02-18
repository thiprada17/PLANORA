import {
    View,
    Text,
    Pressable,
    Animated,
    Dimensions,
    useColorScheme,
    TextInput,
    Image
} from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { useFonts } from 'expo-font';
import GoogleButton from '../(authen)/googleBtn';
import Auth from "../../components/Auth"
import { router } from 'expo-router';
const screenHeight = Dimensions.get('window').height;
import Loading from '../../components/loading';
import { icons } from "@/constants/icons";

export default function Index() {
    const [isSignupOpen, setIsSignupOpen] = useState(false);
    const loginY = useRef(new Animated.Value(0)).current;
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

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


    useEffect(() => {
        const timer = setTimeout(() => {
            setPageLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    if (!fonts || pageLoading) {
        return <Loading visible={true} />;
    }

    //signup dtb
    const handleSignup = async () => {
        try {
            setIsLoading(true);
            // ตอนนี้มันต้องเปลี่ยน ip ที่จะ fetch ตาามเครื่องน้าา ยุ่งยากมาก
            const res = await fetch('https://freddy-unseconded-kristan.ngrok-free.dev/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': '69420'
                },
                body: JSON.stringify({
                    username,
                    email,
                    password
                })
            })
            const data = await res.json()

            if (data.success == true) {
                router.replace('/(home)/homepage')
            }
            if (!res.ok) {
                alert(data.message || data.error)
                return
            }
            alert('Signup success')
        } catch (err) {
            console.log(err)
        } finally {
            setIsLoading(false);
        }
    }
    return (

        <View className="flex-1 bg-white">
            <Loading visible={isLoading} />
            <View
                className="items-center justify-center"
                style={{ height: screenHeight * 0.26 }}
            >

                <Image source={icons.logo} className='w-[80%] h-10'/>
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
                                value={username}
                                onChangeText={setUsername}
                                placeholderTextColor="#9CA3AF"
                                autoCapitalize="none"
                                className="mb-4 rounded-xl border border-gray-300 bg-white px-4 py-3 font-kanitRegular"
                            />
                            <TextInput
                                placeholder="Email"
                                value={email}
                                onChangeText={setEmail}
                                placeholderTextColor="#9CA3AF"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                className="mb-4 rounded-xl border border-gray-300 bg-white px-4 py-3 font-kanitRegular"
                            />
                            <TextInput
                                placeholder="Password"
                                value={password}
                                onChangeText={setPassword}
                                placeholderTextColor="#9CA3AF"
                                secureTextEntry
                                className="mb-4 rounded-xl border border-gray-300 bg-white px-4 py-3 font-kanitRegular"
                            />
                            <Pressable onPress={handleSignup} disabled={isLoading} className={`rounded-xl py-3 ${isLoading ? 'bg-GRAY' : 'bg-black'}`}>
                                <Text className="text-center font-kanitBold text-white">
                                    {isLoading ? 'Loading....' : 'Sign Up'}
                                </Text>
                            </Pressable>


                            <View className="my-4 flex-row items-center">
                                <View className="h-px flex-1 bg-gray-300" />
                                <Text className="mx-2 font-kanitRegular text-sm text-gray-500">
                                    or
                                </Text>
                                <View className="h-px flex-1 bg-gray-300" />
                            </View>
                            <GoogleButton />
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
                                value={loginEmail}
                                onChangeText={setLoginEmail}
                                placeholderTextColor="#9CA3AF"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                className="mb-4 rounded-xl border border-gray-300 bg-white px-4 py-3 font-kanitRegular"
                            />

                            <TextInput
                                placeholder="Password"
                                value={loginPassword}
                                onChangeText={setLoginPassword}
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
                            <GoogleButton />
                        </View>
                    )}
                </Animated.View>

            </View>
        </View>
    );
}
