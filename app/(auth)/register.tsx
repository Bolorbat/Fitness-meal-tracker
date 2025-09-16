import Button from "@/components/Button";
import Text from "@/components/CustomText";
import GradientText from "@/components/GradientText";
import Input from "@/components/input";
import { useAuth } from "@/contexts/autoContext";
import { db } from "@/database/services/DataBaseService";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { EnvelopeSimpleIcon, LockIcon, UserIcon } from "phosphor-react-native";
import React, { useState } from "react";
import { Pressable, SafeAreaView, View } from "react-native";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { register } = useAuth();

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const userCredential = await register(email, password, firstName);
      const uid = userCredential.user.uid;

      await db.users.create({
        user_id: uid,
        name: firstName,
        email: email,
      });
      router.push({
        pathname: "/userOnboarding",
      });
    } catch (error: any) {
      console.log("Error create user", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-7">
        <View className="w-full h-24 justify-center items-center">
          <Text className="font-2xl" style={{ fontSize: 18 }}>
            Hey there,
          </Text>
          <Text
            className=""
            style={{ fontFamily: "Poppins-Bold", fontSize: 24 }}
          >
            Create an Account
          </Text>
        </View>

        <View className="gap-5 mt-5">
          <Input
            placeholder={"First Name"}
            value={firstName}
            onChangeText={(value) => setFirstName(value)}
            icon={<UserIcon size={20} style={{}} />}
          />
          <Input
            placeholder={"Last Name"}
            value={lastName}
            onChangeText={(value) => setLastName(value)}
            icon={<UserIcon size={20} />}
          />
          <Input
            placeholder={"Email"}
            value={email}
            onChangeText={(value) => setEmail(value)}
            icon={<EnvelopeSimpleIcon size={20} />}
          />
          <Input
            placeholder={"Password"}
            value={password}
            secureTextEntry={true}
            onChangeText={(value) => setPassword(value)}
            icon={<LockIcon size={20} />}
          />

          <View className="gap-3" style={{ marginTop: 200 }}>
            <Button
              onPress={handleSignUp}
              title={"Register"}
              textColor={"#fff"}
              image={null}
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
              Already have an account?
            </Text>
            <Pressable
              className="justify-center"
              onPress={() => router.push("/login")}
            >
              <GradientText
                colors={["#C58BF2", "#EEA4CE"]}
                style={{ width: 50 }}
                textStyle={{ fontSize: 16, marginTop: 1.8 }}
              >
                Login
              </GradientText>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Register;
