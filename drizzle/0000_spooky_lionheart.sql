CREATE TABLE `entry` (
	`id` integer PRIMARY KEY NOT NULL,
	`isExpense` integer DEFAULT true NOT NULL,
	`month` text,
	`data` text,
	`amount` integer
);
--> statement-breakpoint
CREATE TABLE `template` (
	`id` integer PRIMARY KEY NOT NULL,
	`amountColumnName` text,
	`categoryList` text,
	`data` text,
	`status` integer DEFAULT false NOT NULL
);
