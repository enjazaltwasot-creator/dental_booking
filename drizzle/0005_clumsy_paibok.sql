CREATE TABLE `crm_sync_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`event_type` enum('booking_created') NOT NULL,
	`resource_reference` varchar(80) NOT NULL,
	`payload` text NOT NULL,
	`status` enum('pending','sent','failed') NOT NULL DEFAULT 'pending',
	`attempt_count` int NOT NULL DEFAULT 0,
	`last_attempt_at` timestamp,
	`provider_reference` varchar(160),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `crm_sync_events_id` PRIMARY KEY(`id`),
	CONSTRAINT `crm_sync_events_resource_type_unique` UNIQUE(`resource_reference`,`event_type`)
);
