ALTER TYPE "role" ADD VALUE 'hacker';--> statement-breakpoint
ALTER TYPE "role" ADD VALUE 'judge';--> statement-breakpoint
ALTER TYPE "role" ADD VALUE 'volunteer';--> statement-breakpoint
ALTER TYPE "role" ADD VALUE 'mentor';--> statement-breakpoint
ALTER TYPE "role" ADD VALUE 'mlh';--> statement-breakpoint
ALTER TYPE "role" ADD VALUE 'admin';--> statement-breakpoint
ALTER TYPE "role" ADD VALUE 'super_admin';--> statement-breakpoint
ALTER TYPE "level_of_study" ADD VALUE 'Other';--> statement-breakpoint
ALTER TABLE "error_log" DROP CONSTRAINT "error_log_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "interviews" DROP CONSTRAINT "interviews_judge_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "invites" DROP CONSTRAINT "invites_invitee_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "registration_data" DROP CONSTRAINT "registration_data_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "scans" DROP CONSTRAINT "scans_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "teams" DROP CONSTRAINT "teams_owner_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "profile_data" RENAME COLUMN "discord" TO "discord_username";--> statement-breakpoint
ALTER TABLE "registration_data" RENAME COLUMN "user_id" TO "clerk_id";--> statement-breakpoint
ALTER TABLE "registration_data" RENAME COLUMN "data_shareable" TO "shared_data_with_mlh";--> statement-breakpoint
ALTER TABLE "registration_data" RENAME COLUMN "emailable" TO "wants_to_receive_mlh_emails";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "id" TO "clerk_id";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "profile_searchable" TO "has_searchable_profile";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "check_in_time" TO "checkin_timestamp";--> statement-breakpoint
ALTER TABLE "profile_data" ALTER COLUMN "profile_photo" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "teams" ALTER COLUMN "photo" SET DEFAULT 'https://static.acmutsa.org/defaultteamphoto.png';--> statement-breakpoint
ALTER TABLE "teams" ALTER COLUMN "photo" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tracks" ALTER COLUMN "color" SET DATA TYPE varchar(7);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'hacker';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "accepted_mlh_conduct" boolean DEFAULT true NOT NULL;--> statement-breakpoint
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
 ALTER TABLE "invites" ADD CONSTRAINT "invites_invitee_id_users_clerk_id_fk" FOREIGN KEY ("invitee_id") REFERENCES "users"("clerk_id") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "teams" ADD CONSTRAINT "teams_owner_id_users_clerk_id_fk" FOREIGN KEY ("owner_id") REFERENCES "users"("clerk_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
