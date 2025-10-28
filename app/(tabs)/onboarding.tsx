import { db } from "@/database/services/DataBaseService";
import { useUserGoal } from "@/hooks/userGoal";
import { UserGoal } from "@/models/usergoals";
import { Image } from "expo-image";
import { useFocusEffect, useRouter } from "expo-router";
import { memo, useMemo, useCallback, useEffect, useRef, useState } from "react";
import {
  Button,
  Dimensions,
  FlatList,
  ImageSourcePropType,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
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
import ToastManager, { Toast } from "toastify-react-native";
import { getDate, getTime, getYear } from "@/utils/dateHelper";
import { colors } from "@/theme/colors";

type DailyGoalConfig = {
  leftValue: number;
  maxValue: number;
  label: string;
  strokeColor: string;
  icon: ImageSourcePropType;
};

type WeekDay = {
  day: number;
  monthOffset: -1 | 0 | 1;
};

const END_POSITION = -100;
const CARD_HEIGHT = 120;
const SCREEN_WIDTH = Dimensions.get("screen").width;
const DAYS_SIZE = 40;
const OVERFLOW_WIDTH = DAYS_SIZE * 0.7;

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

const getWeekIndex = (day: number) => {
  // 0 = Sunday → shift by the start day of the month
  const startDayOfWeek = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  ).getDay();
  return Math.floor((day + startDayOfWeek - 1) / 7);
};

type Props = {
  days: WeekDay[];
  currentDay: WeekDay | null; // currently selected day
  onDayChanged: (day: WeekDay, date: string) => void;
};

const Days = memo(({ days, currentDay, onDayChanged }: Props) => {
  const flatListRef = useRef<FlatList<WeekDay>>(null);

  const usableWidth = SCREEN_WIDTH - 2 * OVERFLOW_WIDTH;
  const gap = (usableWidth - 7 * DAYS_SIZE) / 6;
  const itemWidth = DAYS_SIZE + gap;
  const weekWidth = itemWidth * 7;
  const sidePadding = 7;

  useEffect(() => {
    if (!flatListRef.current || currentDay === null) return;

    // Scroll to the week containing the currentDay
    const index = days.findIndex(
      (d) => d.day === currentDay.day && d.monthOffset === currentDay.monthOffset
    );
    const currentWeekIndex = Math.floor(index / 7);

    flatListRef.current.scrollToOffset({
      offset: currentWeekIndex * weekWidth,
      animated: false,
    });
  }, [days, currentDay]);

  const getItemLayout = (
    _data: ArrayLike<WeekDay> | null | undefined,
    index: number
  ) => ({
    length: itemWidth,
    offset: index * itemWidth,
    index,
  });

  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const weekIndex = Math.round(x / weekWidth);

    const firstDayOfWeek = weekIndex * 7;
    flatListRef.current?.scrollToOffset({
      offset: weekIndex * weekWidth,
      animated: true,
    });
  };

  const changeDay = (dayObj: WeekDay) => {
    const from = new Date();
    let year = from.getFullYear();
    let month = from.getMonth() + dayObj.monthOffset; // adjust month if previous/next
    if (month < 0) {
      month = 11;
      year -= 1;
    } else if (month > 11) {
      month = 0;
      year += 1;
    }

    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      dayObj.day
    ).padStart(2, "0")}`;
    onDayChanged({day : dayObj.day, monthOffset : dayObj.monthOffset}, dateStr);
  };

  const today = new Date().getDate();

  return (
    <FlatList
      ref={flatListRef}
      data={days}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => `${item.monthOffset}-${item.day}`} // unique keys
      snapToInterval={weekWidth}
      decelerationRate="fast"
      removeClippedSubviews={false}
      style={{ overflow: "hidden", marginBottom: 20 }}
      contentContainerStyle={{
        overflow: "visible",
        paddingHorizontal: sidePadding,
      }}
      ItemSeparatorComponent={() => <View style={{ width: gap }} />}
      getItemLayout={getItemLayout}
      onMomentumScrollEnd={onMomentumScrollEnd}
      renderItem={({ item }) => {
        const isCurrent = item.day === currentDay?.day && item.monthOffset === currentDay.monthOffset;
        return (
          <Pressable
            style={{
              width: DAYS_SIZE,
              height: DAYS_SIZE,
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 1,
              borderColor:
                item.day < today && item.monthOffset === 0
                  ? colors.gray[1]
                  : "black",
              borderRadius: 16,
              backgroundColor: isCurrent ? colors.pink.dark : "white",
            }}
            onPress={() => changeDay(item)}
          >
            <Text
              style={{
                color:
                  item.day < today && item.monthOffset === 0
                    ? colors.gray[1]
                    : "black",
              }}
            >
              {item.day}
            </Text>
          </Pressable>
        );
      }}
    />
  );
});

const CaloriesCard = memo(
  ({
    dailyCalories,
    totalCalories,
  }: {
    dailyCalories: number;
    totalCalories: number;
  }) => {
    return (
      <View className="flex-row rounded-2xl shadow-md bg-white h-[150px]">
        <View className="w-1/2 h-full items-start justify-center pl-8">
          <Text className="font-PoppinsSemiBold text-[42px]">
            {Math.round(dailyCalories - totalCalories) || 0}
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
);

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

const RecentFoodCard = memo(
  ({ meal, onDelete }: { meal: MealItem; onDelete: () => void }) => {
    const onLeft = useSharedValue(true);
    const position = useSharedValue(0);
    const itemHeight = useSharedValue(CARD_HEIGHT);
    const cardOpacity = useSharedValue(1);
    const deleteOpacity = useSharedValue(1);

    const panGesture = Gesture.Pan()
      .activeOffsetX([-10, 10])
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
                  {Math.round(meal.calories) + " calories"}
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
);

export default function Onboarding() {
  const router = useRouter();
  const { userGoal } = useUserGoal();
  const [goalsState, setGoalsState] = useState<DailyGoalConfig[]>([]);
  const [mealItems, setMealItems] = useState<MealItem[]>([]);
  const [totalCalories, setTotalCalories] = useState(0);
  const [totalProtein, setTotalProtein] = useState(0);
  const [totalCarbs, setTotalCarbs] = useState(0);
  const [totalFat, setTotalFat] = useState(0);
  const [days, setDays] = useState<WeekDay[]>([]);
  const [currentDay, setCurrentDay] = useState<WeekDay>();
  const [selectedDate, setSelectedDate] = useState(getDate());

  const fetchMeals = useCallback(
    async (date: string) => {
      try {
        const mealData = await db.meal.getBoth(date);

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
    },
    [userGoal]
  );

  const handleDayChange = useCallback(
    (day: WeekDay, date: string) => {
      setCurrentDay(day);
      setSelectedDate(date);
      fetchMeals(date);
    },
    [fetchMeals]
  );

  useFocusEffect(
    useCallback(() => {
      fetchMeals(selectedDate);
    }, [selectedDate, fetchMeals])
  );

  const handleDeleteMeal = async (item: MealItem) => {
    //delete from supabase
    try {
      await db.meal.deleteMeal(item.meal_id);
      Toast.error("Meal deleted");
      setMealItems((prev) => prev.filter((m) => item.meal_id !== m.meal_id));

      fetchMeals(selectedDate);
    } catch (err) {
      console.log(`Error in delete ${item}`, err);
    }
  };

  const navigateToFoodMenu = () => {
    router.push({ pathname: "/foodDetail/foodMenu" });
  };

  useEffect(() => {
    const date = new Date();
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth();
    const today = date.getDate();

    const daysArray: WeekDay[] = [];

    const daysInCurrentMonth = new Date(
      currentYear,
      currentMonth + 1,
      0
    ).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
    const lastDay = new Date(currentYear, currentMonth, daysInCurrentMonth).getDay();

    for (let i = firstDayOfWeek - 1; i >= 1; i--) {
      daysArray.push({
        day: daysInPrevMonth - i,
        monthOffset: -1,
      });
    }

    for (let i = 1; i <= daysInCurrentMonth; i++) {
      daysArray.push({
        day: i,
        monthOffset: 0,
      });
    }

    const todayWeekday = new Date(currentYear, currentMonth, today).getDay();
    const daysLeftInMonth = daysInCurrentMonth - today;

    if (daysLeftInMonth < 7 - todayWeekday - 1) {
      const extraDays = 7 - (lastDay);
      for (let i = 1; i < extraDays; i++) {
        daysArray.push({
          day: i,
          monthOffset: 1,
        });
      }
    }

    setDays(daysArray);
    setCurrentDay({day : today, monthOffset : 0});
  }, []);

  return (
    <FlatList
      className="flex-1 mt-12 p-7"
      data={mealItems}
      keyExtractor={(item) => item.meal_id.toString()}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <>
          <Days
            days={days}
            currentDay={currentDay ?? null}
            onDayChanged={handleDayChange}
          />
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
