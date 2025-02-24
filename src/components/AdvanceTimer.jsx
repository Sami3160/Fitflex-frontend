import React, { useEffect, useState } from 'react'
import { useCallback, useRef } from "react";
// import './CircleStyle.module.scss'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStop, faPlus } from "@fortawesome/free-solid-svg-icons";
import styles from './CircleStyle.module.scss'
export default function AdvanceTimer({ timeAmount, handleClose }) {
    const [time, setTime] = React.useState(timeAmount);
    const increaseTime = () => {
        setTime(time + 15)
    }
    const skipTime = () => {
        setTime(0)
    }

    return (
        <div className='flex justify-center items-center h-screen'>
            <h1>Well done!!</h1>
            <div className="">
                <h3 className='font-mono'>Take some rest, You can do it!!</h3>
                <CircleCountDown time={time} close={handleClose} size={200} stroke="#000" strokeWidth={2} />
                <div className="flex gap-2">
                    <button className="btn btn-primary p-3 px-5 border-yellow-400 border-2 text-yellow-400 shadow-sm" onClick={increaseTime}><FontAwesomeIcon icon={faPlus} /> Add 15 sec</button>
                    <button className="btn btn-primary p-3 px-5 border-yellow-400 border-2 text-yellow-400 shadow-sm" onClick={skipTime}> <FontAwesomeIcon icon={faStop} /> Skip</button>
                </div>
            </div>

        </div>
    )
}



const CircleCountDown = ({
    time,
    size,
    stroke,
    onComplete,
    strokeWidth,
    strokeLinecap = 'round',
    close,
}) => {
    const radius = size / 2;
    const milliseconds = time * 1000;
    const circumference = size * Math.PI;

    const [countdown, setCountdown] = useState(milliseconds);
    const [paused, setPaused] = useState(false);
    const [intervalId, setIntervalId] = useState(null);

    const seconds = (countdown / 1000).toFixed();

    const strokeDashoffset = circumference - (countdown / milliseconds) * circumference;

    useEffect(() => {
        if (paused) {
            clearInterval(intervalId);
            return;
        }

        const interval = setInterval(() => {
            if (countdown > 0) {
                setCountdown(countdown - 10);
            } else {
                clearInterval(interval);
                onComplete && onComplete();
                close();
            }
        }, 10);

        setIntervalId(interval);

        return () => clearInterval(interval);
    }, [countdown, paused]);

    const skip = () => {
        setCountdown(0);
    };

    const pause = () => {
        setPaused(!paused);
    };

    const add15Seconds = () => {
        setCountdown(countdown + 15000);
    };

    return (
        <div className={styles.root}>
            <label className={styles.seconds}>{seconds}</label>
            <div className={styles.countDownContainer}>
                <svg className={styles.svg} width={size} height={size}>
                    <circle
                        fill="none"
                        r={radius}
                        cx={radius}
                        cy={radius}
                        stroke={stroke}
                        strokeWidth={strokeWidth}
                        strokeLinecap={strokeLinecap}
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                    />
                </svg>
            </div>
            <div className="flex gap-2">
                <button onClick={add15Seconds}>Add 15 sec</button>
                <button onClick={skip}>Skip</button>
                <button onClick={pause}>{paused ? 'Resume' : 'Pause'}</button>
            </div>
        </div>
    );
};