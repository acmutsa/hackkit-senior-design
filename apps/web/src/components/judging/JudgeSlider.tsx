'use client';

import { useState } from "react";

export default function JudgeSlider (props: {criterion: string}) {

    const [grade, setGrade] = useState("3");

    return (
      <div className="w-full pb-4">
        <div className="pb-2">{props.criterion}</div>
        <input id={props.criterion} type="range" min={1} max={5} step={1} onChange={(e) => {setGrade(e.target.value)}}
            className="w-2/3 rounded-full h-4 appearance-none bg-gradient-to-r from-rose-900 from-10% via-orange-400 to-emerald-500 to-80%
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:bg-zinc-800
            [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:border-solid [&::-webkit-slider-thumb]:rounded-full
            [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:bg-zinc-800
            [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:border-solid [&::-moz-range-thumb]:rounded-full"/>
        <div>{grade}</div>
      </div>
    );
}