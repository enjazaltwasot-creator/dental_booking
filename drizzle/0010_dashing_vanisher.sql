CREATE TABLE `branch_specialties` (
	`id` int AUTO_INCREMENT NOT NULL,
	`branch_id` int NOT NULL,
	`department` enum('dentistry','dermatology','laser') NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `branch_specialties_id` PRIMARY KEY(`id`),
	CONSTRAINT `branch_specialties_branch_department_unique` UNIQUE(`branch_id`,`department`)
);
--> statement-breakpoint
ALTER TABLE `services` ADD `department` enum('dentistry','dermatology','laser') DEFAULT 'dentistry' NOT NULL;