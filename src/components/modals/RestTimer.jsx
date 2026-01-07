import { motion } from "framer-motion";
import { Plus, Minus, SkipForward } from "lucide-react";
import { Button } from "../ui/button";


const RestTimer = ({
  timeRemaining,
  onSkip,
  onAddTime,
  onReduceTime,
  nextExerciseName,
}) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = ((30 - timeRemaining) / 30) * 100;

  return (
   <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-[60vh] px-4"
    >
      {/* Rest Circle */}
      <div className="relative w-64 h-64 mb-8">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="128"
            cy="128"
            r="120"
            stroke="hsl(var(--secondary))"
            strokeWidth="8"
            fill="none"
          />
          <motion.circle
            cx="128"
            cy="128"
            r="120"
            stroke="url(#restGradient)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={754}
            initial={{ strokeDashoffset: 754 }}
            animate={{ strokeDashoffset: 754 - (754 * progress) / 100 }}
            transition={{ duration: 0.5 }}
          />
          <defs>
            <linearGradient id="restGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(200, 85%, 45%)" />
              <stop offset="100%" stopColor="hsl(200, 85%, 60%)" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-muted-foreground text-lg uppercase tracking-wider mb-2">
            Rest
          </span>
          <span className="font-display text-7xl text-foreground">
            {formatTime(timeRemaining)}
          </span>
        </div>
      </div>
      {/* Time Controls */}
      <div className="flex gap-4 mb-8">
        {/* <Button
          variant="secondary"
          size="lg"
          onClick={onReduceTime}
          disabled={timeRemaining <= 10}
          className="rounded-full w-14 h-14"
        >
        </Button> */}
        <button 
        onClick={onReduceTime}
        className="flex justify-center gap-2 items-center mx-auto shadow-xl text-lg bg-gray-50 backdrop-blur-md lg:font-semibold isolation-auto border-gray-50  hover:bg-secondary/80 transition-colors duration-300 ease-in-out   relative z-10 px-4 py-2 overflow-hidden border-2 rounded-full">
        <Minus className="w-6 h-6" />

        </button>
        <button 
        onClick={onAddTime}
        className="flex justify-center gap-2 items-center mx-auto shadow-xl text-lg bg-gray-50 backdrop-blur-md lg:font-semibold isolation-auto border-gray-50  hover:bg-secondary/80 transition-colors duration-300 ease-in-out   relative z-10 px-4 py-2 overflow-hidden border-2 rounded-full">
        <Plus className="w-6 h-6" />

        </button>

        {/* <Button
          variant="secondary"
          size="lg"
          onClick={onAddTime}
          className="rounded-full w-14 h-14"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div> */}

      </div>
      <button
        onClick={onSkip}
        className="flex justify-center gap-2 items-center mx-auto shadow-xl text-lg bg-gray-50 backdrop-blur-md lg:font-semibold isolation-auto border-gray-50  hover:bg-secondary/80 transition-colors duration-300 ease-in-out   relative z-10 px-4 py-2 overflow-hidden border-2 rounded-xl"
      >
        <SkipForward className="w-5 h-5 mr-2" />
        Skip Rest
      </button>

      {/* Next Up */}
      <div className="mt-10 text-center">
        <p className="text-muted-foreground text-sm uppercase tracking-wider mb-2">
          Next Up
        </p>
        <p className="font-display text-2xl text-foreground">{nextExerciseName}</p>
      </div>
    </motion.div>
  );
};

export default RestTimer;
