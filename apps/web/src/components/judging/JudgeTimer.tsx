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

    const handleStartButtonClick = () => {
        setTimerMode((prevMode) =>
            prevMode === TimerMode.START || prevMode === TimerMode.RESET ? TimerMode.PAUSE : TimerMode.START
        );
    };

    return (
        <div className="p-6 pt-0 flex flex-col items-center space-y-5 max-w-[300px]">
            <div className="text-6xl"> {secondsToString(timeLeft)} </div>
            <div className="flex justify-center space-x-2 overflow-hidden flex-shrink-0">
                <Button onClick={handleStartButtonClick} 
                    className={`${ timerMode === TimerMode.PAUSE ? "bg-lime-300" : "bg-red-400" } flex-shrink-0 w-20`}>
                    {timerMode === TimerMode.START ? "Pause" : "Start"}
                </Button>
                <Button onClick={() => {setTimerMode(TimerMode.RESET)}} className="bg-yellow-300 flex-shrink-0"> Reset </Button>
            </div>
        </div>
    );
}