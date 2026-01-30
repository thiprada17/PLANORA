import { StyleSheet, Dimensions } from "react-native"

const { width } = Dimensions.get("window")

export const BOARD_WIDTH = width * 0.8

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  column: {
    width: BOARD_WIDTH,
    padding: 12,
    backgroundColor: "#F3F4F6",
    marginHorizontal: 8,
    borderRadius: 12,
  },
  columnHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  board: {
    width: 300,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    marginHorizontal: 8,
    padding: 10,
  },
  boardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 2,
    paddingBottom: 8,
    marginBottom: 8,
  },
  boardTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  addButton: {
  fontSize: 22,
  fontWeight: "bold",
  color: "#374151",
},

})
