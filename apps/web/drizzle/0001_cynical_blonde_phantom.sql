ALTER TYPE "role" ADD VALUE 'judge';--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "submissions" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"team_id" varchar(50) NOT NULL,
	"table" integer,
	"name" varchar(255) NOT NULL,
	"track" varchar(50) NOT NULL,
	"link" varchar NOT NULL,
	"time" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "submissions_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "teams" DROP COLUMN IF EXISTS "devpost_url";