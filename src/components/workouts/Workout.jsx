import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, Calendar, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";

const Workout = () => {
  const navigate = useNavigate();

  const workoutDays = [
    { day: 1, title: "Core Activation", duration: 45, exercises: 10, completed: false },
    { day: 2, title: "Upper Body Burn", duration: 40, exercises: 8, completed: false },
    { day: 3, title: "Lower Body Power", duration: 50, exercises: 12, completed: false },
  ];

  const handleStartWorkout = (day) => {
    navigate("/exercise-player", {
      state: {
        day,
        workoutId: "demo-workout-123",
      },
    });
  };

  return (
    <div className="min-h-screen gradient-dark text-foreground p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <header className="mb-10">
          <h1 className="font-display text-5xl lg:text-6xl mb-2">Your Workouts</h1>
          <p className="text-muted-foreground text-lg">Select a day to start training</p>
        </header>

        <div className="space-y-4">
          {workoutDays.map((workout, index) => (
            <motion.div
              key={workout.day}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="gradient-card rounded-2xl p-6 shadow-card border border-border hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center shadow-button">
                    <span className="font-display text-2xl text-primary-foreground">
                      {workout.day}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-2xl text-foreground">{workout.title}</h3>
                    <div className="flex items-center gap-4 text-muted-foreground text-sm mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {workout.duration} min
                      </span>
                      <span className="flex items-center gap-1">
                        <Dumbbell className="w-4 h-4" />
                        {workout.exercises} exercises
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => handleStartWorkout(workout.day)}
                  className="gradient-primary text-primary-foreground font-semibold px-6 rounded-xl shadow-button hover:opacity-90 transition-opacity"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Workout;
