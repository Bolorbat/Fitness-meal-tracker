import { AuthProvider, useAuth } from "@/contexts/autoContext";
import { DatabaseConnection, initDB } from "@/database";
import { useOnboardingStatus } from "@/hooks/useOnboarding";
import { Stack, useRouter, usePathname, useSegments } from "expo-router";
import { useEffect, useState, useRef } from "react";
import { useFonts } from "expo-font";
import { isFirstLaunch } from "@/utils/isFirstLaunch";
import { SyncAll, SyncService } from "@/database/supabase/sync";

function RootLayoutNav() {
  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
  });

  const { user, initializing } = useAuth();
  const onboardingStatus = useOnboardingStatus(user?.uid);
  const [firstLaunch, setFirstLaunch] = useState<boolean | null>(null);
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    const initialize = async () => {
      try {
        const db = await initDB();
        // DatabaseConnection.getInstance().resetDatabase();

        const syncService = await SyncAll(db);

        console.log("Sync initialized successfully");
      } catch (error) {
        console.error("Failed at initialization:", error);
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    (async () => {
      const first = await isFirstLaunch();
      setFirstLaunch(first);
    })();
  }, []);

  useEffect(() => {
    if (firstLaunch === null || initializing || !fontsLoaded) return;

    if (path === "foodDetail/mealName") return;

    if (firstLaunch) {
      router.replace("/(auth)/register");
    } else if (!user) {
      router.replace("/(auth)/login");
    } else if (onboardingStatus === "done") {
      router.replace("/(tabs)/onboarding");
    }
  }, [user, onboardingStatus, firstLaunch, initializing, fontsLoaded, router]);

  if (initializing || firstLaunch === null || !fontsLoaded) {
    return null;
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
      <RootLayoutNav />
    </AuthProvider>
  );
}
