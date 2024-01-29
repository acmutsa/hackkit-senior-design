import { currentUser, clerkClient } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { eq, sql } from "drizzle-orm";
import { users, registrationData, profileData } from "@/db/schema";
import { RegisterFormValidator } from "@/validators/shared/RegisterForm";
import c from "@/hackkit.config";
import { z } from "zod";

export async function POST(req: Request) {
	const rawBody = await req.json();
	const parsedBody = RegisterFormValidator.merge(z.object({ resume: z.string().url() })).safeParse(
		rawBody
	);

	if (!parsedBody.success) {
		return NextResponse.json(
			{
				success: false,
				message: "Malformed request body.",
			},
			{ status: 400 }
		);
	}

	const body = parsedBody.data;
	const user = await currentUser();

	if (!user) {
		console.log("no user");
		return NextResponse.json(
			{
				success: false,
				message: "You must be logged in to register.",
			},
			{ status: 401 }
		);
	}

	if (user.publicMetadata.registrationComplete) {
		console.log("already registered");
		return NextResponse.json(
			{
				success: false,
				message: "You are already registered.",
			},
			{ status: 400 }
		);
	}

	// TODO: Might be removable? Not sure if this is needed. In every case, the sure should have a peice of metadata that says if they are registered or not.

	const lookupByUserID = await db.query.users.findFirst({
		where: eq(users.clerkID, user.id),
	});

	if (lookupByUserID) {
		return NextResponse.json(
			{
				success: false,
				message: "You are already registered.",
			},
			{ status: 400 }
		);
	}

	const lookupByHackerTag = await db.query.users.findFirst({
		where: eq(users.hackerTag, body.hackerTag.toLowerCase()),
	});

	if (lookupByHackerTag) {
		return NextResponse.json({
			success: false,
			message: "hackertag_not_unique",
		});
	}

	const totalUserCount = await db
		.select({ count: sql<number>`count(*)`.mapWith(Number) })
		.from(users);

	if (!body.acceptsMLHCodeOfConduct || !body.sharedDataWithMLH) {
		return NextResponse.json({
			success: false,
			message: "You must accept the MLH Code of Conduct and Privacy Policy.",
		});
	}

	await db.transaction(async (tx) => {
		await tx.insert(users).values({
			clerkID: user.id,
			firstName: body.firstName,
			lastName: body.lastName,
			hackerTag: body.hackerTag.toLowerCase(),
			email: body.email,
			group: totalUserCount[0].count % c.groups.length,
			registrationComplete: true,
			hasSearchableProfile: body.hasSearchableProfile,
		});

		await tx.insert(registrationData).values({
			clerkID: user.id,
			age: body.age,
			gender: body.gender,
			race: body.race,
			ethnicity: body.ethnicity,
			shortID: body.shortID,
			university: body.university,
			major: body.major,
			levelOfStudy: body.levelOfStudy,
			softwareExperience: body.softwareBuildingExperience,
			hackathonsAttended: body.hackathonsAttended,
			shirtSize: body.shirtSize,
			sharedDataWithMLH: body.sharedDataWithMLH,
			emailable: body.wantsToReceiveMLHEmails,
			GitHub: body.github,
			LinkedIn: body.linkedin,
			PersonalWebsite: body.personalWebsite,
			resume: body.resume,
			dietRestrictions: body.dietaryRestrictions,
			accommodationNote: body.accommodationNote || null,
			heardFrom: body.heardAboutEvent || null,
		});

		await tx.insert(profileData).values({
			hackerTag: body.hackerTag.toLowerCase(),
			discord: body.profileDiscordName,
			pronouns: body.pronouns,
			bio: body.bio,
			skills: [],
			profilePhoto: user.profileImageUrl,
		});
	});

	clerkClient.users.updateUser(user.id, {
		publicMetadata: {
			...user.publicMetadata,
			registrationComplete: true,
		},
	});
	return NextResponse.json({ success: true, message: "Successfully created registration!" });
}

export const runtime = "edge";
