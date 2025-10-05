import { Stack } from "expo-router";
import React from "react";

const FoodLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="foodMenu"
        options={{
          headerShown: true,
          headerTitle: "Log Food",
          headerStyle: { backgroundColor: "white" },
          headerShadowVisible: false,
          headerTitleAlign: "center",
          headerTitleStyle: { fontFamily: "Poppins-SemiBold" },
        }}
      />
      <Stack.Screen
        name="[mealName]"
        options={{
          headerShown: true,
          headerTitle: "Selected food",
          headerStyle: { backgroundColor: "white" },
          headerShadowVisible: false,
          headerTitleAlign: "center",
          headerTitleStyle: { fontFamily: "Poppins-SemiBold" },
        }}
      />
    </Stack>
  );
};
export default FoodLayout;
