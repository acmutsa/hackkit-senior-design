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
		<div className="w-full max-w-7xl mx-auto h-16">
			<div className="grid grid-cols-3 gap-x-2 gap-y-2">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Teams Left</CardTitle>
						<BsJournal />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{teamsLeft}</div>
						{/* <p className="text-xs text-muted-foreground">+20.1% from last month</p> */}
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Current Table</CardTitle>
						<BsSearch />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{currentTable}</div>
						{/* <p className="text-xs text-muted-foreground">+20.1% from last month</p> */}
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Next Table</CardTitle>
						<TbPlayerTrackNext />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{nextTable}</div>
						{/* <p className="text-xs text-muted-foreground">+20.1% from last month</p> */}
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Timer</CardTitle>
						<LuAlarmClock />
					</CardHeader>
					<CardContent className="flex flex-col items-center space-y-5">
                        <JudgeTimer defaultTime={defaultTime}/>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

export const runtime = "edge";
export const revalidate = 90;
