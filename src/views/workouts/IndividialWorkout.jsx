import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackward } from '@fortawesome/free-solid-svg-icons';
import { useWorkout } from '../../context/WorkoutContext';
import RightSideContent from '../../components/workouts/RightSideContent';
import { useAuth } from '../../context/AuthContext';
import replay from '../../assets/replay.png'
const URL = import.meta.env.VITE_API_URL;

export default function IndividialWorkout() {
    const { workoutId } = useParams()
    const navigate = useNavigate()
    const [status, setStatus] = useState("new")
    const [daysCompleted, setDaysCompleted] = useState(0)

    const { user } = useAuth()
    const [loading, setLoading] = useState(true);
    const { getWorkoutById } = useWorkout()
    const [info, setInfo] = useState({
        title: "Overview",
        description: "This is the overview of the workout plan. It will contain the details of the workout plan and the exercises that are included in the plan. The plan will be divided into different sections and each section will have a different set of exercises. The plan will also contain the number of sets and repetitions for each exercise. The plan will also contain the rest time between each set and exercise. The plan will also contain the duration of the workout plan. The plan will also contain the number of days in a week that the workout plan should be followed. The plan will also contain the diet that should be followed along with the workout plan. The plan will also contain the supplements that should be taken along with the workout plan. The plan will also contain the precautions that should be taken while following the workout plan. The plan will also contain the benefits of following the workout plan. The plan will also contain the side effects of following the workout plan."
    })
    const [workoutData, setWorkoutData] = useState()
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getWorkoutById(workoutId);
                setWorkoutData(data);
                if (user?.inprogressWorkouts) {
                    for (let obj of user?.inprogressWorkouts) {
                        if (obj.workoutId === workoutId) {
                            setStatus("inprogress")
                            setDaysCompleted(obj.daysCompleted)
                            break
                        }
                    }
                }
                if (user?.completedWorkouts) {
                    for (let obj of user?.completedWorkouts) {
                        if (obj.workoutId === workoutId) {
                            setStatus("completed")
                            break
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching workout data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

    }, [getWorkoutById, workoutId])
    const startWorkout = (_id, days, status) => {
        const data = {
            workoutId: _id,
            daysCompleted: days,
            status: status,
        }
        localStorage.setItem("exerciseData", JSON.stringify(data))
        window.open(`/startWorkout`, "blank")
    }

    console.log(workoutData)
    return (
        <div>
            <div className="h-24"></div>
            <div
                style={{ backgroundImage: `url(${workoutData?.imageUrl})` }}
                className="relative bg-cover bg-center h-80 flex items-center justify-end pr-36"
            >
                <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-md"></div>
                <div
                    style={{ backgroundImage: `url(${workoutData?.imageUrl})` }}
                    className="relative bg-cover bg-end  h-[320px] w-[28rem] flex items-center justify-start"
                >
                    <h1 className="text-5xl relative z-10 px-11 font-bold text-white backdrop-blur-sm w-[28rem]">{workoutData?.name}</h1>
                </div>
            </div>
            <div className="min-h-[80vh] relative flex">
                <div className="absolute flex -top-24 left-16 text-white cursor-pointer items-center gap-2" onClick={() => navigate("/plans")}><FontAwesomeIcon icon={faBackward} />Back to Plans</div>
                <div className="leftMenu h-fit -mt-16 ml-10 mb-10 border w-[28rem] -top-16 left-10 z-20 min-h-20 rounded-2xl shadow-2xl">
                    <div className="overview h-20 bg-[#212128] text-white cursor-pointer rounded-t-2xl flex justify-center items-center">
                        <div className="title">Overview</div>
                    </div>
                    {
                        status == "completed" && workoutData?.roadMap.map((element, index) => {

                            return (
                                <div key={index} className="overview h-20  border  border-[#212128] text-black  flex justify-between items-center">
                                    <div className="flex items-center gap-2 ml-5">

                                        <div className="title">{element?.title}</div>
                                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48">
                                            <path fill="#c8e6c9" d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"></path><path fill="#4caf50" d="M34.586,14.586l-13.57,13.586l-5.602-5.586l-2.828,2.828l8.434,8.414l16.395-16.414L34.586,14.586z"></path>
                                        </svg>
                                    </div>
                                    <img width="65" height="65" src={replay} className='cursor-pointer mr-5' alt="restart--v1" onClick={() => {

                                        startWorkout(workoutId, index, "inprogress")
                                    }} />
                                    {/* <img width="65" height="65" className='cursor-pointer mr-5' src="https://img.icons8.com/material-two-tone/96/circled-play--v1.png" alt="circled-play--v1"/> */}
                                </div>
                            )
                        })
                    }
                    {
                        status != "completed" && workoutData?.roadMap.map((element, index) => {

                            return (
                                <div key={index} className="overview h-20  border  border-[#212128] text-black  flex justify-between items-center">
                                    <div className="flex items-center gap-2 ml-5">

                                        <div className="title">{element?.title}</div>
                                        {
                                            index < daysCompleted ?
                                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48">
                                                    <path fill="#c8e6c9" d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"></path><path fill="#4caf50" d="M34.586,14.586l-13.57,13.586l-5.602-5.586l-2.828,2.828l8.434,8.414l16.395-16.414L34.586,14.586z"></path>
                                                </svg>
                                                :
                                                <div className="rounded-full w-6 h-6 border-[3px] border-gray-400"></div>
                                        }

                                    </div>
                                    {
                                        index < daysCompleted ?
                                            <img width="65" height="65" src={replay} className='cursor-pointer mr-5' alt="restart--v1" onClick={() => {
                                                // if (index > daysCompleted) {
                                                //     alert("Please complete the previous days workout first")
                                                //     return
                                                // }
                                                startWorkout(workoutId, index, "inprogress")
                                            }} />
                                            :
                                            <img width="65" height="65" className='cursor-pointer mr-5' src="https://img.icons8.com/material-two-tone/96/circled-play--v1.png" alt="circled-play--v1" onClick={()=>{
                                                if (index > daysCompleted) {
                                                    alert("Please complete the previous days workout first")
                                                    return
                                                }
                                                startWorkout(workoutId, index, "inprogress")
                                            }} />
                                    }
                                    {/* <img width="65" height="65" className='cursor-pointer mr-5' src="https://img.icons8.com/material-two-tone/96/circled-play--v1.png" alt="circled-play--v1"/> */}
                                </div>
                            )
                        })
                    }
                    <div className="overview h-20 bg-[#212128] text-white cursor-pointer rounded-b-2xl flex justify-center items-center">
                        <div className="title">Progress</div>
                    </div>
                </div>

                <div className="rightBar">
                    <RightSideContent info={{ title: workoutData?.name, description: workoutData?.description }} isLogged={(user ? true : false)} status={status} daysCompleted={daysCompleted} />
                </div>
            </div>
        </div>
    )
}

