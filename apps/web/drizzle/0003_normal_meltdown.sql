CREATE TABLE IF NOT EXISTS "submissions_log" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"type" varchar(50) NOT NULL
);
