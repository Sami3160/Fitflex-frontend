import React from 'react'

export default function RightSideContent({ info, isLogged, status, daysCompleted, workoutId }) {
    const sentences = info?.description?.split('.').filter(Boolean);
    const content = [];
    let resumeDay = 0



    for (let i = 0; i < sentences?.length; i += 2) {
        const combined = sentences[i] + (sentences[i + 1] ? '. ' + sentences[i + 1] : '');
        content.push(combined.trim() + '.');
    }
    return (
        <div className='m-10 w-[60vw]'>
            <h1 className='text-5xl font-bold mb-2'>{info.title}</h1>
            {
                content?.map((item, index) => {
                    return <p key={index} className='text-xl mb-4'>{item}</p>
                })
            }
            <br /><br />
            <LetsGetStarted isLogged={isLogged} status={status} _id={workoutId} daysCompleted={daysCompleted} />
        </div>
    )
}

const LetsGetStarted = ({ isLogged, status, _id, daysCompleted }) => {
    return (
        <div className="relative group">
            <button
                className="relative inline-block p-px font-semibold leading-6 text-white bg-gray-800 shadow-2xl cursor-pointer rounded-xl shadow-zinc-900 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95"
                onClick={() => {
                    if (isLogged) {
                        if (status === "inprogress") {
                            const res = confirm("Want to resume the workout or start from the beginning?")
                            if (res) {
                                const data = {
                                    workoutId: _id,
                                    daysCompleted: daysCompleted,
                                    status: "inprogress",
                                }
                                localStorage.setItem("exerciseData", JSON.stringify(data))
                                window.open(`/startWorkout`, "blank")
                            } else {
                                const data = {
                                    workoutId: _id,
                                    daysCompleted: 0,
                                    status: "inprogress",
                                }
                                localStorage.setItem("exerciseData", JSON.stringify(data))
                                window.open(`/startWorkout`, "blank")
                            }
                        } else {
                            const data = {
                                workoutId: _id,
                                daysCompleted: 0,
                                status: "new",
                            }
                            localStorage.setItem("exerciseData", JSON.stringify(data))
                            window.open(`/startWorkout`, "blank")
                        }
                    } else {
                        alert("Please login to continue")
                        // console.log("Not logged in")
                    }
                }}
            >
                <span
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                ></span>

                <span className="relative z-10 block px-6 py-3 rounded-xl bg-gray-950">
                    <div className="relative z-10 flex items-center space-x-2">
                        <span className="transition-all duration-500 group-hover:translate-x-1"
                        >
                            Let's get started
                        </span>
                        <svg
                            className="w-6 h-6 transition-transform duration-500 group-hover:translate-x-1"
                            data-slot="icon"
                            aria-hidden="true"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                clipRule="evenodd"
                                d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                                fillRule="evenodd"
                            ></path>
                        </svg>
                    </div>
                </span>
            </button>
        </div>
    )
}