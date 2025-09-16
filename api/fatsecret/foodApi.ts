import { MealItem } from "@/models/meal";

interface SearchParams {
  query: string;
  page?: number;
  maxResults?: number;
}

export const searchFood = async ({
  query,
  page = 0,
  maxResults = 10,
}: SearchParams): Promise<MealItem[]> => {
  try {
    const response = await apiClient.get("/search/v3", {
      params: {
        search_expression: query,
        page_number: page,
        max_results: maxResults,
        format: "json",
        region: "MN",
      },
    });

    console.log("Full response:", response.data);
    console.log("foods_search:", response.data?.foods_search);
    console.log("results:", response.data?.foods_search?.results);

    const foodsData = response.data?.foods_search?.results;

    const foodsArray: any[] = Array.isArray(foodsData.food)
      ? foodsData.food
      : foodsData.food
        ? [foodsData.food]
        : [];

    if (!foodsArray || !Array.isArray(foodsArray)) return [];

    return foodsArray.map((f: any) => {
      const serving = f.servings?.serving?.[0];
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
    console.log("Error fetching food: ", err);
    return [];
  }
};
