import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAsyncError, useNavigate } from 'react-router-dom';
import { useWorkout } from '../../context/WorkoutContext';
import axios from 'axios';
const URL = import.meta.env.VITE_API_URL;
const AdvanceTimer = React.lazy(() => import('../../components/AdvanceTimer'))

export default function StartWorkout() {
  const [workoutMeta, setWorkoutMeta] = useState(JSON.parse(localStorage.getItem('exerciseData')) || {});
  const [workoutData, setWorkoutData] = useState(null);
  const { user, refreshUser } = useAuth();
  const [modalVisible, showModalVisible] = useState(false);
  const { getWorkoutById, getExerciseById } = useWorkout();
  const navigate = useNavigate();
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getWorkoutById(workoutMeta.workoutId);
        setWorkoutData(data);
        // console.log('workout data set')
      } catch (error) {
        console.error("Error fetching workout data:", error);
      }
    };

    fetchData();
  }, [workoutMeta, getWorkoutById]);

  useEffect(() => {
    if (workoutData) {
      const day = workoutData.roadMap.find(day => day.day === workoutMeta.daysCompleted + 1);
      setCurrentDay(day);
    }

  }, [workoutData, workoutMeta]);

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
    console.log("current day ",currentDay)
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
          console.log("workout id ", workoutMeta.workoutId)
          const response = await axios.post(`${URL}/api/users/updateProgress`, {
            workoutId: workoutMeta.workoutId,
            currentDay:currentDayIndex,
            score: score
          }, {
            headers: {
              Authorization: `Bearer ${storedToken}`
            },
          });
          
          // if (response.status === 200) {
          //   console.log('Progress updated successfully');
          //   const isWorkoutCompleted = response.data.completed;
            
          //   if (isWorkoutComplete && isWorkoutCompleted) {
          //     console.log("modal printing")
          //     setShowCompletionModal(true);
          //     setWorkoutCompleted(true);
          //   } else {
          //     setShowCompletionModal(true);
          //     setWorkoutCompleted(false);
          //   }
          // }
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
  }, [exerciseIndex, actualExerciseDone, currentDayIndex, workoutMeta, user, navigate])


  // Auto-enroll user when starting workout from day 1
  useEffect(() => {
    const enrollUser = async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken || !user || !currentDay) {
        setSaving(false);
        return;
      }

      // Check if user needs to be enrolled (starting day 1 and not already enrolled)
      const isDay1 = currentDay?.day === 1;
      const isNotEnrolled = !user?.inprogressWorkouts?.some(w => w.workoutId === workoutMeta.workoutId);
      const isNotCompleted = !user?.completedWorkouts?.some(w => w.workoutId === workoutMeta.workoutId);
      
      if (isDay1 && isNotEnrolled && isNotCompleted && !modalVisible && exerciseIndex === 0) {
        setSaving(true);
        console.log('Enrolling user in workout...');

        try {
          const response = await axios.post(`${URL}/api/users/enroll`, {
            workoutId: workoutMeta.workoutId,
          }, {
            headers: {
              Authorization: `Bearer ${storedToken}`
            }
          });
          
          if (response.status === 200) {
            console.log('User enrolled successfully');
          }
        } catch (error) {
          console.error("Error enrolling user:", error.response?.data || error.message);
        } finally {
          setSaving(false);
          refreshUser();
        }
      } else {
        setSaving(false);
      }
    };
    
    enrollUser();
  }, [exerciseIndex, currentDay, workoutMeta, user, modalVisible])
  const handlePrevious = () => {
    if (exerciseIndex == 0) {
      return;
    } else {
      setExerciseIndex((prev) => prev - 1)
      setProgress((prog)=>(exerciseIndex / currentDay?.exercises?.length) * 100)
    }
  }
  // const updateUserProgress=async ()=>{
  //   const storedToken = localStorage.getItem('token');
   
  //   try {
  //     const response = await axios.post(`${URL}/api/users/updateProgress`, {
  //       workoutId: workoutMeta.workoutId,
  //       score: score
  //     }, {
  //       headers: {
  //         Authorization: `Bearer ${storedToken}`
  //       },
  //     });
      
  //     if (response.status === 200) {
  //       console.log('Progress updated successfully');
  //       const isWorkoutCompleted = response.data.completed;
        
  //       if (isWorkoutCompleted) {
  //         setShowCompletionModal(true);
  //         setWorkoutCompleted(true);
  //       } else {
  //         setShowCompletionModal(true);
  //         setWorkoutCompleted(false);
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error updating progress:", error.response?.data || error.message);
  //     alert('Failed to save progress. Please try again.');
  //   } finally {
  //     setSaving(false);
  //     refreshUser();
  //   }
  // }

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
      <div className="flex flex-col items-center">
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



function ExercisePlayer({ _id, duration, data, progress, next, previous, updateActualExercise }) {
  // console.log("duration 1 "+duration);
  const [time, setTime] = useState(duration.split('-')[0] == 'time' ? duration.split('-')[1] : -1);
  // console.log(time);
  const [reps, setReps] = useState(duration.split('-')[0] == 'reps' ? duration.split('-')[1] : -1);
  // console.log(reps);
  const type = duration.split('-')[0];
  const [events, setEvents] = useState({
    pause: false,
    skip: false,
    next: false,
    previous: false,
  });
  const pause = () => {
    console.log('pause');
  }
  useEffect(() => {
    if (time > 0) {
      if (events.pause) {
        return;
      }
      const timer = setTimeout(() => {
        setTime((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (time == 0 ) {
      setTime(30);
      updateActualExercise((exercises)=>{
        if(exercises?.includes(_id)){
          return exercises;
        }
        return [...exercises,_id];
      })

      next();
    }
  }, [time, events])

  // console.log("duration 2 "+duration);

  return (
    <div className="w-full h-full flex flex-col lg:flex-row gap-8 p-8 text-white">
      {/* Left Side - Exercise Display */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-6">
        {/* Exercise Title */}
        <div className="text-center">
          <h1 className="text-4xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            {data?.name}
          </h1>
        </div>

        {/* Exercise Image */}
        <div className="relative w-full max-w-md h-80 rounded-2xl overflow-hidden shadow-2xl">
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${data?.imageUrl})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          </div>
        </div>

        {/* Timer/Reps Display */}
        <div className="text-center">
          {time >= 0 ? (
            <div className="space-y-2">
              <div className="text-2xl font-semibold text-gray-300">Time Remaining</div>
              <div className="text-7xl font-bold text-yellow-400 animate-pulse">
                {Math.floor(time / 60).toString().padStart(2, '0')}:{(time % 60).toString().padStart(2, '0')}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-2xl font-semibold text-gray-300">Target Reps</div>
              <div className="text-7xl font-bold text-green-400">
                {reps}x
              </div>
            </div>
          )}
        </div>

        {/* Control Buttons */}
        <div className="flex flex-wrap gap-3 justify-center max-w-lg">
          <button 
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            onClick={previous}
          >
            ← Previous
          </button>
          
          {type === 'time' && (
            <button 
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${
                events.pause 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600' 
                  : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600'
              }`}
              onClick={() => setEvents(prev => ({ ...prev, pause: !prev.pause }))}
            >
              {events.pause ? '▶ Resume' : '⏸ Pause'}
            </button>
          )}

          {type === 'time' && (
            <button 
              className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
              onClick={() => setTime(30)}
            >
              🔄 Restart
            </button>
          )}

          <button 
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            onClick={next}
          >
            Skip ⏭
          </button>

          <button 
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            onClick={() => {
              setEvents((prev)=>({...prev,completed:true}))
              // updateActualExercise();
              updateActualExercise((exercises)=>{
                if(exercises?.includes(_id)){
                  return exercises;
                }
                return [...exercises,_id];
              })
              next();
            }}
          >
            Complete ✓
          </button>
        </div>
      </div>

      {/* Right Side - Exercise Details */}
      <div className="flex-1 space-y-8 max-w-lg">
        {/* Focus Areas */}
        <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h2 className="text-2xl font-bold mb-4 text-yellow-400 flex items-center gap-2">
            🎯 Focus Areas
          </h2>
          <div className="flex flex-wrap gap-2">
            {data?.focusArea?.map((area, index) => (
              <span 
                key={index} 
                className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-full text-sm font-medium"
              >
                {area}
              </span>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h2 className="text-2xl font-bold mb-4 text-green-400 flex items-center gap-2">
            📋 Instructions
          </h2>
          <p className="text-gray-200 leading-relaxed">{data?.instructions}</p>
        </div>

        {/* Tips */}
        <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h2 className="text-2xl font-bold mb-4 text-orange-400 flex items-center gap-2">
            💡 Tips
          </h2>
          <p className="text-gray-200 leading-relaxed">{data?.tips}</p>
        </div>

        {/* Video Link */}
        <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h2 className="text-2xl font-bold mb-4 text-red-400 flex items-center gap-2">
            🎥 Video Guide
          </h2>
          <a 
            href={data?.videoUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
          >
            ▶ Watch Video
          </a>
        </div>
      </div>
    </div>
  );
}