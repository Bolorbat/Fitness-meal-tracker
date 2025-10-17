import { BackButton } from "@/components/BackButton";
import { router, Stack } from "expo-router";
import React from "react";

const FoodLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: true }}>
    <Stack.Screen
        name="foodMenu"
        options={{
          headerLeft: () => (
            <BackButton/>
          ),
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
          headerLeft: () => (
            <BackButton/>
          ),
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
