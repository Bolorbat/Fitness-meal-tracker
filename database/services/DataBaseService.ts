import { UserGoalRepository, UserRepository, MealRepository } from "../repositories";

export class DatabaseService {
  private static instance: DatabaseService;

  public readonly users: UserRepository;
  public readonly goal: UserGoalRepository;
  public readonly meal: MealRepository;

  private constructor() {
    this.users = new UserRepository();
    this.goal = new UserGoalRepository();
    this.meal = new MealRepository();
  }

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance)
      DatabaseService.instance = new DatabaseService();
    return DatabaseService.instance;
  }
}

export const db = DatabaseService.getInstance();
