import { MealItem } from "@/models/meal";
import { supabase } from "./supabaseClient";

export const fetchFoods = async (): Promise<MealItem[]> => {
  try {
    const { data, error, status } = await supabase.from("foods").select("*");

    if (error && status !== 406) throw error;

    if (data) {
      return data.map(
        (item: any): MealItem => ({
          meal_id: item.id ?? 0,
          food_name: item.name,
          calories: item.calories,
          protein: item.protein,
          carbs: item.carbs,
          fat: item.fat,
          fiber: item.fiber ?? 0,
          sugar: item.sugar ?? 0,
          sodium: item.sodium ?? 0,
          portion_size: item.portion_size ?? "100g",
          food_image: item.food_image ?? undefined,
          synced: item.synced ?? 0,
          updated_at: item.updated_at ?? undefined,
        })
      );
    }
    return [];
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const fetchFood = async ({
  name,
}: {
  name: string;
}): Promise<MealItem[]> => {
  try {
    const { data, error, status } = await supabase
      .from("foods")
      .select("*")
      .eq("name", name);

    if (error && status !== 406) throw error;

    if (data) {
      return data.map(
        (item: any): MealItem => ({
          meal_id: item.id ?? 0,
          food_name: item.name,
          calories: item.calories,
          protein: item.protein,
          carbs: item.carbs,
          fat: item.fat,
          fiber: item.fiber ?? 0,
          sugar: item.sugar ?? 0,
          sodium: item.sodium ?? 0,
          portion_size: item.portion_size ?? "100g",
          food_image: item.food_image ?? undefined,
          synced: item.synced ?? 0,
          updated_at: item.updated_at ?? undefined,
        })
      );
    }
    return [];
  } catch (err) {
    console.log(err);
    return [];
  }
};
