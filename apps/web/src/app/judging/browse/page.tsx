import { Card, CardHeader, CardContent, CardTitle } from "@/components/shadcn/ui/card";
import { Button } from "@/components/shadcn/ui/button";
import Link from "next/link";
import { db } from "@/db";
import { teams, submissions } from "@/db/schema";

export default async function Page() {

    interface Project {
      id:             string,
      teamID:         string,
      tableNum:       number,
      name:           string,
      track:          string,
      link:           string,
      submissionTime: string,
    }

    const allSubmissions = await db.select().from(submissions);
    const teamTags = await db.select({id: teams.id, tag: teams.tag}).from(teams);

    const projects: Project[] = allSubmissions.map( (submission) => { return {
        id:             submission.id,
        teamID:         teamTags.find((team) => {team.id == submission.teamID})?.tag || "undefined",
        tableNum:       submission.table || 0,
        name:           submission.name,
        track:          submission.track,
        link:           submission.link,
        submissionTime: submission.time.toDateString(),
    }});

    console.log(projects);

    // TODO: test data! remove later
    // const projects: Project[] = [
    //     {
    //       id: 1, teamNum: 11, tableNum: 21,
    //       name: "r/Slang", track: "Beginner",
    //       link: "https://devpost.com/software/r-slang",
    //       submissionTime: "2024-03-23T21:11:02.000Z"
    //     },
    //     {
    //       id: 2, teamNum: 12, tableNum: 22,
    //       name: "Optimealmmmmmmmmmmmmmmmmmmm", track: "General",
    //       link: "https://devpost.com/software/optimeal-w8r1x3",
    //       submissionTime: "2024-03-22T21:23:02.000Z"
    //     },
    //     {
    //       id: 3, teamNum: 13, tableNum: 23, 
    //       name: "RightBite", track: "Design",
    //       link: "https://devpost.com/software/rightbite",
    //       submissionTime: "2024-03-24T21:01:02.000Z"
    //     },
    // ]

	return (
		<div className="w-full mx-auto h-16">
		  <div className="grid gap-2 p-2" style={{gridTemplateColumns: "repeat(auto-fit, minmax(410px,1fr)"}}>
              {
                projects.map( (project) => { return (
                  <Card key={project.id} className="hover:bg-zinc-900 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                      <CardTitle className="text-sm font-medium">Team {project.teamNum.toString()}</CardTitle>
                      <div> Table {project.tableNum} </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-rows-1 justify-between gap-x-2" style={{gridTemplateColumns: "1fr 94px"}}>
                        <div className="text-3xl align-middle w-auto overflow-hidden text-ellipsis">
                          <Link href={`submissions/${project.id}`}>
                            {project.name}
                          </Link>
                        </div>
                        <div className="flex flex-row justify-between gap-x-2">
                          <a href={project.link} target="_blank" className="relative z-10">
                            <Button className="text-xl p-2 text-center">
                              Devpost
                            </Button>
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )})
              }
		  </div>
		</div>
	);
}

export const runtime = "edge";
export const revalidate = 90;
