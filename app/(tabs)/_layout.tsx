import { AuthProvider, useAuth } from "@/contexts/autoContext";
import { useOnboardingStatus } from "@/hooks/useOnboarding";
import { Image } from "expo-image";
import { Tabs, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ImageSourcePropType } from "react-native";
// import {colors} from "@/tailwind.config";

type TabConfig = {
  name: string;
  size: number;
  icon: ImageSourcePropType;
};

const tabs: TabConfig[] = [
  {
    name: "onboarding",
    size: 28,
    icon: require("./../../assets/icons/Home.png"),
  },
  {
    name: "workout",
    size: 28,
    icon: require("./../../assets/icons/workout.png"),
  },
  { name: "meal", size: 30, icon: require("./../../assets/icons/meal.png") },
  {
    name: "profile",
    size: 30,
    icon: require("./../../assets/icons/Profile.png"),
  },
];

const _Layout = () => {
  return (
    <Tabs screenOptions={{ tabBarItemStyle: { paddingVertical: 10 } }}>
      {tabs.map(({ name, size, icon }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            tabBarLabel: "",
            headerShown: false,
            tabBarIcon: ({
              focused,
            }: {
              focused: boolean;
              color: string;
              size: number;
            }) => (
              <Image
                source={icon}
                style={{
                  width: size,
                  height: size,
                  // tintColor: focused ? colors.blue.dark : colors.gray[100],
                }}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
};

export default _Layout;
