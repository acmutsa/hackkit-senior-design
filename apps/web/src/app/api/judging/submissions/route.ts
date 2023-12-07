import { db } from "@/db";
import { users, submissions } from "@/db/schema";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

    const { userId } = auth();

	if (!userId) return new Response("Unauthorized", { status: 401 });

	const reqUserRecord = await db.query.users.findFirst({
		where: eq(users.clerkID, userId),
	});

	if (!reqUserRecord || (reqUserRecord.role !== "judge" && reqUserRecord.role !== "admin" && reqUserRecord.role !== "super_admin")) {
		return new Response("Unauthorized", { status: 401 });
	}

    const body = await req.json();

    return NextResponse.json(body);
}

export async function GET(req: NextRequest) {

    const { userId } = auth();

	if (!userId) return new Response("Unauthorized", { status: 401 });

	const reqUserRecord = await db.query.users.findFirst({
		where: eq(users.clerkID, userId),
	});

	if (!reqUserRecord || (reqUserRecord.role !== "judge" && reqUserRecord.role !== "admin" && reqUserRecord.role !== "super_admin")) {
		return new Response("Unauthorized", { status: 401 });
	}

    const id = req.nextUrl.searchParams.get('id') as string;
    const submission = await db.select().from(submissions).where(eq(submissions.id, id)).limit(1);

    return NextResponse.json(submission);
}

export const runtime = "edge";
