import { View } from "react-native"
import { useLocalSearchParams } from "expo-router"
import KanbanBoard from "./kanban/kanban_board"
import { useState } from "react"

export default function BoardScreen() {
  const { projectId } = useLocalSearchParams()

  const [boardData, setBoardData] = useState({
    1: {
      columnData: [],
      total_count: 0,
    },
    2: {
      columnData: [],
      total_count: 0,
    },
    3: {
      columnData: [],
      total_count: 0,
    },
  })

  const boardHeaders = [
    { id: 1, status: "To Do", color: "#3B82F6" },
    { id: 2, status: "In Progress", color: "#F59E0B" },
    { id: 3, status: "Done", color: "#10B981" },
  ]

  return (
    <View style={{ flex: 1 }}>
      <KanbanBoard
        boardHeaderData={boardHeaders}
        boardCardData={boardData}
        onBoardChange={setBoardData}
        onAddCard={(boardId) =>
          console.log("Add card to board", boardId, "project", projectId)
        }
      />
    </View>
  )
}
