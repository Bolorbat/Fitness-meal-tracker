import Button from "@/components/Button";
import Text from "@/components/CustomText";
import GradientText from "@/components/GradientText";
import Input from "@/components/input";
import { useAuth } from "@/contexts/autoContext";
import { db } from "@/database/services/DataBaseService";
import { useOnboardingStatus } from "@/hooks/useOnboarding";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { EnvelopeSimpleIcon, LockIcon } from "phosphor-react-native";
import React, { useState } from "react";
import { Pressable, SafeAreaView, View } from "react-native";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login, user, initializing } = useAuth();
  const userOnboardingStatus = useOnboardingStatus(user?.uid);

  const displayUsers = async () => {
    const result = await db.users.findAll();
    console.log(result);
  };
  displayUsers();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await login(email, password);
      if (res && userOnboardingStatus !== "done")
        router.replace("/(auth)/userOnboarding");
      console.log("Login successful:");
    } catch (error: any) {
      console.log("Login error:", error);
      // Handle specific error cases
      if (error.code === "auth/user-not-found") {
        alert("No user found with this email");
      } else if (error.code === "auth/wrong-password") {
        alert("Incorrect password");
      } else if (error.code === "auth/invalid-email") {
        alert("Invalid email format");
      } else {
        alert("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    // <KeyboardAvoidingView className="flex flex-1 bg-white p-7"
    //     behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-7">
        <View className="w-full h-24 justify-center items-center ">
          <Text className="font-2xl" style={{ fontSize: 18 }}>
            Hey there,
          </Text>
          <Text
            className=""
            style={{ fontFamily: "Poppins-Bold", fontSize: 24 }}
          >
            Welcome Back
          </Text>
        </View>

        <View className="gap-5 mt-5">
          <Input
            placeholder={"Email"}
            value={email}
            onChangeText={setEmail}
            icon={<EnvelopeSimpleIcon size={20} />}
          />
          <Input
            placeholder={"Password"}
            value={password}
            secureTextEntry={true}
            onChangeText={setPassword}
            icon={<LockIcon size={20} />}
          />

          <Text className="text-center text-[#ADA4A5] -mt-2 underline">
            Forget your password?
          </Text>

          <View className="gap-3" style={{ marginTop: 310 }}>
            <Button
              onPress={() => handleLogin()}
              title={"Login"}
              textColor={"#fff"}
              image={require("../../assets/icons/Login.png")}
            />
          </View>

          <View className="flex-row items-center mt-32my-4 bg">
            <View className="flex-1 h-[1px] bg-gray-300"></View>
            <Text className="mx-3 text-center">Or</Text>
            <View className="flex-1 h-[1px] bg-gray-300"></View>
          </View>

          <View className="flex flex-row h-16 items-center justify-center gap-7">
            <Pressable
              className="w-16 items-center justify-center h-full rounded-2xl border border-[#DDDADA]"
              onPress={() => console.log("google clicked")}
            >
              <Image
                source={require("../../assets/icons/google_logo.png")}
                style={{ width: 25, height: 25 }}
              />
            </Pressable>
            <Pressable
              className="w-16 items-center justify-center h-full rounded-2xl border border-[#DDDADA]"
              onPress={() => console.log("facebook clicked")}
            >
              <Image
                source={require("../../assets/icons/facebook_logo.png")}
                style={{ width: 25, height: 25 }}
              />
            </Pressable>
          </View>

          <View className="flex-row items-center justify-center gap-1">
            <Text className="text-center" style={{ fontSize: 16 }}>
              Don&#39;t have an account yet?
            </Text>
            <Pressable
              className="justify-center"
              onPress={() => router.push("/register")}
            >
              <GradientText
                colors={["#C58BF2", "#EEA4CE"]}
                style={{ width: 70 }}
                textStyle={{ fontSize: 16, marginTop: 1.8 }}
              >
                Register
              </GradientText>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
    // </KeyboardAvoidingView>
  );
};

export default Login;
