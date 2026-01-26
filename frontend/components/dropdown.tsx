import React, { useState } from "react";
import { View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

export default function MyDropdown() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "งานวันนี้", value: "today" },
    { label: "งานสัปดาห์นี้", value: "week" },
    { label: "งานทั้งหมด", value: "all" },
  ]);

  return (
    <View style={{ margin: 20 }}>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        placeholder="เลือกประเภทงาน"
      />
    </View>
  );
}
