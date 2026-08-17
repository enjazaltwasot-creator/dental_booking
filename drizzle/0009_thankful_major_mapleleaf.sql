CREATE TABLE `branches` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(64) NOT NULL,
	`name` varchar(140) NOT NULL,
	`short_name` varchar(100) NOT NULL,
	`city` varchar(140) NOT NULL,
	`address` text,
	`phone` varchar(20),
	`is_active` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `branches_id` PRIMARY KEY(`id`),
	CONSTRAINT `branches_slug_unique` UNIQUE(`slug`)
);
