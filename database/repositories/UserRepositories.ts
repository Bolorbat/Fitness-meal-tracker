import { User } from "@/models/user";
import { BaseRepository } from "../repositories/BaseRepositories";

export class UserRepository extends BaseRepository {
  async create(user: User): Promise<number> {
    const db = await this.getDB();
    try {
      const result = await db?.runAsync(
        `INSERT INTO users (user_id, name, email, height, weight, age, gender) VALUES (?,?,?,?,?,?,?)`,
        [
          user.user_id,
          user.name,
          user.email,
          user.height ?? null,
          user.weight ?? null,
          user.age ?? null,
          user.gender ?? null,
        ]
      );
      return result.lastInsertRowId;
    } catch (e) {
      console.error("Error creating user: ", e);
      throw e;
    }
  }

  async updateUser(
    uid: string | null,
    sex: string,
    weight: number,
    height: number,
    age: number
  ) {
    if (!uid) return;
    const db = await this.getDB();
    try {
      await db.runAsync(
        `UPDATE users SET gender = ?, weight = ?, height = ?, age = ? WHERE user_id = ?`,
        [sex, weight, height, age, uid]
      );
    } catch (err) {
      console.error("Error setting user: ", err);
    }
  }

  async findByID(uid: string): Promise<User | undefined> {
    if (!uid) return;
    const db = await this.getDB();
    try {
      return (await db.getFirstAsync(`SELECT * from users WHERE user_id = ?`, [
        uid,
      ])) as User;
    } catch (err) {
      console.log("Error getting user by id", err);
      return undefined;
    }
  }
  async findAll(): Promise<User[]> {
    const db = await this.getDB();
    try {
      return (await db.getAllAsync(
        `SELECT * from users order by created_at DESC`
      )) as User[];
    } catch (err) {
      console.log("Error getting all user");
      throw err;
    }
  }
  async getOnboardingStatus(userId: string): Promise<boolean> {
    const db = await this.getDB();
    const result = await db.getFirstAsync<{ complete_onboarding: number }>(
      `SELECT complete_onboarding FROM users WHERE user_id = ?`,
      [userId]
    );
    return result?.complete_onboarding == 1;
  }

  async completeOnboarding(userId: string | null): Promise<void> {
    const db = await this.getDB();
    try {
      await db.runAsync(
        `UPDATE users SET complete_onboarding = 1 WHERE user_id = ?`,
        [userId]
      );
    } catch (err) {
      console.log("Error completing onboarding: ", err);
      throw err;
    }
  }
}
