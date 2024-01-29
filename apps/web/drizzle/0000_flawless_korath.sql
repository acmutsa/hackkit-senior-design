DO $$ BEGIN
 CREATE TYPE "ethnicity" AS ENUM('Hispanic or Latino', 'Not Hispanic or Latino');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "software_experience" AS ENUM('Beginner', 'Intermediate', 'Advanced', 'Expert');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "gender" AS ENUM('Male', 'Female', 'Non-binary', 'Other', 'Prefer not to say');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "heard_from" AS ENUM('Instagram', 'Class Presentation', 'Twitter', 'Event Site', 'Friend', 'Other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "status" AS ENUM('pending', 'accepted', 'declined');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "race" AS ENUM('Native American', 'Asian / Pacific Islander', 'Black / African American', 'White / Caucasian', 'Multiple / Other', 'Prefer not to say');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "role" AS ENUM('hacker', 'judge', 'volunteer', 'mentor', 'mlh', 'admin', 'super_admin');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "shirt_size" AS ENUM('S', 'M', 'L', 'XL', '2XL', '3XL');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "level_of_study" AS ENUM('Freshman', 'Sophomore', 'Junior', 'Senior', 'Recent Grad', 'Other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "error_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"user_id" varchar(32),
	"route" varchar(100),
	"message" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"room_num" varchar(10) NOT NULL,
	"description" text NOT NULL,
	"type" varchar(50) NOT NULL,
	"host" varchar(255) NOT NULL,
	"hidden" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "interviews" (
	"judge_id" varchar(32) NOT NULL,
	"team_id" varchar(21) NOT NULL,
	"table" integer NOT NULL,
	"grade" json,
	CONSTRAINT interviews_judge_id_team_id PRIMARY KEY("judge_id","team_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invites" (
	"invitee_id" varchar(32) NOT NULL,
	"team_id" varchar(21) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"status" "status" DEFAULT 'pending' NOT NULL,
	CONSTRAINT invites_invitee_id_team_id PRIMARY KEY("invitee_id","team_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "profile_data" (
	"hacker_tag" varchar(15) PRIMARY KEY NOT NULL,
	"discord_username" varchar(60),
	"pronouns" varchar(20) NOT NULL,
	"bio" text,
	"skills" json NOT NULL,
	"profile_photo" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "registration_data" (
	"clerk_id" varchar(32) PRIMARY KEY NOT NULL,
	"age" integer NOT NULL,
	"gender" "gender" NOT NULL,
	"race" "race" NOT NULL,
	"ethnicity" "ethnicity" NOT NULL,
	"short_id" varchar(10),
	"university" varchar(80) NOT NULL,
	"major" varchar(80) NOT NULL,
	"level_of_study" "level_of_study" NOT NULL,
	"software_experience" "software_experience" NOT NULL,
	"hackathons_attended" integer NOT NULL,
	"shirt_size" "shirt_size" NOT NULL,
	"shared_data_with_mlh" boolean NOT NULL,
	"wants_to_receive_mlh_emails" boolean NOT NULL,
	"github" varchar(100),
	"linkedin" varchar(100),
	"personal_website" varchar(100),
	"resume" varchar(255),
	"diet_restrictions" json,
	"accommodation_note" text,
	"heard_from" "heard_from"
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "scans" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"user_id" varchar(32) NOT NULL,
	"event_id" integer NOT NULL,
	"count" integer DEFAULT 1 NOT NULL,
	CONSTRAINT scans_user_id_event_id PRIMARY KEY("user_id","event_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "submissions" (
	"team_id" varchar(21) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"link" varchar NOT NULL,
	"time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "teams" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"tag" varchar(50) NOT NULL,
	"bio" text,
	"photo" varchar(400) DEFAULT 'https://static.acmutsa.org/defaultteamphoto.png' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"owner_id" varchar(32) NOT NULL,
	CONSTRAINT "teams_tag_unique" UNIQUE("tag")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "track_submissions" (
	"track_id" integer NOT NULL,
	"team_id" varchar(21) NOT NULL,
	CONSTRAINT track_submissions_track_id_team_id PRIMARY KEY("track_id","team_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tracks" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"color" varchar(7) NOT NULL,
	"criteria" json NOT NULL,
	CONSTRAINT "tracks_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"clerk_id" varchar(32) PRIMARY KEY NOT NULL,
	"first_name" varchar(50) NOT NULL,
	"last_name" varchar(50) NOT NULL,
	"role" "role" DEFAULT 'hacker' NOT NULL,
	"hacker_tag" varchar(15) NOT NULL,
	"email" varchar(255) NOT NULL,
	"team_id" varchar(21),
	"group" integer NOT NULL,
	"registration_complete" boolean DEFAULT false NOT NULL,
	"accepted_mlh_conduct" boolean DEFAULT true NOT NULL,
	"has_searchable_profile" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"checkin_timestamp" timestamp,
	CONSTRAINT "users_hacker_tag_unique" UNIQUE("hacker_tag"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "error_log" ADD CONSTRAINT "error_log_user_id_users_clerk_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("clerk_id") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "interviews" ADD CONSTRAINT "interviews_team_id_submissions_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "submissions"("team_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invites" ADD CONSTRAINT "invites_invitee_id_users_clerk_id_fk" FOREIGN KEY ("invitee_id") REFERENCES "users"("clerk_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invites" ADD CONSTRAINT "invites_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "profile_data" ADD CONSTRAINT "profile_data_hacker_tag_users_hacker_tag_fk" FOREIGN KEY ("hacker_tag") REFERENCES "users"("hacker_tag") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "registration_data" ADD CONSTRAINT "registration_data_clerk_id_users_clerk_id_fk" FOREIGN KEY ("clerk_id") REFERENCES "users"("clerk_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "scans" ADD CONSTRAINT "scans_user_id_users_clerk_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("clerk_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "scans" ADD CONSTRAINT "scans_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE no action ON UPDATE no action;
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
DO $$ BEGIN
 ALTER TABLE "teams" ADD CONSTRAINT "teams_owner_id_users_clerk_id_fk" FOREIGN KEY ("owner_id") REFERENCES "users"("clerk_id") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "track_submissions" ADD CONSTRAINT "track_submissions_team_id_submissions_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "submissions"("team_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
