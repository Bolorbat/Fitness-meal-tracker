import { Meal, MealItem } from "@/models/meal";
import { BaseRepository } from "./BaseRepositories";
import { useAuth } from "@/contexts/autoContext";

export class MealRepository extends BaseRepository {
  async addMeal(meal: Meal): Promise<number> {
    const db = await this.getDB();
    try {
      const result = await db.runAsync(
        `
            INSERT INTO meals (name, date, time, synced) VALUES (?,?,?,0)`,
        [meal.name, meal.date, meal.time ?? null]
      );
      await this.syncToSupabase("meals", "id");
      return result.lastInsertRowId;
    } catch (err) {
      console.log("Error adding food : ", err);
      throw err;
    }
  }
  async addMealItem(item: MealItem): Promise<void> {
    const db = await this.getDB();
    try {
      const result = await db.runAsync(
        `
            INSERT INTO meal_items (meal_id, food_name, calories, protein, carbs, fat, fiber, sugar, sodium, portion_size,synced) VALUES (?,?,?,?,?,?,?,?,?,?,0)`,
        [
          item.meal_id,
          item.food_name,
          item.calories,
          item.protein,
          item.carbs,
          item.fat,
          item.fiber ?? null,
          item.sugar ?? null,
          item.sodium ?? null,
          item.portion_size,
        ]
      );
      await this.syncToSupabase("meal_items", "id");
      if (result) console.log("Meal added to local");
    } catch (err) {
      console.log("Error adding food : ", err);
      throw err;
    }
  }

  async deleteMeal(id: number): Promise<void> {
    const db = await this.getDB();
    try {
      const meal = (await db.getFirstAsync(
        `SELECT food_name FROM meal_items WHERE meal_id = ?`,
        [id]
      )) as MealItem;
      const result = await db.runAsync(`DELETE FROM meals WHERE id = ?`, [id]);
      if (result) {
        alert(`${meal?.food_name} deleted`);
        this.syncToSupabase("meals", "id");
      }
    } catch (err) {
      console.log("Error in delete meal", err);
    }
  }

  async getMeal(id: number): Promise<Meal[]> {
    const db = await this.getDB();
    try {
      return (await db.getAllAsync(`SELECT * FROM meals WHERE id = ?`, [
        id,
      ])) as Meal[];
    } catch (err) {
      console.log("Error in get meal", err);
      throw err;
    }
  }
  async getMealItems(): Promise<MealItem[]> {
    const db = await this.getDB();
    try {
      return (await db.getAllAsync(`SELECT * FROM meal_items`)) as MealItem[];
    } catch (err) {
      console.log("Error getting meal items from db");
      throw err;
    }
  }
  async getBoth(): Promise<MealItem[]> {
    const db = await this.getDB();
    try {
      return (await db.getAllAsync(
        `SELECT meal_items.*, meals.time, meals.date FROM meal_items INNER JOIN meals ON meal_items.meal_id = meals.id ORDER BY meals.date ASC, meals.time ASC`
      )) as MealItem[];
    } catch (err) {
      console.log("Error getting meal items from db");
      throw err;
    }
  }
}
