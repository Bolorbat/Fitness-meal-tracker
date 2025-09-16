import { AuthProvider, useAuth } from "@/contexts/autoContext";
import { DatabaseConnection, initDB } from "@/database";
import { useOnboardingStatus } from "@/hooks/useOnboarding";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import "./globals.css";

function RootLayoutNav() {
  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
  });
  const { user, initializing } = useAuth();
  const onboardingStatus = useOnboardingStatus(user?.uid);
  const router = useRouter();

  // const db = DatabaseConnection.getInstance();
  // db.resetDatabase();

  useEffect(() => {
    initDB();
  }, []);

  useEffect(() => {
    console.log("init");
    if (!initializing) {
      console.log(onboardingStatus);
      if (!user) {
        router.replace("/(auth)/login");
      } else if (onboardingStatus === "done") {
        router.replace("/(tabs)/onboarding");
      }
    }
  }, [user, initializing, onboardingStatus]);

  if (initializing || !fontsLoaded) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="foodMenu"
        options={{
          headerTitle: "Log Food",
          headerStyle: { backgroundColor: "white" },
          headerShadowVisible: false,
          headerTitleAlign: "center",
          headerTitleStyle: { fontFamily: "Poppins-SemiBold" },
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
