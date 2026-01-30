import { View, Text } from "react-native"
import { CardData } from "./types"

type Props = {
  item: CardData
  boardId: number
  priorityColors: Record<"high" | "medium" | "low", string>
}


export default function KanbanCard({ item, priorityColors }: Props) {
  return (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        borderLeftWidth: 4,
        borderLeftColor: priorityColors[item.priority] ?? "#9CA3AF",
      }}
    >
      <Text>{item.title ?? "Untitled"}</Text>
    </View>
  )
}
