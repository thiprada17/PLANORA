import { View, Text, Pressable, Image } from "react-native";
import { icons } from "@/constants/icons";

type Member = {
    id: string;
    avatar?: string | null;
};

type Props = {
    project_id: string;
  project_name: string;
  subject: string;
  deadline: Date | null;
  members: Member[]; //number[] อันนี้เอาไว้เทส
    onPress?: () => void;
};


export default function ProjectCard({
    project_name,
    subject,
    deadline,
    members = [],
    onPress,
}: Props) 
{
// const safeMembers = Array.isArray(members) ? members : []
// const visibleMembers = safeMembers.slice(0, 4)
// const extraCount = safeMembers.length - 4

    return (
        <Pressable
            onPress={onPress}
            className="w-[155px] h-[150px] relative"
            style={{
                shadowColor: "#000",
                shadowOpacity: 0.25,
                shadowRadius: 4,
                shadowOffset: { width: 0, height: 3 },
            }}
        >
            <View className="absolute inset-0 rounded-3xl bg-black" />
            <View className="absolute top-0 left-0 right-0 h-[135px] rounded-3xl bg-GREEN p-3 border border-black">

            <View className="self-start bg-white px-3 rounded-full mb-2 flex-row items-center"
                style={{
                    shadowColor: '#bfbfbf',
                    shadowOpacity: 0.3,
                    shadowRadius: 3.5,
                    shadowOffset: { width: 0, height: 4 },
                    elevation: 4,
                }}
            >
                <Image source={icons.deadline} className="w-4 h-4 mr-1" />
                <Text className="text-[11px] font-kanitRegular text-black">
                    {deadline
                        ? deadline.toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        })
                        : "No deadline"}
                </Text>
            </View>
            <Text className="font-kanitBold text-2xl text-black mb-1" numberOfLines={1}>
                {project_name}
            </Text>
            <View className="self-start border border-black/40 rounded-full px-3 py-0.5 mb-3">
                <Text className="text-[9px] font-kanitRegular text-black/60">
                    {subject}
                </Text>
            </View>
            <View className="flex-row items-center justify-between mt-auto">
                <View className="flex-row">
                    {members.slice(0, 4).map((m, i) => (
                        <View
                            key={m.id}
                            className={`w-8 h-8 rounded-full bg-white border border-black/30 items-center justify-center ${i !== 0 ? "-ml-4" : ""
                                }`}
                        >
                            <Image
                                source={m.avatar ? { uri: m.avatar } : icons.face}
                                className={m.avatar ? "w-7 h-7 rounded-full" : "w-5 h-5"}
                                resizeMode="cover"
                            />
                        </View>
                    ))}
                </View>
                <Pressable
                    onPress={onPress}
                    className="bg-black px-3 py-0.5 rounded-full"
                >
                    <Text className="text-white text-[7px] font-kanitRegular">
                        Details
                    </Text>
                </Pressable>
            </View>
            </View>
        </Pressable>
    );
}
