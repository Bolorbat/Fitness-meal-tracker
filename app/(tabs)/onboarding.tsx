import { db } from "@/database/services/DataBaseService";
import { useUserGoal } from "@/hooks/userGoal";
import { UserGoal } from "@/models/usergoals";
import { Image } from "expo-image";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Button,
  Dimensions,
  FlatList,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  useAnimatedValue,
  useWindowDimensions,
  View,
} from "react-native";
import Text from "./../../components/CustomText";
import CircularProgress from "react-native-circular-progress-indicator";
import { Meal, MealItem } from "@/models/meal";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { TrashIcon } from "phosphor-react-native";
import { useAuth } from "@/contexts/autoContext";

type DailyGoalConfig = {
  leftValue: number;
  maxValue: number;
  label: string;
  strokeColor: string;
  icon: ImageSourcePropType;
};

const END_POSITION = -100;
const CARD_HEIGHT = 120;
const SCREEN_WIDTH = Dimensions.get("screen").width;

function mapUserGoalToDailyConfig(
  userGoal: UserGoal | null,
  totals: { protein: number; carbs: number; fat: number }
): DailyGoalConfig[] {
  if (!userGoal) return [];

  return [
    {
      leftValue: Math.round(userGoal.target_protein - totals.protein),
      maxValue: userGoal.target_protein ?? 0,
      label: "Protein",
      strokeColor: "#de6969",
      icon: require("./../../assets/icons/workout.png"),
    },
    {
      leftValue: Math.round(userGoal.target_carbs - totals.carbs),
      maxValue: userGoal.target_carbs ?? 0,
      label: "Carbs",
      strokeColor: "#de9a69",
      icon: require("./../../assets/icons/workout.png"),
    },
    {
      leftValue: Math.round(userGoal.target_fat - totals.fat),
      maxValue: userGoal.target_fat ?? 0,
      label: "Fat",
      strokeColor: "#6998de",
      icon: require("./../../assets/icons/workout.png"),
    },
  ];
}

function CaloriesCard({
  dailyCalories,
  totalCalories,
}: {
  dailyCalories: number;
  totalCalories: number;
}) {
  return (
    <View className="flex-row rounded-2xl shadow-md bg-white h-[150px]">
      <View className="w-1/2 h-full items-start justify-center pl-8">
        <Text className="font-PoppinsSemiBold text-[42px]">
          {dailyCalories - totalCalories || 0}
        </Text>
        <Text className="-mt-2" style={{ fontSize: 14 }}>
          Calories left
        </Text>
      </View>
      <View className="w-1/2 h-full items-center justify-center relative">
        <CircularProgress
          value={(totalCalories / dailyCalories) * 100}
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
    <View className="flex-1 h-full rounded-2xl items-start shadow-md p-3 bg-white">
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

function RecentFoodCard({
  meal,
  onDelete,
}: {
  meal: MealItem;
  onDelete: () => void;
}) {
  const onLeft = useSharedValue(true);
  const position = useSharedValue(0);
  const itemHeight = useSharedValue(CARD_HEIGHT);
  const cardOpacity = useSharedValue(1);
  const deleteOpacity = useSharedValue(1);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (onLeft.value) {
        position.value = e.translationX;
      } else {
        position.value = END_POSITION + e.translationX;
      }
    })
    .onEnd((e) => {
      if (position.value < END_POSITION / 2) {
        position.value = withTiming(END_POSITION, undefined);
        onLeft.value = false;
      } else {
        position.value = withTiming(0, undefined);
        onLeft.value = true;
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: position.value }],
    height: itemHeight.value,
    opacity: cardOpacity.value,
  }));

  const deleteAnimatedStyle = useAnimatedStyle(() => ({
    height: itemHeight.value,
    opacity: deleteOpacity.value,
  }));

  const handleDelete = () => {
    // Animate card sliding fully left
    deleteOpacity.value = 0;
    position.value = withTiming(
      -SCREEN_WIDTH,
      { duration: 300 },
      (finished) => {
        if (finished) {
          // After it slides off, shrink height to remove visually
          cardOpacity.value = withTiming(0, { duration: 150 });
          itemHeight.value = withTiming(0, { duration: 200 }, (done) => {
            if (done) {
              runOnJS(onDelete)();
            }
          });
        }
      }
    );
  };

  return (
    <GestureHandlerRootView>
      <Animated.View
        style={[deleteAnimatedStyle]}
        className="w-[200px] h-[120px] bg-red-400 absolute right-1 justify-start items-end rounded-2xl"
      >
        <TouchableOpacity
          className="h-full justify-center items-end"
          onPress={handleDelete}
        >
          <TrashIcon style={{ width: 20, height: 20, marginRight: 40 }} />
        </TouchableOpacity>
      </Animated.View>
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[animatedStyle]}
          className="w-full h-[120px] border border-neutral-500 bg-[#DDDDDD] rounded-2xl py-2 mb-3"
        >
          <View className="flex-1 flex-col ml-3 mr-3">
            <View className="flex-1 justify-center items-stretch">
              <View className="flex-row justify-between items-center">
                <Text>{meal.food_name}</Text>
                <View className="rounded-full bg-white p-1">
                  <Text>{meal.time?.slice(0, 5)}</Text>
                </View>
              </View>
            </View>
            <View className="flex-1 justify-center items-start">
              <Text
                className="text-lg"
                style={{ fontFamily: "PoppinsSemiBold" }}
              >
                {meal.calories + " calories"}
              </Text>
            </View>
            <View className="flex-1 flex-row justify-start items-start gap-2">
              <Text>{Math.round(meal.protein) + "g"}</Text>
              <Text>{Math.round(meal.carbs) + "g"}</Text>
              <Text>{Math.round(meal.fat) + "g"}</Text>
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

export default function Onboarding() {
  const router = useRouter();
  const { userGoal } = useUserGoal();
  const [goalsState, setGoalsState] = useState<DailyGoalConfig[]>([]);
  const [mealItems, setMealItems] = useState<MealItem[]>([]);
  const [totalCalories, setTotalCalories] = useState(0);
  const [totalProtein, setTotalProtein] = useState(0);
  const [totalCarbs, setTotalCarbs] = useState(0);
  const [totalFat, setTotalFat] = useState(0);

  const fetchMeals = async () => {
    try {
      const mealData = await db.meal.getBoth();

      const totals = mealData.reduce(
        (acc, item) => {
          acc.calories += item.calories;
          acc.protein += item.protein;
          acc.carbs += item.carbs;
          acc.fat += item.fat;
          return acc;
        },
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      );

      setTotalCalories(totals.calories);
      setTotalProtein(totals.protein);
      setTotalCarbs(totals.carbs);
      setTotalFat(totals.fat);

      setMealItems(mealData);

      setGoalsState(mapUserGoalToDailyConfig(userGoal, totals));
    } catch (err) {
      console.log("error in fetch meal_items", err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMeals();
    }, [userGoal])
  );

  const handleDeleteMeal = async (item: MealItem) => {
    //delete from supabase
    try {
      await db.meal.deleteMeal(item.meal_id);
      setMealItems((prev) => prev.filter((m) => item.meal_id !== m.meal_id));

      fetchMeals();
    } catch (err) {
      console.log(`Error in delete ${item}`, err);
    }
  };

  const navigateToFoodMenu = () => {
    router.push({ pathname: "/foodDetail/foodMenu" });
  };

  return (
    <FlatList
      className="flex p-7"
      data={mealItems}
      keyExtractor={(item) => item.meal_id.toString()}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <>
          <CaloriesCard
            dailyCalories={userGoal?.daily_calories ?? 1}
            totalCalories={totalCalories}
          />

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
        </>
      }
      renderItem={({ item }) => (
        <RecentFoodCard meal={item} onDelete={() => handleDeleteMeal(item)} />
      )}
      ListFooterComponent={
        <Button title="Add Food" onPress={navigateToFoodMenu} />
      }
    />
  );
}
