import Button from "@/components/Button";
import Text from "@/components/CustomText";
import { db } from "@/database/services/DataBaseService";
import { useUser } from "@/hooks/userHook";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { SafeAreaView, View } from "react-native";

async function completeOnboarding(userId: string | null) {
  try {
    await db.users.completeOnboarding(userId);
  } catch (err) {
    console.log(err);
  }
}

const welcome = () => {
  const router = useRouter();

  const { userData, loading } = useUser();
  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 items-center px-7 py-7">
        <Image
          source={require("@/assets/images/Lean.png")}
          style={{
            width: 250,
            height: 300,
            alignSelf: "center",
            marginTop: 100,
          }}
          contentFit="contain"
        />
        <View className="flex-1 items-center mt-10 gap-1">
          <Text className="text-[20px]" style={{ fontFamily: "Poppins-Bold" }}>
            Welcome, {userData?.name || "User"}
          </Text>
          <Text className="text-gray-1 mx-14 text-center">
            You are all set now, let's reach your goals together with us
          </Text>
        </View>
        <View className="flex-1 w-full justify-end mb-12">
          <Button
            title={"Go To Home"}
            textColor={"#fff"}
            image={null}
            onPress={() => {
              completeOnboarding(userData?.user_id ?? null);
              router.replace("/(tabs)/onboarding");
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default welcome;
