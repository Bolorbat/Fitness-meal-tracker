import AsyncStorage from "@react-native-async-storage/async-storage";

export async function isFirstLaunch(): Promise<boolean> {
  try {
    const alreadyInstalled = AsyncStorage.getItem("alreadyInstalled");
    if (alreadyInstalled === null) {
      await AsyncStorage.setItem("alreadyInstalled", "true");
      return true;
    }
    return false;
  } catch (err) {
    console.log("Error checking first launch");
    return false;
  }
}
