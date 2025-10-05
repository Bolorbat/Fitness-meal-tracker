import Button from "@/components/Button";
import Text from "@/components/CustomText";
import { db } from "@/database/services/DataBaseService";
import { useUser } from "@/hooks/userHook";
import { User } from "@/models/user";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Dimensions, Platform, SafeAreaView, View } from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";

type GoalConfig = {
  image: any;
  name: string;
  description: string;
};

const goalData: GoalConfig[] = [
  {
    image: require("@/assets/images/Mass.png"),
    name: "Improve Shape",
    description:
      "I have a low amount of body fat and need / want to build more muscle",
  },
  {
    image: require("@/assets/images/Lean.png"),
    name: "Lean & Tone",
    description:
      "I'm “skinny fat”. look thin but have no shape. I want to add learn muscle in the right way",
  },
  {
    image: require("@/assets/images/loseFat.png"),
    name: "Lose a Fat",
    description:
      "I have over 20 lbs to lose. I want to drop all this fat and gain muscle mass",
  },
];

const width = Dimensions.get("window").width;

async function setUserGoal(user: User | null, goalIdx: number) {
  if (!user) return;
  const goalName = goalData[goalIdx].name;
  try {
    await db.goal.create(user, goalName);
  } catch (err) {
    console.log(err);
  }
}

const Goal = () => {
  const [active, setActive] = useState(0);
  const ref = useRef<ICarouselInstance>(null);
  const { userData, loading } = useUser();
  const router = useRouter();

  const handleScroll = (offset: number) => {
    const itemWidth = width;
    const totalItems = goalData.length;

    const rawIndex = Math.round(offset / itemWidth);
    const correctedIndex = ((rawIndex % totalItems) + totalItems) % totalItems;

    if (correctedIndex !== active) {
      setActive(correctedIndex);
    }
  };

  const handleConfirm = async () => {
    await setUserGoal(userData, active);
    router.push("/welcome");
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 items-center justify-center px-7 py-7">
        <Text
          className="mt-2 text-[24px]"
          style={{ fontFamily: "Poppins-Bold" }}
        >
          What is your goal ?
        </Text>
        <Text className="text-[#7B6F72] text-center">
          It will help us to choose a best {"\n"} program for you
        </Text>

        {/* <View style={{ paddingHorizontal: 20, paddingVertical: 20 }}> */}
        <Carousel
          loop
          ref={ref}
          width={width}
          height={width * 1.35}
          data={goalData}
          onProgressChange={handleScroll}
          scrollAnimationDuration={1000}
          modeConfig={{
            parallaxScrollingScale: 0.85,
            parallaxScrollingOffset: 75,
          }}
          mode="parallax"
          renderItem={({ item, index }) => (
            <View
              className="flex-1 rounded-[35px] items-center justify-center"
              style={Platform.OS === "ios" ? shadowStyles : androidStyles}
            >
              <LinearGradient
                colors={["#92A3FD", "#9DCEFF"]}
                start={{ x: 1, y: 0.5 }}
                end={{ x: 0, y: 0.5 }}
                className="flex rounded-[35px] justify-center"
                style={{ flex: 1, borderRadius: 35, justifyContent: "center" }}
              >
                <Image
                  source={item.image}
                  contentFit="contain"
                  style={{
                    width: 240,
                    height: 400,
                    alignSelf: "center",
                    // top: 30,
                    // position: "absolute",
                  }}
                />
                <Text
                  className=" self-center text-white text-[22px]"
                  style={{ fontFamily: "Poppins-SemiBold" }}
                >
                  {item.name}
                </Text>
                <View className="w-24 h-[2px] bg-white self-center mb-4" />
                <Text className=" self-center  text-[16px] text-white px-12 text-center">
                  {item.description}
                </Text>
              </LinearGradient>
            </View>
          )}
        />
        {/* </View> */}
        <View className="flex-1 w-full justify-end mb-12">
          <Button
            title={"Confirm"}
            textColor={"#fff"}
            image={null}
            onPress={handleConfirm}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const shadowStyles = {
  shadowColor: "#C58BF2",
  shadowOffset: {
    width: 0,
    height: 15,
  },
  shadowOpacity: 0.3,
  shadowRadius: 10,
};

const androidStyles = {
  elevation: 10,
};

export default Goal;
