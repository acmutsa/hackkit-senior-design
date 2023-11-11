import JudgeSlider from "@/components/judging/JudgeSlider";
import { Card } from "@/components/shadcn/ui/card";
import { db } from "@/db";
import { teams, submissions } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function Page({params: {id}}: {params: {id: string}}) {

    interface Project {
        id:             string,
        team:           string,
        table:          number,
        name:           string,
        track:          string,
        link:           string,
        submissionTime: string,
    }

    const submission = await db.select().from(submissions).where(eq(submissions.id, id)).limit(1);
    const team = await db.select({name: teams.tag}).from(teams).where(eq(teams.id, submission[0].teamID));
    
    const project: Project = {
        id:             submission[0].id,
        team:           team[0].name,
        table:          submission[0].table || 0,
        name:           submission[0].name,
        track:          submission[0].track,
        link:           submission[0].link,
        submissionTime: submission[0].time.toDateString(),
    };
    
    const criteria: string[] = ["Idea", "Technology", "Design", "Learning", "Completion"];

	return (
	  <Card className="w-full h-full p-4 mx-auto text-center max-w-7xl">
        <h1 className="p-10 text-4xl">{project.name}</h1>
        <div className="flex flex-col gap-x-2 gap-y-2">
          <Card className="p-8">
            <div className="grid grid-cols-3 grid-rows-2 text-center">
              <div className="text-lg"> Team  </div>
              <div className="text-lg"> Table </div>
              <div className="text-lg"> Track </div>
              <div className="text-3xl font-bold"> {project.team}  </div>
              <div className="text-3xl font-bold"> {project.table} </div>
              <div className="text-3xl font-bold"> {project.track} </div>
            </div>
          </Card>
          {
            criteria.map( (criterion) => { return (
              <JudgeSlider key={criterion} criteria={criterion}/>
            )})
          }
        </div>
	  </Card>
	);
}

export const runtime = "edge";
export const revalidate = 90;
