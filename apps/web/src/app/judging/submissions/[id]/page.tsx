import JudgeForm from "@/components/judging/JudgeForm";
import { Card } from "@/components/shadcn/ui/card";
import { db } from "@/db";
import { teams, submissions } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function Page({params: {id}}: {params: {id: string}}) {

    const submission = await db.select().from(submissions).where(eq(submissions.teamID, id)).limit(1);
    const team = await db.select({name: teams.tag}).from(teams).where(eq(teams.id, submission[0].teamID)).limit(1);
    
    const project = {
        id:             submission[0].id,
        team:           team[0].name,
        table:          submission[0].table || 0,
        name:           submission[0].name,
        track:          submission[0].track,
        link:           submission[0].link,
        submissionTime: submission[0].time.toDateString(),
    };
    
    const tempCriteria: string[] = ["Idea", "Technology", "Design", "Learning", "Completion"];

	return (
	  <Card className="w-full h-full p-4 mx-auto text-center max-w-7xl">
        <h1 className="pt-2 pb-6 text-4xl font-medium">{project.name}</h1>
        <div className="flex flex-col gap-x-2 gap-y-2">
          <Card className="py-8 mx-10 mb-10">
            <div className="grid grid-cols-3 grid-rows-2 text-center">
              <div className="text-lg"> Team  </div>
              <div className="text-lg"> Table </div>
              <div className="text-lg"> Track </div>
              <div className="text-3xl"> {project.team}  </div>
              <div className="text-3xl"> {project.table} </div>
              <div className="text-3xl"> {project.track} </div>
            </div>
          </Card>
          <JudgeForm id={project.id} criteria={tempCriteria}/>
        </div>
	  </Card>
	);
}

export const runtime = "edge";
export const revalidate = 90;
