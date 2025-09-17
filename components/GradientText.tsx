import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleProp, Text, TextStyle, ViewStyle } from "react-native";

interface GradientTextProps {
  children: React.ReactNode;
  colors?: readonly [string, string, ...string[]];
  locations?: readonly [number, number, ...number[]];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  textStyle?: TextStyle;
  style?: StyleProp<ViewStyle>;
}

const GradientText: React.FC<GradientTextProps> = ({
  children,
  colors = ["#ff0080", "#7928ca"],
  locations = [0, 1],
  start = { x: 0, y: 0 },
  end = { x: 1, y: 0 },
  textStyle = {},
  style = {},
}) => {
  return (
    <MaskedView
      style={[{ height: 30 }, style]} // Explicit height
      maskElement={
        <Text
          style={[
            {
              backgroundColor: "transparent",
              fontSize: 16,
              textAlign: "center",
              fontFamily: "Poppins-Regular",
            },
            textStyle,
          ]}
        >
          {children}
        </Text>
      }
    >
      <LinearGradient
        colors={colors}
        locations={locations}
        start={start}
        end={end}
        style={{ flex: 1 }} // Fill the mask area
      />
    </MaskedView>
  );
};

export default GradientText;
