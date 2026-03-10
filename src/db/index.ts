import { drizzle } from "drizzle-orm/bun-sqlite";
import * as schema from "./schema";
import Database from "bun:sqlite";
import { existsSync, mkdirSync } from "fs";
import { dirname } from "path";

// Database file path
const DB_PATH = process.env.DB_PATH || "./data/breeder.db";

// Ensure data directory exists
const dataDir = dirname(DB_PATH);
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

// Create database connection using Bun's native SQLite
const sqlite = new Database(DB_PATH);

// Enable WAL mode for better performance
sqlite.run("PRAGMA journal_mode = WAL");

// Create drizzle instance
export const db = drizzle(sqlite, { schema });

export { sqlite };
