import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Image,
  Dimensions,
} from "react-native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { Pressable } from "react-native";
import { useState } from "react";
import CreateTaskModal from "@/components/task/create_task";

// element: icons
const icons = {
  add: require("../../../assets/icons/add.png"),
  arrow_forward: require("../../../assets/icons/arrow_forward.png"),
  date: require("../../../assets/icons/date_range.png"),
  delete: require("../../../assets/icons/delete.png"),
  user: require("../../../assets/icons/face.png"),
  filter: require("../../../assets/icons/filter_list.png"),
  custom_pen: require("../../../assets/icons/ink_pen.png"),
  kanban: require("../../../assets/icons/view_kanban.png"),
};

const Icon = ({
  name,
  size = 18,
  style,
}: {
  name: keyof typeof icons;
  size?: number;
  style?: any;
}) => (
  <Image
    source={icons[name]}
    style={[
      {
        width: size,
        height: size,
      },
      style,
    ]}
  />
);

// responsive
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const BASE_WIDTH = 393;

const scale = (size: number) => (SCREEN_WIDTH / BASE_WIDTH) * size;

const spacing = {
  xxs: scale(6),
  xs: scale(8),
  sm: scale(12),
  md: scale(16),
  lg: scale(24),
  xl: scale(32),
  margin_horizontal: scale(64),
};

// column
const Column = [
  {
    id: "todo",
    title: "To-do",
    tasks: [1, 2, 3, 4],
  },
  {
    id: "progress",
    title: "On Progress",
    tasks: [1],
  },
  {
    id: "review",
    title: "In Review",
    tasks: [1],
  },
  {
    id: "complete",
    title: "Complete",
    tasks: [1],
  },
];

const users = [1, 2, 3]; // mock

export default function BoardScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  // element: fonts
  const [fontsLoaded] = useFonts({
    kanitMedium: require("../../../assets/fonts/Kanit-Medium.ttf"),
  });

  if (!fontsLoaded) return null;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View
        style={[
          styles.container,
          {
            paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.title_back}>
            <Text style={styles.title_back}>Project</Text>
          </TouchableOpacity>

          <Icon
            name="arrow_forward"
            size={spacing.sm}
            style={styles.arrow_forward}
          />
          <Text style={styles.title}>Board</Text>


          <Pressable
            onPress={() => setModalVisible(true)}
            className="border border-black rounded-xl px-3 py-2 bg-white active:bg-gray-100"
          >
            <Text className="font-kanitRegular">+ Create Task</Text>
          </Pressable>

          <CreateTaskModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
          />

        </View>



        {/* Tab */}
        <View style={styles.tab}>
          <View style={styles.menu}>
            <Icon name="kanban" size={spacing.md} style={styles.kanban} />
            <Text style={styles.tabText}>Kanban</Text>
          </View>

          <TouchableOpacity style={styles.filterBtn}>
            <Icon name="filter" size={scale(18)} />
          </TouchableOpacity>
        </View>

        {/* Board */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.board}
        >
          {Column.map((col) => (
            <View key={col.id} style={styles.column}>
              {/* Column Header */}
              <View style={styles.columnHeader}>
                <Text style={styles.columnTitle}>{col.title}</Text>

                <View style={styles.columnActions}>
                  <TouchableOpacity style={styles.customBtn}>
                    <Icon name="custom_pen" size={scale(20)} />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.deleteBtn}>
                    <Icon name="delete" size={scale(20)} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.divider} />

              {/* Cards */}
              <ScrollView
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled
                style={{ flexGrow: 0 }}
              >
                {col.tasks.map((_, i) => (
                  <View key={i} style={styles.cardWrapper}>
                    <View style={styles.card}>
                      <Text style={styles.cardTitle}>Task name</Text>

                      <View style={styles.dateRow}>
                        <View style={styles.date_icon}>
                          <Icon name="date" size={spacing.sm} />
                        </View>
                        <Text style={styles.dateText}>DD/MM/YY</Text>
                      </View>

                      <Text style={styles.assignText}>Assign to</Text>

                      <View style={styles.avatarRow}>
                        {users.map((u, i) => (
                          <View
                            key={i}
                            style={[
                              styles.avatar,
                              i !== 0 && { marginLeft: -scale(10) },
                            ]}
                          />
                        ))}
                      </View>
                    </View>
                  </View>
                ))}

                {/* Add task */}
                <TouchableOpacity style={styles.addTask}>
                  <Icon name="add" size={scale(20)} style={styles.addTaskIcon} />
                  <Text style={styles.addTaskText2}>Add Task</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          ))}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",

    marginHorizontal: spacing.lg,
    marginTop: spacing.margin_horizontal,
  },

  title_back: {
    fontFamily: "kanitMedium",
    fontSize: scale(20),
    color: "#7D7D7D",

    paddingTop: scale(5),
  },

  arrow_forward: {
    marginHorizontal: scale(5),
    marginTop: scale(10),
  },

  title: {
    fontFamily: "kanitMedium",
    fontSize: scale(45),
    color: "#000000",

    flex: 1,
  },

  // ปุ่ม create
  createBtn: {
    flexDirection: "row",
    alignItems: "center",

    borderWidth: scale(2),
    borderRadius: scale(8),

    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xxs,

    backgroundColor: "#FFFFFF",
    borderColor: "#222222",

    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2.5 },

    // Android
    elevation: 3,
  },

  addTaskText: {
    fontFamily: "kanitMedium",
    fontSize: spacing.md,
    color: "#222222",

    marginHorizontal: scale(2),
  },

  add: {
    marginRight: scale(2),
  },

  /* Tab */
  tab: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginHorizontal: spacing.lg,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,

    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,

    borderWidth: scale(1.5),
    borderRadius: scale(14),

    backgroundColor: "#F0F0F0",
    borderColor: "#8E8E8E",
  },

  menu: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(4),
  },

  tabText: {
    fontFamily: "kanitMedium",
    fontSize: scale(18),
  },

  kanban: {
    marginLeft: scale(10),
  },

  // filter btn
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",

    borderWidth: scale(1.5),
    borderRadius: scale(14),

    marginLeft: scale(16),

    paddingHorizontal: spacing.xxs,
    paddingVertical: spacing.xxs,

    backgroundColor: "#F0F0F0",
    borderColor: "#8E8E8E",

    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 1,
    shadowOffset: { width: 0, height: 2 },
  },

  /* Board */
  board: {
    marginHorizontal: spacing.lg,
    alignItems: "flex-start",
  },

  column: {
    width: scale(300),
    height: scale(500),

    borderWidth: scale(1.5),
    borderRadius: scale(15),

    padding: spacing.md,
    marginRight: scale(20),

    backgroundColor: "#CAEAD5",
    borderColor: "#222222",

    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2.5 },
  },

  columnHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    marginBottom: spacing.xs,
  },

  columnTitle: {
    fontFamily: "kanitMedium",
    fontSize: scale(20),
  },

  customBtn: {
    borderWidth: scale(1.5),
    borderRadius: scale(8),

    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,

    marginHorizontal: scale(5),
    marginVertical: spacing.xs,

    backgroundColor: "#FFFFFF",
    borderColor: "#222222",

    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2.5 },
  },

  deleteBtn: {
    borderWidth: scale(1.5),
    borderRadius: scale(8),

    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,

    marginHorizontal: scale(1),
    marginVertical: spacing.xs,

    backgroundColor: "#F07166",
    borderColor: "#222222",

    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2.5 },
  },

  columnActions: {
    flexDirection: "row",
    gap: scale(3),
  },

  divider: {
    height: scale(2),
    backgroundColor: "#222222",
    marginVertical: spacing.xs,
    marginTop: scale(5),
  },

  /* Card */
  cardWrapper: {
    paddingTop: scale(40),
    paddingHorizontal: spacing.xs,
    paddingBottom: spacing.xs,

    borderWidth: scale(1.5),
    borderColor: "#222222",
    borderRadius: scale(25),
    backgroundColor: "#F0F0F0",
    marginBottom: spacing.lg,

    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2.5 },
  },

  card: {
    paddingBottom: scale(20),
    backgroundColor: "#FFFFFF",
    borderRadius: scale(25),
    borderWidth: scale(1.5),
    borderColor: "#222222",
    padding: spacing.md,

    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2.5 },
  },

  cardTitle: {
    fontFamily: "kanitMedium",
    fontSize: scale(35),

    marginTop: scale(20),
    marginHorizontal: scale(10),
  },

  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(6),

    marginBottom: spacing.xl,
    marginHorizontal: scale(10),
  },

  dateText: {
    fontFamily: "kanit",
    fontSize: spacing.sm,
    color: "#000000",
  },

  date_icon: {
    borderWidth: scale(0.5),
    borderRadius: scale(20),

    padding: spacing.xxs,

    backgroundColor: "#FFFFFF",
    borderColor: "#222222",
  },

  assignText: {
    fontFamily: "kanit",
    fontSize: spacing.sm,
    color: "#000000",

    marginHorizontal: scale(10),
    marginBottom: spacing.xs,
  },

  avatarRow: {
    flexDirection: "row",
    alignItems: "center",

    marginHorizontal: scale(10),
  },

  avatar: {
    width: scale(50),
    height: scale(50),

    borderRadius: scale(50),

    backgroundColor: "#FFFFFF",

    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 1.5,
    shadowOffset: { width: 0, height: 2.5 },
  },

  /* Add task */
  addTask: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },

  addTaskText2: {
    fontFamily: "kanit",
    fontSize: spacing.sm,
  },

  addTaskIcon: {},
});
