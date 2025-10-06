import CustomText from "@/components/CustomText";
import { db } from "@/database/services/DataBaseService";
import { fetchFood } from "@/database/supabase/fetchFood";
import { Meal, MealItem } from "@/models/meal";
import { searchFood } from "@/services/api/foodApi";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { FireIcon } from "phosphor-react-native";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  ImageSourcePropType,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";

type NutritionProps = {
  icon: ImageSourcePropType;
  name: string;
  value: number;
};

const MeasurementType: string[] = ["Medium", "Small", "Large", "S"];

function MeasurementButtons({
  type,
  selected,
  onPress,
}: {
  type: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-1 h-fit justify-center items-center rounded-full ${selected ? "bg-black" : "bg-slate-200"} `}
    >
      <CustomText className={`${selected ? "text-white" : "text-black"}`}>
        {type}
      </CustomText>
    </Pressable>
  );
}

function CaloryCard({ calories }: { calories: number }) {
  return (
    <View className="mt-16 flex-row h-[80px] border border-gray-2 rounded-3xl gap-2 items-center">
      <View className="ml-2 rounded-xl bg-gray-2 w-[40px] h-[40px] justify-center items-center">
        <FireIcon style={{ width: 20, height: 20 }} />
      </View>
      <View className="flex-col">
        <Text className="font-PoppinsRegular">Calories</Text>
        <Text className="font-PoppinsBold text-3xl">{calories}</Text>
      </View>
    </View>
  );
}

function NutritionCards({ data }: { data: NutritionProps }) {
  return (
    <View className="flex-1 flex-row p-2 border border-gray-2 rounded-3xl">
      <View className="rounded-xl w-[20px] h-[20px] bg-gray-2 justify-center items-center">
        <Image source={data.icon} style={{ width: 15, height: 15 }} />
      </View>
      <View className="ml-1">
        <Text className="font-PoppinsRegular">{data.name}</Text>
        <Text className="font-PoppinsSemiBold">{data.value + "g"}</Text>
      </View>
    </View>
  );
}

const FoodDetails = () => {
  const { mealName } = useLocalSearchParams<{ mealName: string }>();
  const [mealData, setMealData] = useState<MealItem>();
  const [currentMeasure, setCurrentMeasure] = useState<string>("Medium");
  const [currentServings, setCurrentServings] = useState<string>("1");

  const HandleOnMeasurement = (type: string) => {
    console.log(type);
    setCurrentMeasure(type);
  };

  const HandleOnLog = async (): Promise<void> => {
    if (mealData) {
      const meal: Meal = {
        name: "lunch",
        date: "2025-05-02",
        synced: 0,
        created_at: "12:30",
      };
      const mealId = await db.meal.addMeal(meal);
      const mealItem = {
        ...mealData,
        meal_id: mealId,
      };
      await db.meal.addMealItem(mealItem);
    }
  };

  useEffect(() => {
    const fetchFoodData = async () => {
      try {
        // const foodData = await searchFood({
        //   query: mealName,
        //   portion_size: 0,
        // });
        const foodData = await fetchFood({ name: mealName });
        if (foodData) setMealData(foodData[0]);
        const mealItems = await db.meal.getMealItems();
        const meal = await db.meal.getMeal();
        console.log("meal: " ,meal);
        console.log("items : ", mealItems);
      } catch (err) {
        console.log("Error in foodDetails : " + err);
      }
    };

    if (mealName) fetchFoodData();
  }, [mealName]);

  const Nutritions: NutritionProps[] = [
    {
      icon: require("./../../assets/icons/meal.png"),
      name: "Protein",
      value: mealData?.protein ?? 0,
    },
    {
      icon: require("./../../assets/icons/meal.png"),
      name: "Carbs",
      value: mealData?.carbs ?? 0,
    },
    {
      icon: require("./../../assets/icons/meal.png"),
      name: "Fats",
      value: mealData?.fat ?? 0,
    },
  ];

  return (
    <View className="flex-1 px-7 pt-2 bg-white">
      <Text className="font-PoppinsBold text-2xl">{mealName}</Text>
      <View className="flex-1 p-2">
        <Text className="font-PoppinsBold t-2 text-l">Measurement</Text>
        <View className="flex flex-row h-[50px] gap-3 top-4">
          {MeasurementType.map((item, idx) => (
            <MeasurementButtons
              key={idx}
              type={item}
              selected={currentMeasure === item}
              onPress={() => HandleOnMeasurement(item)}
            />
          ))}
        </View>

        <View className="flex top-8 h-[40px] bg-red flex-row justify-between items-center">
          <Text className="font-PoppinsBold text-l">Number of Servings</Text>
          <View className="w-[130px] h-full border rounded-2xl">
            <TextInput
              onChangeText={setCurrentServings}
              className="text-center"
            >
              {currentServings}
            </TextInput>
          </View>
        </View>

        <CaloryCard calories={mealData?.calories || 0} />

        <View className="flex-row gap-2 mt-2 h-[60px]">
          {Nutritions.map((item, idx) => (
            <NutritionCards key={idx} data={item} />
          ))}
        </View>

        <TouchableOpacity
          activeOpacity={0.75}
          className="absolute bottom-10 w-full h-[50px] bg-black rounded-full justify-center"
          onPress={HandleOnLog}
        >
          <Text className="font-PoppinsRegular text-center text-white text-xl">
            Log
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FoodDetails;
