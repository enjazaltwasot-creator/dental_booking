CREATE TABLE `assistant_conversations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`session_key` varchar(64) NOT NULL,
	`channel` enum('website','whatsapp') NOT NULL DEFAULT 'website',
	`last_message_at` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `assistant_conversations_id` PRIMARY KEY(`id`),
	CONSTRAINT `assistant_conversations_session_key_unique` UNIQUE(`session_key`)
);
--> statement-breakpoint
CREATE TABLE `assistant_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`conversation_id` int NOT NULL,
	`role` enum('user','assistant') NOT NULL,
	`content` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `assistant_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `crm_sync_events` MODIFY COLUMN `event_type` enum('booking_created','assistant_conversation') NOT NULL;--> statement-breakpoint
CREATE INDEX `assistant_conversations_last_message_at_index` ON `assistant_conversations` (`last_message_at`);--> statement-breakpoint
CREATE INDEX `assistant_messages_conversation_created_index` ON `assistant_messages` (`conversation_id`,`createdAt`);