import Button from "@/components/Button";
import Text from "@/components/CustomText";
import Input from "@/components/input";
import Picker from "@/components/Picker";
import { db } from "@/database/services/DataBaseService";
import { useUser } from "@/hooks/userHook";
import { useRouter } from "expo-router";
import {
  CalendarDotsIcon,
  CashRegisterIcon,
  SwapIcon,
  Users,
} from "phosphor-react-native";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

async function setUserData(
  uid: string | null,
  sex: any,
  weight: any,
  height: any,
  age: any
) {
  await db.users.updateUser(uid, sex, weight, height, age);
}

const UserOnboarding = () => {
  const router = useRouter();

  const { userData, loading } = useUser();
  const [sex, setSex] = useState("");
  const [weight, setWeight] = useState<number | undefined>();
  const [height, setHeight] = useState<number | undefined>();
  const [age, setAge] = useState<number | undefined>();

  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerItem, setPickerItems] = useState<
    { label: string; value: any }[]
  >([]);
  const [pickerValue, setPickerValue] = useState();
  const [pickerTitle, setPickerTitle] = useState();
  const [targetSetter, setTargetSetter] = useState<((val: any) => void) | null>(
    null
  );

  const openPicker = (
    items: { label: string; value: any }[],
    currentVal: any,
    setter: (val: any) => void
  ) => {
    setPickerItems(items);
    setPickerValue(currentVal);
    setTargetSetter(() => setter);
    setPickerOpen(true);
  };

  const handleChange = (val: any) => {
    setPickerValue(val);
    targetSetter?.(val);
  };

  const handleClose = () => {
    if (!targetSetter) return;

    if (targetSetter) {
      targetSetter(pickerValue);
    }

    setPickerOpen(false);
  };

  const HandleNext = async () => {
    setUserData(userData?.user_id || null, sex, weight, height, age);
    router.push("/goal");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 items-center justify-center px-7 py-7">
          <Image
            source={require("@/assets/images/Vector-Section.png")}
            className="w-[300px] h-[300px]"
          />
          <Text
            className="font-PoppinsSemiBold text-[20px] mt-4"
            style={{ fontFamily: "Poppins-Bold" }}
          >
            Let's complete your profile
          </Text>
          <Text className="font-PoppinsSemiBold text-[14px] text-[#ADA4A5]">
            It will help us to know more about you!
          </Text>

          <View className="flex w-full gap-4 mt-10">
            <Pressable
              onPress={() =>
                openPicker(
                  [
                    { label: "Male", value: "Male" },
                    { label: "Female", value: "Female" },
                  ],
                  "Male",
                  setSex
                )
              }
            >
              <Input
                placeholder={"Choose Gender"}
                value={sex}
                editable={false}
                showSoftInputOnFocus={false}
                icon={<Users size={20} style={{}} />}
              />
            </Pressable>
            <Pressable
              onPress={() =>
                openPicker(
                  Array.from({ length: 100 }, (_, i) => ({
                    label: `${i + 1}`,
                    value: i + 1,
                  })),
                  age ?? 20,
                  setAge
                )
              }
            >
              <Input
                placeholder={"Age"}
                value={age ? String(age) : ""}
                editable={false}
                showSoftInputOnFocus={false}
                icon={<CalendarDotsIcon size={20} style={{}} />}
              />
            </Pressable>
            <Pressable
              onPress={() =>
                openPicker(
                  Array.from({ length: 150 }, (_, i) => ({
                    label: `${i + 40} kg`,
                    value: i + 40,
                  })),
                  weight ?? 50,
                  setWeight
                )
              }
            >
              <Input
                placeholder={"Your Weight"}
                value={weight ? `${String(weight)} kg` : ""}
                editable={false}
                showSoftInputOnFocus={false}
                icon={<CashRegisterIcon size={20} style={{}} />}
              />
            </Pressable>
            <Pressable
              onPress={() =>
                openPicker(
                  Array.from({ length: 200 }, (_, i) => ({
                    label: `${i + 30} cm`,
                    value: i + 30,
                  })),
                  height ?? 150,
                  setHeight
                )
              }
            >
              <Input
                placeholder={"Your Height"}
                value={height ? `${String(height)} cm` : ""}
                editable={false}
                showSoftInputOnFocus={false}
                icon={<SwapIcon size={20} style={{}} />}
              />
            </Pressable>
          </View>

          <Picker
            visible={pickerOpen}
            onClose={handleClose}
            value={pickerValue}
            onChange={handleChange}
            items={pickerItem}
          />

          <View className="flex-1 w-full justify-end mb-12">
            <Button
              onPress={HandleNext}
              title={"Next"}
              textColor={"#fff"}
              image={null}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default UserOnboarding;
