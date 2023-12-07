CREATE TABLE IF NOT EXISTS "criteria" (
	"track_id" integer NOT NULL,
	"name" varchar(20) PRIMARY KEY NOT NULL,
	CONSTRAINT "criteria_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "interviews" (
	"id" integer PRIMARY KEY NOT NULL,
	"judge_id" varchar(255) NOT NULL,
	"submission_id" varchar(50) NOT NULL,
	"table" integer NOT NULL,
	"complete" boolean DEFAULT false NOT NULL,
	CONSTRAINT "interviews_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "track_submissions" (
	"id" integer PRIMARY KEY NOT NULL,
	"track_id" integer NOT NULL,
	"submission_id" varchar NOT NULL,
	CONSTRAINT "track_submissions_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tracks" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	CONSTRAINT "tracks_id_unique" UNIQUE("id"),
	CONSTRAINT "tracks_name_unique" UNIQUE("name")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "error_log" ADD CONSTRAINT "error_log_user_id_users_clerk_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("clerk_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "submissions" ADD CONSTRAINT "submissions_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "submissions" DROP COLUMN IF EXISTS "table";--> statement-breakpoint
ALTER TABLE "submissions" DROP COLUMN IF EXISTS "track";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "criteria" ADD CONSTRAINT "criteria_track_id_tracks_id_fk" FOREIGN KEY ("track_id") REFERENCES "tracks"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "interviews" ADD CONSTRAINT "interviews_judge_id_users_clerk_id_fk" FOREIGN KEY ("judge_id") REFERENCES "users"("clerk_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "interviews" ADD CONSTRAINT "interviews_submission_id_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "submissions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "track_submissions" ADD CONSTRAINT "track_submissions_track_id_tracks_id_fk" FOREIGN KEY ("track_id") REFERENCES "tracks"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "track_submissions" ADD CONSTRAINT "track_submissions_submission_id_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "submissions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
