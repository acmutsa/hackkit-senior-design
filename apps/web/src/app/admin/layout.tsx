import c from "@/hackkit.config";
import Image from "next/image";
import { db } from "@/db";
import { auth } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/shadcn/ui/button";
import DashNavItem from "@/components/dash/shared/DashNavItem";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";
import FullScreenMessage from "@/components/shared/FullScreenMessage";
import ProfileButton from "@/components/dash/shared/ProfileButton";

interface AdminLayoutProps {
	children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
	const { userId } = auth();

	if (!userId) {
		return (
			<FullScreenMessage message="No clue how this happened since you should have been redirected, but this page is only viewable by admins." />
		);
	}

	const user = await db.query.users.findFirst({
		where: eq(users.clerkID, userId),
	});

	if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
		return (
			<FullScreenMessage
				title="Access Denied"
				message="You are not an admin. If you belive this is a mistake, please contact a administrator."
			/>
		);
	}

	return (
		<div className="max-w-screen">
			<div className="w-full h-16 px-5 grid grid-cols-2 bg-nav">
				<div className="flex items-center gap-x-4">
					<Image src={c.icon.svg} alt={c.hackathonName + " Logo"} width={32} height={32} />
					<div className="bg-muted-foreground h-[45%] rotate-[25deg] w-[2px]" />
					<h2 className="font-bold tracking-tight">Admin Dashboard</h2>
				</div>
				<div className="flex items-center justify-end gap-x-4">
					<Link href={"/"}>
						<Button variant={"outline"} className="bg-nav hover:bg-background">
							Home
						</Button>
					</Link>
					<Link href={"/guide"}>
						<Button variant={"outline"} className="bg-nav hover:bg-background">
							Survival Guide
						</Button>
					</Link>
					<Link href={"/guide"}>
						<Button variant={"outline"} className="bg-nav hover:bg-background">
							Discord
						</Button>
					</Link>
					<ProfileButton />
				</div>
			</div>
			<div className="w-full h-12 px-5 flex bg-nav border-b-border border-b mb-12">
				{Object.entries(c.dashPaths.admin).map(([name, path]) => (
					<DashNavItem key={name} name={name} path={path} />
				))}
			</div>
			{children}
		</div>
	);
}

export const runtime = "edge";
