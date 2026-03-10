import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { db } from "./index";
import { existsSync, mkdirSync } from "fs";
import { dirname } from "path";

// Database file path (same as in index.ts)
const DB_PATH = process.env.DB_PATH || "./data/breeder.db";

// Ensure data directory exists
const dataDir = dirname(DB_PATH);
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

await migrate(db, { migrationsFolder: "./src/db/migrations" });

console.log("Migrations completed successfully!");
