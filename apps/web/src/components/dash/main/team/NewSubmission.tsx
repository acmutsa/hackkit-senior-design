"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
} from "@/components/shadcn/ui/form";
import { Input } from "@/components/shadcn/ui/input";
import { Button } from "@/components/shadcn/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/shadcn/ui/textarea";
import { zpostSafe } from "@/lib/utils/client/zfetch";
import { BasicServerValidator } from "@/validators/shared/basic";
import { useRef, useState, useCallback } from "react";
import { ImSpinner10 } from "react-icons/im";
import { useRouter } from "next/navigation";
import { submissionValidator } from "@/validators/shared/team";

import { put } from "@vercel/blob";

import { auth } from "@clerk/nextjs";
import { teams, users, submissions } from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import c from "@/hackkit.config";

export default function submissionForm() {
    const formValidator = z.object({
        table: z.number(),
        track: z.string(),
        link: z.string(),
    });
    const [loading, setLoading] = useState(false);
    const form = useForm<z.infer<typeof formValidator>>({
        resolver: zodResolver(formValidator),
        defaultValues: {
            link: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formValidator>) {
        console.log("submit pressed");
        setLoading(true);

        const res = await zpostSafe({
            url: "/api/team/submissions/create",
            vReq: submissionValidator,
            vRes: BasicServerValidator,
            body: {
                table: values.table,
                track: values.track,
                link: values.link,
            },
        });

        if (!res.success) {
            return alert(
                `An unknown error occurred. Please try again later. If this is a continuous issue, please contact us at ${c.issueEmail}.`
            );
        }
        if (!res.data.success) {
            console.log("error: ", res.data.message);
            return alert(res.data.message);
        }
    }

    return (
        <div className="flex grid-cols-2 col-span-2 justify-center border-muted mt-4">
            <form
                className="flex flex-wrap w-full text-black space-y-4"
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <input
                    type="number"
                    placeholder="Table Number"
                    {...form.register("table")}
                    className="border border-gray-300 rounded-md py-2 px-4 w-full h-10 focus:outline-none focus:ring focus:border-blue-500"
                />

                <div className="relative w-full">
                    <select
                        {...form.register("track")}
                        className="border border-gray-300 rounded-md py-2 px-4 w-full h-10 focus:outline-none focus:ring focus:border-blue-500"
                    >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Expert">Expert</option>
                    </select>
                </div>

                <input
                    type="text"
                    placeholder="Link"
                    {...form.register("link")}
                    className="border border-gray-300 rounded-md py-2 px-4 w-full h-10 focus:outline-none focus:ring focus:border-blue-500"
                />

                {loading ? (
                    <p className="flex justify-center items-center gap-x-1">
                        Submitting <ImSpinner10 className="animate-spin" />
                    </p>
                ) : (
                    <button
                        type="submit"
                        className="h-10 px-4 text-white font-semibold rounded-md bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        Submit
                    </button>
                )}
            </form>
        </div>
    );
}
