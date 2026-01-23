import { motion } from "framer-motion";


const ExerciseProgressBar = ({ current, total }) => {
  const progress = (current / total) * 100;
    
  return (
    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
      <motion.div
        className="h-full gradient-primary"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  );
};


export default ExerciseProgressBar;