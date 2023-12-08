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

    // clear any previously generated schedules
    await db.delete(interviews);

    // Fetch all submissions, track data, and judges
    const allSubmissions = (await db.select({id: submissions.id}).from(submissions).orderBy(submissions.id))
                                .map((submission) => ({id: submission.id}));

    const trackSizes = (await db.select({id: tracks.id, name: tracks.name, size: sql`count(${trackSubmissions.trackID})`})
                                .from(tracks).innerJoin(trackSubmissions, eq(tracks.id, trackSubmissions.trackID))
                                .groupBy(tracks.id)
                                .orderBy(sql`count(${trackSubmissions.trackID}) desc`));

    const allTrackSubmissions = (await db.select().from(trackSubmissions))
                                    .map((trackSubmission) => ({
                                        id: trackSubmission.id,
                                        trackID: trackSubmission.trackID,
                                        submissionID: trackSubmission.submissionID
                                    }));

    const allJudges = (await db.select({id: users.clerkID}).from(users).where(eq(users.role, "judge")))
                           .map((user) => ({id: user.id}));

    // Declare interview array to store iteratively generated schedule data
    type Interview = {
        id:           number,
        judgeID:      string,
        submissionID: string,
        table:        number,
        complete:     boolean
    };

    var tempInterviews: Record<string, Interview[]> = {};

    // Generate interviews in batches ordered by submission
    var curID = 0;
    for (let submission of allSubmissions) {
        tempInterviews[submission.id] = [];
        for (let i = 0; i < c.interviewsPerSubmission; i++) {
            let newInterview = {
                id: curID++,
                judgeID: "",
                submissionID: submission.id,
                table: -1,
                complete: false
            };
            tempInterviews[submission.id].push(newInterview);
        }
    }

    // Assign tables to largest tracks' submissions first
    var curTable = 1;
    for (let track of trackSizes) {
        for (let trackSubmission of allTrackSubmissions) {

            if (trackSubmission.trackID != track.id) continue;

            let newTableAssigned = false;
            for (let curInterview of tempInterviews[trackSubmission.submissionID]){
                if (curInterview["table"] == -1)
                    curInterview["table"] = curTable;
                    newTableAssigned = true;
            }

            if (newTableAssigned) curTable++;
        }
    }

    // Unroll interviews record into array
    var interviewsArray: Interview[] = [];
    for (let key in tempInterviews) {
        for (let interview of tempInterviews[key]) {
            interviewsArray.push(interview);
        }
    }

    const numInterviews = interviewsArray.length;
    const numJudges = allJudges.length;
    const interviewsPerJudge = Math.ceil(numInterviews / numJudges);

    for (let judge = 0; judge < numJudges; judge++) {
        for (let interview = 0; interview < interviewsPerJudge; interview++) {
            const submission = judge * interviewsPerJudge + interview;
            if (submission < numInterviews)
                interviewsArray[submission]["judgeID"] = allJudges[judge].id;
        }
    }

    await db.insert(interviews).values(interviewsArray);

    return NextResponse.json({success: true});
}

export const runtime = "edge";
