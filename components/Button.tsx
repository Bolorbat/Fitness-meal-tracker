import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ColorValue,
  ImageSourcePropType,
  StyleSheet,
  TouchableHighlight,
  TouchableHighlightProps,
  View,
} from "react-native";
import Text from "./CustomText";

type ButtonProps = TouchableHighlightProps & {
  title: string;
  textColor: ColorValue;
  image: ImageSourcePropType | null;
};

const Button = ({ title, image, ...props }: ButtonProps) => {
  return (
    <View style={styles.container}>
      <TouchableHighlight
        className="flex-1 w-full h-full rounded-full"
        underlayColor={"#6998DE"}
        // activeOpacity={0.1}
        {...props}
      >
        <LinearGradient
          style={styles.background}
          //   className="flex w-full h-full rounded-full"
          colors={["#92A3FD", "#9DCEFF"]}
        >
          {image ? (
            <Image source={image} style={{ width: 30, height: 30 }} />
          ) : null}
          <Text style={[styles.text, { color: props.textColor }]}>{title}</Text>
        </LinearGradient>
      </TouchableHighlight>
    </View>
  );
};

export default Button;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    height: 70,
    width: "100%",
  },
  text: {
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
    marginTop: 3.5,
  },
  background: {
    width: "100%",
    height: "100%",
    borderRadius: 40,
    borderCurve: "continuous",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#95ADFE",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  gradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
