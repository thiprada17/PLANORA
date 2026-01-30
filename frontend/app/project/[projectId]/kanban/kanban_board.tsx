import React, { useRef } from "react"
import {
  Animated,
  ScrollView,
  ActivityIndicator,
} from "react-native"
import BoardColumn from "./board_column"
import { styles } from "./styles"

type Props = {
  boardHeaderData: any[]
  boardCardData: any
  onBoardChange: (data: any) => void
  onAddCard: (boardId: number) => void
  priorityColors?: {
    high: string
    medium: string
    low: string
  }
  isLoading?: boolean
}

const KanbanBoard = ({
  boardHeaderData = [],
  boardCardData = {},
  onBoardChange,
  onAddCard,
  priorityColors = {
    high: "#FF5252",
    medium: "#FFC107",
    low: "#4CAF50",
  }, 
  isLoading = false,
}: Props) => {
  const scrollX = useRef(new Animated.Value(0)).current
  const horizontalScrollRef = useRef<ScrollView>(null)

  if (isLoading) {
    return <ActivityIndicator />
  }

  return (
    <ScrollView
      horizontal
      ref={horizontalScrollRef}
      showsHorizontalScrollIndicator={false}
      style={styles.container}
    >
      {boardHeaderData.map((board) => (
        <BoardColumn
          key={board.id}
          board={board}
          boardCardData={boardCardData[board.id]}
          onAddCard={onAddCard}
          onBoardChange={onBoardChange}
          priorityColors={priorityColors}
        />
      ))}
    </ScrollView>
  )
}

export default KanbanBoard
