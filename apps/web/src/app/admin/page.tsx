import { Card, CardHeader, CardContent, CardTitle } from "@/components/shadcn/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader,TableRow } from "@/components/shadcn/ui/table";
import { db } from "@/db";
import { sql } from "drizzle-orm";
import { users, teams, submissions } from "@/db/schema";
import { BsFillPersonLinesFill, BsPersonBoundingBox, BsFillPersonCheckFill, BsClipboardCheck, BsCheck2Circle, BsCheckCircleFill } from "react-icons/bs";
import { RiTeamFill } from "react-icons/ri";

export default async function Page() {

	interface Project {
		id:             string,
		team:           string,
		table:          number,
		name:           string,
		track:          string,
		link:           string,
		submissionTime: string,
	}

	const allSubmissions = await db
		.select()
		.from(submissions);

	const allTeams = await db
		.select()
		.from(teams);

	const projects: Project[] = allSubmissions.map( (submission) => { return {
		id:             submission.id,
		team:           allTeams.find((team) => team.id == submission.teamID)?.name || "",
		table:          submission.table || 0,
		name:           submission.name,
		track:          submission.track,
		link:           submission.link,
		submissionTime: submission.time.toDateString(),
	}});

	const totalUserCount = await db
		.select({ count: sql<number>`count(*)`.mapWith(Number) })
		.from(users);

	const totalTeamCount = allTeams.length;
	const totalRSVPCount = 0;
	const totalCheckinCount = 0;

	var submitted: number = 0;
	allSubmissions.map((sub) => {
		if (sub.time.toDateString() !== "") { submitted++ }
	})

	const submissionPerc = (submitted * 100) / projects.length;

	return (
		<div className="w-full max-w-7xl mx-auto h-16">
			<div className="grid grid-cols-4 gap-x-2">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Registrations</CardTitle>
						<BsFillPersonLinesFill />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{totalUserCount[0].count}</div>
						{/* <p className="text-xs text-muted-foreground">+20.1% from last month</p> */}
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Teams</CardTitle>
						<RiTeamFill />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{totalTeamCount}</div>
						{/* <p className="text-xs text-muted-foreground">+20.1% from last month</p> */}
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">RSVPs</CardTitle>
						<BsFillPersonCheckFill />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{totalRSVPCount}</div>
						{/* <p className="text-xs text-muted-foreground">+20.1% from last month</p> */}
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Check-ins</CardTitle>
						<BsPersonBoundingBox />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{totalCheckinCount}</div>
						{/* <p className="text-xs text-muted-foreground">+20.1% from last month</p> */}
					</CardContent>
				</Card>
			</div>
			<div className="grid grid-cols-3 gap-x-2 mt-2">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Submissions</CardTitle>
						<BsClipboardCheck />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{submissionPerc}%</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Completion</CardTitle>
						<BsCheck2Circle />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">TBD%</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Finished</CardTitle>
						<BsCheckCircleFill />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">TBD%</div>
					</CardContent>
				</Card>
			</div>
			<div className="mt-2">
				{/* TBD table | Teams/Projects Submissions % Completion % Finished % */}
				<Table>
					<TableHeader>
						<TableRow>
						<TableHead className="w-[100px]">Team</TableHead>
						<TableHead>Project</TableHead>
						<TableHead>Track</TableHead>
						<TableHead className="text-center">Table</TableHead>
						<TableHead className="text-center">Submitted</TableHead>
						<TableHead className="text-center">Judged</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{projects.map((project) => (
							<TableRow key={project.id}>
								<TableCell className="font-medium">{project.team}</TableCell>
								<TableCell className="font-medium">{project.name}</TableCell>
								<TableCell className="font-medium">{project.track}</TableCell>
								<TableCell className="font-medium text-center">{project.table}</TableCell>
								<TableCell className="text-center">{project.submissionTime === "" ? `\u2715` : project.submissionTime}</TableCell>
								{/* TBD if judged, display check, else display x */}
								<TableCell className="text-center">&#x2715;</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}

export const runtime = "edge";
export const revalidate = 90;
