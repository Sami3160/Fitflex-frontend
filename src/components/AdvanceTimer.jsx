import React, { useState } from 'react';
import { useTimer } from 'react-timer-hook';

export default function AdvanceTimer({ timeAmount, handleClose }) {
    const [time, setTime] = useState(() => {
        const newTime = new Date();
        newTime.setSeconds(newTime.getSeconds() + timeAmount);
        return newTime;
    });

    function increaseTime() {
        const newTime = new Date(time);
        newTime.setSeconds(newTime.getSeconds() + 15);
        setTime(newTime);
        restart(newTime);
    }

    function skipTime() {
        handleClose && handleClose();
    }

    const { seconds, minutes, isRunning, start, pause, resume, restart } = useTimer({
        expiryTimestamp: time,
        onExpire: () => handleClose && handleClose(),
    });

    return (
        <div className='flex flex-col items-center justify-center h-screen  text-white'>
            <h1 className='text-3xl font-bold mb-4 text-black'>Well done!!</h1>
            <h3 className='text-lg mb-6 text-black'>Take some rest, You can do it!!</h3>
            <div className='text-6xl font-mono bg-gray-800 px-8 py-4 rounded-lg shadow-md'>
                {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </div>
            <p className='mt-2 text-sm'>{isRunning ? 'Running' : 'Paused'}</p>
            <div className='flex gap-4 mt-6'>
                <button onClick={increaseTime} className='px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg shadow'>
                    +15s
                </button>
                <button onClick={skipTime} className='px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg shadow'>
                    Skip
                </button>
                {isRunning ? (
                    <button onClick={pause} className='px-4 py-2 bg-yellow-500 hover:bg-yellow-400 rounded-lg shadow'>
                        Pause
                    </button>
                ) : (
                    <button onClick={resume} className='px-4 py-2 bg-green-500 hover:bg-green-400 rounded-lg shadow'>
                        Resume
                    </button>
                )}
                <button onClick={() => restart(time)} className='px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg shadow'>
                    Restart
                </button>
            </div>
        </div>
    );
}