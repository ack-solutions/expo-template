CREATE TABLE `photos` (
	`id` text PRIMARY KEY NOT NULL,
	`local_uri` text NOT NULL,
	`width` integer,
	`height` integer,
	`file_size` integer,
	`mime_type` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `photos_created_at_idx` ON `photos` (`created_at`);