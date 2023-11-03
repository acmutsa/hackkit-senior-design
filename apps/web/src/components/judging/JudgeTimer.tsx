'use client'

import { Button } from "../shadcn/ui/button";
import { useEffect, useState } from "react"

enum TimerMode { GO, RESET, PAUSE };

function secondsToString (seconds: number) {
    return ((seconds > 0) ? "" : "-") + Math.floor(seconds / 60) + ":" + (seconds % 60).toString().padStart(2, "0");
}

export default function JudgeTimer (props: {defaultTime: number}) {

    const [timeLeft,  setTimeLeft]  = useState<number>(props.defaultTime);
    const [timer,     setTimer]     = useState<NodeJS.Timer>();
    const [timerMode, setTimerMode] = useState<TimerMode>(TimerMode.PAUSE);

    useEffect(() => {

        switch(timerMode){
            case TimerMode.GO:
                var newTimer = setInterval(() => {setTimeLeft((timeLeft) => timeLeft - 1);}, 1000);
                setTimer(newTimer);
                break;

            case TimerMode.RESET:
                clearInterval(timer);
                setTimerMode(TimerMode.PAUSE);
                setTimeLeft(props.defaultTime);
                break;

            case TimerMode.PAUSE:
                clearInterval(timer);
                setTimerMode(TimerMode.PAUSE);
                break;
        }

        return () => {
            clearInterval(timer);
        }
        
    }, [timerMode]);

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