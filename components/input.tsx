import React from "react";
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

interface InputProps extends TextInputProps {
  icon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  inputRef?: React.RefObject<TextInput>;
}

const Input = (props: InputProps) => {
  return (
    <View
      style={[styles.container, props.containerStyle && props.containerStyle]}
    >
      {props.icon && props.icon}
      <TextInput
        style={[styles.input, props.inputStyle]}
        placeholderTextColor={"#ADA4A5"}
        ref={props.inputRef && props.inputRef}
        // pointerEvents="none"
        {...props}
      />
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    borderWidth: 0,
    backgroundColor: "#F7F8F8",
    borderRadius: 16,
    borderCurve: "continuous",
    paddingHorizontal: 15,
    gap: 10,
  },
  input: {
    flex: 1,
    height: "auto",
    color: "#123131",
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginTop: 4,
  },
});
