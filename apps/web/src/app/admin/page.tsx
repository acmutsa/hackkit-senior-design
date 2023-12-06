import { Card, CardHeader, CardContent, CardTitle } from "@/components/shadcn/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader,TableRow } from "@/components/shadcn/ui/table";
import { Button } from "@/components/shadcn/ui/button";
import { db } from "@/db";
import { sql } from "drizzle-orm";
import { users, teams, submissions } from "@/db/schema";
import { BsFillPersonLinesFill, BsPersonBoundingBox, BsFillPersonCheckFill, BsCheckCircleFill } from "react-icons/bs";
import { RiTeamFill, RiContactsFill, RiEditBoxFill } from "react-icons/ri";
import { BiSolidFileExport } from "react-icons/bi";
import Link from "next/link";

export default async function Page() {

	interface Project {
		id:             string,
		team:           string,
		name:           string,
		track:          string,
		table:          number,
		submissionTime: string,
	};

	const allSubmissions = await db
		.select()
		.from(submissions);

	const allTeams = await db
		.select()
		.from(teams);

    const totalUserCount = await db
		.select({ count: sql<number>`count(*)`.mapWith(Number) })
		.from(users);

	/* NOTES
	 * Variables from original file.
	 */
	const totalTeamCount = allTeams.length;
	const totalRSVPCount = 0;    // TODO
	const totalCheckinCount = 0; // TODO

	/* NOTES
	 * - Are teams assigned a table on creation?
	 * - Move table attribute from submissions to team?
	 * - Do teams chose which track to submit to before OR after submitting?
	 */
	const projects: Project[] = allTeams.map( (team) => { return {
		id:             team.id,
		team:           team.name,
		name:           allSubmissions.find((submission) => submission.teamID === team.id)?.name || "---",
		track:          allSubmissions.find((submission) => submission.teamID === team.id)?.track || "---",
		table:          allSubmissions.find((submission) => submission.teamID === team.id)?.table || -1,
		submissionTime: allSubmissions.find((submission) => submission.teamID === team.id)?.time.toDateString() || "",
	}});

	var submitted: number = 0;
	projects.map((proj) => {
		if (proj.submissionTime !== "") { submitted++; }
	});
	const submissionPerc = (submitted * 100) / projects.length;

    /* NOTES
     * - Completion = % of interviews conducted out of total interviews.
     * - Finished = % of projects fully judged out of total judging.
     * - How are both of these going to be tracked?
     */
	const completionPerc = 57; // TODO
	const finishedPerc = 25;   // TODO

	return (
		<div className="w-full max-w-7xl mx-auto h-16">
			<div className="w-full grid grid-cols-2 mb-5">
				<div className="flex items-center">
					<div>
						<h2 className="text-3xl font-bold tracking-tight">Overview</h2>
					</div>
				</div>
				<div className="flex items-center justify-end">
					<a download> {/* href="/api/admin/export/overview" */}
						<Button className="flex gap-x-1">
							<BiSolidFileExport />
							Export
						</Button>
					</a>
				</div>
			</div>
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
						<BsCheckCircleFill />
					</CardHeader>
					<CardContent>
                        {/* Percentage of projects SUBMITTED out off all projects */}
						<CardContent className="flex flex-row items-center justify-between spapce-y-0">
							<div className="text-2xl font-bold">{submissionPerc.toFixed(1)}%</div>
							<div className="text-l font-bold">{submitted}/{projects.length}</div>
						</CardContent>
						<div className="h-2 w-full bg-slate-500 rounded-2xl">
							<div className={"h-2 bg-slate-100 rounded-2xl"} style={{width: `${submissionPerc}%`}}></div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Completion</CardTitle>
						<RiContactsFill />
					</CardHeader>
					<CardContent>
						{/* Percentage of INTERVIEWS done out off all interviews */}
						<CardContent className="flex flex-row items-center justify-between spapce-y-0">
							<div className="text-2xl font-bold">{completionPerc}%</div>
							<div className="text-l font-bold">TBD</div>
						</CardContent>
						<div className="h-2 w-full bg-slate-500 rounded-2xl">
							<div className={"h-2 bg-slate-100 rounded-2xl"} style={{width: `${completionPerc}%`}}></div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Finished</CardTitle>
						<RiEditBoxFill />
					</CardHeader>
					<CardContent>
						{/* Percentage of FULLY JUDGED projects */}
						<CardContent className="flex flex-row items-center justify-between spapce-y-0">
							<div className="text-2xl font-bold">{finishedPerc}%</div>
							<div className="text-l font-bold">TBD</div>
						</CardContent>
						<div className="h-2 w-full bg-slate-500 rounded-2xl">
							<div className={"h-2 bg-slate-100 rounded-2xl"} style={{width: `${finishedPerc}%`}}></div>
						</div>
					</CardContent>
				</Card>
			</div>
			<div className="w-full grid grid-cols-2 my-5">
				<div className="flex items-center">
					<div>
						<h3 className="text-2xl font-bold tracking-tight">Submissions</h3>
					</div>
				</div>
				<div className="flex items-center justify-end gap-2"> {/* Alert for each corresponding button? */}
					<Button variant="outline" className="flex hover:bg-slate-800">Open</Button>
					<Button variant="outline" className="flex hover:bg-red-800">Close</Button>
				</div>
			</div>
			<div className="mt-2">
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
							<TableRow key={project.id} className="cursor-pointer">
								<TableCell className="font-medium">{project.team}</TableCell>
								<TableCell className="font-medium">{project.name}</TableCell>
								<TableCell className="font-medium">{project.track}</TableCell>
								<TableCell className="font-medium text-center">{project.table === -1 ? "---" : project.table}</TableCell>
								<TableCell className="font-medium text-center">{project.submissionTime === "" ? `\u2715` : `\u2713 ` + project.submissionTime}</TableCell>
								{/* TODO if judged, display check, else display x */}
								<TableCell className="font-medium text-center">&#x2715;</TableCell>
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
