import { Meal, MealItem } from "@/models/meal";
import { BaseRepository } from "./BaseRepositories";
import { useAuth } from "@/contexts/autoContext";

export class MealRepository extends BaseRepository {
  async addMeal(meal: Meal): Promise<void> {
    const db = await this.getDB();
    try {
        const result = await db.runAsync(`
            INSERT INTO meals (name, date, time, synced) VALUES (?,?,?,0)`,
            [meal.name, meal.date, meal.time ?? null]
        );
    } catch (err) {
      console.log("Error adding food : ", err);
      throw err;
    }
  }
  async addMealItem(item: MealItem): Promise<void> {
    const db = await this.getDB();
    try {
        const result = await db.runAsync(`
            INSERT INTO meal_items (meal_id, food_name, calories, protein, carbs, fat, fiber, sugar, sodium, portion_size,synced) VALUES (?,?,?,?,?,?,?,?,?,?,0)`,
            [item.meal_id, item.food_name, item.calories, item.protein, item.carbs, item.fat, item.fiber ?? null, item.sugar ?? null, item.sodium ?? null, item.portion_size]
        );
    } catch (err) {
      console.log("Error adding food : ", err);
      throw err;
    }
  }
}
