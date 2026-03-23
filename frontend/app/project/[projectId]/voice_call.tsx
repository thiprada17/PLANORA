import { View, Text, Pressable, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useRef, useState } from "react";
import { icons } from "@/constants/icons";
import {
  createAgoraRtcEngine,
  ChannelProfileType,
  ClientRoleType,
  IRtcEngine
} from "react-native-agora";

import { getEngine, deleteEngine } from "@/utils/agoraEngine";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PermissionsAndroid, Platform } from 'react-native';
import { useLocalSearchParams } from "expo-router";
import TabBar from "@/components/tabBar";

const appId = "1ba060b3befa4a518e2d5e06a58f8738";
const MY_UID = Math.floor(Math.random() * 9000) + 1000; // สุ่มครั้งเดียว ไม่ใช่ใน component

type JoinedUser = {
  uid: number;
  name: string;
  avatar: string;
};

export default function RoomPage() {
  // ใช้ ref สำหรับ engine เพื่อให้ cleanup เข้าถึงได้เสมอ
  const { projectId } = useLocalSearchParams<{ projectId: string }>();
  const [openTab, setOpenTab] = useState(false);
  const engineRef = useRef<IRtcEngine | null>(null);
  const userRef = useRef<{ name: string | null; profile: string | null; projectId: string }>({
    name: null,
    profile: null,
    projectId: projectId
  });

  const [joinedUsers, setJoinedUsers] = useState<JoinedUser[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [speakingUids, setSpeakingUids] = useState<Set<number>>(new Set());
  const [user, setUser] = useState<{ name: string | null; profile: string | null }>({
    name: null,
    profile: null
  });
  const [projectName, setProjecName] = useState<String | null>(null)

  // pop ขออนุญาติใช้ไมค์หน่อยย
  const requestMicPermission = async () => {
    const already = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
    );
    if (already) return;
    if (Platform.OS === 'android') {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
      );
      console.log("PERMISSION:", result);
    }
  };

  // โหลด user info
  useEffect(() => {
    const projectName = async () => {

      const res = await fetch(`https://freddy-unseconded-kristan.ngrok-free.dev/project/name/${projectId}`)
      const data = await res.json()
      setProjecName(data.project_name)

    }
    projectName()

    const loadUser = async () => {
      const username = await AsyncStorage.getItem('username');
      const profile = await AsyncStorage.getItem('profile');
      const loaded = { name: username, profile: profile, projectId: projectId };
      userRef.current = loaded;
      setUser(loaded);
    };
    loadUser();
  }, []);

  const getUser = async (username: string) => {
    console.log('yes yes')
    const encoded = encodeURIComponent(username);
    try {
      const res = await fetch(`https://freddy-unseconded-kristan.ngrok-free.dev/avatar/${encoded}`)
      const data = await res.json()

      return data[0].avatar_url

    } catch (error) {

    }
  }

  // init Agora
  useEffect(() => {
    const init = async () => {
      await requestMicPermission()

      const eng = createAgoraRtcEngine()
      eng.initialize({ appId })
      eng.enableAudio();
      eng.enableLocalAudio(true) // เปิด local audio 

      eng.setChannelProfile(ChannelProfileType.ChannelProfileCommunication); // เลือกประเภทห้อง
      eng.setClientRole(ClientRoleType.ClientRoleBroadcaster)

      eng.setEnableSpeakerphone(true);  //  บังคับให้เสียงออกลำโพง
      eng.setDefaultAudioRouteToSpeakerphone(true)  // default route = speaker

      // eng.setParameters('{"che.audio.enable.aec":false}') // ปิด echo cancel
      // eng.setParameters('{"che.audio.enable.ns":false}')  // ปิด noise suppression  
      // eng.setParameters('{"che.audio.enable.agc":false}')

      // เรียก enableAudioVolumeIndication ก่อน join เสมอ
      eng.enableAudioVolumeIndication(200, 3, true)


      // สร้าง event ไว้รับ event
      eng.registerEventHandler({

        // ตัวเราเองเข้าห้องสำเร็จ
        onJoinChannelSuccess: (connection) => {
          console.log('joined user : ' + userRef.current.name)
          getUser(userRef.current.name || "Thiprada Mopad")
          setJoinedUsers([{
            uid: MY_UID,
            name: userRef.current.name ?? "Me",
            avatar: userRef.current.profile ?? `https://api.dicebear.com/7.x/adventurer/png?seed=${MY_UID}`
          }]);
        },

        onUserInfoUpdated: (uid, info) => {
          const username = info.userAccount;
          if (!username) return;

          getUser(username).then(data => {
            setJoinedUsers(prev => {
              const exists = prev.some(u => u.uid === uid);
              if (exists) {
                return prev.map(u =>
                  u.uid === uid
                    ? {
                      ...u,
                      name: username,
                      avatar: data ?? `https://api.dicebear.com/7.x/adventurer/png?seed=${uid}`
                    }
                    : u
                );
              } else {
                return [...prev, {
                  uid,
                  name: username,
                  avatar: data ?? `https://api.dicebear.com/7.x/adventurer/png?seed=${uid}`
                }];
              }
            });
          });
        },

        // มีคนอื่นเข้ามา
        onUserJoined: (connection, uid) => {
          console.log("User joined:", uid)
          setJoinedUsers(prev => {
            if (prev.some(u => u.uid === uid)) return prev;
            return [...prev, {
              uid,
              name: "Loading",
              avatar: ``
            }]
          })
        },

        // คนออก
        onUserOffline: (_, uid) => {
          setJoinedUsers(prev => prev.filter(u => u.uid !== uid));
        },

        // วงเขียวๆ เช็คว่าใครพุดอยู่้บาง
        onAudioVolumeIndication: (_, speakers) => {
          // console.log("RAW speakers:", JSON.stringify(speakers));
          const active = new Set<number>();
          speakers.forEach(s => {
            if ((s.volume ?? 0) > 0) {
              // uid=0 หมายถึงตัวเอง
              active.add(s.uid === 0 ? MY_UID : s.uid!);
            }
          });
          setSpeakingUids(active);
        },
        onError: (err, msg) => {
          console.log("Agora error:", err, msg);
        }
      });

      engineRef.current = eng;
    };

    init();

    //cleanup ใช้ engineRef ไม่ใช่ engine state
    return () => {
      engineRef.current?.leaveChannel();
      engineRef.current?.release();
      engineRef.current = null;
    };
  }, []);

  const joinRoom = () => {
    const eng = engineRef.current;
    if (!eng) {
      console.log("Engine not ready");
      return
    }

    const username = userRef.current.name

    if (!username) {
      console.log('username not found')
      return
    }

    const proejctId = userRef.current.projectId

    console.log(userRef.current.name + " " + userRef.current.projectId)
    if (!username) {
      console.log('username not found')
      return
    }


    eng.joinChannelWithUserAccount('', proejctId, username, {
      clientRoleType: ClientRoleType.ClientRoleBroadcaster // ระบุ role ตอน join ด้วย
    });
  };

  const leaveRoom = () => {
    engineRef.current?.leaveChannel();
    setJoinedUsers([]);
    setSpeakingUids(new Set());
  };

  const toggleMute = () => {
    const eng = engineRef.current;
    if (!eng) return;
    eng.muteLocalAudioStream(!isMuted);
    setIsMuted(!isMuted);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-200 items-center ">

              <TouchableOpacity onPress={() => setOpenTab(true)} className="absolute top-10 left-5"           style={{ zIndex: 10 }}>
          <Image source={icons.menu} className="w-6 h-6" />
        </TouchableOpacity>

      <Text className="font-kanitMedium text-lg font-bold mt-10 mb-10">{projectName}</Text>

      {joinedUsers.length === 0 && (
        <View
          className="absolute top-0 left-0 right-0 bottom-0 bg-black/35 items-center justify-center"
          style={{ zIndex: 5 }}
        >
          <Pressable
            onPress={joinRoom}
            className="bg-[#99EEC9] px-10 py-3 rounded-xl"
          >
            <Text className="font-kanitRegular text-2xl text-black">Join</Text>
          </Pressable>
        </View>
      )}

      <View className="flex-row flex-wrap justify-center w-full px-10">
        {joinedUsers.map((member) => (
          <View key={member.uid} className="w-1/2 items-center mb-10">
            <Image
              source={{ uri: member.avatar }}
              className={`w-24 h-24 rounded-full border-2 bg-gray-300 ${speakingUids.has(member.uid) ? 'border-green-400 border-' : 'border-gray-400'
                }`}
            />
            <Text className="mt-2 font-kanitRegular">{member.name}</Text>
          </View>
        ))}
      </View>

      <View className="absolute bottom-16 flex-row items-center gap-3">
        <Pressable
          onPress={toggleMute}
          className={`${isMuted ? 'bg-red-300' : 'bg-[#D9D9D9]'} w-24 h-14 rounded-full items-center justify-center`}
        >
          <Image source={icons.mic} className='h-7 w-7' />
        </Pressable>

        <Pressable
          onPress={leaveRoom}
          className="bg-red-500 w-14 h-14 rounded-full items-center justify-center"
        >
          <Image source={icons.phone_cancel} className='h-7 w-7' />
        </Pressable>
      </View>
            <TabBar
              visible={openTab}
              onClose={() => setOpenTab(false)}
              projectId={Number(projectId)}
            />
    </SafeAreaView>
  );
}