import { View, Text, TouchableOpacity, Image, ViewStyle } from "react-native";
import { useState } from "react";
import { icons } from "@/constants/icons";

type Props = {
    shadowStyle?: ViewStyle;
};

export default function CalendarPart({ shadowStyle }: Props) {
    const [offset, setOffset] = useState(0);
    const today = new Date();

    const days = [];
    for (let i = 0; i < 5; i++) {
        const d = new Date();
        d.setDate(today.getDate() - 1 + offset + i);
        days.push(d);
    }

    return (
        <View
            className="mx-6 mb-6 bg-GREEN rounded-2xl p-4"
            style={shadowStyle}
        >
            <View className="bg-white self-center flex-row items-center px-20 py-2 rounded-xl mb-2 border border-black">
                <Image source={icons.calendar} className="w-4 h-4 mr-2" />
                <Text className="font-kanitBold text-sm">
                    {today.toLocaleString("default", { month: "long" })},{" "}
                    {today.getFullYear()}
                </Text>
            </View>

            <View className="flex-row items-center justify-between">
                <TouchableOpacity onPress={() => setOffset(offset - 1)}>
                    <Text className="text-lg font-kanitBold">◀</Text>
                </TouchableOpacity>

                {days.map((date, index) => {
                    const isToday =
                        date.toDateString() === new Date().toDateString();

                    return (
                        <View
                            key={index}
                            className={`items-center px-3 py-2 ${isToday
                                    ? "bg-[#FFEA80] border border-black rounded-xl"
                                    : ""
                                }`}
                        >
                            <Text className={`text-sm font-kanitBold ${isToday ? "text-black" : "text-white"}`}
                            >                
                            {date.toLocaleDateString("en-US", 
                                {weekday: "short",})}
                            </Text>

                            <Text className={`text-sm font-kanitBold ${isToday ? "text-black" : "text-white"}`}>
                                {date.getDate()}
                            </Text>
                        </View>
                    );
                })}

                <TouchableOpacity onPress={() => setOffset(offset + 1)}>
                    <Text className="text-lg font-kanitBold">▶</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
