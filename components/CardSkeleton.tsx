import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";

type Props = {
  height: number;
  borderRadius?: number;
};

export const CardSkeleton = ({ height, borderRadius = 20 }: Props) => {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    );
    loop.start();

    return () => loop.stop();
  }, []);

  const translateX = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 300],
  });

  return (
    <View
      className="bg-gray-200 shadow-md w-full overflow-hidden"
      style={{ height, borderRadius }}
    >
      {/* <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            transform: [{ translateX }],
            borderRadius,
            overflow: "hidden",
          },
        ]}
      >
        <LinearGradient
          colors={["transparent", "rgba(255,255,255,0.5)", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1, borderRadius }}
        />
      </Animated.View> */}
    </View>
  );
};
