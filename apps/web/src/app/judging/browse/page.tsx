import { Card, CardHeader, CardContent, CardTitle } from "@/components/shadcn/ui/card";
import { Button } from "@/components/shadcn/ui/button";
import Link from "next/link";
import { db } from "@/db";
import { teams, submissions } from "@/db/schema";

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

    const allSubmissions = await db.select().from(submissions);
    const teamNames = await db.select({id: teams.id, name: teams.tag}).from(teams);

    const projects: Project[] = allSubmissions.map( (submission) => { return {
        id:             submission.id,
        team:           teamNames.find((team) => team.id == submission.teamID)?.name || "",
        table:          submission.table || 0,
        name:           submission.name,
        track:          submission.track,
        link:           submission.link,
        submissionTime: submission.time.toDateString(),
    }});

	return (
      <div className="w-full mx-auto h-16 grid gap-2 p-2" style={{gridTemplateColumns: "repeat(auto-fit, minmax(400px,1fr)"}}>
        {
          projects.map( (project) => { return (
            <Card key={project.id} className="hover:bg-zinc-900 transition-colors">
              <CardHeader className="flex flex-col items-center space-y-0 pb-4">
                <div className="text-sm font-medium">{project.track}</div>
                <div className="flex flex-row w-full justify-between">
                  <div>{project.team}</div>
                  <div>Table {project.table}</div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-row justify-between gap-x-2">
                  <Link href={`submissions/${project.id}`} className="text-3xl align-middle w-full overflow-hidden text-ellipsis whitespace-nowrap">
                    {project.name}
                  </Link>
                  <a href={project.link} target="_blank">
                    <Button className="text-xl p-2 text-center">
                      Devpost
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          )})
        }
      </div>
	);
}

export const runtime = "edge";
export const revalidate = 90;
