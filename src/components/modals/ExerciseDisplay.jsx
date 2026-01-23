import { motion } from "framer-motion";
import { Pause, Play, SkipForward, ChevronLeft, Check, Target, Clock, Repeat } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";



const ExerciseDisplay = ({
  exercise,
  currentIndex,
  totalExercises,
  timeRemaining,
  repsCount,
  isPaused,
  onPause,
  onResume,
  onSkip,
  onComplete,
  onPrevious,
}) => {
  const isTimeBased = exercise.duration.startsWith("time-");

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getYouTubeEmbedUrl = (url) => {
    const videoId = url.split("v=")[1]?.split("&")[0] || url.split("/").pop();
    return `https://www.youtube.com/embed/${videoId}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col lg:flex-row gap-6 lg:gap-10  px-4 pb-6 h-[calc(100vh-4rem)] lg:h-[calc(100vh-6rem)] overflow-auto"
    >
      {/* Left Side - Image/Video */}
      <div className="flex-1 flex flex-col">
        <div className="relative rounded-2xl overflow-hidden shadow-card bg-card aspect-video lg:aspect-auto lg:flex-1">
          <img
            src={exercise.exerciseData.imageUrl}
            alt={exercise.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

          {/* Exercise Counter */}
          {/* <div className="absolute top-4 left-4">
            <Badge className="bg-secondary/90 text-foreground font-semibold px-3 py-1">
              {currentIndex + 1} / {totalExercises}
            </Badge>
          </div> */}

          {/* Timer/Reps Overlay */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-end justify-between">
              <div>
                <h1 className="font-display text-4xl lg:text-6xl text-foreground mb-2">
                  {exercise.name}
                </h1>
                <div className="flex gap-2 flex-wrap">
                  {exercise.exerciseData.focusArea.map((area) => (
                    <Badge key={area} variant="outline" className="border-primary text-primary">
                      <Target className="w-3 h-3 mr-1" />
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Big Timer/Reps Display */}
              <div className="text-right">
                {isTimeBased && timeRemaining !== null ? (
                  <div className="flex items-center gap-2">
                    <Clock className="w-8 h-8 text-primary" />
                    <span className="font-display text-6xl lg:text-8xl text-gradient">
                      {formatTime(timeRemaining)}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Repeat className="w-8 h-8 text-primary" />
                    <span className="font-display text-6xl lg:text-8xl text-gradient">
                      {repsCount}
                    </span>
                    <span className="text-2xl text-muted-foreground">reps</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div class="absolute top-6 right-6">
            <div class="bg-white/95 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-soft">
              <div class="text-center">
                <span class="font-display text-5xl text-gradient">#{currentIndex+1}</span>
                <span class="text-muted-foreground text-sm block">Exercise</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Right Side - Info & Controls */}
      <div className="lg:w-96 flex flex-col gap-4">
        {/* Instructions Card */}
        <div className="gradient-card rounded-2xl p-6 shadow-card border border-border flex-1 overflow-auto">
          <h3 className="font-display text-2xl text-foreground mb-4">Instructions</h3>
          <p className="text-muted-foreground leading-relaxed text-sm lg:text-base">
            {exercise.exerciseData.instructions}
          </p>
        </div>

        {/* Video Preview */}
        <div className="rounded-2xl overflow-hidden shadow-card aspect-video">
          <iframe
            src={getYouTubeEmbedUrl(exercise.exerciseData.videoUrl)}
            title={exercise.name}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>



        {/* Controls */}
        <div className="grid grid-cols-4 gap-3">
          <button
            variant="secondary"
            size="lg"
            onClick={onPrevious}
            disabled={currentIndex === 0}
            className="rounded-xl flex items-center justify-center h-14 bg-secondary/80 text-back shadow-button hover:opacity-80 transition-opacity duration-300 shadow-md"
          >
            <ChevronLeft className="w-6 h-6" />

          </button>

          {isTimeBased && (
            <button
              variant="secondary"
              size="lg"
              onClick={isPaused ? onResume : onPause}
              className="rounded-xl flex items-center justify-center h-14 bg-secondary/80 text-back shadow-button hover:opacity-80 transition-opacity duration-300 shadow-md"
            >
              {isPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
              {isPaused ? <p>Play</p> : <p>Pause</p>}
            </button>
          )}

          <button
            variant="secondary"
            size="lg"
            onClick={onSkip}
            className="rounded-xl flex items-center justify-center h-14 bg-secondary/80 text-back shadow-button hover:opacity-80 transition-opacity duration-300 shadow-md"
          >
            <SkipForward className="w-6 h-6 " />
            <p>Skip</p>
          </button>

          <button
            size="lg"
            onClick={onComplete}
            className={`rounded-xl flex items-center justify-center h-14 bg-orange-300 text-back shadow-button hover:opacity-80 transition-opacity duration-300 shadow-md ${!isTimeBased ? "col-span-2" : ""
              }`}
          >
            <Check className="w-6 h-6" />
            <p>Done</p>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ExerciseDisplay;
