import { db } from "@/db";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";
import { auth } from "@clerk/nextjs";

function escape(value: any) {
	if (value === null) return "None";

	// convert to string if it's not already
	const stringValue = typeof value !== "string" ? JSON.stringify(value) : value;

	// escape double quotes and enclose in quotes if it contains comma, newline or double quote
	if (/[",\n]/.test(stringValue)) {
		return `"${stringValue.replace(/"/g, '""')}"`;
	}

	return stringValue;
}

function jsonToCSV(json: any[]): string {
	if (!Array.isArray(json) || json.length === 0) {
		return "";
	}

	const header = Object.keys(json[0]);
	let csv = json.map((row) => header.map((fieldName) => escape(row[fieldName])).join(","));
	csv.unshift(header.join(","));

	return csv.join("\r\n");
}

export async function GET() {
	const { userId } = auth();

	if (!userId) return new Response("Unauthorized", { status: 401 });

	const reqUserRecord = await db.query.users.findFirst({
		where: eq(users.clerkID, userId),
	});

	if (!reqUserRecord || (reqUserRecord.role !== "super_admin" && reqUserRecord.role !== "admin")) {
		return new Response("Unauthorized", { status: 401 });
	}

	const userTableData = await db.query.users.findMany({
		with: {
			registrationData: true,
			profileData: true,
		},
	});

	const columed = userTableData.map((user) => {
		// TODO: Have to use any here to avoid type errors as we reshape the data. Could be fixed with a better type definition.
		let toRet: any = { ...user, ...user.registrationData, ...user.profileData };
		delete toRet.registrationData;
		delete toRet.profileData;
		return toRet;
	});

	const csv = jsonToCSV(columed);

	return new Response(csv, {
		headers: {
			"Content-Type": "text/csv",
			"Content-Disposition": `attachment; filename=hackkit_export_${new Date()
				.toString()
				.replaceAll(" ", "_")
				.replaceAll("(", "")
				.replaceAll(")", "")
				.toLowerCase()}.csv`,
		},
	});
}

export const runtime = "edge";
