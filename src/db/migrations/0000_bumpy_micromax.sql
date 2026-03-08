CREATE TABLE `egg_production` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`flock_id` integer,
	`record_date` integer NOT NULL,
	`hatching_eggs` integer DEFAULT 0 NOT NULL,
	`small_eggs` integer DEFAULT 0 NOT NULL,
	`thin_shell_eggs` integer DEFAULT 0 NOT NULL,
	`misshape_eggs` integer DEFAULT 0 NOT NULL,
	`double_yolk_eggs` integer DEFAULT 0 NOT NULL,
	`broken_eggs` integer DEFAULT 0 NOT NULL,
	`spoiled_eggs` integer DEFAULT 0 NOT NULL,
	`others_eggs` integer DEFAULT 0 NOT NULL,
	`reported_by` integer,
	`notes` text,
	`created_at` integer,
	FOREIGN KEY (`flock_id`) REFERENCES `flocks`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`reported_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `employees` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`employee_id` text NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`birthday` integer,
	`address` text,
	`contact_number` text,
	`email` text,
	`date_hired` integer NOT NULL,
	`position` text NOT NULL,
	`resignation_date` integer,
	`status` text DEFAULT 'active' NOT NULL,
	`picture_url` text,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `employees_employee_id_unique` ON `employees` (`employee_id`);--> statement-breakpoint
CREATE TABLE `farm_profile` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`farm_name` text NOT NULL,
	`farm_address` text NOT NULL,
	`logo_url` text,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `feed_categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `feed_consumption` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`flock_id` integer,
	`category_id` integer,
	`consumption_date` integer NOT NULL,
	`quantity_kg` real NOT NULL,
	`notes` text,
	`created_by` integer,
	`created_at` integer,
	FOREIGN KEY (`flock_id`) REFERENCES `flocks`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`category_id`) REFERENCES `feed_categories`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `feed_incoming` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`category_id` integer,
	`quantity_bags` real NOT NULL,
	`quantity_kg` real NOT NULL,
	`delivery_date` integer NOT NULL,
	`supplier` text,
	`notes` text,
	`created_by` integer,
	`created_at` integer,
	FOREIGN KEY (`category_id`) REFERENCES `feed_categories`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `feed_inventory` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`category_id` integer,
	`beginning_inventory_kg` real DEFAULT 0 NOT NULL,
	`current_stock_kg` real DEFAULT 0 NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`category_id`) REFERENCES `feed_categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `flock_transfers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`from_flock_id` integer,
	`to_flock_id` integer,
	`transfer_date` integer NOT NULL,
	`male_count` integer DEFAULT 0 NOT NULL,
	`female_count` integer DEFAULT 0 NOT NULL,
	`reason` text,
	`created_by` integer,
	`created_at` integer,
	FOREIGN KEY (`from_flock_id`) REFERENCES `flocks`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`to_flock_id`) REFERENCES `flocks`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `flocks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`house_number` text NOT NULL,
	`breed` text NOT NULL,
	`loading_date` integer NOT NULL,
	`beginning_male` integer DEFAULT 0 NOT NULL,
	`beginning_female` integer DEFAULT 0 NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`notes` text,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `mortality_records` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`flock_id` integer,
	`record_date` integer NOT NULL,
	`mortality_male` integer DEFAULT 0 NOT NULL,
	`mortality_female` integer DEFAULT 0 NOT NULL,
	`spot_cull_male` integer DEFAULT 0 NOT NULL,
	`spot_cull_female` integer DEFAULT 0 NOT NULL,
	`spent_cull_male` integer DEFAULT 0 NOT NULL,
	`spent_cull_female` integer DEFAULT 0 NOT NULL,
	`missex_male` integer DEFAULT 0 NOT NULL,
	`missex_female` integer DEFAULT 0 NOT NULL,
	`reported_by` integer,
	`notes` text,
	`created_at` integer,
	FOREIGN KEY (`flock_id`) REFERENCES `flocks`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`reported_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`role` text DEFAULT 'worker' NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);