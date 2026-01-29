import { MaterialIcons } from "@expo/vector-icons"
import React, { useEffect, useRef, useState } from "react"
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    PanResponder,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from "react-native"


// Data Structure
interface BoardHeader {
    id: string | number;
    status: string;
    color: string;
}

interface CardData {
    id: string | number;
    first_name: string;
    last_name: string;
    company: string;
    email: string;
    phone: string;
    priority: 'high' | 'medium' | 'low';
    notes?: string;
    assigned_to: {
        first_name: string;
        last_name: string;
    };
    created_on: string;
}
interface BoardCardData {
    [boardId: string]: {
        columnData: CardData[];
        total_count: number;
    };
}

interface KanbanCardProps {
  item: CardData
  boardId: string | number
  setDraggingItemId: (id: string | number) => void
  setDraggingBoardId: (id: string | number) => void
}

// Main Component
const ReactNativeKanbanBoard = ({
    boardHeaderData = [],
    boardCardData = {},
    onCardPress = () => {},
    onBoardChange = () => {},
    onAddCard = () => {},
    priorityColors = {
        "high": "#FF5252",
        "medium": "#FFC107",
        "low": "#4CAF50",
    },
    isLoading = false,
}) => {
    // State management
    const [draggingItemId, setDraggingItemId] = useState(null)
    const [draggingBoardId, setDraggingBoardId] = useState(null)
    const [boardLayouts, setBoardLayouts] = useState({})
    
    // Refs for animations and measurements
    const horizontalScrollRef = useRef(null)
    const scrollX = useRef(new Animated.Value(0)).current
    const boardRefs = useRef({})
    
    // Device orientation handling
    const [orientation, setOrientation] = useState(
        Dimensions.get("window").width > Dimensions.get("window").height
            ? "LANDSCAPE" : "PORTRAIT"
    )

    // Responsive
    const getBoardWidth = () => {
        const boardCount = boardHeaderData.length || 1
        const { width: windowWidth } = useWindowDimensions()
        const isTablet = windowWidth >= 768
        
    if (orientation === "LANDSCAPE") {
        const visibleBoards = isTablet ? 4 : 3
        const totalMargin = 24
        const calculatedWidth = windowWidth / visibleBoards - totalMargin
        return Math.max(calculatedWidth, 280)
        } else {
            if (isTablet) {
                const visibleBoards = Math.min(boardCount, 4)
                const totalMargin = 24
                return windowWidth / visibleBoards - totalMargin
            } else {
                const minWidth = Math.max(windowWidth * 0.2, 300)
                return minWidth
            }
        }
    }
}

const KanbanCard: React.FC<KanbanCardProps> = ({
  item,
  boardId,
  setDraggingItemId,
  setDraggingBoardId,
}) => {

  const pan = useRef(new Animated.ValueXY()).current
  const cardOpacity = useRef(new Animated.Value(1)).current

  const hamburgerPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,

    onPanResponderGrant: () => {
      setDraggingItemId(item.id)
      setDraggingBoardId(boardId)

      Animated.timing(cardOpacity, {
        toValue: 0.5,
        duration: 100,
        useNativeDriver: false,
      }).start()

      pan.extractOffset()
    },

    onPanResponderMove: (e, gesture) => {
    if (isDragging) {
        // Update card position
        Animated.event([null, { dx: pan.x, dy: pan.y }], {
            useNativeDriver: false,
        })(e, gesture)

        // Auto-scroll when near edges
        if (!autoScrollInterval.current) {
            autoScrollInterval.current = setInterval(() => {
                handleAutoScroll(gesture.moveX)
            }, 16)
        }
    }
},
  })

  return (
    <Animated.View
      {...hamburgerPanResponder.panHandlers}
      style={{
        opacity: cardOpacity,
        transform: pan.getTranslateTransform(),
      }}
    >
      <Text>{item.first_name}</Text>
    </Animated.View>
  )
}

