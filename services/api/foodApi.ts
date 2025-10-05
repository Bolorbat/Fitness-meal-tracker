import { MealItem } from "@/models/meal";

interface SearchParams {
  query: string;
  page?: number;
  max_results?: number;
  portion_size: number;
}

const API_BASE_URL = "http://159.223.80.206:3000";

export const searchFood = async ({
  query,
  page = 0,
  max_results = 10,
  portion_size = 0,
}: SearchParams): Promise<MealItem[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/search-food?${new URLSearchParams({
        q: query.toString(),
        max_results: max_results.toString(),
        page_number: page.toString(),
      })}`
    );

    const data = await response.json();

    const foodsData = data.foods_search?.results;
    const foodsArray: any[] = Array.isArray(foodsData.food)
      ? foodsData.food
      : [];

    if (!foodsArray) return [];

    return foodsArray.map((f: any) => {
      const serving = f.servings?.serving?.[portion_size];
      return {
        meal_id: f.food_id,
        food_name: f.food_name,
        calories: serving?.calories || 0,
        protein: serving?.protein || 0,
        carbs: serving?.carbohydrate || 0,
        fat: serving?.fat || 0,
        fiber: serving?.fiber,
        sugar: serving?.sugar,
        sodium: serving?.sodium,
        portion_size: serving?.serving_description || "",
        food_image: f.food_images?.food_image?.[0]?.image_url,
        synced: 0,
        updated_at: new Date().toISOString(),
      };
    });
  } catch (err) {
    console.log("Error search food : ", err);
    return [];
  }
};
