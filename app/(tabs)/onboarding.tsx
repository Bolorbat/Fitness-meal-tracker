import { db } from "@/database/services/DataBaseService";
import { useUserGoal } from "@/hooks/userGoal";
import { UserGoal } from "@/models/usergoals";
import { Image } from "expo-image";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Button, ImageSourcePropType, ScrollView, View } from "react-native";
import Text from "./../../components/CustomText";
import CircularProgress from "react-native-circular-progress-indicator";
import { MealItem } from "@/models/meal";
import { supabase } from "@/database/supabase/supabaseClient";

type DailyGoalConfig = {
  leftValue: number;
  maxValue: number;
  label: string;
  strokeColor: string;
  icon: ImageSourcePropType;
};

function mapUserGoalToDailyConfig(
  userGoal: UserGoal | null
): DailyGoalConfig[] {
  if (!userGoal) return [];

  return [
    {
      leftValue: userGoal.target_protein ?? 0,
      maxValue: userGoal.target_protein ?? 0,
      label: "Protein",
      strokeColor: "#de6969",
      icon: require("./../../assets/icons/workout.png"),
    },
    {
      leftValue: userGoal.target_carbs ?? 0,
      maxValue: userGoal.target_carbs ?? 0,
      label: "Carbs",
      strokeColor: "#de9a69",
      icon: require("./../../assets/icons/workout.png"),
    },
    {
      leftValue: userGoal.target_fat ?? 0,
      maxValue: userGoal.target_fat ?? 0,
      label: "Fat",
      strokeColor: "#6998de",
      icon: require("./../../assets/icons/workout.png"),
    },
  ];
}

function CaloriesCard({ dailyCalories }: { dailyCalories: number }) {
  return (
    <View className="flex-row rounded-2xl shadow-md bg-white h-[150px]">
      <View className="w-1/2 h-full items-start justify-center pl-8">
        <Text className="font-PoppinsSemiBold text-[42px]">
          {dailyCalories || 0}
        </Text>
        <Text className="-mt-2" style={{ fontSize: 14 }}>
          Calories left
        </Text>
      </View>
      <View className="w-1/2 h-full items-center justify-center relative">
        <CircularProgress
          value={(50 / dailyCalories) * 100}
          showProgressValue={true}
          activeStrokeColor="#000"
          inActiveStrokeColor="#DDDDDD"
          strokeLinecap="butt"
        />
        <View className="bg-gray-200 rounded-full w-12 h-12 absolute justify-center items-center">
          <Image
            source={require("./../../assets/icons/workout.png")}
            style={{ width: 24, height: 24 }}
          />
        </View>
      </View>
    </View>
  );
}

function NutrientCard({ item }: { item: DailyGoalConfig }) {
  return (
    <View className="flex-1 h-full rounded-2xl items-start shadow-md pt-3 pl-3 bg-white">
      <Text className="font-PoppinsRegular">{item.leftValue}g</Text>
      <Text className="pt-1.5">{item.label} left</Text>
      <View className="pt-4 pl-2 items-center justify-center relative">
        <CircularProgress
          value={item.maxValue - item.leftValue}
          maxValue={item.maxValue}
          radius={35}
          showProgressValue={false}
          activeStrokeColor={item.strokeColor}
          inActiveStrokeWidth={8}
          activeStrokeWidth={8}
          inActiveStrokeColor="#DDDDDD"
          strokeLinecap="butt"
        />
        <View className="bg-gray-200 rounded-full w-7 h-7 absolute translate-y-2 translate-x-1 items-center justify-center">
          <Image source={item.icon} style={{ width: 20, height: 20 }} />
        </View>
      </View>
    </View>
  );
}

function RecentFoodCard({ meal }: { meal: MealItem }) {
  return (
    <View className="w-full h-32 border border-neutral-500 bg-[#DDDDDD] rounded-2xl py-2">
      <View className="flex-1 flex-col ml-3 mr-3">
        <View className="flex-1 justify-center items-stretch">
          <View className="flex-row justify-between items-center">
            <Text>{meal.food_name}</Text>
            <View className="rounded-full bg-white p-1">
              <Text>10:12</Text>
            </View>
          </View>
        </View>
        <View className="flex-1 justify-center items-start">
          <Text className="text-lg" style={{ fontFamily: "PoppinsSemiBold" }}>
            {meal.calories + " calories"}
          </Text>
        </View>
        <View className="flex-1 flex-row justify-start items-start gap-2">
          <Text>{Math.round(meal.protein) + "g"}</Text>
          <Text>{Math.round(meal.carbs) + "g"}</Text>
          <Text>{Math.round(meal.fat) + "g"}</Text>
        </View>
      </View>
    </View>
  );
}

export default function Onboarding() {
  const router = useRouter();
  const { userGoal } = useUserGoal();
  const [goalsState, setGoalsState] = useState<DailyGoalConfig[]>([]);
  const [mealItems, setMealItems] = useState<MealItem[]>([]);

  useEffect(() => {
    setGoalsState(mapUserGoalToDailyConfig(userGoal));
  }, [userGoal]);

  useFocusEffect(
    useCallback(() => {
      const fetchMeal = async () => {
        try {
          const mealData = await db.meal.getMealItems();
          if (mealData) setMealItems(mealData);
        } catch (err) {
          console.log("error in fetch meal_items", err);
        }
      };

      fetchMeal();
    }, [])
  );

  const navigateToFoodMenu = () => {
    router.push({ pathname: "/foodDetail/foodMenu" });
  };

  return (
    <ScrollView className="flex p-7">
      <CaloriesCard dailyCalories={userGoal?.daily_calories ?? 1} />

      <View className="flex-row mt-3 gap-3" style={{ height: 155 }}>
        {goalsState.map((item, idx) => (
          <NutrientCard key={idx} item={item} />
        ))}
      </View>

      <Text
        className="mt-7 mb-2"
        style={{ fontFamily: "PoppinsSemiBold", fontSize: 18 }}
      >
        Recently uploaded
      </Text>

      <View className="flex-col mt-3 gap-3">
        {mealItems.map((item, idx) => (
          <RecentFoodCard key={idx} meal={item} />
        ))}
      </View>

      <Button title="Add Food" onPress={navigateToFoodMenu} />
    </ScrollView>
  );
}
