import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "@/constants/icons";
import { useState } from "react";
import Svg, { Text as SvgText } from "react-native-svg";
import TabBar from "@/components/tabBar";

const StrokeText = ({
  text = "",
  size = 20,
  fill = "#000",
  stroke = "#000",
  strokeWidth = 1,
  fontFamily = "Kanit-Bold",
  className = "",
}) => {
  const width = text.length * (size * 0.7);

  return (
    <View className={className}>
      <Svg height={size * 1.5} width={width}>
        <SvgText
          x="50%"
          y={size}
          textAnchor="middle"
          fontSize={size}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          fontFamily={fontFamily}
        >
          {text}
        </SvgText>
      </Svg>
    </View>
  );
};

export default function DashBoard() {
  const [openTab, setOpenTab] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white px-2">
      <ScrollView showsVerticalScrollIndicator={false}>

        <View className="flex-col items-right px-6 pt-4 mb-2">
          <TouchableOpacity onPress={() => setOpenTab(true)}>
            <Image source={icons.menu} className="w-6 h-6" />
          </TouchableOpacity>
          <Text className="text-[36px] font-kanitBold">Project name</Text>
        </View>
{/* header */}
        <View className="px-6 mb-6 ">

          <View className="flex-row mb-1">
            <Text className="w-24 font-kanitRegular text-sm">
              Status
            </Text>

            <View className="bg-[#E6BB2D] px-5 py-1 rounded-full">
              <Text className="text-xs font-kanitRegular text-white">
                ● On Progress
              </Text>
            </View>
          </View>

          <View className="flex-row mb-1">
            <Text className="w-24 font-kanitRegular text-sm">
              Deadline
            </Text>

            <Text className="font-kanitBold text-sm">
              March 1, 2026
            </Text>
          </View>

          <View className="flex-row">
            <Text className="w-24 font-kanitRegular text-sm">
              Subject
            </Text>
            <Text className="font-kanitBold text-sm">
              SF222
            </Text>
          </View>

        </View>


        <View className="mx-6 mb-6 bg-GREEN rounded-2xl p-4">

          <View className="bg-white self-center flex-row items-center px-20 py-1.5 rounded-xl mb-2 border border-black">
            <Image source={icons.calendar} className="w-4 h-4 mr-2" />
            <Text className="font-kanitBold text-sm">
              {new Date().toLocaleString("default", { month: "long" })},{" "}
              {new Date().getFullYear()}
            </Text>
          </View>
          {/* วันนี้ */}
          {(() => {
            const today = new Date();
            const [offset, setOffset] = useState(0);

            const days = [];
            for (let i = 0; i < 5; i++) {
              const d = new Date();
              d.setDate(today.getDate() - 1 + offset + i);
              days.push(d);
            }

          // แถบวัน
            return (
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
                      className={`items-center px-3 py-3  ${isToday ? "bg-[#FFEA80] border border-black rounded-xl" : ""
                        }`}
                    >
                      <Text
                        className={`text-sm font-kanitBold ${isToday ? "text-black" : "text-white"
                          }`}
                      >
                        {date.toLocaleDateString("en-US", {
                          weekday: "short",
                        })}
                      </Text>

                      <Text
                        className={`text-sm font-kanitBold ${isToday ? "text-black" : "text-white"
                          }`}
                      >
                        {date.getDate()}
                      </Text>
                    </View>
                  );
                })}

                <TouchableOpacity onPress={() => setOffset(offset + 1)}>
                  <Text className="text-lg font-kanitBold">▶</Text>
                </TouchableOpacity>

              </View>
            );
          })()}
        </View>

        <View className="px-6 flex-row flex-wrap justify-center mb-6">

          {/*overdue */}
          <View className="w-[45%] mb-4 mr-8 shadow-l">

            <View className="bg-[#EFFFEA] border border-black overflow-hidden flex-row">
              {/* แถบเขียวเข้มด้านซ้าย */}
              <View className="w-8 bg-GREEN border-r border-black" />
              <View className="flex-1 p-4 items-center">

                {/* ไอพื้นหลังสีเหลืองๆมันไม่พอดีอะ */}
                <View className="">
                  <StrokeText
                    text="Overdue Tasks"
                    size={17}
                    fill="#C9EAD5"
                    stroke="black"
                    strokeWidth={1.1}
                    fontFamily="KanitBold"
                  />
                </View>
                <StrokeText
                  text="1"
                  size={80}
                  fill="red"
                  stroke="black"
                  strokeWidth={1.5}
                  className="-mt-2"
                  fontFamily="KanitBold"
                />
              </View>
            </View>
          </View>

          {/*จนtask */}
          <View className="w-[45%] mb-4 bg-white border border-black p-4 items-center ">
            {/* เส้นสี่ฟ้า */}
            <View className="absolute left-6 top-0 bottom-0 w-[1px] bg-red-400" />

            {[...Array(8)].map((_, i) => (
              <View
                key={i}
                className="absolute left-0 right-0 h-[1px] bg-blue-300"
                style={{ top: 17 + i * 25 }}
              />
            ))}
            <StrokeText
              text="Number of Task"
              size={18}
              fill="#4285F4"
              stroke="black"
              strokeWidth={1.2}
              fontFamily="KanitBold"
            />
            <StrokeText
              text="20"
              size={80}
              fill="#ffffff"
              stroke="black"
              strokeWidth={1.5}
              className="-mt-2"
              fontFamily="KanitBold"
            />
          </View>

          {/* countdown deadline */}
          <View className="w-[45%] border border-black mr-8 overflow-hidden">
            {/* แถบแดงด้านบน */}
            <View className="bg-[#E96A5F] p-2 items-center border-b border-black">
              <StrokeText
                text="Countdown"
                size={18}
                fill="white"
                stroke="black"
                strokeWidth={1.1}
                fontFamily="KanitBold"
              />
            </View>

            <View className="bg-[#F3F3F3] p-6 items-center">
              <View className="items-end">
                {/* 30 days */}
                <View className="flex-row items-end">
                  <Text className="text-[85px] font-kanitBold leading-[80px]">
                    30
                  </Text>
                  <Text className="text-sm font-kanitRegular ml-1 mb-3">
                    days
                  </Text>
                </View>

                <Text className="text-xs font-kanitRegular">
                  before Deadline
                </Text>
              </View>
            </View>

          </View>

          {/*งานเรา*/}
          <View className="w-[45%] bg-[#EFFFDF] border border-black p-4 items-center">
            <StrokeText
              text="My assignment"
              size={18}
              fill="#FACC15"
              stroke="black"
              strokeWidth={1.1}
              fontFamily="KanitBold"
            />

            <View className="w-32 h-32 bg-[#D7D8FF] rounded-full items-center justify-center mt-4 border border-black">
              <StrokeText
                text="4"
                size={80}
                fill="#E5E5E5"
                stroke="black"
                strokeWidth={2}
                fontFamily="KanitBold"
              />
            </View>
          </View>
        </View>

        {/* task Overview */}
        <View className="mb-10 items-center">
          <View className="w-[85%] relative ">
            {/* กล่องเขียวด้านหลัง */}
            <View className="absolute top-4 left-3 w-full h-full bg-GREEN rounded-2xl border" />
            <View className="bg-white rounded-2xl border border-black p-4">
              <Text className="font-kanitBold text-xl mb-3 text-center">
                Tasks Overview
              </Text>
              {[
                ["Not Started", 3],
                ["On progress", 6],
                ["In review", 1],
                ["Complete", 10],
              ].map(([label, value]) => (
                <View
                  key={label}
                  className="flex-row justify-between mb-1"
                >
                  <Text className="font-kanitRegular">{label}</Text>
                  <Text className="font-kanitBold">{value} tasks</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* My Team */}
        <View className="mb-16 items-center">
          <View className="w-[85%] border border-dashed border-black rounded-2xl p-4">

            <Text className="font-kanitBold text-xl mb-4 text-center">
              My Team
            </Text>

            {/* กล่อง mem ที่ scroll */}
            <ScrollView
              className="h-[180px]"
              nestedScrollEnabled
              showsVerticalScrollIndicator
              contentContainerStyle={{
                alignItems: "center",
                paddingBottom: 10,
              }}
            >
              {[1, 2, 3, 4, 5, 6].map((item, index) => (
                <View
                  key={index}
                  className="flex-row items-center justify-center mb-3 w-full"
                >
                  <Image
                    source={icons.face}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <Text className="font-kanitRegular text-sm">
                    Member Name
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
      <TabBar
        visible={openTab}
        onClose={() => setOpenTab(false)}
      />
    </SafeAreaView>
  );
}