CREATE TABLE `booking_admin_actions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`booking_id` int NOT NULL,
	`reference_number` varchar(20) NOT NULL,
	`action` enum('rescheduled','deleted') NOT NULL,
	`performed_by` varchar(100) NOT NULL,
	`before_payload` text NOT NULL,
	`after_payload` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `booking_admin_actions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `booking_admin_actions_booking_index` ON `booking_admin_actions` (`booking_id`,`createdAt`);