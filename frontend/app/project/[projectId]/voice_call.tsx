import { View, Text, Pressable, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import React, { memo, useEffect, useRef, useState } from "react";
import { icons } from "@/constants/icons";
import {
  createAgoraRtcEngine,
  ChannelProfileType,
  ClientRoleType,
  IRtcEngine
} from "react-native-agora";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PermissionsAndroid, Platform } from 'react-native';

const appId = "1ba060b3befa4a518e2d5e06a58f8738";

type Member = {
  id: string;
  name: string;
  avatar: string;
};

export const mockMembers: Member[] = [
  {
    id: "1",
    name: "Alice",
    avatar: "https://api.dicebear.com/7.x/adventurer/png?seed=Alice"
  },
  {
    id: "2",
    name: "Bob",
    avatar: "https://api.dicebear.com/7.x/adventurer/png?seed=Bob"
  },
  {
    id: "3",
    name: "Charlie",
    avatar: "https://api.dicebear.com/7.x/adventurer/png?seed=Charlie"
  },
  {
    id: "4",
    name: "Daisy",
    avatar: "https://api.dicebear.com/7.x/adventurer/png?seed=Daisy"
  }
];

export default function RoomPage() {
  const [MyUid, SetMyuid] = useState<number>(Math.floor(Math.random() * 1000))
  const token = '';
  type JoinedUser = {
    uid: number;
    name: string;
    avatar: string;
  };

  const [joinedUsers, setJoinedUsers] = useState<JoinedUser[]>([]);
  const [engine, setEngine] = useState<IRtcEngine | null>(null);
  const [user, setUser] = useState<{
    name: string | null;
    profile: string | null;
  }>({
    name: null,
    profile: null
  });

  const userRef = useRef<{
    name: string | null;
    profile: string | null;
  }>({
    name: null,
    profile: null
  });

  const [isMuted, setIsMuted] = useState(false)

  const toggleMute = () => {
    if (!engine) return;
    engine.muteLocalAudioStream(!isMuted);  // true = mute, false = unmute
    setIsMuted(!isMuted);
  };

  const requestMicPermission = async () => {
    if (Platform.OS === 'android') {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
      )
      if (result !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log("❌ Mic permission denied");
      }

      console.log("PERMISSION:", result);
    }
  }

  const [speakingUids, setSpeakingUids] = useState<Set<number>>(new Set());

  useEffect(() => {
    const loaduser = async () => {
      const username = await AsyncStorage.getItem('username');
      const profile = await AsyncStorage.getItem('profile');

      const loaded = { name: username, profile: profile };
      userRef.current = loaded;
      setUser(loaded);

      console.log("username:", username, "profile:", profile);
    };
    loaduser();
  }, []);

  useEffect(() => {
    const init = async () => {
      await requestMicPermission();

      const eng = createAgoraRtcEngine();
      eng.initialize({ appId });
      eng.enableAudio();
      eng.setChannelProfile(ChannelProfileType.ChannelProfileCommunication);
      eng.setClientRole(ClientRoleType.ClientRoleBroadcaster);

      eng.registerEventHandler({
        onJoinChannelSuccess: () => {
          setJoinedUsers(prev => [...prev, {
            uid: MyUid,
            name: userRef.current.name ?? "Me",
            avatar: userRef.current.profile ?? "https://via.placeholder.com/100"
          }]);
        },
        onUserJoined: (_, uid) => {
          setJoinedUsers(prev =>
            prev.some(u => u.uid === uid) ? prev : [...prev, {
              uid,
              name: "User " + uid,
              avatar: `https://api.dicebear.com/7.x/adventurer/png?seed=${uid}`
            }]
          );
        },
        onUserOffline: (_, uid) => {
          setJoinedUsers(prev => prev.filter(u => u.uid !== uid));
        },
        onAudioVolumeIndication: (connection, speakers) => {
          console.log("RAW speakers:", JSON.stringify(speakers)); // ดูค่าดิบ
          speakers.forEach(s => {
            console.log("UID:", s.uid, "VOL:", s.volume);
          });
          const active = new Set<number>();
          speakers.forEach(s => {
            if (s.volume !== undefined && s.volume > 10) { // threshold = 0 ก่อน
              active.add(s.uid === 0 ? MyUid : s.uid!);
            }
          });
          setSpeakingUids(active);
        },
      });

      setEngine(eng); // set engine หลัง register handler เสร็จ
    };

    init(); // เรียกข้างนอก ไม่ใช่ข้างใน

    return () => { // cleanup อยู่ใน useEffect โดยตรง
      engine?.leaveChannel();
      engine?.release();
    };
  }, [MyUid]);



  const joinRoom = () => {
    console.log("JOIN CLICKED", MyUid, engine);
    console.log("isMuted:", isMuted);

    if (!engine || !MyUid) return;

    engine.joinChannel(token, 'test-room', MyUid, {});
    engine.enableAudioVolumeIndication(200, 3, true);
  }

  const leaveRoom = () => {
    console.log("CANCEL CLICKED", MyUid, engine);
    engine?.leaveChannel();
    setJoinedUsers([]);
  };

  useEffect(() => {
    if (!user.name) return;

    setJoinedUsers(prev => {
      if (!prev.some(u => u.uid === MyUid)) return prev;

      return prev.map(u =>
        u.uid === MyUid
          ? {
            ...u,
            name: user.name!,
            avatar: user.profile || "https://via.placeholder.com/100"
          }
          : u
      );
    });
  }, [user]);

  useEffect(() => {
    console.log("joinedUsers:", joinedUsers);
    console.log("Users:", user);
  }, [joinedUsers]);
  return (
    <SafeAreaView className="flex-1 bg-gray-200 items-center">


      <Text className="text-lg font-bold mt-10 mb-10 font-kanitRegular">
        Project name
      </Text>

      <Pressable
        onPress={joinRoom}
        className="bg-green-500 px-6 py-3 rounded mb-6"
      >
        <Text className="text-white">Join</Text>
      </Pressable>

      <View className="flex-row flex-wrap justify-center w-full px-10 font-kanitRegular">
        {joinedUsers.map((member) =>
          <View key={member.uid} className="w-1/2 items-center mb-10">
            <Image
              source={{ uri: member.avatar }}
              className={`w-24 h-24 rounded-full border-4 bg-gray-300 ${speakingUids.has(member.uid)
                ? 'border-green-400'   // กำลังพูด
                : 'border-gray-400'    // เงียบ
                }`}
            />
            <Text className="mt-2 font-kanitRegular">{member.name}</Text>
          </View>
        )
        }

      </View>

      <View className="flex-row flex-wrap justify-center w-full px-10">
        <View className="w-1/2 items-center mb-10">
          <View className="w-24 h-24 rounded-full border-4 border-green-400 bg-gray-300" />
        </View>

        <View className="w-1/2 items-center mb-10">
          <View className="w-24 h-24 rounded-full border-2 border-gray-400 bg-gray-300" />
        </View>

        <View className="w-1/2 items-center">
          <View className="w-24 h-24 rounded-full border-2 border-gray-400 bg-gray-300" />
        </View>

        <View className="w-1/2 items-center">
          <View className="w-24 h-24 rounded-full border-2 border-gray-400 bg-gray-300" />
        </View>

      </View>

      <View className="absolute bottom-16 flex-row items-center gap-3">
        <Pressable
          onPress={toggleMute}
          className={`${isMuted ? 'bg-red-300' : 'bg-[#D9D9D9]'} w-24 h-14 rounded-full items-center justify-center`}>
          <Image source={icons.mic} className='h-7 w-7' />
        </Pressable>

        <Pressable
          onPress={leaveRoom}
          className="bg-red-500 w-14 h-14 rounded-full items-center justify-center">
          <Image source={icons.phone_cancel} className='h-7 w-7' />
        </Pressable>

      </View>

    </SafeAreaView>
  );
}