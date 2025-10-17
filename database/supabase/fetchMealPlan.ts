import { MealPlans } from "@/models/meal";
import { supabase } from "./supabaseClient";

export const fetchMealPlan = async (): Promise<MealPlans[]> => {
  try {
    const { data, error } = await supabase.from("meal_plans").select("*");

    if (error) console.log(error);

    if (data) {
      return data.map(
        (item: any): MealPlans => ({
          id: item.id,
          plan_name: item.plan_name,
          description: item.description,
          calories: item.calories,
          protein: item.protein,
          carbs: item.carbs,
          rating: item.rating,
        })
      );
    }
    return [];
  } catch (err) {
    console.log("Error fetching mealPlans");
    throw err;
  }
};
