import { Picker as RPicker } from "@react-native-picker/picker";
import React from "react";
import { Modal, Pressable, View } from "react-native";
import Text from "./CustomText";

interface PickerItem {
  label: string;
  value: any;
}

interface PickerProfs {
  visible: boolean;
  onClose: () => void;
  value: any;
  onChange: (val: any) => void;
  items: PickerItem[];
  title?: string;
}

const Picker = ({
  visible,
  onClose,
  value,
  onChange,
  items,
  title,
}: PickerProfs) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          backgroundColor: "rgba(0,0,0,0.3)",
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            paddingBottom: 30,
          }}
        >
          <RPicker
            selectedValue={value}
            onValueChange={(itemVal) => {
              onChange(itemVal);
            }}
          >
            {items.map((item) => (
              <RPicker.Item
                key={item.value}
                label={item.label}
                value={item.value}
                color="black"
                fontFamily="Poppins-Regular"
              />
            ))}
          </RPicker>
          {title && <Text style={{ fontSize: 16, margin: 16 }}>{title}</Text>}
          <Pressable
            onPress={() => {
              onClose();
            }}
            style={{
              backgroundColor: "black",
              marginHorizontal: 16,
              marginTop: 10,
              padding: 12,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: "white", textAlign: "center" }}>Done</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default Picker;
