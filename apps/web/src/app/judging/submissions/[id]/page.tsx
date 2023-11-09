import { Card, CardHeader, CardContent, CardTitle } from "@/components/shadcn/ui/card";

export default async function Page({params: {id}}: {params: {id: number}}) {
	return (
		<div className="w-full max-w-7xl mx-auto h-16">
			<div className="grid grid-cols-3 gap-x-2 gap-y-2">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium"></CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{id}</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

export const runtime = "edge";
export const revalidate = 90;
