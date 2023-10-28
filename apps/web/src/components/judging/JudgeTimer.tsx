'use client'

import { Button } from "../shadcn/ui/button";
import { useEffect, useState } from "react"

enum TimerMode { GO, RESET, PAUSE };

function secondsToString (seconds: number) {
    return ((seconds > 0) ? "" : "-") + Math.floor(seconds / 60) + ":" + (seconds % 60).toString().padStart(2, "0");
}

export default function JudgeTimer (props: {defaultTime: number}) {

    const [timeLeft, setTimeLeft] = useState(props.defaultTime);
    const [timerMode, setTimerMode] = useState(TimerMode.PAUSE);

    useEffect(() => {
        const updateTime = setInterval(() => {
            switch(timerMode){
                case TimerMode.GO:
                    setTimeLeft(timeLeft - 1);
                    break;

                case TimerMode.RESET:
                    setTimerMode(TimerMode.PAUSE);
                    setTimeLeft(props.defaultTime);
                    break;

                case TimerMode.PAUSE:
                    setTimerMode(TimerMode.PAUSE);
                    break;
            }
        }, 1000);

        return () => {
            clearInterval(updateTime);
        }
    }, [timeLeft, timerMode]);

    return (
        <>
            <div className="text-6xl"> {secondsToString(timeLeft)} </div>
            <div className="w-33% space-x-2">
                <Button onClick={() => {setTimerMode(TimerMode.GO)}}    className="bg-lime-300">   Start </Button>
                <Button onClick={() => {setTimerMode(TimerMode.PAUSE)}} className="bg-red-400">    Stop  </Button>
                <Button onClick={() => {setTimerMode(TimerMode.RESET)}} className="bg-yellow-300"> Reset </Button>
            </div>
        </>
    );
}