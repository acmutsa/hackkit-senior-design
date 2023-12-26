import { db } from "@/db";
import { errorLog } from "@/db/schema";
import { nanoid } from "nanoid";

interface LogErrorParams {
	error: unknown;
	userID?: string;
	route: string;
}

export async function logError({ error, userID, route }: LogErrorParams) {
	if (error instanceof Error) {
		await db.insert(errorLog).values({
			message: error.message,
			userID: userID || null,
			route,
		});
	} else {
		throw new Error("Error must be an instance of Error");
	}
}
