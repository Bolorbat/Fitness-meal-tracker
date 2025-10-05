import React from "react";
import { Text as RNText, TextProps } from "react-native";


export default function CustomText(props: TextProps) {
    return (
        <RNText
            {...props}
            style={[{ fontFamily: "Poppins-Regular" }, props.style]}
        />
    );
}
