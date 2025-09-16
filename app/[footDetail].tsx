import { searchFood } from "@/api/fatsecret/foodApi";
import Text from "@/components/CustomText";
import { MealItem } from "@/models/meal";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const foodDetails = () => {
  const { mealName } = useLocalSearchParams<{ mealName: string }>();
  const [mealData, setMealData] = useState<MealItem>();
  const fetchFood = async () => {
    try {
      const foodData = await searchFood({ query: mealName, maxResults: 1 });
      if (foodData) setMealData(foodData[0]);
    } catch (err) {
      console.log("Error in foodDetails : " + err);
      throw err;
    }
  };
  fetchFood();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-7">
        <Text>Food : {mealData?.food_name}</Text>
      </View>
    </SafeAreaView>
  );
};

export default foodDetails;
