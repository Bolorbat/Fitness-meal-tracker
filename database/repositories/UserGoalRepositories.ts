import { User } from "@/models/user";
import { UserGoal } from "@/models/usergoals";
import { BaseRepository } from "./BaseRepositories";

export class UserGoalRepository extends BaseRepository {
  async create(user: User, goalType: string): Promise<UserGoal | undefined> {
    if (!user) return;
    const db = await this.getDB();
    const g = (user.gender ?? "").trim().toLowerCase();

    const adj = g === "male" ? 5 : -161;
    const bmr =
      10 * (user.weight ?? 1) +
      6.25 * (user.height ?? 1) -
      5 * (user.age ?? 1) +
      adj;

    const tdee = bmr * 1.3;

    const goalAdj =
      goalType === "Improve Shape" ? 500 : goalType === "Lose a Fat" ? -500 : 0;
    const daily_calories = Math.round(tdee + goalAdj);
    const target_protein = Math.round((user.weight ?? 1) * 2.0);
    const target_fat = Math.round((user.weight ?? 1) * 0.9);
    const target_carbs = Math.round(
      (daily_calories - (target_protein * 4 + target_fat * 9)) / 4
    );

    try {
      await db.runAsync(
        `INSERT INTO userGoals(user_id, goal_type, daily_calories, target_protein, target_carbs, target_fat) VALUES (?,?,?,?,?,?)`,
        [
          user.user_id,
          goalType,
          daily_calories,
          target_protein,
          target_carbs,
          target_fat,
        ]
      );
    } catch (err) {
      console.log("Error in set user goals : ", err);
    }
  }

  async findByUserId(uid : string) : Promise<UserGoal | undefined>{
    const db = await this.getDB();
    try{
        return (await db.getFirstAsync(`SELECT * from userGoals WHERE user_id = ?`, [uid])) as UserGoal;
    }catch(err){
        console.log("error getting user goal, ", err);
        throw err;
    }
  }
}
