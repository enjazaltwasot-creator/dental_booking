CREATE TABLE `booking_action_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`booking_id` int NOT NULL,
	`action` enum('confirm','reschedule','cancel') NOT NULL,
	`source` enum('whatsapp') NOT NULL,
	`external_message_id` varchar(160) NOT NULL,
	`status` enum('pending','processed','rejected') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `booking_action_requests_id` PRIMARY KEY(`id`),
	CONSTRAINT `booking_action_requests_message_unique` UNIQUE(`external_message_id`)
);
