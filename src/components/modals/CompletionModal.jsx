import { motion, AnimatePresence } from "framer-motion";
import { Trophy, XCircle, Home, RotateCcw ,Flame} from "lucide-react";
import { Button } from "../ui/button";



const CompletionModal = ({
  isOpen,
  isSuccess,
  completionPercentage,
  onGoHome,
  onRetry,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.8, y: 40 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 40 }}
          transition={{ type: "spring", damping: 20 }}
          className="relative w-full max-w-md mx-4 p-8 rounded-3xl gradient-card shadow-card border border-border text-center"
        >
          {isSuccess ? (
            <>
              {/* Success State */}
              <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="w-20 h-20 mx-auto mb-6 rounded-full gradient-fire flex items-center justify-center shadow-warm"
                >
                  <Flame className="w-10 h-10 text-primary-foreground" />
                </motion.div>
                <h2 className="font-display text-4xl text-foreground mb-2">Workout Complete!</h2>
                <p className="text-muted-foreground mb-6">Amazing effort! You crushed it!</p>
                <div className="gradient-fire rounded-2xl p-6 mb-8">
                  <p className="text-primary-foreground/80 text-sm uppercase tracking-wider mb-1">Completion Rate</p>
                  <p className="font-display text-5xl text-primary-foreground">{Math.round(completionPercentage)}%</p>
                </div>
            </>
          ) : (
            <>
              {/* Failure State */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-24 h-24 mx-auto mb-6 rounded-full bg-destructive/20 flex items-center justify-center"
              >
                <XCircle className="w-12 h-12 text-destructive" />
              </motion.div>

              <h2 className="font-display text-5xl text-foreground mb-2">
                KEEP PUSHING!
              </h2>
              <p className="text-muted-foreground text-lg mb-6">
                You need 70% completion to finish. Try again!
              </p>

              <div className="bg-destructive/10 border border-destructive/30 rounded-2xl p-6 mb-8">
                <p className="text-destructive/80 text-sm uppercase tracking-wider mb-1">
                  Completion Rate
                </p>
                <p className="font-display text-6xl text-destructive">
                  {Math.round(completionPercentage)}%
                </p>
              </div>
            </>
          )}

          <div className="flex gap-4 justify-between">
            {!isSuccess  && (
              <button 
                onClick={onRetry}              
              className="relative w-[48%] flex flex-wrap items-center justify-center py-3 pl-4 pr-14 rounded-lg text-base font-medium [transition:all_0.5s_ease] border-solid border border-[#f85149] text-[#b22b2b] [&amp;_svg]:text-[#b22b2b] group bg-[linear-gradient(#f851491a,#f851491a)]">

                   <RotateCcw className="w-5 h-5 mr-2" />
                   Retry

              </button>
            )}
            
            <button className={`relative  flex flex-wrap items-center justify-center py-3 pl-4 pr-14 rounded-lg text-base font-medium [transition:all_0.5s_ease] border-solid border   
                ${isSuccess  ? "w-full flex border-green-700 text-green-800 [&amp;_svg]:text-green-800 group bg-[linear-gradient(#f851491a,#f851491a)]" : "w-[48%] flex border-[#f85149] text-[#b22b2b] [&amp;_svg]:text-[#b22b2b] group bg-[linear-gradient(#f851491a,#f851491a)]"}
              `}
              onClick={onGoHome}
              
              >

              <Home className="w-5 h-5 mr-2" />
              Go Home
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CompletionModal;
