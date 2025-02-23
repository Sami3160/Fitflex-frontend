import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAsyncError, useNavigate } from 'react-router-dom';
import { useWorkout } from '../../context/WorkoutContext';

export default function StartWorkout() {
  const [workoutMeta, setWorkoutMeta] = useState(JSON.parse(localStorage.getItem('exerciseData')) || {});
  const [workoutData, setWorkoutData] = useState(null);
  const { user } = useAuth();
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
  const [progress, setProrgess] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getWorkoutById(workoutMeta.workoutId);
        setWorkoutData(data);
        console.log('workout data set')
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

      console.log('current day set', day)

      // const fetchData = async () => {
      //   try {
      //     console.log('exercise data set', currentDay)
      //     if (!currentDay?.[exerciseIndex]) {
      //       return;
      //     }
      //     const data = await getExerciseById(currentDay[exerciseIndex]?.exerciseData);
      //     setCurrentExercise(data);
      //   } catch (error) {
      //     console.error("Error fetching exercise data:", error);
      //   }
      // };

      // fetchData();
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
        console.log('exercise data set', currentExercise)
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
        setTime(3);
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
    if (exerciseIndex == currentDay?.exercise?.length) {
      alert('exercise completed')
    }else{
      setExerciseIndex((prev) => prev + 1)
      setProrgess((exerciseIndex+1)/currentDay?.exercises?.length)
    }
  }

  const handlePrevious=()=>{
    if(exerciseIndex==0){
      return;
    }else{
      setExerciseIndex((prev)=>prev-1)
      setProrgess((exerciseIndex+1)/currentDay?.exercises?.length)
    }
  }
  {console.log(currentDay)}

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
    } else if (opr === 'skip') {
      setInitialInstruction(false);
      setStartCountDown(true);
      console.log(currentDay?.exercises[exerciseIndex]);
      // setCurrentExercise({ ...currentDay?.exercises[0] });
      startCount();
    } else if (opr === 'previous') {
      setInstructionIndex((prev) => (prev - 1 + instructions.length) % instructions.length);
    }
  };

  return (
    <div className="mt-24 p-4">
      {modalVisible && (
        <div className="fixed top-0 left-0 h-[100vh] w-[100vw] z-[9999] bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 relative rounded-lg h-full w-full">
            <p className="text-xl">You are in full-screen mode. Press <strong>ESC</strong> to exit.</p>
            <div className='flex gap-2'>

              <button
                className="bg-red-500 text-white px-4 py-2 rounded mt-4 hover:bg-red-600 transition duration-300"
                onClick={() => {
                  exitFullScreen();
                  showModalVisible(false);
                }}
              >
                Exit Fullscreen
              </button>

              <div className="progress flex flex-col justify-end p-2">
                <div className="head">{progress}% | Total{currentDay?.exercises?.length}</div>
                <div className="bar h-3 w-[80vw] relative  shadow-md rounded-lg">
                  <div className="h-full bg-yellow-300 rounded-lg absolute z-10" style={{ width: `${progress}%` }}></div>
                  <div className="h-full w-[100%] bg-gray-300 rounded-lg absolute"></div>
                </div>
              </div>
            </div>
            {initialInstruction && (
              <div className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-orange-400 text-white p-5 rounded-lg max-w-lg">
                  <div className="instruction text-3xl">{instructions[instructionIndex]}</div>
                  <br />
                  <div className="flex justify-evenly">
                    <div className="previous cursor-pointer" onClick={() => changeInstruction('previous')}>
                      Previous
                    </div>
                    {instructionIndex < instructions.length - 1 ? (
                      <div className="next cursor-pointer" onClick={() => changeInstruction('next')}>
                        Next
                      </div>
                    ) : (
                      <div className="close cursor-pointer" onClick={() => changeInstruction('skip')}>Close</div>
                    )}
                    <div className="skip cursor-pointer" onClick={() => changeInstruction('skip')}>
                      Skip all
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-center items-center h-full">
              {startCountDown && (
                <div className="text-4xl text-center">
                  Exercise starts in
                  <br />
                  {time}s
                </div>
              )}
              {startCountDown && (
                <div className="absolute flex flex-col text-lg text-white bottom-10 p-5 px-10 right-10 bg-yellow-400 rounded-xl min-w-52">
                  Next Exercise
                  <span className='text-xl font-bold'>{currentDay?.exercises[0].name}, {currentDay?.exercises[0].duration}</span>
                </div>
              )}
              {(!startCountDown && !initialInstruction) && (
                <ExercisePlayer 
                _id={currentDay?.exercises[0].exerciseData} 
                progress={((exerciseIndex + 1) / currentDay?.exercise?.length)} 
                duration={currentDay?.exercises[0].duration} 
                data={currentExercise}
                next={handleNext}
                previous={handlePrevious}
                
                />
              )}
            </div>
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
  );
}

function ExercisePlayer({ _id, duration, data, progress }) {
  const [time, setTime] = useState(duration.split('-')[0] === 'time' ? duration.split('-')[1] : -1);
  const [reps, setReps] = useState(duration.split('-')[0] === 'reps' ? duration.split('-')[1] : -1);
  const type = duration.split('-')[0];
  const [events, setEvents] = useState({
    pause: false,
    skip: false,
    next: false,
    previous: false,
  });
  const next = () => {
    console.log('next');
  };
  const previous = () => {
    console.log('previous');
  };
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
    } else {
      next();
    }
  }, [time, events])
  // console.log(data)

  return (
    <div className="w-[85vw] h-[90%] m-10 flex ">
      <div className="w-1/2 h-full">
        <span className='text-6xl'>{data?.name}</span>
        <div className="img" style={{ backgroundImage: `url(${data?.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '360px' }}>

        </div>
        {/* <img src={data?.imageUrl} className='cover h-72' alt={data?.name} /> */}
        <br />
        {
          time > 0 ? (
            <div className="text-xl flex flex-col gap-2">
              Time:
              <span className='text-6xl'>00:{time}s</span>
            </div>
          ) : (
            <div className="text-xl flex flex-col gap-2">
              Time:
              <span className='text-6xl'>{time}</span>
            </div>
          )
        }
        <div className="flex rounded-lg gap-2 justify-between ">
          <button className='w-[30%] bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition duration-300' onClick={previous}>Previous</button>
          {
            type === 'time' ? (
              events.pause ? (
                <button className='w-[30%] bg-white border-2 border-orange-500 shadow-md text-orange font-bold px-4 py-2 rounded-lg hover:bg-gray-200  transition duration-300' onClick={() => setEvents((prev) => {
                  return { ...prev, pause: false }
                })}>Continue</button>
              ) : (
                <button className='w-[30%] bg-white border-2 border-orange-500 shadow-md text-orange font-bold px-4 py-2 rounded-lg hover:bg-gray-200  transition duration-300' onClick={() => setEvents((prev) => {
                  return { ...prev, pause: true }
                })}>Pause</button>
              )
              // <button className='w-[30%] bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition duration-300' onClick={pause}>Pause</button>
            ) : (
              <button className='w-[30%] bg-white border-2 border-orange-500 shadow-md text-orange font-bold px-4 py-2 rounded-lg hover:bg-gray-200  transition duration-300' onClick={pause}>Skip</button>
            )
          }
          {
            type === 'time' && (
              <button className='w-[30%] bg-white border-2 border-orange-500 shadow-md text-orange font-bold px-4 py-2 rounded-lg hover:bg-gray-200  transition duration-300' onClick={() => setTime(30)}>Restart</button>
            )
          }
          {/* {
            events.pause ? (
              <button className='w-[30%] bg-white border-2 border-orange-500 shadow-md text-orange font-bold px-4 py-2 rounded-lg hover:bg-gray-200  transition duration-300' onClick={previous}>Continue</button>
            ) : (
              <button className='w-[30%] bg-white border-2 border-orange-500 shadow-md text-orange font-bold px-4 py-2 rounded-lg hover:bg-gray-200  transition duration-300' onClick={previous}>Pause</button>
            )
          } */}

          <button className='w-[30%] bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition duration-300' onClick={next}>Next</button>
        </div>

      </div>
      <div className="w-1/2 h-full flex flex-col gap-6 px-4">
        <div>
          <h2 className="text-3xl font-bold mb-2">Focus Areas</h2>
          <ul className="list-disc list-inside ml-4">
            {data?.focusArea.map((area, index) => (
              <li key={index} className="text-lg">{area}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-2">Instructions</h2>
          <p className="text-lg leading-relaxed">{data?.instructions}</p>
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-2">Tips</h2>
          <p className="text-lg leading-relaxed">{data?.tips}</p>
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-2">Video</h2>
          <a href={data?.videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline hover:text-blue-600 transition duration-300">
            Watch Video
          </a>
        </div>
      </div>
    </div>
  );
}