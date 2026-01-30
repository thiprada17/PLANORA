import { Dimensions } from "react-native"

export function getBoardWidth() {
  const { width } = Dimensions.get("window")
  return width * 0.8
}