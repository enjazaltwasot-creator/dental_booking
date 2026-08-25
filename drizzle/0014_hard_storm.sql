CREATE TABLE `dentist_branches` (
	`id` int AUTO_INCREMENT NOT NULL,
	`dentist_id` int NOT NULL,
	`branch_id` int NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `dentist_branches_id` PRIMARY KEY(`id`),
	CONSTRAINT `dentist_branches_dentist_branch_unique` UNIQUE(`dentist_id`,`branch_id`)
);
--> statement-breakpoint
CREATE TABLE `dentist_services` (
	`id` int AUTO_INCREMENT NOT NULL,
	`dentist_id` int NOT NULL,
	`service_id` int NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `dentist_services_id` PRIMARY KEY(`id`),
	CONSTRAINT `dentist_services_dentist_service_unique` UNIQUE(`dentist_id`,`service_id`)
);
--> statement-breakpoint
ALTER TABLE `bookings` ADD `booking_source` enum('snapchat','instagram','facebook','branch_visit','other') DEFAULT 'other' NOT NULL;--> statement-breakpoint
ALTER TABLE `bookings` ADD `slot_state` varchar(16) DEFAULT 'reserved';--> statement-breakpoint
ALTER TABLE `dentists` ADD `is_active` boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_dentist_date_time_reserved_unique` UNIQUE(`dentist_id`,`appointment_date`,`appointment_time`,`slot_state`);--> statement-breakpoint
CREATE INDEX `dentist_branches_branch_active_index` ON `dentist_branches` (`branch_id`,`is_active`);--> statement-breakpoint
CREATE INDEX `dentist_services_service_active_index` ON `dentist_services` (`service_id`,`is_active`);--> statement-breakpoint
CREATE INDEX `bookings_booking_source_index` ON `bookings` (`booking_source`);