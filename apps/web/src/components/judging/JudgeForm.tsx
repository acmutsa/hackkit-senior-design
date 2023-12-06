'use client';

import JudgeSlider from "@/components/judging/JudgeSlider";
import { Button } from "../shadcn/ui/button";
import { FormEvent } from "react";

export default function JudgeForm (props: {id: string, criteria: string[]}) {

    fetch(`/api/judging/submissions?id=${props.id}`)
        .then((res) => res.json())
        .then((body) => console.log(body));

    function onSubmit (e: FormEvent) {
        e.preventDefault();

        const grades = [];

        for(const criterion of props.criteria){
            const slider = document.getElementById(criterion) as HTMLInputElement;
            grades.push({criterion: slider?.id, grade: slider?.value});
        }

        fetch(`/api/judging/submissions?id=${props.id}`, {
            method: "POST",
            body: JSON.stringify(grades),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then((res) => res.json())
        .then((body) => console.log(body));
    }

    return (
      <form id="judgeForm" onSubmit={onSubmit}>
        {
          props.criteria.map( (criterion) => { return (
            <JudgeSlider key={criterion} criterion={criterion}/>
          )})
        }
        <div className="pt-4 pb-8">
            <div>Comments</div>
            <textarea id="comments" className="w-2/3 py-2 mt-2 rounded-md bg-zinc-900 min-h-[100px]" />
        </div>
        <Button type="submit" className="bg-zinc-500 w-[200px] self-center"> Submit </Button>
      </form>
    );

}