CREATE TABLE `bodyarea` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `bodyarea_name_unique` ON `bodyarea` (`name`);--> statement-breakpoint
CREATE TABLE `exercise` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`image_url` text,
	`exercise_type_id` integer NOT NULL,
	FOREIGN KEY (`exercise_type_id`) REFERENCES `exercise_type`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE UNIQUE INDEX `exercise_name_unique` ON `exercise` (`name`);--> statement-breakpoint
CREATE TABLE `exercise_bodyarea` (
	`exercise_id` integer NOT NULL,
	`bodyarea_id` integer NOT NULL,
	`muscle_intensity` integer DEFAULT 1 NOT NULL,
	`ismajorbodyarea` integer DEFAULT false,
	PRIMARY KEY(`exercise_id`, `bodyarea_id`),
	FOREIGN KEY (`exercise_id`) REFERENCES `exercise`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`bodyarea_id`) REFERENCES `bodyarea`(`id`) ON UPDATE no action ON DELETE restrict,
	CONSTRAINT "muscleIntensity_check1" CHECK("exercise_bodyarea"."muscle_intensity" > 0 AND "exercise_bodyarea"."muscle_intensity" < 6)
);
--> statement-breakpoint
CREATE TABLE `exercise_type` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `exercise_type_type_unique` ON `exercise_type` (`type`);--> statement-breakpoint
CREATE TABLE `measurements` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`datetime` text NOT NULL,
	`bodyweight` real NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `measurements_datetime_unique` ON `measurements` (`datetime`);--> statement-breakpoint
CREATE TABLE `profile` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text,
	`theme` text DEFAULT 'system' NOT NULL,
	`keepawake` integer DEFAULT false,
	`firstdayofweek` text DEFAULT 'mon' NOT NULL,
	`timer_sound` integer DEFAULT 0 NOT NULL,
	`timer_volume` integer DEFAULT 0 NOT NULL,
	`default_resttimer` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `routine` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `routine_name_unique` ON `routine` (`name`);--> statement-breakpoint
CREATE TABLE `routine_exercise` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`position_index` integer NOT NULL,
	`routine_id` integer NOT NULL,
	`exercise_id` integer NOT NULL,
	`rest_timer` integer DEFAULT 0 NOT NULL,
	`notes` text,
	FOREIGN KEY (`routine_id`) REFERENCES `routine`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercise`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `routine_exercise_set` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`routine_exercise_id` integer NOT NULL,
	`reps` integer DEFAULT 0 NOT NULL,
	`weight` real,
	`distance` real,
	`time` integer,
	FOREIGN KEY (`routine_exercise_id`) REFERENCES `routine_exercise`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `workout` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`routine_id` integer,
	`datetime` text NOT NULL,
	`duration` integer NOT NULL,
	`notes` text,
	FOREIGN KEY (`routine_id`) REFERENCES `routine`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `workout_exercise` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`position_index` integer NOT NULL,
	`workout_id` integer NOT NULL,
	`exercise_id` integer NOT NULL,
	`rest_timer` integer DEFAULT 0 NOT NULL,
	`notes` text,
	FOREIGN KEY (`workout_id`) REFERENCES `workout`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercise`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `workout_exercise_set` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`workout_exercise_id` integer NOT NULL,
	`reps` integer DEFAULT 0 NOT NULL,
	`weight` real,
	`distance` real,
	`time` integer,
	`heart_rate` integer,
	FOREIGN KEY (`workout_exercise_id`) REFERENCES `workout_exercise`(`id`) ON UPDATE no action ON DELETE cascade
);
