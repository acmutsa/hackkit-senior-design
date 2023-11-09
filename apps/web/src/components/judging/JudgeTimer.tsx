'use client'

import { Button } from "../shadcn/ui/button";
import { useEffect, useState } from "react"

enum TimerMode { START, RESET, PAUSE };

function secondsToString (seconds: number) {
    return ((seconds >= 0) ? "" : "-") +                                             // leading sign
            Math.floor(Math.abs(seconds / 60)) + ":" +                               // minutes
            Math.floor(Math.abs(seconds % 60)).toString().padStart(2, "0") +  "." +  // seconds
            (Math.round(Math.abs(seconds * 10)) % 10).toString();                    // fractional seconds
}

export default function JudgeTimer (props: {defaultTime: number}) {

    const [timeLeft,  setTimeLeft]  = useState<number>(props.defaultTime);
    const [timer,     setTimer]     = useState<NodeJS.Timer>();
    const [timerMode, setTimerMode] = useState<TimerMode>(TimerMode.PAUSE);

    useEffect(() => {

        switch(timerMode){
            case TimerMode.START:
                var newTimer = setInterval(() => {setTimeLeft((timeLeft) => timeLeft - 0.1);}, 100);
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
                <Button onClick={() => {setTimerMode(TimerMode.START)}} className="bg-lime-300">   Start </Button>
                <Button onClick={() => {setTimerMode(TimerMode.PAUSE)}} className="bg-red-400">    Pause </Button>
                <Button onClick={() => {setTimerMode(TimerMode.RESET)}} className="bg-yellow-300"> Reset </Button>
            </div>
        </>
    );
}