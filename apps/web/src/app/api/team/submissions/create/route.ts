import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { users, teams, errorLog, submissions } from "@/db/schema";
import { submissionValidator } from "@/validators/shared/team";
import { nanoid } from "nanoid";
import c from "@/hackkit.config";
import { logError } from "@/lib/utils/server/logError";

export async function POST(req: Request) {
    console.log("in the api");
    const { userId } = await auth();
    if (!userId) return new Response("Unauthorized", { status: 401 });
    const user = await db.query.users.findFirst({
        where: eq(users.clerkID, userId),
        with: {
            invites: {
                with: {
                    team: true,
                },
            },
            team: {
                with: {
                    members: {
                        with: {
                            profileData: true,
                        },
                    },
                },
            },
        },
    });
    if (!user) return new Response("Unauthorized", { status: 401 });

    const rawBody = await req.json();
    const body = submissionValidator.safeParse(rawBody);
    if (!body.success) {
        return NextResponse.json({
            success: false,
            message: body.error.message,
        });
    }
    const team = user.team;
    if (!team) return null;
    const submission = await db.query.submissions.findFirst({
        where: eq(submissions.teamID, team.id),
    });
    if (!submission) return null;
    const submissionID = submission?.id;
    const currentTime: string | Date = new Date();
    try {
        await db.transaction(async (tx) => {
            await tx
                .update(submissions)
                .set({
                    teamID: team.id,
                    table: body.data.table,
                    name: team.name,
                    track: body.data.track,
                    link: body.data.link,
                    time: currentTime,
                })
                .where(eq(submissions.id, submissionID));
        });
    } catch (e) {
        const errorID = await logError({
            error: e,
            userID: userId,
            route: "/api/team/submissions/create",
        });
        return NextResponse.json({
            success: false,
            message: `An error occurred while creating your team. If this is a continuing issue, please reach out to ${c.issueEmail} with error ID ${errorID}.`,
        });
    }
}
