import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAsyncError, useNavigate , useLocation} from 'react-router-dom';
import { useWorkout } from '../../context/WorkoutContext';
import axios from 'axios';
const URL = import.meta.env.VITE_API_URL;
const AdvanceTimer = React.lazy(() => import('../../components/AdvanceTimer'))

export default function StartWorkout() {
  const [workoutData, setWorkoutData] = useState(null);
  const { user, refreshUser } = useAuth();
  const [modalVisible, showModalVisible] = useState(false);
  const { getWorkoutById, getExerciseById } = useWorkout();
  const navigate = useNavigate();
  const location = useLocation();
  const [initialInstruction, setInitialInstruction] = useState(true);
  const [instructionIndex, setInstructionIndex] = useState(0);
  const [startCountDown, setStartCountDown] = useState(false);
  const [time, setTime] = useState(3);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [currentDay, setCurrentDay] = useState(null);
  const [currentDayIndex, setCurrentDayIndex] = useState(JSON.parse(localStorage.getItem('exerciseData')).daysCompleted);
  const [progress, setProgress] = useState(0)
  const [advanceTimer, setAdvanceTimer] = useState(false);
  const [actualExerciseDone, setActualExerciseDone] = useState([]);
  const [saving, setSaving] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [workoutCompleted, setWorkoutCompleted] = useState(false);
  const dayNumber = location.state?.day || 0;
  const workoutId = location.state?.workoutId;

  const handleBegin=  () => {
    navigate('/exerciseplayer', {state: {day: dayNumber, workoutId: workoutId}});
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getWorkoutById(workoutId);
        setWorkoutData(data);
        // console.log('workout data set')
      } catch (error) {
        console.error("Error fetching workout data:", error);
      }
    };

    fetchData();
  }, [workoutId, getWorkoutById]);

  useEffect(() => {
    if (workoutData) {
      const day = workoutData.roadMap.find(day => day.day-1 === dayNumber);
      setCurrentDay(day);
    }

  }, [workoutData, dayNumber]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!currentDay?.exercises[exerciseIndex]) {
          return;
        }
        const data = await getExerciseById(currentDay?.exercises[exerciseIndex]?.exerciseData);
        setCurrentExercise(data);
        // console.log('exercise data set', currentExercise)
      } catch (error) {
        console.error("Error fetching exercise data:", error);
      }
    };
    fetchData();
  }, [exerciseIndex, getExerciseById, currentDay]);



  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { /* Firefox */
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE/Edge */
      document.msExitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        alert('You have exited full-screen mode.');
        showModalVisible(false);
        setInitialInstruction(true);
        setInstructionIndex(0);
        setStartCountDown(false);
        setProgress(0)
        setTime(3);
        setActualExerciseDone([]);
        setAdvanceTimer(false);
        setExerciseIndex(0);

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

  useEffect(() => {
    if (modalVisible) {
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.classList.add('no-scroll');
      document.documentElement.style.position = 'relative';
    } else {
      document.documentElement.style.overflow = 'auto';
      document.documentElement.style.position = '';
      document.documentElement.classList.remove('no-scroll');
    }
  }, [modalVisible]);

  const startCount = () => {
    setTime(3);
    setStartCountDown(true);
  };

  useEffect(() => {
    if (startCountDown && time > 0) {
      const timer = setTimeout(() => {
        setTime((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (time === 0) {
      console.log('Start Workout');
      setStartCountDown(false);
      setTime(3);
    }
  }, [time, startCountDown]);
  const handleNext = () => {
    const totalExercises = currentDay?.exercises?.length || 0;
    if (exerciseIndex >= totalExercises - 1) {
      // Last exercise completed
      setProgress(100);
      setWorkoutCompleted(true);
      setShowCompletionModal(true);
    } else {
      setExerciseIndex((prev) => prev + 1);
      setProgress((progr)=>((exerciseIndex + 1) / totalExercises) * 100);
      setAdvanceTimer(true);
    }
  }






  // Update progress when workout day is completed
  useEffect(() => {
    // console.log("current day ",currentDay)
    const updateProgress = async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken || !user || !currentDay) {
        setSaving(false);
        return;
      }

      // Check if all exercises are completed and minimum 70% were actually done
      const totalExercises = currentDay?.exercises?.length || 0;
      const completionRatio = (actualExerciseDone?.length || 0) / totalExercises;
      const isWorkoutComplete = exerciseIndex >= totalExercises && completionRatio >= 0.7;
      if  (completionRatio > 0) {
      // if(isWorkoutComplete){setSaving(true);}
        // console.log('Workout day completed, updating progress...');
        
        // Calculate score based on completion percentage
        const score = Math.round(completionRatio * 100);
        
        try {
          console.log("workout id ", workoutId)
          const response = await axios.post(`${URL}/api/users/updateProgress`, {
            workoutId: workoutId,
            currentDay:currentDayIndex,
            score: score
          }, {
            headers: {
              Authorization: `Bearer ${storedToken}`
            },
          });
          
          console.log("response ", response)
          console.log("isWorkoutComplete ",isWorkoutComplete)
        } catch (error) {
          setSaving(false);
          console.error("Error updating progress:", error.response?.data || error.message);
          alert('Failed to save progress. Please try again.');
        } finally {
          setSaving(false);
          refreshUser();
        }

        if(completionRatio>=0.7 && exerciseIndex>=totalExercises){
          setShowCompletionModal(true);
          setWorkoutCompleted(true);
        }else{
          setShowCompletionModal(false);
          setWorkoutCompleted(false);
        }
        
      }else{
        console.log("not enough exercises done")
      }
    };
    
    updateProgress();
  }, [exerciseIndex, actualExerciseDone, currentDayIndex, workoutId, user, navigate])

  const handlePrevious = () => {
    if (exerciseIndex == 0) {
      return;
    } else {
      setExerciseIndex((prev) => prev - 1)
      setProgress((prog)=>(exerciseIndex / currentDay?.exercises?.length) * 100)
    }
  }
  
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

  const instructions = [
    "Closing the tab will end the workout.",
    "Exiting full-screen will lose your progress.",
    "Default their are 30s breaks between exercises.",
    "You can only skip the current exercise.",
    "You can pause the workout at any time.",
    "You can resume the workout after pausing.",
  ];

  const changeInstruction = (opr) => {
    if (opr === 'next') {
      setInstructionIndex((prev) => (prev + 1) % instructions.length);
      console.log(currentDay?.exercises[exerciseIndex]);

    } else if (opr === 'skip') {
      setInitialInstruction(false);
      setStartCountDown(true);
      console.log(currentDay?.exercises[exerciseIndex]);
      // setCurrentExercise({ ...currentDay?.exercises[0] });
      startCount();
    } else if (opr === 'previous') {
      console.log(currentDay?.exercises[exerciseIndex]);

      setInstructionIndex((prev) => (prev - 1 + instructions.length) % instructions.length);
    }
  };

  return (
    <div>
      {/* Workout Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-[10000] bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-green-500 p-1 rounded-2xl max-w-md w-full animate-pulse">
            <div className="bg-white rounded-xl p-8 text-center">
              <div className="mb-6">
                {workoutCompleted ? (
                  <div className="text-6xl mb-4">🏆</div>
                ) : (
                  <div className="text-6xl mb-4">🎉</div>
                )}
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  {workoutCompleted ? 'Program Complete!' : 'Day Complete!'}
                </h2>
                <p className="text-gray-600 text-lg">
                  {workoutCompleted 
                    ? 'Amazing! You\'ve completed the entire workout program!' 
                    : `Great job! You've completed Day ${currentDay?.day}`
                  }
                </p>
              </div>
              
              <div className="mb-6">
                <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white py-3 px-6 rounded-full text-xl font-semibold">
                  Score: {Math.round((actualExerciseDone.length / (currentDay?.exercises?.length || 1)) * 100)}%
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowCompletionModal(false);
                    navigate('/plans');
                  }}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
                >
                  Back to Dashboard
                </button>
                
                {!workoutCompleted && (
                  <button
                    onClick={() => {
                      setShowCompletionModal(false);
                      exitFullScreen();
                      showModalVisible(false);
                    }}
                    className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300"
                  >
                    Continue Tomorrow
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {modalVisible && (
        <div className="fixed top-0 left-0 h-[100vh] w-[100vw] z-[9999] bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
          {/* Modern Header */}
          <div className="absolute top-0 left-0 right-0 z-20 bg-black bg-opacity-20 backdrop-blur-sm">
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center space-x-4">
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                  onClick={() => {
                    exitFullScreen();
                    showModalVisible(false);
                  }}
                >
                  ← Exit Workout
                </button>

                {saving && (
                  <div className="flex items-center gap-3 px-4 py-2 bg-blue-500 bg-opacity-20 backdrop-blur-sm rounded-full border border-blue-400">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-400 border-t-transparent"></div>
                    <span className="text-blue-100 font-medium">Saving...</span>
                  </div>
                )}
              </div>

              <div className="text-white text-right">
                <div className="text-sm opacity-75">Day {currentDay?.day}</div>
                <div className="text-lg font-semibold">Exercise {exerciseIndex + 1} of {currentDay?.exercises?.length}</div>
              </div>
            </div>

            {/* Enhanced Progress Bar */}
            <div className="px-6 pb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-semibold">{Math.round(progress)}% Complete</span>
                <span className="text-white opacity-75">{actualExerciseDone?.length || 0} exercises done</span>
              </div>
              <div className="h-3 bg-black bg-opacity-30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 rounded-full transition-all duration-500 ease-out shadow-lg"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
          {/* Modern Instructions Modal */}
          {initialInstruction && (
            <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-30">
              <div className="bg-gradient-to-br from-orange-500 to-red-500 p-1 rounded-2xl max-w-lg mx-4">
                <div className="bg-white rounded-xl p-8 text-center">
                  <div className="text-4xl mb-4">💪</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Get Ready!</h3>
                  <div className="text-lg text-gray-700 mb-6 leading-relaxed">
                    {instructions[instructionIndex]}
                  </div>
                  <div className="flex justify-center space-x-4">
                    <button 
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                      onClick={() => changeInstruction('previous')}
                    >
                      ← Previous
                    </button>
                    {instructionIndex < instructions.length - 1 ? (
                      <button 
                        className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                        onClick={() => changeInstruction('next')}
                      >
                        Next →
                      </button>
                    ) : (
                      <button 
                        className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        onClick={() => changeInstruction('skip')}
                      >
                        Start Workout! 🚀
                      </button>
                    )}
                    <button 
                      className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                      onClick={() => changeInstruction('skip')}
                    >
                      Skip All
                    </button>
                  </div>
                </div>
              </div>
              </div>
            )}
          

          {/* Main Exercise Area */}
          <div className="flex justify-center items-center h-full pt-32">
            {/* Countdown Timer */}
            {startCountDown && (
              <div className="text-center">
                <div className="text-6xl font-bold text-white mb-4 animate-pulse">
                  {time}
                </div>
                <div className="text-2xl text-white opacity-75 mb-8">
                  Get Ready!
                </div>
                <div className="bg-black bg-opacity-30 backdrop-blur-sm rounded-2xl p-6 max-w-sm">
                  <div className="text-white text-lg mb-2">Next Exercise:</div>
                  <div className="text-2xl font-bold text-yellow-300">
                    {currentDay?.exercises[exerciseIndex]?.name}
                  </div>
                  <div className="text-white opacity-75">
                    {currentDay?.exercises[exerciseIndex]?.duration}
                  </div>
                </div>
              </div>
            )}

            {/* Exercise Player */}
            {(!startCountDown && !initialInstruction && !advanceTimer) && (
              <ExercisePlayer
                _id={currentExercise?._id}
                duration={currentDay?.exercises[exerciseIndex]?.duration}
                data={currentExercise}
                progress={progress}
                next={handleNext}
                previous={handlePrevious}
                updateActualExercise={setActualExerciseDone}
              />
            )}

            {/* Advance Timer */}
            {advanceTimer && (
              <AdvanceTimer
                timeAmount={30}
                handleClose={() => setAdvanceTimer(false)}
              />
            )}
          </div>
        </div>
      )}
      <div className="flex flex-col items-center mb-9 mt-36 relative">
        
      <div className="backBtn absolute right-16 top-0 cursor-pointer flex underline" onClick={() => navigate("/plans")}>
        <img width="28" height="28" src="https://img.icons8.com/deco-glyph/48/back.png" alt="back"/>
        <p className="text-black  text-xl">Go Back</p>
      </div>
        <h1 className="text-4xl font-bold mb-4">{currentDay?.title}</h1>
        <p className="text-lg mb-4">{workoutData.description}</p>
        <div className="w-full max-w-2xl">
          {currentDay?.exercises.map((exercise, index) => (
            <div key={index} className="mb-4 p-4 border rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold">{exercise.name}</h2>
              <p className="text-md">Duration: {exercise.duration}</p>
            </div>
          ))}
        </div>
        <div className=""></div>
        <button
          className="bg-green-500 text-white px-6 py-3 rounded mt-6 hover:bg-green-600 transition duration-300"
          onClick={() => {
            showModalVisible(true);
            handleBegin();
          }}
        >
          Begin
        </button>
      </div>
    </div>
  )
  
}


