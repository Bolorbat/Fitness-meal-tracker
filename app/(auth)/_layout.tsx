import { AuthProvider, useAuth } from "@/contexts/autoContext";
import { useOnboardingStatus } from "@/hooks/useOnboarding";
import { Stack, useRouter } from "expo-router";
import React, { useEffect } from "react";

const AuthLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="register" />
      <Stack.Screen name="login" />
      <Stack.Screen name="userOnboarding" />
      <Stack.Screen name="goal" />
      <Stack.Screen name="welcome" />
    </Stack>
  );
};

export default AuthLayout;
