import { auth } from "@clerk/nextjs";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { users            as usersTable,
         submissions      as submissionsTable,
         interviews       as interviewsTable,
         tracks           as tracksTable,
         trackSubmissions as trackSubmissionsTable
       } from "@/db/schema";
import c from "@/hackkit.config";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	// const { userId } = auth();

	// if (!userId) return new Response("Unauthorized", { status: 401 });

	// const reqUserRecord = await db.query.usersTable.findFirst({
	// 	where: eq(usersTable.clerkID, userId),
	// });

	// if (!reqUserRecord || (reqUserRecord.role !== "super_admin" && reqUserRecord.role !== "admin")) {
	// 	return new Response("Unauthorized", { status: 401 });
	// }

    // clear any previously generated schedules
    await db.delete(interviewsTable);

    // Fetch all submissions, track data, and judges
    const submissions = (await db.select({id: submissionsTable.teamID}).from(submissionsTable).orderBy(submissionsTable.teamID))
                                .map((submission) => ({id: submission.id}));

    const trackSizes = (await db.select({id: tracksTable.id, name: tracksTable.name, size: sql`count(${trackSubmissionsTable.trackID})`})
                                .from(tracksTable).innerJoin(trackSubmissionsTable, eq(tracksTable.id, trackSubmissionsTable.trackID))
                                .groupBy(tracksTable.id)
                                .orderBy(sql`count(${trackSubmissionsTable.trackID}) desc`));

    const trackSubmissions = (await db.select().from(trackSubmissionsTable))
                                    .map((trackSubmission) => ({
                                        trackID: trackSubmission.trackID,
                                        teamID: trackSubmission.teamID
                                    }));

    const judges = (await db.select({id: usersTable.clerkID}).from(usersTable).where(eq(usersTable.role, "judge")))
                           .map((user) => ({id: user.id}));

    // Declare interview array to store iteratively generated schedule data
    type Interview = {
        id:           number,
        judgeID:      string,
        teamID: string,
        table:        number,
        complete:     boolean
    };

    var tempInterviews: Record<string, Interview[]> = {};

    // Generate interviews in batches ordered by submission
    var curID = 0;
    for (let submission of submissions) {
        tempInterviews[submission.id] = [];
        for (let i = 0; i < c.interviewsPerSubmission; i++) {
            let newInterview = {
                id: curID++,
                judgeID: "",
                teamID: submission.id,
                table: -1,
                complete: false
            };
            tempInterviews[submission.id].push(newInterview);
        }
    }

    // Assign tables to largest tracks' submissions first
    var curTable = 1;
    for (let track of trackSizes) {
        for (let trackSubmission of trackSubmissions) {

            if (trackSubmission.trackID != track.id) continue;

            let newTableAssigned = false;
            for (let curInterview of tempInterviews[trackSubmission.teamID]){
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
    const numJudges = judges.length;
    const interviewsPerJudge = Math.ceil(numInterviews / numJudges);

    for (let judge = 0; judge < numJudges; judge++) {
        for (let interview = 0; interview < interviewsPerJudge; interview++) {
            const submission = judge * interviewsPerJudge + interview;
            if (submission < numInterviews)
                interviewsArray[submission]["judgeID"] = judges[judge].id;
        }
    }

    await db.insert(interviewsTable).values(interviewsArray);

    return NextResponse.json({success: true});
}

export const runtime = "edge";
