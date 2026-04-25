import {
  View,
  Text,
  Pressable,
  Animated,
  Dimensions,
  useColorScheme,
  TextInput,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { useFonts } from "expo-font";
import GoogleButton from "../(authen)/googleBtn";
import Auth from "../../components/Auth";
import { router } from "expo-router";
const screenHeight = Dimensions.get("window").height;
import Loading from "../../components/loading";

export default function Index() {
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const loginY = useRef(new Animated.Value(0)).current;
  const [username, setUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const openSignup = () => {
    setUsername("");
    setSignupEmail("");
    setSignupPassword("");
    Animated.timing(loginY, {
      toValue: 360,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setIsSignupOpen(true);
  };

  const openLogin = () => {
    setLoginEmail("");
    setLoginPassword("");
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
    if (!signupEmail || !signupPassword || !username) {
      alert("กรอกข้อมูลให้ครบ");
      return;
    }
    try {
      setIsLoading(true);
      // ตอนนี้มันต้องเปลี่ยน ip ที่จะ fetch ตาามเครื่องน้าา ยุ่งยากมาก
      const res = await fetch(
        "https://planora-4qj8.onrender.com/api/signup",

        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "69420",
          },
          body: JSON.stringify({
            username,
            email: signupEmail,
            password: signupPassword,
          }),
        },
      );
      const data = await res.json();

      if (data.success == true) {
        router.replace("/homepage");
      }
      if (!res.ok) {
        alert(data.message || data.error);
        return;
      }
      alert("Signup success");
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };
  const handleLogin = async () => {
    try {
      setIsLoading(true);

      const res = await fetch(
        "https://planora-4qj8.onrender.com/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: loginEmail,
            password: loginPassword,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      if (data.success) {
        router.replace("/homepage");
      }
    } catch (err) {
      console.log(err);
      alert("Network error");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <View className="flex-1 bg-white">
      <Loading visible={isLoading} />
      <View
        className="items-center justify-center"
        style={{ height: screenHeight * 0.26 }}
      >
        <Text className="font-KanitBold text-[30px]">Plandora</Text>
      </View>

      {/*Card*/}
      <View className="flex-1 items-center">
        <View className="absolute -top-4 h-full w-[90%] rounded-t-[28px] bg-GREEN px-5 pt-4 shadow-sm">
          <Pressable className="py-3" onPress={openSignup}>
            <Text className="font-KanitBold text-xl">Sign Up</Text>
          </Pressable>

          {isSignupOpen && (
            <View className="mt-6">
              <TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                placeholderTextColor="#9CA3AF"
                autoCapitalize="none"
                className="mb-4 rounded-xl border border-gray-300 bg-white px-4 py-3 font-KanitRegular"
              />
              <TextInput
                placeholder="Email"
                value={signupEmail}
                onChangeText={setSignupEmail}
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                className="mb-4 rounded-xl border border-gray-300 bg-white px-4 py-3 font-KanitRegular"
              />
              <TextInput
                placeholder="Password"
                value={signupPassword}
                onChangeText={setSignupPassword}
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                className="mb-4 rounded-xl border border-gray-300 bg-white px-4 py-3 font-KanitRegular"
              />
              <Pressable
                onPress={handleSignup}
                disabled={isLoading}
                className={`rounded-xl py-3 ${isLoading ? "bg-GRAY" : "bg-black"}`}
              >
                <Text className="text-center font-KanitBold text-white">
                  {isLoading ? "Loading...." : "Sign Up"}
                </Text>
              </Pressable>

              <View className="my-4 flex-row items-center">
                <View className="h-px flex-1 bg-gray-300" />
                <Text className="mx-2 font-KanitRegular text-sm text-gray-500">
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
            <Text className="font-KanitBold text-xl">Login</Text>
          </Pressable>

          {!isSignupOpen && (
            <View className="mt-6">
              <TextInput
                value={loginEmail}
                onChangeText={setLoginEmail}
                placeholder="Email"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                className="mb-4 rounded-xl border border-gray-300 bg-white px-4 py-3 font-KanitRegular"
              />

              <TextInput
                value={loginPassword}
                onChangeText={setLoginPassword}
                placeholder="Password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                className="mb-4 rounded-xl border border-gray-300 bg-white px-4 py-3 font-KanitRegular"
              />

              <Pressable
                onPress={handleLogin}
                className="rounded-xl bg-black py-3"
              >
                <Text className="text-center font-KanitBold text-white">
                  Login
                </Text>
              </Pressable>

              {/*ไอเส้นๆ*/}
              <View className="my-4 flex-row items-center">
                <View className="h-px flex-1 bg-gray-300" />
                <Text className="mx-2 font-KanitRegular text-sm text-gray-500">
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
