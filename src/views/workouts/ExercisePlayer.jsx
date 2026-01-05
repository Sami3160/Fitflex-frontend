import { useWorkout } from "../../context/WorkoutContext.jsx";
import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import ExerciseProgressBar from "../../components/ExerciseProgressBar.jsx";
import InstructionModal from "../../components/modals/InstructionModal.jsx";
import CountdownOverlay from "../../components/modals/CountdownOverlay.jsx";
import ExerciseDisplay from "../../components/modals/ExerciseDisplay.jsx";
import RestTimer from "../../components/modals/RestTimer.jsx";
import CompletionModal from "../../components/modals/CompletionModal.jsx";
import { Button } from "../../components/ui/button.jsx";
import { CloseButton } from "../../components/ui/close-button.jsx";
function ExercisePlayer() {
    const location = useLocation();
    const navigate = useNavigate();
    const dayNumber = location.state?.day || 0;
    const workoutId = location.state?.workoutId || '';
    const { getWorkoutById, getExerciseById, getWorkoutByDay } = useWorkout();
    const [phase, setPhase] = useState("instructions");
    const [instructionStep, setInstructionStep] = useState(0);
    const [exercises, setExercises] = useState([]);
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [completedExercises, setCompletedExercises] = useState(new Set());
    const [timeRemaining, setTimeRemaining] = useState(null);
    const [restTimeRemaining, setRestTimeRemaining] = useState(30);
    const [isPaused, setIsPaused] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [completionPercentage, setCompletionPercentage] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const INSTRUCTIONS = [
        {
            title: "Welcome!",
            description: "Get ready for an amazing workout. Follow along with each exercise and do your best!",
            icon: "💪",
        },
        {
            title: "Time-Based Exercises",
            description: "For timed exercises, a countdown will show. You can pause anytime if needed.",
            icon: "⏱️",
        },
        {
            title: "Rep-Based Exercises",
            description: "For rep exercises, complete all reps then tap 'Complete' when done.",
            icon: "🔄",
        },
        {
            title: "Rest Periods",
            description: "30 seconds rest between exercises. Skip or extend as needed!",
            icon: "😮‍💨",
        },
    ];
      // Fetch workout data
  useEffect(() => {
    const fetchWorkoutData = async () => {
      try {
        const workoutData = await getWorkoutByDay(workoutId, dayNumber);
        console.log("Fetched workout data:", workoutData.data);
        setExercises(workoutData.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch workout:", error);
        setIsLoading(false);
      }
    };

    fetchWorkoutData();
  }, [workoutId, dayNumber]);
//   useEffect(()=>{
//     document.onfullscreenchange = () => {
//         if (document.fullscreenElement) {
//             setIsFullscreen(true);
//         } else {
//             setIsFullscreen(false);
//         }
//     };
//     }, []);



    // Timer for time-based exercises
    useEffect(() => {
        if (phase !== "exercise" || isPaused) return;

        const currentExercise = exercises[currentExerciseIndex];
        if (!currentExercise?.duration.startsWith("time-")) return;

        if (timeRemaining === null) {
            const seconds = parseInt(currentExercise.duration.split("-")[1]);
            setTimeRemaining(seconds);
            return;
        }

        if (timeRemaining <= 0) {
            handleCompleteExercise();
            return;
        }

        const timer = setInterval(() => {
            setTimeRemaining((prev) => (prev !== null ? prev - 1 : null));
        }, 1000);

        return () => clearInterval(timer);
    }, [phase, timeRemaining, isPaused, currentExerciseIndex, exercises]);

    // Rest timer
    useEffect(() => {
        if (phase !== "rest") return;

        if (restTimeRemaining <= 0) {
            startNextExercise();
            return;
        }

        const timer = setInterval(() => {
            setRestTimeRemaining((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [phase, restTimeRemaining]);




    //function for initial instructions
    const handleInstructionNext = () => {
        if (instructionStep < INSTRUCTIONS.length - 1) {
            setInstructionStep(instructionStep + 1);
        } else {
            setPhase("countdown");
        }
    };

    const handleInstructionPrevious = () => {
        if (instructionStep > 0) {
            setInstructionStep(instructionStep - 1);
        }
    };

    const handleSkipInstructions = () => {
        setPhase("countdown");
    };

    const handleCountdownComplete = useCallback(() => {
        setPhase("exercise");
        const exercise = exercises[currentExerciseIndex];
        if (exercise?.duration.startsWith("time-")) {
            setTimeRemaining(parseInt(exercise.duration.split("-")[1]));
        }
    }, [exercises, currentExerciseIndex]);

    const handleCompleteExercise = async () => {
        // Send completion to backend
        try {
            // await fetch(`${BASE_URL}/complete-exercise`, {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({
            //     day: dayNumber,
            //     workoutId,
            //     exerciseId: exercises[currentExerciseIndex]?.exerciseData._id.$oid,
            //   }),
            // });
            console.log("Exercise completed:", currentExerciseIndex);
        } catch (error) {
            console.error("Failed to record completion:", error);
        }

        setCompletedExercises((prev) => new Set([...prev, currentExerciseIndex]));

        if (currentExerciseIndex < exercises.length - 1) {
            setPhase("rest");
            setRestTimeRemaining(30);
        } else {
            checkCompletion();
        }
    };

    const handleSkipExercise = () => {
        if (currentExerciseIndex < exercises.length - 1) {
            setPhase("rest");
            setRestTimeRemaining(30);
        } else {
            checkCompletion();
        }
    };

    const handlePreviousExercise = () => {
        if (currentExerciseIndex > 0) {
            setCurrentExerciseIndex(currentExerciseIndex - 1);
            setTimeRemaining(null);
            setPhase("countdown");
        }
    };

    const startNextExercise = () => {
        setCurrentExerciseIndex((prev) => prev + 1);
        setTimeRemaining(null);
        setPhase("countdown");
    };

    const checkCompletion = async () => {
        // Fetch completion percentage from backend
        try {
            // const response = await fetch(`${BASE_URL}/completion-percentage`, {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({ workoutId, day: dayNumber }),
            // });
            // const data = await response.json();
            // setCompletionPercentage(data.percentage);

            // Calculate locally for demo
            const percentage = (completedExercises.size / exercises.length) * 100;
            setCompletionPercentage(percentage);
        } catch (error) {
            const percentage = (completedExercises.size / exercises.length) * 100;
            setCompletionPercentage(percentage);
        }
        setPhase("complete");
    };

    const handleGoHome = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => { });
        }
        navigate("/startWorkout", {state: { workoutId, day: dayNumber }});
    };

    const handleExit = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => { });
        }
        navigate("/startWorkout", {state: { workoutId, day: dayNumber }});
    };

    const getRepsCount = () => {
        const exercise = exercises[currentExerciseIndex];
        if (!exercise || !exercise.duration.startsWith("reps-")) return null;
        return parseInt(exercise.duration.split("-")[1]);
    };
    // useEffect(() => {
    //     if(document.fullscreenElement===null){
    //         setIsFullscreen(false);
    //     }
    // }, [phase, document.fullscreenElement]);

    
    if (isLoading) {
        return (
            <div className="min-h-screen gradient-dark flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
                />
            </div>
        );
    }
    console.log("Fullscreen Element:", document.fullscreenElement);
    
    if(isLoading === false && !isFullscreen){
        return <FullscreenRequestPage  changeFullscreenStatus={() => setIsFullscreen(true)} />
    }
return (
    <div className="min-h-screen gradient-dark text-foreground flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <div className="flex-1">
          <ExerciseProgressBar current={currentExerciseIndex} total={exercises.length} />
        </div>
        <CloseButton onClick={handleExit} />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {phase === "instructions" && (
          <InstructionModal
            isOpen={true}
            instructions={INSTRUCTIONS}
            currentStep={instructionStep}
            onNext={handleInstructionNext}
            onPrevious={handleInstructionPrevious}
            onSkipAll={handleSkipInstructions}
          />
        )}

        {phase === "countdown" && (
          <CountdownOverlay isActive={true} onComplete={handleCountdownComplete} />
        )}

        {phase === "exercise" && exercises[currentExerciseIndex] && (
          <ExerciseDisplay
            exercise={exercises[currentExerciseIndex]}
            currentIndex={currentExerciseIndex}
            totalExercises={exercises.length}
            timeRemaining={timeRemaining}
            repsCount={getRepsCount()}
            isPaused={isPaused}
            onPause={() => setIsPaused(true)}
            onResume={() => setIsPaused(false)}
            onSkip={handleSkipExercise}
            onComplete={handleCompleteExercise}
            onPrevious={handlePreviousExercise}
          />
        )}

        {phase === "rest" && (
          <RestTimer
            timeRemaining={restTimeRemaining}
            onSkip={startNextExercise}
            onAddTime={() => setRestTimeRemaining((prev) => prev + 30)}
            onReduceTime={() => setRestTimeRemaining((prev) => Math.max(0, prev - 10))}
            nextExerciseName={exercises[currentExerciseIndex + 1]?.name || ""}
          />
        )}

        <CompletionModal
          isOpen={phase === "complete"}
          isSuccess={completionPercentage >= 70}
          completionPercentage={completionPercentage}
          onGoHome={handleGoHome}
        />
      </main>
    </div>
  );
};




const FullscreenRequestPage = ({changeFullscreenStatus}) => {
    return (
        <div className="min-h-screen gradient-dark flex flex-col items-center justify-center text-foreground p-4">
            <h1 className="text-3xl font-bold mb-6">Enter Fullscreen to Start Workout</h1>
            <Button

                component={<span>Enter Fullscreen</span>}
                onClick={async () => {
                    try {
                        if (document.documentElement.requestFullscreen) {
                            await document.documentElement.requestFullscreen();
                            changeFullscreenStatus();
                            // window.location.reload();
                        }
                    } catch (err) {
                        console.log("Fullscreen request failed:", err);
                    }
                }}
                className="px-6 py-3 text-lg"
            />
        </div>
    )
}
export default ExercisePlayer;