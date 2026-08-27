CREATE TABLE `whatsapp_message_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`booking_id` int NOT NULL,
	`template_name` varchar(128) NOT NULL,
	`recipient_fingerprint` varchar(128) NOT NULL,
	`status` enum('queued','sending','accepted','delivered','read','failed','skipped') NOT NULL DEFAULT 'queued',
	`attempt_count` int NOT NULL DEFAULT 0,
	`provider_message_id` varchar(160),
	`error_code` varchar(96),
	`last_attempt_at` timestamp,
	`provider_updated_at` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `whatsapp_message_events_id` PRIMARY KEY(`id`),
	CONSTRAINT `whatsapp_message_events_booking_template_unique` UNIQUE(`booking_id`,`template_name`),
	CONSTRAINT `whatsapp_message_events_provider_message_unique` UNIQUE(`provider_message_id`)
);
--> statement-breakpoint
ALTER TABLE `bookings` ADD `whatsapp_booking_consent` boolean DEFAULT false NOT NULL;--> statement-breakpoint
CREATE INDEX `whatsapp_message_events_status_index` ON `whatsapp_message_events` (`status`,`createdAt`);