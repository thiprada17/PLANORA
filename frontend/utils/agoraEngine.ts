import {
  createAgoraRtcEngine,
  ChannelProfileType,
  ClientRoleType,
  IRtcEngine
} from "react-native-agora";

let engine: IRtcEngine | null = null

export const getEngine = (): IRtcEngine => {
    if(!engine) {
        engine = createAgoraRtcEngine()
    }
    return engine
}

export const deleteEngine = () => {
    engine?.release()
    engine = null
}

