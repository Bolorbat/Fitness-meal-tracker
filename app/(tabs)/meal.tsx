import React, { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { Stack } from "expo-router";
import { Image } from "expo-image";
import CustomText from "@/components/CustomText";
import { MealPlans } from "@/models/meal";
import { fetchMealPlan } from "@/database/supabase/fetchMealPlan";
import { CardSkeleton } from "@/components/CardSkeleton";

const CARD_HEIGHT = 250;

function MealPlanCard({ plan }: { plan: MealPlans }) {
  return (
    <View className="flex-1 mt-12 rounded-3xl shadow-md bg-white" style = {{height : CARD_HEIGHT}}>
      <Image
        source={require("../../assets/images/meal-template.jpg")}
        style={{ width: "100%", height: 100, borderTopLeftRadius: 24, borderTopRightRadius:24 }}
        contentFit="fill"
      />
      <View className="flex p-4">
        <View className="">
          <Text className="font-PoppinsSemiBold text-[20px]">
            {plan.plan_name}
          </Text>
        </View>
        <Text className="text-justify text-[16px] color-gray-1">
          {plan.description}
        </Text>
        <View className="flex flex-row gap-6 mt-8">
          <View className="flex-col">
            <CustomText className="color-gray-1">Calories</CustomText>
            <CustomText>{plan.calories}</CustomText>
          </View>
          <View className="flex-col">
            <CustomText className="color-gray-1">Protein</CustomText>
            <CustomText>{plan.protein}g</CustomText>
          </View>
          <View className="flex-col mb-2">
            <CustomText className="color-gray-1">Carbs</CustomText>
            <CustomText>{plan.carbs}g</CustomText>
          </View>
          <TouchableOpacity
            className="w-[100px] h-[50px] bg-green-600 justify-center rounded-2xl absolute end-0"
            onPress={() => console.log("Clicked meal")}
          >
            <CustomText className="text-center text-white text-[16px]">
              Start plan
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const Meal = () => {
  const [mealPlans, setMealPlans] = useState<MealPlans[]>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMealPlans = async () => {
      try{
        setLoading(true);
        const data = await fetchMealPlan();
        if (data) setMealPlans(data);
      }finally{
        setLoading(false);
      }
    };

    fetchMealPlans();
  },[]);

  if(loading){
    return(
        <FlatList
          data={Array.from({length : 2})}
          className="flex-1 p-7 mt-12"
          keyExtractor={(_, i) => i.toString()}
          renderItem={() => <CardSkeleton height={CARD_HEIGHT} borderRadius={24}/>
        }
        ItemSeparatorComponent={() => <View style= {{marginBottom : 20}}/>}
        />
    )
  }

  return (
      <FlatList
        data={mealPlans}
        className="flex-1 p-7"
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <MealPlanCard plan={item} />}
      />
  );
};

export default Meal;