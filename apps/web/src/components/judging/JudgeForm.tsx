'use client';

import JudgeSlider from "@/components/judging/JudgeSlider";
import { Button } from "../shadcn/ui/button";
import { FormEvent } from "react";

export default function JudgeForm () {

    const criteria: string[] = ["Idea", "Technology", "Design", "Learning", "Completion"];

    function onSubmit (e: FormEvent) {
        e.preventDefault();

        for(const criterion of criteria){
            const slider = document.getElementById(criterion);
            console.log("criterion " + slider + ": " + slider?.id);
        }

        fetch("api/judging/submissions", {
            method: "POST",
            body: JSON.stringify({

            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });
    }

    return (
      <form id="judgeForm" onSubmit={onSubmit}>
        {
          criteria.map( (criterion) => { return (
            <JudgeSlider key={criterion} criterion={criterion}/>
          )})
        }
        <div className="pt-4">
            <div>Comments</div>
            <textarea className="w-2/3 py-2 mt-2 rounded-md bg-zinc-900 min-h-[100px]" />
        </div>
        <Button type="submit" className="bg-zinc-500 w-[200px] self-center"> Submit </Button>
      </form>
    );

}