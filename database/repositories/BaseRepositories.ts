import { DatabaseConnection } from "..";
import * as SQLite from 'expo-sqlite';

export abstract class BaseRepository{
    protected async getDB() : Promise<SQLite.SQLiteDatabase>{
        return DatabaseConnection.getInstance().getDB();
    }
}

