import React from "react"
import { View, ScrollView, Text, TouchableOpacity } from "react-native"
import KanbanCard from "./kanban_card"
import { styles } from "./styles"

type Props = {
  board: {
    id: number
    status: string
    color: string
  }
  boardCardData: {
    columnData: []
    total_count: number
  }
  onAddCard: (boardId: number) => void
  onBoardChange: (data: any) => void
  priorityColors: {
    high: string
    medium: string
    low: string
  }
}

const BoardColumn: React.FC<Props> = ({
  board,
  boardCardData,
  onAddCard,
  priorityColors,
}) => {
  return (
    <View style={styles.board}>
      <View style={[styles.boardHeader, { borderBottomColor: board.color }]}>
        <Text style={styles.boardTitle}>{board.status}</Text>
        <TouchableOpacity onPress={() => onAddCard(board.id)}>
          <Text style={styles.addButton}>＋</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {boardCardData?.columnData?.map((item: any) => (
          <KanbanCard
            key={item.id}
            item={item}
            boardId={board.id}
            priorityColors={priorityColors}
          />
        ))}
      </ScrollView>
    </View>
  )
}

export default BoardColumn
