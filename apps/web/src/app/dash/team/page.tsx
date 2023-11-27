import c from "@/hackkit.config";
import { auth } from "@clerk/nextjs";
import { db } from "@/db";
import { teams, users, submissions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Button } from "@/components/shadcn/ui/button";
import Link from "next/link";
import { BsFillPlusCircleFill, BsPeopleFill } from "react-icons/bs";
import { ImExit } from "react-icons/im";
import Image from "next/image";
import TeamInvite from "@/components/dash/team/invite";
import { Fragment } from "react";
import { Badge } from "@/components/shadcn/ui/badge";
import { Value } from "@radix-ui/react-select";

export default async function Page() {
    const { userId } = auth();
    if (!userId) return null;

    // TODO: make this db query not so bad
    const user = await db.query.users.findFirst({
        where: eq(users.clerkID, userId),
        with: {
            invites: {
                with: {
                    team: true,
                },
            },
            team: {
                with: {
                    members: {
                        with: {
                            profileData: true,
                        },
                    },
                },
            },
        },
    });
    if (!user) return null;

    if (!user.teamID) {
        return (
            <main className="max-w-5xl min-h-[70%] mx-auto w-full flex flex-col items-center mt-16">
                <div className="fixed left-1/2 top-[calc(50%+7rem)] overflow-x-hidden h-[40vh] w-[800px] max-w-screen -translate-x-1/2 -translate-y-1/2 scale-150 bg-hackathon opacity-30 blur-[100px] will-change-transform"></div>
                <h2 className="text-4xl font-extrabold">{c.hackathonName}</h2>
                <h1 className="text-6xl md:text-8xl mb-10 font-extrabold text-hackathon dark:text-transparent dark:bg-gradient-to-t dark:from-hackathon/80 dark:to-white dark:bg-clip-text">
                    Team
                </h1>
                <div className="min-h-[60vh] w-full max-w-[500px] aspect-video dark:bg-white/[0.08] bg-white backdrop-blur transition rounded-xl p-5">
                    <div className="w-full grid grid-cols-2 border-b-primary/[0.09] border-b pb-2">
                        <div className="flex flex-col justify-center text-sm">
                            <p>You are not currently in a team.</p>
                            <Link
                                className="text-xs text-blue-500 hover:underline"
                                href={"#"}
                            >
                                How do Teams work?
                            </Link>
                        </div>
                        <div className="flex items-center justify-end">
                            <Link href="/dash/team/new">
                                <Button>
                                    <BsFillPlusCircleFill className="mr-1" />
                                    New Team
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <div className="w-full flex flex-col items-center mt-10">
                        <h2 className="font-bold font-xl mb-5 text-2xl">
                            Invitations
                        </h2>
                        {user.invites.length > 0 ? (
                            user.invites.map((invite) => (
                                <div
                                    className="grid grid-cols-3 w-full h-16 rounded-xl px-2"
                                    key={invite.teamID}
                                >
                                    <div className="flex flex-col justify-center h-full w-full">
                                        <h1 className="font-bold">
                                            {invite.team.name}
                                        </h1>
                                        <h2 className="text-xs font-mono leading-none">
                                            ~{invite.team.tag}
                                        </h2>
                                    </div>
                                    <div className="h-full col-span-2 flex items-center justify-end gap-x-2">
                                        <Link href={`/~${invite.team.tag}`}>
                                            <Button>View Team</Button>
                                        </Link>
                                        <Button>Accept</Button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No Pending Invites</p>
                        )}
                    </div>
                </div>
            </main>
        );
    } else {
        if (!user.team) return null;
        const team = user.team;
        const submission = await db.query.submissions.findFirst({
            where: eq(submissions.teamID, team.id),
        });

        return (
            <main className="max-w-5xl min-h-[70%] mx-auto w-full flex flex-col items-center mt-16 font-sans">
                <div className="w-full grid grid-cols-2 mb-5">
                    <div className="flex items-center">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-x-1">
                                <BsPeopleFill />
                                Team
                            </h2>
                            {/* <p className="text-sm text-muted-foreground">{users.length} Total Users</p> */}
                        </div>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                        <TeamInvite />
                        <Button variant={"destructive"}>
                            <ImExit className="mr-1" />
                            Leave
                        </Button>
                    </div>
                </div>
                <div className="grid grid-cols-3 w-full min-h-[500px] mt-20">
                    <div className="flex flex-col items-center h-full w-full max-w-[250px]">
                        <div className="relative w-full h-min rounded-full aspect-square overflow-hidden">
                            <Image
                                className="object-cover object-center"
                                fill
                                src={team.photo}
                                alt={`Team Photo for ${team.name}`}
                            />
                        </div>
                        <h1 className="text-3xl mt-4 font-semibold">
                            {team.name}
                        </h1>
                        <h2 className="font-mono text-muted-foreground">
                            ~{team.tag}
                        </h2>
                        <p className="text-sm mt-5">{team.bio}</p>
                        <div className="flex mt-5 gap-x-2">
                            <Badge className="no-select">
                                Est.{" "}
                                {team.createdAt
                                    .toDateString()
                                    .split(" ")
                                    .slice(1)
                                    .join(" ")}
                            </Badge>
                        </div>
                    </div>
                    <div
                        className="aspect-video grid grid-cols-2 col-span-2 border-muted border-2 w-full rounded-2xl bg-[radial-gradient(#27272a,_1px,_transparent_0)]"
                        style={{
                            backgroundSize: "30px 30px",
                        }}
                    >
                        {team.members.map((member) => (
                            <Fragment key={member.hackerTag}>
                                <Link href={`/@${member.hackerTag}`}>
                                    <div className="h-full w-full flex items-center justify-center">
                                        <div className="bg-zinc-900 hover:bg-muted hover:border-muted-foreground transition-colors duration-150 border-muted border-2 rounded flex gap-x-2 p-2 items-center justify-center h-[75px] w-[200px]">
                                            <Image
                                                src={
                                                    member.profileData
                                                        .profilePhoto
                                                }
                                                alt={`${member.hackerTag}'s Profile Photo`}
                                                height={40}
                                                width={40}
                                                className="rounded-full"
                                            />
                                            <div>
                                                <h3>
                                                    {member.firstName}{" "}
                                                    {member.lastName}
                                                </h3>
                                                <h4 className="font-mono text-xs">
                                                    @{member.hackerTag}
                                                </h4>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </Fragment>
                        ))}
                    </div>
                    <div></div>
                    <div className="flex flex-col items-center col-span-2 mb-8">
                        <div className="flex grid-cols-2 col-span-2 justify-center border-muted mt-4">
                            <form className="flex flex-wrap w-full text-black space-x-4">
                                <input
                                    type="hidden"
                                    name="teamID"
                                    value={team.id}
                                    placeholder="Team ID"
                                    className="border border-gray-300 rounded-md py-2 px-4 w-full h-10 mb-4 focus:outline-none focus:ring focus:border-blue-500"
                                />

                                <input
                                    type="text"
                                    name="name"
                                    value={team.name}
                                    placeholder="Name"
                                    className="border border-gray-300 rounded-md py-2 px-4 w-full h-10 mb-4 focus:outline-none focus:ring focus:border-blue-500"
                                />
                                <input
                                    type="number"
                                    name="table"
                                    placeholder="Table Number"
                                    className="border border-gray-300 rounded-md py-2 px-4 w-full h-10 mb-4 focus:outline-none focus:ring focus:border-blue-500"
                                />

                                <div className="relative mb-4 w-full">
                                    <select
                                        name="track"
                                        className="border border-gray-300 rounded-md py-2 px-4 w-full h-10 focus:outline-none focus:ring focus:border-blue-500"
                                    >
                                        <option value="Beginner">
                                            Beginner
                                        </option>
                                        <option value="Intermediate">
                                            Intermediate
                                        </option>
                                        <option value="Expert">Expert</option>
                                    </select>
                                </div>
                                <input
                                    type="text"
                                    name="link"
                                    placeholder="Link"
                                    className="border border-gray-300 rounded-md py-2 px-4 w-full h-10 mb-4 focus:outline-none focus:ring focus:border-blue-500"
                                />
                                <button
                                    type="submit"
                                    className="h-10 px-4 text-white font-semibold rounded-md bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                >
                                    Submit
                                </button>
                            </form>
                        </div>
                        {submission && (
                            <div className="flex justify-center mt-4">
                                <div className="border border-muted p-4 bg-gray-100 rounded-lg shadow-md">
                                    <div>
                                        <h3 className="text-2xl font-bold mb-2 text-black">
                                            Last Submission
                                        </h3>
                                        <div className="bg-white p-4 rounded-md shadow-md">
                                            <p className="mb-2 font-semibold text-gray-800">
                                                <span className="font-semibold text-gray-800">
                                                    Table:
                                                </span>{" "}
                                                {submission.table}
                                            </p>
                                            <p className="mb-2 font-semibold text-gray-800">
                                                <span className="font-semibold text-gray-800">
                                                    Track:
                                                </span>{" "}
                                                {submission.track}
                                            </p>
                                            <p className="mb-2 font-semibold text-gray-800">
                                                <span className="font-semibold text-gray-800">
                                                    Link:
                                                </span>{" "}
                                                {submission.link}
                                            </p>
                                            <p className="mb-2 font-semibold text-gray-800">
                                                <span className="font-semibold text-gray-800">
                                                    Time:
                                                </span>{" "}
                                                {submission.time.toString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        );
    }
}

export const runtime = "edge";
