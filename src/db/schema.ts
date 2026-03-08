import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// Users table with access levels
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role", { enum: ["admin", "manager", "supervisor", "worker"] }).notNull().default("worker"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Farm Profile
export const farmProfile = sqliteTable("farm_profile", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  farmName: text("farm_name").notNull(),
  farmAddress: text("farm_address").notNull(),
  logoUrl: text("logo_url"),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Flock Management
export const flocks = sqliteTable("flocks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  houseNumber: text("house_number").notNull(),
  breed: text("breed").notNull(),
  loadingDate: integer("loading_date", { mode: "timestamp" }).notNull(),
  beginningMale: integer("beginning_male").notNull().default(0),
  beginningFemale: integer("beginning_female").notNull().default(0),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Flock Transfers/Movements
export const flockTransfers = sqliteTable("flock_transfers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  fromFlockId: integer("from_flock_id").references(() => flocks.id),
  toFlockId: integer("to_flock_id").references(() => flocks.id),
  transferDate: integer("transfer_date", { mode: "timestamp" }).notNull(),
  maleCount: integer("male_count").notNull().default(0),
  femaleCount: integer("female_count").notNull().default(0),
  reason: text("reason"),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Feed Categories
export const feedCategories = sqliteTable("feed_categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Feed Inventory
export const feedInventory = sqliteTable("feed_inventory", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  categoryId: integer("category_id").references(() => feedCategories.id),
  beginningInventoryKg: real("beginning_inventory_kg").notNull().default(0),
  currentStockKg: real("current_stock_kg").notNull().default(0),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Feed Incoming
export const feedIncoming = sqliteTable("feed_incoming", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  categoryId: integer("category_id").references(() => feedCategories.id),
  quantityBags: real("quantity_bags").notNull(),
  quantityKg: real("quantity_kg").notNull(),
  deliveryDate: integer("delivery_date", { mode: "timestamp" }).notNull(),
  supplier: text("supplier"),
  notes: text("notes"),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Feed Consumption
export const feedConsumption = sqliteTable("feed_consumption", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  flockId: integer("flock_id").references(() => flocks.id),
  categoryId: integer("category_id").references(() => feedCategories.id),
  consumptionDate: integer("consumption_date", { mode: "timestamp" }).notNull(),
  quantityKg: real("quantity_kg").notNull(),
  notes: text("notes"),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Mortality Records
export const mortalityRecords = sqliteTable("mortality_records", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  flockId: integer("flock_id").references(() => flocks.id),
  recordDate: integer("record_date", { mode: "timestamp" }).notNull(),
  mortalityMale: integer("mortality_male").notNull().default(0),
  mortalityFemale: integer("mortality_female").notNull().default(0),
  spotCullMale: integer("spot_cull_male").notNull().default(0),
  spotCullFemale: integer("spot_cull_female").notNull().default(0),
  spentCullMale: integer("spent_cull_male").notNull().default(0),
  spentCullFemale: integer("spent_cull_female").notNull().default(0),
  missexMale: integer("missex_male").notNull().default(0),
  missexFemale: integer("missex_female").notNull().default(0),
  reportedBy: integer("reported_by").references(() => users.id),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Egg Production Records
export const eggProduction = sqliteTable("egg_production", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  flockId: integer("flock_id").references(() => flocks.id),
  recordDate: integer("record_date", { mode: "timestamp" }).notNull(),
  hatchingEggs: integer("hatching_eggs").notNull().default(0),
  smallEggs: integer("small_eggs").notNull().default(0),
  thinShellEggs: integer("thin_shell_eggs").notNull().default(0),
  misshapeEggs: integer("misshape_eggs").notNull().default(0),
  doubleYolkEggs: integer("double_yolk_eggs").notNull().default(0),
  brokenEggs: integer("broken_eggs").notNull().default(0),
  spoiledEggs: integer("spoiled_eggs").notNull().default(0),
  othersEggs: integer("others_eggs").notNull().default(0),
  reportedBy: integer("reported_by").references(() => users.id),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Employees
export const employees = sqliteTable("employees", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  employeeId: text("employee_id").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  birthday: integer("birthday", { mode: "timestamp" }),
  address: text("address"),
  contactNumber: text("contact_number"),
  email: text("email"),
  dateHired: integer("date_hired", { mode: "timestamp" }).notNull(),
  position: text("position").notNull(),
  resignationDate: integer("resignation_date", { mode: "timestamp" }),
  status: text("status", { enum: ["active", "resigned", "terminated"] }).notNull().default("active"),
  pictureUrl: text("picture_url"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});
