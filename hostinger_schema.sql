-- Evan Medical Group booking platform: initial schema for a new MySQL database.
-- Import this file once into the dedicated empty database only.
-- This file intentionally contains schema only and no patient, booking, or credential data.

CREATE TABLE IF NOT EXISTS `users` (
  `id` int AUTO_INCREMENT NOT NULL,
  `openId` varchar(64) NOT NULL,
  `username` varchar(100),
  `password` text,
  `is_active` boolean NOT NULL DEFAULT true,
  `name` text,
  `email` varchar(320),
  `loginMethod` varchar(64),
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  `admin_permission` enum('full_access','operations','bookings') NOT NULL DEFAULT 'full_access',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `lastSignedIn` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `users_id` PRIMARY KEY (`id`),
  CONSTRAINT `users_openId_unique` UNIQUE (`openId`),
  CONSTRAINT `users_username_unique` UNIQUE (`username`)
);

CREATE TABLE IF NOT EXISTS `services` (
  `id` int AUTO_INCREMENT NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  `duration` int NOT NULL,
  `department` enum('dentistry','dermatology','laser') NOT NULL DEFAULT 'dentistry',
  `is_active` boolean NOT NULL DEFAULT true,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `services_id` PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `branches` (
  `id` int AUTO_INCREMENT NOT NULL,
  `slug` varchar(64) NOT NULL,
  `name` varchar(140) NOT NULL,
  `short_name` varchar(100) NOT NULL,
  `city` varchar(140) NOT NULL,
  `address` text,
  `phone` varchar(20),
  `is_active` boolean NOT NULL DEFAULT true,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `branches_id` PRIMARY KEY (`id`),
  CONSTRAINT `branches_slug_unique` UNIQUE (`slug`)
);

CREATE TABLE IF NOT EXISTS `branch_specialties` (
  `id` int AUTO_INCREMENT NOT NULL,
  `branch_id` int NOT NULL,
  `department` enum('dentistry','dermatology','laser') NOT NULL,
  `is_active` boolean NOT NULL DEFAULT true,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `branch_specialties_id` PRIMARY KEY (`id`),
  CONSTRAINT `branch_specialties_branch_department_unique` UNIQUE (`branch_id`,`department`)
);

CREATE TABLE IF NOT EXISTS `dentists` (
  `id` int AUTO_INCREMENT NOT NULL,
  `name` varchar(100) NOT NULL,
  `specialization` varchar(100) NOT NULL,
  `department` enum('dentistry','dermatology','laser') NOT NULL DEFAULT 'dentistry',
  `bio` text,
  `phone` varchar(20),
  `email` varchar(320),
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `dentists_id` PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `working_hours` (
  `id` int AUTO_INCREMENT NOT NULL,
  `dentist_id` int NOT NULL,
  `day_of_week` int NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `is_active` boolean NOT NULL DEFAULT true,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `working_hours_id` PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `bookings` (
  `id` int AUTO_INCREMENT NOT NULL,
  `reference_number` varchar(20) NOT NULL,
  `branch` varchar(64),
  `dentist_id` int NOT NULL,
  `service_id` int NOT NULL,
  `patient_name` varchar(100) NOT NULL,
  `patient_phone` varchar(20) NOT NULL,
  `appointment_date` date NOT NULL,
  `appointment_time` time NOT NULL,
  `status` enum('pending','confirmed','cancelled') NOT NULL DEFAULT 'pending',
  `notes` text,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `bookings_id` PRIMARY KEY (`id`),
  CONSTRAINT `bookings_reference_number_unique` UNIQUE (`reference_number`)
);

CREATE TABLE IF NOT EXISTS `booking_reminders` (
  `id` int AUTO_INCREMENT NOT NULL,
  `booking_id` int NOT NULL,
  `reminder_type` enum('booking_created','before_48h','before_24h') NOT NULL,
  `status` enum('pending','sent','skipped','failed') NOT NULL DEFAULT 'pending',
  `scheduled_for` datetime NOT NULL,
  `processed_at` timestamp NULL,
  `provider_reference` varchar(160),
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `booking_reminders_id` PRIMARY KEY (`id`),
  CONSTRAINT `booking_reminders_booking_type_unique` UNIQUE (`booking_id`,`reminder_type`)
);

CREATE TABLE IF NOT EXISTS `assistant_conversations` (
  `id` int AUTO_INCREMENT NOT NULL,
  `session_key` varchar(64) NOT NULL,
  `channel` enum('website','whatsapp') NOT NULL DEFAULT 'website',
  `last_message_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `assistant_conversations_id` PRIMARY KEY (`id`),
  CONSTRAINT `assistant_conversations_session_key_unique` UNIQUE (`session_key`)
);

CREATE TABLE IF NOT EXISTS `assistant_messages` (
  `id` int AUTO_INCREMENT NOT NULL,
  `conversation_id` int NOT NULL,
  `role` enum('user','assistant') NOT NULL,
  `content` text NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `assistant_messages_id` PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `crm_sync_events` (
  `id` int AUTO_INCREMENT NOT NULL,
  `event_type` enum('booking_created','assistant_conversation') NOT NULL,
  `resource_reference` varchar(80) NOT NULL,
  `payload` text NOT NULL,
  `status` enum('pending','sent','failed') NOT NULL DEFAULT 'pending',
  `attempt_count` int NOT NULL DEFAULT 0,
  `last_attempt_at` timestamp NULL,
  `provider_reference` varchar(160),
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `crm_sync_events_id` PRIMARY KEY (`id`),
  CONSTRAINT `crm_sync_events_resource_type_unique` UNIQUE (`resource_reference`,`event_type`)
);

CREATE TABLE IF NOT EXISTS `booking_action_requests` (
  `id` int AUTO_INCREMENT NOT NULL,
  `booking_id` int NOT NULL,
  `action` enum('confirm','reschedule','cancel') NOT NULL,
  `source` enum('whatsapp','website') NOT NULL,
  `external_message_id` varchar(160) NOT NULL,
  `status` enum('pending','processed','rejected') NOT NULL DEFAULT 'pending',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `booking_action_requests_id` PRIMARY KEY (`id`),
  CONSTRAINT `booking_action_requests_message_unique` UNIQUE (`external_message_id`)
);

CREATE INDEX `assistant_conversations_last_message_at_index` ON `assistant_conversations` (`last_message_at`);
CREATE INDEX `assistant_messages_conversation_created_index` ON `assistant_messages` (`conversation_id`,`createdAt`);
