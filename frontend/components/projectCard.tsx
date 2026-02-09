import { View, Text, Pressable, Image } from "react-native";
import { icons } from "@/constants/icons";

type Member = {
    id: number;
    avatar?: string | null;
};

type Props = {
    name: string;
    subject: string;
    deadline?: Date | null;
    members: Member[]; //number[] อันนี้เอาไว้เทส
    onPress?: () => void;
};


export default function ProjectCard({
    name,
    subject,
    deadline,
    members,
    onPress,
}: Props) {
    return (
        <Pressable
            onPress={onPress}
            className="w-[155px] h-[150px] rounded-3xl bg-GREEN p-4 border border-black"
            style={{
                shadowColor: "#000",
                shadowOpacity: 0.25,
                shadowRadius: 4,
                shadowOffset: { width: 0, height: 3 },
            }}
        >
            <View className="self-start bg-white px-3 py-1 rounded-full mb-2 flex-row items-center">
                <Image source={icons.calendar} className="w-3 h-3 mr-1" />
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
            <Text className="font-kanitBold text-xl text-black mb-1" numberOfLines={1}>
                {name}
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
                            className={`w-8 h-8 rounded-full bg-white border border-black/30 items-center justify-center ${i !== 0 ? "-ml-2" : ""
                                }`}
                        >
                            <Image
                                source={m.avatar ? { uri: m.avatar } : icons.face}
                                className={m.avatar ? "w-8 h-8 rounded-full" : "w-5 h-5"}
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
        </Pressable>
    );
}
