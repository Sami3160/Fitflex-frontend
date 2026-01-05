import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X , SkipForward} from "lucide-react";
import { Button } from "../../components/ui/button";



// interface InstructionModalProps {
//   isOpen: boolean;
//   instructions: Instruction[];
//   currentStep: number;
//   onNext: () => void;
//   onPrevious: () => void;
//   onSkipAll: () => void;
// }

const InstructionModal = ({
  isOpen,
  instructions,
  currentStep,
  onNext,
  onPrevious,
  onSkipAll,
}) => {
  if (!isOpen) return null;

  const instruction = instructions[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === instructions.length - 1;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
      >
         <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg mx-4 p-8 rounded-2xl gradient-card shadow-card border border-border"
        >
          {/* Skip All Button */}
          <button
            onClick={onSkipAll}
            className="absolute top-4 right-4 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mb-8">
            {instructions.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${index === currentStep ? "bg-primary" : "bg-secondary"
                  }`}
              />
            ))}
          </div>

          {/* Content */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-center"
          >
            <div className="text-6xl mb-6">{instruction.icon}</div>
            <h2 className="font-display text-4xl text-foreground mb-4">
              {instruction.title}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {instruction.description}
            </p>
          </motion.div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-10">
            
            <button disabled={isFirst} onClick={onPrevious} className="  bg-white flex justify-center items-center rounded-xl p-2 shadow-lg dark:bg-gray-800">

              <ChevronLeft className="w-5 h-5 mr-1" />
              Previous
            </button>

            {/* <Button
              onClick={onSkipAll}
              className="gradient-primary text-primary-foreground font-semibold px-8 shadow-button hover:opacity-90 transition-opacity"
            >
            </Button> */}
            <button onClick={onSkipAll} className="bg-white flex justify-center items-center rounded-xl p-2 shadow-lg dark:bg-gray-800">
              Skip All
              <SkipForward className="w-4 h-4 ml-1" />
            </button>
            <button disabled={isLast} onClick={onNext} className="  bg-white flex justify-center items-center rounded-xl p-2 shadow-lg dark:bg-gray-800">
              {isLast ? "Start Workout" : "Next"}
              {!isLast && <ChevronRight className="w-5 h-5 ml-1" />}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InstructionModal;
