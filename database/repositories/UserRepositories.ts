import { User } from "@/models/user";
import { BaseRepository } from "../repositories/BaseRepositories";

export class UserRepository extends BaseRepository {
  async create(user: User): Promise<number> {
    const db = await this.getDB();
    console.log(user);
    try {
      const result = await db?.runAsync(
        `INSERT INTO users (id, name, email) VALUES (?,?,?)`,
        [
          user.id,
          user.name,
          user.email,
        ]
      );
      await this.syncToSupabase("users", "id");
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
        `UPDATE users SET gender = ?, weight = ?, height = ?, age = ? WHERE id = ?`,
        [sex, weight, height, age, uid]
      );
      await this.syncToSupabase("users", "id");
    } catch (err) {
      console.error("Error setting user: ", err);
    }
  }

  async findByID(uid: string): Promise<User | undefined> {
    if (!uid) return;
    const db = await this.getDB();
    try {
      return (await db.getFirstAsync(`SELECT * from users WHERE id = ?`, [
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
      `SELECT complete_onboarding FROM users WHERE id = ?`,
      [userId]
    );
    return result?.complete_onboarding == 1;
  }

  async completeOnboarding(userId: string | null): Promise<void> {
    const db = await this.getDB();
    try {
      await db.runAsync(
        `UPDATE users SET complete_onboarding = 1 WHERE id = ?`,
        [userId]
      );
      await this.syncToSupabase("users", "id");
    } catch (err) {
      console.log("Error completing onboarding: ", err);
      throw err;
    }
  }
}
