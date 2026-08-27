-- Evan Medical Group — WhatsApp booking-request confirmation upgrade
-- Run this file ONCE on the Hostinger database after taking a database backup.
-- Do not re-run hostinger_dynamic_booking_upgrade.sql or hostinger_care_departments_placeholder_seed.sql.

CREATE TABLE IF NOT EXISTS `whatsapp_message_events` (
  `id` int AUTO_INCREMENT NOT NULL,
  `booking_id` int NOT NULL,
  `template_name` varchar(128) NOT NULL,
  `recipient_fingerprint` varchar(128) NOT NULL,
  `status` enum('queued','sending','accepted','delivered','read','failed','skipped') NOT NULL DEFAULT 'queued',
  `attempt_count` int NOT NULL DEFAULT 0,
  `provider_message_id` varchar(160) NULL,
  `error_code` varchar(96) NULL,
  `last_attempt_at` timestamp NULL DEFAULT NULL,
  `provider_updated_at` timestamp NULL DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `whatsapp_message_events_booking_template_unique` (`booking_id`, `template_name`),
  UNIQUE KEY `whatsapp_message_events_provider_message_unique` (`provider_message_id`),
  KEY `whatsapp_message_events_status_index` (`status`, `createdAt`)
);

ALTER TABLE `bookings`
  ADD COLUMN IF NOT EXISTS `whatsapp_booking_consent` boolean NOT NULL DEFAULT false;
