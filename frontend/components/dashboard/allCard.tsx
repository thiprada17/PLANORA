import { View, Text, ViewStyle } from "react-native";
import Svg, { Text as SvgText } from "react-native-svg";

type Props = {
  shadowStyle?: ViewStyle;
  overdue: number;
  totalTasks: number;
  countdownDays: number;
  myAssignments: number;
};

const StrokeText = ({
  text = "",
  size = 20,
  fill = "#000",
  stroke = "#000",
  strokeWidth = 0.5,
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

export default function StatsCards({
  shadowStyle,
  overdue,
  totalTasks,
  countdownDays,
  myAssignments,
}: Props) {
  return (
    <View className="px-6 flex-row flex-wrap justify-center mb-6">

      {/* overdue */}
      <View className="w-[45%] mb-4 mr-8" style={shadowStyle}>
        <View className="bg-[#EFFFEA] border border-black flex-row">
          <View className="w-5 bg-GREEN border-r border-black" />
          <View className="flex-1 p-4 items-center">

            <StrokeText
              text="Overdue Tasks"
              size={18}
              fill="#C9EAD5"
              stroke="black"
              strokeWidth={1.1}
              fontFamily="KanitExtraBold"
            />

            <StrokeText
              text={String(overdue)}
              size={80}
              fill="red"
              stroke="black"
              strokeWidth={1.5}
              className="-mt-2"
              fontFamily="KanitExtraBold"
            />

          </View>
        </View>
      </View>

      {/* จน task */}
      <View
        className="w-[45%] mb-4 bg-white border border-black p-4 items-center"
        style={shadowStyle}
      >
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
          strokeWidth={1.1}
          fontFamily="KanitExtraBold"
        />

        <StrokeText
          text={String(totalTasks)}
          size={80}
          fill="#ffffff"
          stroke="black"
          strokeWidth={1.5}
          className="-mt-2"
          fontFamily="KanitExtraBold"
        />

      </View>

      {/* countdown*/}
      <View
        className="w-[45%] border border-black mr-8 overflow-hidden"
        style={shadowStyle}
      >
        <View className="bg-[#E96A5F] p-3 items-center border-b border-black">

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
            <View className="flex-row items-end">
              <Text className="text-[85px] font-kanitExtraBold leading-[80px]">
                {countdownDays}
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

      {/* งานเรานา */}
      <View
        className="w-[45%] bg-[#EFFFDF] border border-black p-4 items-center"
        style={shadowStyle}
      >

        <StrokeText
          text="My assignment"
          size={18}
          fill="#FFEA80"
          stroke="black"
          strokeWidth={1.1}
          fontFamily="KanitBold"
        />

        <View className="w-32 h-32 bg-[#D7D8FF] rounded-full items-center justify-center mt-4 border border-black">
          <StrokeText
            text={String(myAssignments)}
            size={80}
            fill="#fff"
            stroke="black"
            strokeWidth={2}
            fontFamily="KanitExtraBold"
          />
        </View>

      </View>

    </View>
  );
}