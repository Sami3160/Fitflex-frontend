import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackward } from '@fortawesome/free-solid-svg-icons';
import { useWorkout } from '../../context/WorkoutContext';

const URL = import.meta.env.VITE_API_URL;

export default function IndividialWorkout() {
    const { workoutId } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true);
    const { getWorkoutById } = useWorkout()

    const [workoutData, setWorkoutData] = useState()
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getWorkoutById(workoutId);
                setWorkoutData(data);
            } catch (error) {
                console.error("Error fetching workout data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

    }, [getWorkoutById, workoutId])
    // console.log(workoutId)
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
            <div className="min-h-[80vh] relative">
                <div className="absolute flex -top-20 left-16 text-white cursor-pointer items-center gap-2" onClick={() => navigate("/plans")}><FontAwesomeIcon icon={faBackward} />Back to Plans</div>
                <div className="leftMenu -mt-16 ml-10 mb-10 border w-[28rem] -top-16 left-10 z-20 min-h-20 rounded-2xl shadow-2xl">
                    <div className="overview h-20 bg-[#212128] text-white cursor-pointer rounded-t-2xl flex justify-center items-center">
                        <div className="title">Overview</div>
                    </div>
                    {
                        workoutData?.roadMap.map((element, index) => (
                            <div key={index} className="overview h-20  border cursor-pointer border-[#212128] text-black  flex justify-center items-center">
                                <div className="title">{element?.title}</div>
                            </div>
                        ))
                    }
                    <div className="overview h-20 bg-[#212128] text-white cursor-pointer rounded-b-2xl flex justify-center items-center">
                        <div className="title">Progress</div>
                    </div>
                </div>
                <div className="rightBar">

                </div>
            </div>
        </div>
    )
}
