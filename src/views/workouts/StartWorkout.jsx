import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useWorkout } from '../../context/WorkoutContext';

export default function StartWorkout() {
  const [workoutMeta, setWorkoutMeta] = useState(JSON.parse(localStorage.getItem('exerciseData')) || {});
  const [workoutData, setWorkoutData] = useState(null);
  const { user } = useAuth();
  const { getWorkoutById } = useWorkout();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getWorkoutById(workoutMeta.workoutId);
        setWorkoutData(data);
      } catch (error) {
        console.error("Error fetching workout data:", error);
      }
    };

    fetchData();
  }, [workoutMeta, getWorkoutById]);

  const handleBegin = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) { /* Firefox */
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
      document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) { /* IE/Edge */
      document.documentElement.msRequestFullscreen();
    }
  };
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        alert('You have exited full-screen mode.');
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <p className="text-2xl font-semibold mb-4 text-gray-800">Login required!</p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
          onClick={() => navigate('/login')}
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (!workoutData) {
    return <div>Loading...</div>;
  }

  const currentDay = workoutData.roadMap.find(day => day.day === workoutMeta.daysCompleted + 1);

  return (
    <div className="mt-24 p-4">
      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-4">{currentDay.title}</h1>
        <p className="text-lg mb-4">{workoutData.description}</p>
        <div className="w-full max-w-2xl">
          {currentDay.exercises.map((exercise, index) => (
            <div key={index} className="mb-4 p-4 border rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold">{exercise.name}</h2>
              <p className="text-md">Duration: {exercise.duration}</p>
            </div>
          ))}
        </div>
        <button
          className="bg-green-500 text-white px-6 py-3 rounded mt-6 hover:bg-green-600 transition duration-300"
          onClick={handleBegin}
        >
          Begin
        </button>
      </div>
    </div>
  );
}