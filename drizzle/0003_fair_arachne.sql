CREATE TABLE `booking_reminders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`booking_id` int NOT NULL,
	`reminder_type` enum('booking_created','before_48h','before_24h') NOT NULL,
	`status` enum('pending','sent','skipped','failed') NOT NULL DEFAULT 'pending',
	`scheduled_for` timestamp NOT NULL,
	`processed_at` timestamp,
	`provider_reference` varchar(160),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `booking_reminders_id` PRIMARY KEY(`id`),
	CONSTRAINT `booking_reminders_booking_type_unique` UNIQUE(`booking_id`,`reminder_type`)
);
