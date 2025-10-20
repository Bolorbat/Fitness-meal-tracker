import { AuthProvider, useAuth } from "@/contexts/autoContext";
import { DatabaseConnection, initDB } from "@/database";
import { useOnboardingStatus } from "@/hooks/useOnboarding";
import { Stack, useRouter, usePathname, useSegments } from "expo-router";
import { useEffect, useState, useRef } from "react";
import { useFonts } from "expo-font";
import { isFirstLaunch } from "@/utils/isFirstLaunch";
import { SyncAll, SyncService, SyncTable } from "@/database/supabase/sync";
import { ActivityIndicator, View, Text } from "react-native";
import ToastManager from "toastify-react-native";

function RootLayoutNav() {
  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
  });

  const { user, initializing } = useAuth();
  const [syncCompleted, setSyncCompleted] = useState(false);
  const [firstLaunch, setFirstLaunch] = useState<boolean | null>(null);
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    const initializeDB = async () => {
      try {
        // await DatabaseConnection.getInstance().resetDatabase();
        await initDB();
      } catch (err) {
        console.log("Error init db : ", err);
      }
    };

    initializeDB();

    return () => {
      DatabaseConnection.getInstance().close();
    };
  }, []);

  useEffect(() => {
    const syncUserData = async () => {
      if (!user) {
        setSyncCompleted(false);
        return;
      }

      try {
        setSyncCompleted(false);
        const db = await initDB();
        await SyncAll(db, user?.uid ?? "");
        setSyncCompleted(true);
        console.log("Sync initialized successfully");
      } catch (error) {
        console.error("Failed at initialization:", error);
      }
    };

    syncUserData();
  }, [user]);

  const onboardingStatus = useOnboardingStatus(user?.uid, syncCompleted);

  useEffect(() => {
    (async () => {
      const first = await isFirstLaunch();
      setFirstLaunch(first);
    })();
  }, []);

  useEffect(() => {
    if (firstLaunch === null || initializing || !fontsLoaded) return;

    if (firstLaunch) {
      router.replace("/(auth)/register");
    } else if (!user) {
      router.replace("/(auth)/login");
    } else if (!syncCompleted) {
      console.log("Waiting sync");
      return;
    } else if (onboardingStatus === "done") {
      router.replace("/(tabs)/onboarding");
    } else if (onboardingStatus === "incomplete") {
      router.replace("/(auth)/userOnboarding");
    }
  }, [
    user,
    onboardingStatus,
    firstLaunch,
    initializing,
    fontsLoaded,
    syncCompleted,
    router,
  ]);

  if (initializing || firstLaunch === null || !fontsLoaded) {
    return null;
  }

  if (user && !syncCompleted) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ToastManager position="bottom" useModal={false} />
      <RootLayoutNav />
    </AuthProvider>
  );
}
