import { Card, CardHeader, CardContent, CardTitle } from "@/components/shadcn/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader,TableRow } from "@/components/shadcn/ui/table";
import { Button } from "@/components/shadcn/ui/button";
import { db } from "@/db";
import { sql, eq } from "drizzle-orm";
import { users, teams, submissions, interviews, tracks, trackSubmissions } from "@/db/schema";
import { BsFillPersonLinesFill, BsPersonBoundingBox, BsFillPersonCheckFill, BsCheckCircleFill } from "react-icons/bs";
import { RiTeamFill, RiContactsFill, RiEditBoxFill } from "react-icons/ri";
import { BiSolidFileExport } from "react-icons/bi";
import Link from "next/link";

export default async function Page() {

	interface Project {
		id:             string,    /* Judged column to display (complete interviews) / (total interviews) */
		tag:            string,    /* Display check + timestamp(?) when complete */
		team:           string,
		name:           string,
		link:           string,
		track:          string,
		table:          number,
		submissionTime: string,
		done:           number,
		total:          number,
		subID:          string,
	};

	const totalUserCount = await db
		.select({ count: sql<number>`count(*)`.mapWith(Number) })
		.from(users);

	const allTeams = await db
		.select()
		.from(teams);

	const allInterviews = await db
		.select()
		.from(interviews);

	const teamSub = await db
		.select()
		.from(teams)
		.fullJoin(submissions, eq(teams.id, submissions.teamID))

	const getTrack = await db
		.select()
		.from(tracks)
		.leftJoin(trackSubmissions, eq(tracks.id, trackSubmissions.trackID));

	const getInterviews = await db
		.select()
		.from(submissions)
		.leftJoin(interviews, eq(submissions.id, interviews.submissionID));

	/* Variables from original file */
	const totalTeamCount = allTeams.length;
	const totalRSVPCount = 0;    // TODO
	const totalCheckinCount = 0; // TODO

	/* Project Interface */
	const projects: Project[] = teamSub.map( (teamSub) => { return {
		id:             teamSub.teams!.id,
		tag:            teamSub.teams!.tag,
		team:           teamSub.teams!.name,
		name:           teamSub.submissions?.name ?? "---",
		link:           teamSub.submissions?.link ?? "",
		track:          getTrack.find((track) => track.track_submissions?.submissionID === teamSub.submissions?.id)?.tracks.name ?? "---",
		table:          getInterviews.find((interview) => interview.submissions.id === teamSub.submissions?.id)?.interviews?.table ?? -1,
		submissionTime: teamSub.submissions?.time.toDateString() || "",
		done:           0,
		total:          0,
		subID:          teamSub.submissions?.id ?? "",
	}});

	/* Sort projects to show unsubmitted last */
	const sortedProjects = projects.sort(
		(a: Project, b: Project) =>
			a.submissionTime === ""
				? 1
				: b.submissionTime === ""
				? -1
				: new Date(a.submissionTime).getTime() - new Date(b.submissionTime).getTime()
	);

	/* Calculating the percentage of submitted projects */
	var submitted: number = 0;
	projects.map((proj) => {
		if (proj.submissionTime !== "") { submitted++; }
	});
	const submissionPerc = (submitted * 100) / projects.length;

    /* Calculating the percentage of judging completed */
	var doneInterviews: number = 0;
	allInterviews.map((interview) => {
		if (interview.complete) { doneInterviews++; }
	});
	var completionPerc: number = 0;
	allInterviews.length == 0 ?
		completionPerc = 0
		:
		completionPerc = (doneInterviews * 100) / allInterviews.length;

	/* Calculating the percentage of fully judged projects */
	const groupedInterviews: Record<string, any[]> = {};
	allInterviews.forEach((interview) => {
		const submission = interview.submissionID.toString();

		if (groupedInterviews.hasOwnProperty(submission)) {
			groupedInterviews[submission].push(interview);
		} else {
			groupedInterviews[submission] = [interview];
		}
	});

	const totalJudging = Object.keys(groupedInterviews).length;
	var doneJudging = 0;

	Object.keys(groupedInterviews).forEach(judged => {
		const check = groupedInterviews[judged];
		const allComplete = check.every(interview => interview.complete === true);
		if (allComplete) { doneJudging++; }

		var count = 0;
		var total = 0;
		for (const element of check) {
			if (element.complete) { count++; }
			total++;
		}

		projects.find((project) => project.subID === judged)!.done = count;
		projects.find((project) => project.subID === judged)!.total = total;
	})

	const finishedPerc = (doneJudging * 100) / totalJudging;

	return (
		<div className="w-full max-w-7xl mx-auto h-16">
			<div className="w-full grid grid-cols-2 mb-5">
				<div className="flex items-center">
					<div>
						<h2 className="text-3xl font-bold tracking-tight">Overview</h2>
					</div>
				</div>
				<div className="flex items-center justify-end">
					<a download> {/* TODO */}
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
							<div className="text-2xl font-bold">{submissionPerc.toFixed(0)}%</div>
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
							<div className="text-2xl font-bold">{completionPerc.toFixed(0)}%</div>
							<div className="text-l font-bold">{doneInterviews}/{allInterviews.length}</div> {/* TODO: Change variables to final */}
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
							<div className="text-2xl font-bold">{finishedPerc.toFixed(0)}%</div> {/* TODO: Change variables to final */}
							<div className="text-l font-bold">{doneJudging}/{totalJudging}</div>
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
							<TableHead className="w-[75px] text-center">Page</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{sortedProjects.map((project) => (
							<TableRow key={project.id}>
								<TableCell className="font-medium">{project.team}</TableCell>
								<TableCell className="font-medium">{project.name}</TableCell>
								<TableCell className="font-medium">{project.track}</TableCell>
								<TableCell className="font-medium text-center">{project.table === -1 ? "---" : project.table}</TableCell>
								<TableCell className="font-medium text-center">{project.submissionTime === "" ? `\u2715` : `\u2713 ` + project.submissionTime}</TableCell>
								{/* TODO if judged, display check, else display x */}
								<TableCell className="font-medium text-center">{project.done === 0 ? `\u2715` : project.done + "/" + project.total}</TableCell>
								<TableCell className="font-medium">
									{project.link == "" ? (
										<Button disabled variant="secondary">View</Button>
									) : (
										<Link href={project.link} rel="noopener noreferrer" target="_blank">
											<Button variant="secondary" className="hover:bg-gray-800">View</Button>
										</Link>
									)}
								</TableCell>
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
