import { FIREBASE_AUTH } from "@/FirebaseConfig";
import { NavigationProp } from "@react-navigation/core";
import React from "react";
import { Button, Text, View } from "react-native";

interface RouterProfs {
  navigation: NavigationProp<any, any>;
}

const Profile = ({ navigation }: RouterProfs) => {
  // const User = database.getUser();
  // console.table(User);
  return (
    <View className="flex-1 justify-center items-center">
      <Text>Profile</Text>
      <Button title={"Log Out"} onPress={() => FIREBASE_AUTH.signOut()} />
    </View>
  );
};

export default Profile;
