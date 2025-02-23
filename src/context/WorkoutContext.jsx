import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';
const URL = import.meta.env.VITE_API_URL;

export const WorkoutContext = createContext();
export const WorkoutProvider = ({ children }) => {
    const [workouts, setWorkouts] = useState({});
    const fetchWorkouts = async () => {
        try {
            const response = await axios.get(`${URL}/api/workouts/workouts`)
            setWorkouts(response.data.data)
            // console.log(response.data.data)
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(() => {
        fetchWorkouts()
    }, []);
    const getWorkoutById = async (_id) => {
        if (Object.values(workouts).length==0) {
            await fetchWorkouts()
        }
        for (let types of Object.values(workouts)) {
            for (let workout of types) {
                if (workout._id === _id) {
                    return workout
                }
            }
        }
    }
    const getExerciseById = async (workoutId) => {
        try {
            // console.log(workoutId)
            const response = await axios.get(`${URL}/api/workouts/exercise/${workoutId}`)
            return response.data.data
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <WorkoutContext.Provider value={{ getWorkoutById, workouts,getExerciseById }}>
            {children}
        </WorkoutContext.Provider>
    )

}

export const useWorkout = () => {
    return useContext(WorkoutContext)
}

