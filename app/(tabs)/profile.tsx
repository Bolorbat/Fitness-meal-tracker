import { FIREBASE_APP, FIREBASE_AUTH, FIREBASE_DB } from "@/FirebaseConfig";
import { NavigationProp } from "@react-navigation/core";
import React from "react";
import { Button, ScrollView, Text, TouchableOpacity, View } from "react-native";
import * as PhosporIcons from "phosphor-react-native";

type ListItemPros = {
  label: string;
  icon: keyof typeof PhosporIcons;
  onPress: () => void;
  isLast?: boolean;
};
const accountItems: ListItemPros[] = [
  {
    label: "Personal Details",
    icon: "User",
    onPress: () => console.log("Clicked Personal detail"),
  },
  {
    label: "Preferences",
    icon: "GearSix",
    onPress: () => console.log("Clicked Personal detail"),
  },
  {
    label: "Language",
    icon: "Globe",
    onPress: () => console.log("Clicked Personal detail"),
  },
  {
    label: "Upgrade to Family Plan",
    icon: "GridFour",
    onPress: () => console.log("Clicked Personal detail"),
  },
];

const goalItems: ListItemPros[] = [
  {
    label: "Edit Nutrition Goals",
    icon: "ArrowArcLeft",
    onPress: () => console.log("Edit Nutrient"),
  },
  {
    label: "Goals & current weight",
    icon: "Flag",
    onPress: () => console.log("Goals"),
  },
  {
    label: "Weight History",
    icon: "MaskHappy",
    onPress: () => console.log("Weight History"),
  },
];

const accountActionItems: ListItemPros[] = [
  {
    label: "Log Out",
    icon: "SignOut",
    onPress: () => FIREBASE_AUTH.signOut,
  },
  {
    label: "Delete Account",
    icon: "Trash",
    onPress: () => console.log("Delete account"),
  },
];

const ProfileScreen = () => {
  return (
    <View className="flex-1">
      <ScrollView className="px-5 pt-14 pb-24">
        {/* Profile Section */}
        <View className="flex-row items-center mb-6 space-x-4">
          <View className="w-16 h-16 rounded-full bg-gray-800 items-center justify-center">
            <Text className="text-white text-xs font-bold text-center">
              GET{"\n"}REKT
            </Text>
          </View>
          <View>
            <Text className="text-[#555] text-lg font-semibold">
              Tap to set name
            </Text>
            <Text className="text-gray-400 text-sm">and username</Text>
          </View>
        </View>

        {/* Invite Friends */}
        <TouchableOpacity className="bg-[#232028] rounded-xl p-4 flex-row items-center mb-6">
          {/* <Feather size={22} color="#fff" /> */}
          <View className="ml-3 flex-1">
            <Text className="text-white font-semibold text-base">
              Refer a friend and earn $10
            </Text>
            <Text className="text-gray-400 text-sm">
              Earn $10 per friend that signs up with your promo code.
            </Text>
          </View>
        </TouchableOpacity>

        {/* Account Section */}
        <Section title="Account">
          {accountItems.map((item, index) => (
            <ListItem
              key={item.label}
              label={item.label}
              icon={item.icon}
              onPress={item.onPress}
              isLast={index === accountItems.length - 1}
            />
          ))}
        </Section>

        {/* Goals & Tracking */}
        <Section title="Goals & Tracking">
          {goalItems.map((item, index) => (
            <ListItem
              key={item.label}
              label={item.label}
              icon={item.icon}
              onPress={item.onPress}
              isLast={index === goalItems.length - 1}
            />
          ))}
        </Section>

        <Section title={"Account actions"}>
          {accountActionItems.map((item, index) => (
            <ListItem
              key={item.label}
              label={item.label}
              icon={item.icon}
              onPress={item.onPress}
              isLast={index === accountActionItems.length - 1}
            />
          ))}
        </Section>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;

// Components
const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <View className="mb-6">
    <Text className="text-gray-400 uppercase text-sm font-semibold mb-2">
      {title}
    </Text>
    <View className="bg-[#DDDDDD] rounded-xl">{children}</View>
  </View>
);

const ListItem = ({ label, icon, onPress, isLast }: ListItemPros) => {
  const IconComponent = PhosporIcons[icon] as React.ComponentType<
    React.ComponentProps<typeof PhosporIcons.User>
  >;
  return (
    <TouchableOpacity
      className="flex-row items-center px-4 py-3 last:border-b-0"
      onPress={onPress}
    >
      {IconComponent && <IconComponent size={20} color="#555" />}
      <Text className="text-black ml-3 flex-1 font-PoppinsRegular">
        {label}
      </Text>
      <PhosporIcons.ArrowRightIcon size={20} color="#555" />
      {!isLast && (
        <View
          style={{
            bottom : 0,
            left: '5%',
            position : "absolute",
            height : 0.6,
            width: "98%",
            backgroundColor: "black",
          }}
        />
      )}
    </TouchableOpacity>
  );
};

const NavItem = ({
  label,
  icon,
  active,
}: {
  label: string;
  icon: string;
  active?: boolean;
}) => (
  <View className="items-center">
    {/* <Ionicons
      name={icon as any}
      size={24}
      color={active ? "#FACC15" : "#9CA3AF"}
    /> */}
    <Text className={`${active ? "text-yellow-400" : "text-gray-400"} text-xs`}>
      {label}
    </Text>
  </View>
);
