import { Card, CardHeader, CardContent, CardTitle } from "@/components/shadcn/ui/card";
import { LuAlarmClock } from "react-icons/lu";
import { BsSearch, BsJournal } from "react-icons/bs";
import { TbPlayerTrackNext } from "react-icons/tb";
import JudgeTimer from "@/components/judging/JudgeTimer";

const defaultTime: number = 300;

export default async function JudgingPage() {

    const teamsLeft = 5;
    const currentTable = "143";
    const nextTable = "157";

	return (
	  <div className="grid w-full h-16 grid-cols-3 mx-auto max-w-7xl gap-x-2 gap-y-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Teams Left</CardTitle>
            <BsJournal />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamsLeft}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Current Table</CardTitle>
            <BsSearch />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentTable}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Next Table</CardTitle>
            <TbPlayerTrackNext />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nextTable}</div>
          </CardContent>
        </Card>
        <Card className="w-[400px] lg:w-[420px]">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Timer</CardTitle>
            <LuAlarmClock />
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-5">
            <JudgeTimer defaultTime={defaultTime}/>
          </CardContent>
        </Card>
	  </div>
	);
}

export const runtime = "edge";
export const revalidate = 90;