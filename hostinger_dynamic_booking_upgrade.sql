-- Evan Medical Group: Dynamic booking upgrade for the existing Hostinger database.
-- Run ONCE in phpMyAdmin after taking a database export. No patient rows are deleted.

CREATE TABLE IF NOT EXISTS `dentist_branches` (
  `id` int AUTO_INCREMENT NOT NULL,
  `dentist_id` int NOT NULL,
  `branch_id` int NOT NULL,
  `is_active` boolean NOT NULL DEFAULT true,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `dentist_branches_id` PRIMARY KEY(`id`),
  CONSTRAINT `dentist_branches_dentist_branch_unique` UNIQUE(`dentist_id`, `branch_id`)
);

CREATE TABLE IF NOT EXISTS `dentist_services` (
  `id` int AUTO_INCREMENT NOT NULL,
  `dentist_id` int NOT NULL,
  `service_id` int NOT NULL,
  `is_active` boolean NOT NULL DEFAULT true,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `dentist_services_id` PRIMARY KEY(`id`),
  CONSTRAINT `dentist_services_dentist_service_unique` UNIQUE(`dentist_id`, `service_id`)
);

CREATE TABLE IF NOT EXISTS `booking_admin_actions` (
  `id` int AUTO_INCREMENT NOT NULL,
  `booking_id` int NOT NULL,
  `reference_number` varchar(20) NOT NULL,
  `action` enum('rescheduled', 'deleted') NOT NULL,
  `performed_by` varchar(100) NOT NULL,
  `before_payload` text NOT NULL,
  `after_payload` text,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  CONSTRAINT `booking_admin_actions_id` PRIMARY KEY(`id`)
);

ALTER TABLE `bookings` ADD COLUMN IF NOT EXISTS `booking_source` enum('snapchat', 'instagram', 'facebook', 'branch_visit', 'other') NOT NULL DEFAULT 'other';
ALTER TABLE `bookings` ADD COLUMN IF NOT EXISTS `slot_state` varchar(16) DEFAULT 'reserved';
ALTER TABLE `dentists` ADD COLUMN IF NOT EXISTS `is_active` boolean NOT NULL DEFAULT true;

CREATE INDEX IF NOT EXISTS `dentist_branches_branch_active_index` ON `dentist_branches` (`branch_id`, `is_active`);
CREATE INDEX IF NOT EXISTS `dentist_services_service_active_index` ON `dentist_services` (`service_id`, `is_active`);
CREATE INDEX IF NOT EXISTS `bookings_booking_source_index` ON `bookings` (`booking_source`);
CREATE INDEX IF NOT EXISTS `booking_admin_actions_booking_index` ON `booking_admin_actions` (`booking_id`, `createdAt`);

-- Cancelled slots and duplicated legacy test slots are released before the unique availability constraint.
UPDATE `bookings` SET `slot_state` = CONCAT('released-', `id`) WHERE `status` = 'cancelled';
UPDATE `bookings` b
JOIN (
  SELECT `dentist_id`, `appointment_date`, `appointment_time`, MIN(`id`) AS keep_id
  FROM `bookings`
  WHERE `slot_state` = 'reserved'
  GROUP BY `dentist_id`, `appointment_date`, `appointment_time`
  HAVING COUNT(*) > 1
) collisions ON collisions.`dentist_id` = b.`dentist_id`
  AND collisions.`appointment_date` = b.`appointment_date`
  AND collisions.`appointment_time` = b.`appointment_time`
SET b.`slot_state` = CONCAT('legacy-', b.`id`)
WHERE b.`id` <> collisions.keep_id AND b.`slot_state` = 'reserved';

ALTER TABLE `bookings` ADD CONSTRAINT `bookings_dentist_date_time_reserved_unique` UNIQUE(`dentist_id`, `appointment_date`, `appointment_time`, `slot_state`);

-- Preserve current doctors by connecting each one to compatible active branches and services.
INSERT IGNORE INTO `dentist_branches` (`dentist_id`, `branch_id`, `is_active`)
SELECT d.`id`, b.`id`, true
FROM `dentists` d
JOIN `branches` b
JOIN `branch_specialties` bs ON bs.`branch_id` = b.`id` AND bs.`department` = d.`department` AND bs.`is_active` = true
WHERE b.`is_active` = true;

INSERT IGNORE INTO `dentist_services` (`dentist_id`, `service_id`, `is_active`)
SELECT d.`id`, s.`id`, true
FROM `dentists` d
JOIN `services` s ON s.`department` = d.`department` AND s.`is_active` = true;
