/*

When changes are made to this file, you must run the following command to create the SQL migrations:

pnpm run generate

more info: https://orm.drizzle.team/kit-docs/overview

*/

import {
	serial,
	text,
	varchar,
	boolean,
	timestamp,
	integer,
	json,
	pgEnum,
	primaryKey,
	pgTable,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const inviteType = pgEnum("status",
[
    "pending",
    "accepted",
    "declined",
]);

export const genders = pgEnum("gender",
[
    "Male",
    "Female",
    "Non-binary",
    "Other",
    "Prefer not to say"
]);

export const races = pgEnum("race",
[
    "Native American",
    "Asian / Pacific Islander",
    "Black / African American",
    "White / Caucasian",
    "Multiple / Other",
    "Prefer not to say",
]);

export const ethnicities  = pgEnum("ethnicity",
[
    "Hispanic or Latino",
    "Not Hispanic or Latino",
]);

export const studyLevels = pgEnum("level_of_study",
[
    "Freshman",
    "Sophomore",
    "Junior",
    "Senior",
    "Recent Grad",
    "Other,"
]);

export const experiences = pgEnum("software_experience",
[
    "Beginner",
    "Intermediate",
    "Advanced",
    "Expert",
]);

export const heardFrom = pgEnum("heard_from",
[
    "Instagram",
    "Class Presentation",
    "Twitter",
    "Event Site",
    "Friend",
    "Other",
]);

export const shirtSizes = pgEnum("shirt_size",
[
    "S",
    "M",
    "L",
    "XL",
    "2XL",
    "3XL",
]);

export const roles = pgEnum("role",
[
	"hacker",
	"volunteer",
	"mentor",
	"mlh",
	"admin",
	"super_admin",
]);


export const users = pgTable("users",
{
	id:                   varchar   ("id",                   {length:  32}) .primaryKey(),
	firstName:            varchar   ("first_name",           {length:  50}) .notNull(),
	lastName:             varchar   ("last_name",            {length:  50}) .notNull(),
	role:                 roles     ("role"                               ) .notNull().default("hacker"),
	hackerTag:            varchar   ("hacker_tag",           {length:  15}) .notNull().unique(),
	email:                varchar   ("email",                {length: 255}) .notNull().unique(),
	teamID:               varchar   ("team_id",              {length:  21}) ,
	group:                integer   ("group"                              ) .notNull(),
	registrationComplete: boolean   ("registration_complete"              ) .notNull().default(false),
	profileSearchable:    boolean   ("profile_searchable"                 ) .notNull().default(true),
	createdAt:            timestamp ("created_at"                         ) .notNull().defaultNow(),
	checkInTime:          timestamp ("check_in_time"                      ) ,
});

export const registrationData = pgTable("registration_data",
{
	userID:             varchar     ("user_id",             {length:  32}) .primaryKey().references(() => (users.id)),
    age:                integer     ("age"                               ) .notNull(),
	gender:             genders     ("gender"                            ) .notNull(),
	race:               races       ("race"                              ) .notNull(),
	ethnicity:          ethnicities ("ethnicity"                         ) .notNull(),
	shortID:            varchar     ("short_id",            {length:  10}) ,
	university:         varchar     ("university",          {length:  80}) .notNull(),
	major:              varchar     ("major",               {length:  80}) .notNull(),
	levelOfStudy:       studyLevels ("level_of_study"                    ) .notNull(),
	softwareExperience: experiences ("software_experience"               ) .notNull(),
	hackathonsAttended: integer     ("hackathons_attended"               ) .notNull(),
	shirtSize:          shirtSizes  ("shirt_size"                        ) .notNull(),
	dataShareable:      boolean     ("data_shareable"                    ) .notNull(),
	emailable:          boolean     ("emailable"                         ) .notNull(),
	GitHub:             varchar     ("github",              {length: 100}) ,
	LinkedIn:           varchar     ("linkedin",            {length: 100}) ,
	PersonalWebsite:    varchar     ("personal_website",    {length: 100}) ,
	resume:             varchar     ("resume",              {length: 255}) .notNull()
                            .default("https://static.acmutsa.org/No%20Resume%20Provided.pdf"),
	dietRestrictions:   json        ("diet_restrictions"                 ) ,
	accommodationNote:  text        ("accommodation_note"                ) ,
	heardFrom:          heardFrom   ("heard_from"                        ) ,
});

export const profileData = pgTable("profile_data",
{
	hackerTag:    varchar ("hacker_tag",    {length:  15}) .primaryKey().references(() => (users.hackerTag)),
	discord:      varchar ("discord",       {length:  60}) ,
	pronouns:     varchar ("pronouns",      {length:  20}) .notNull(),
	bio:          text    ("bio"                         ) ,
	skills:       json    ("skills"                      ) .notNull(),
	profilePhoto: varchar ("profile_photo", {length: 255}) ,
});

export const events = pgTable("events",
{
	id:          serial    ("id"                       ) .primaryKey(),
    title:       varchar   ("name",       {length: 255}) .notNull(),
	startTime:   timestamp ("start_time"               ) .notNull(),
	endTime:     timestamp ("end_time"                 ) .notNull(),
    roomNum:     varchar   ("room_num",   {length:  10}) .notNull(),
	description: text      ("description"              ) .notNull(),
	type:        varchar   ("type",       {length:  50}) .notNull(),
	host:        varchar   ("host",       {length: 255}) .notNull(),
	hidden:      boolean   ("hidden"                   ) .notNull().default(false),
});

export const scans = pgTable("scans",
	{
		createdAt: timestamp ("created_at"              ) .notNull().defaultNow(),
		userID:    varchar   ("user_id",   {length:  32}) .notNull().references(() => (users.id)),
		eventID:   integer   ("event_id"                ) .notNull().references(() => (events.id)),
		count:     integer   ("count"                   ) .notNull().default(1),
	},
	(table) => ({
		id: primaryKey(table.userID, table.eventID),
	})
);

export const teams = pgTable("teams",
{
	id:        varchar   ("id",        {length:  21}) .primaryKey(),
	name:      varchar   ("name",      {length: 255}) .notNull(),
	tag:       varchar   ("tag",       {length:  50}) .notNull().unique(),
	bio:       text      ("bio"                     ) ,
	photo:     varchar   ("photo",     {length: 400}) ,
	createdAt: timestamp ("created_at"              ) .notNull().defaultNow(),
	ownerID:   varchar   ("owner_id",  {length:  32}) .notNull().references(() => (users.id)),
});

export const invites = pgTable("invites",
	{
		inviteeID: varchar    ("invitee_id", {length:  32}) .notNull().references(() => (users.id)),
		teamID:    varchar    ("team_id",    {length:  21}) .notNull().references(() => (teams.id)),
		createdAt: timestamp  ("created_at"               ) .notNull().defaultNow(),
		status:    inviteType ("status"                   ) .notNull().default("pending"),
	},
	(table) => ({
		id: primaryKey(table.inviteeID, table.teamID),
	})
);

export const submissions = pgTable("submissions",
{
    teamID: varchar   ("team_id", {length:  21}) .primaryKey().references(() => teams.id),
    name:   varchar   ("name",    {length: 255}) .notNull(),
    link:   varchar   ("link"                  ) .notNull(),
    time:   timestamp ("time"                  ) .notNull().defaultNow()
});

export const tracks = pgTable("tracks",
{
    id:       integer ("id"      ) .primaryKey(),
    name:     varchar ("name"    ) .notNull().unique(),
    criteria: json    ("criteria") .notNull(),
});

export const trackSubmissions = pgTable("track_submissions",
    {
        trackID:      integer ("track_id"                   ) .notNull().references(() => tracks.id),
        submissionID: varchar ("submission_id", {length: 21}) .notNull().references(() => submissions.teamID)
    },
    (table) => ({
        id: primaryKey(table.trackID, table.submissionID),
    })
);

export const interviews = pgTable("interviews",
    {
    	judgeID:      varchar ("judge_id",      {length: 32}) .notNull().references(() => users.id),
        submissionID: varchar ("submission_id", {length: 21}) .notNull().references(() => submissions.teamID),
        table:        integer ("table"                      ) .notNull(),
        completed:    boolean ("completed"                  ) .notNull().default(false)
    },
    (table) => ({
        id: primaryKey(table.judgeID, table.submissionID),
    })
);

export const errorLog = pgTable("error_log",
{
	id:        serial    ("id"                      ) .primaryKey(),
	createdAt: timestamp ("created_at"              ) .notNull().defaultNow(),
	userID:    varchar   ("user_id",   {length:  32}) .references(() => users.id),
	route:     varchar   ("route",     {length: 100}) ,
	message:   text      ("message"                 ) .notNull(),
});

export const userRelations = relations(users, ({ one, many }) => ({
	registrationData: one(registrationData, {
		fields: [users.id],
		references: [registrationData.userID],
	}),
	profileData: one(profileData, {
		fields: [users.hackerTag],
		references: [profileData.hackerTag],
	}),
	scans: many(scans),
	team: one(teams, {
		fields: [users.teamID],
		references: [teams.id],
	}),
	invites: many(invites),
}));

export const eventsRelations = relations(events, ({ many }) => ({
	scans: many(scans),
}));

export const scansRelations = relations(scans, ({ one }) => ({
	user: one(users, {
		fields: [scans.userID],
		references: [users.id],
	}),
	event: one(events, {
		fields: [scans.eventID],
		references: [events.id],
	}),
}));

export const teamsRelations = relations(teams, ({ many }) => ({
	members: many(users),
	invites: many(invites),
}));

export const submissionRelations = relations(submissions, ({ one, many }) => ({
    team: one(teams, {
        fields: [submissions.teamID],
        references: [teams.id]
    }),
    tracks: many(trackSubmissions),
    interviews: one(interviews, {
        fields: [submissions.teamID],
        references: [interviews.submissionID]
    }),
}));

export const tracksRelations = relations(tracks, ({ one, many }) => ({
    submissions: many(trackSubmissions)
}));

export const trackSubmissionsRelations = relations(trackSubmissions, ({ one }) => ({
    track: one(tracks, {
        fields: [trackSubmissions.trackID],
        references: [tracks.id]
    }),
    submission: one(submissions, {
		fields: [trackSubmissions.submissionID],
		references: [submissions.teamID]
    })
}));

export const invitesRelations = relations(invites, ({ one }) => ({
	invitee: one(users, {
		fields: [invites.inviteeID],
		references: [users.id],
	}),
	team: one(teams, {
		fields: [invites.teamID],
		references: [teams.id],
	}),
}));
