import { auth } from "@clerk/nextjs";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { users, submissions, interviews, tracks, trackSubmissions } from "@/db/schema";
import c from "@/hackkit.config";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	// const { userId } = auth();

	// if (!userId) return new Response("Unauthorized", { status: 401 });

	// const reqUserRecord = await db.query.users.findFirst({
	// 	where: eq(users.clerkID, userId),
	// });

	// if (!reqUserRecord || (reqUserRecord.role !== "super_admin" && reqUserRecord.role !== "admin")) {
	// 	return new Response("Unauthorized", { status: 401 });
	// }

    // delete any previously generated schedules
    await db.delete(interviews);

    // Fetch all track & submission data and judges
    const trackSizes     = (await db.select({name: tracks.name, size: sql`count(${trackSubmissions.trackID})`}).from(tracks)
                                    .innerJoin(trackSubmissions, eq(tracks.id, trackSubmissions.trackID))
                                    .groupBy(tracks.id)
                                    .orderBy(sql`count(${trackSubmissions.trackID}) desc`));

    const allSubmissions = (await db.select().from(submissions)
                                    .innerJoin(trackSubmissions, eq(submissions.id, trackSubmissions.submissionID))
                                    .innerJoin(tracks,           eq(trackSubmissions.trackID, tracks.id))
                           ).map((obj) => (obj.submissions.id));

    const allJudges      = (await db.select().from(users).where(eq(users.role, "judge"))
                           ).map((user) => ({
                                id: user.clerkID
                           }));

    console.log(JSON.stringify(trackSizes));
    console.log();
    console.log(JSON.stringify(allSubmissions));
    console.log();
    console.log(JSON.stringify(allJudges));

    // c.rooms;

    // split submissions by track

    //foreach(track): make Map<String,String[]> entry of <track_name,null>
    //foreach(project): map[project.track].append(project.id)


    // fit largest tracks into largest rooms
    // ...
    
    return NextResponse.json({success: true});
}

export const runtime = "edge";
