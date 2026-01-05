import { motion, AnimatePresence } from "framer-motion";
import { Trophy, XCircle, Home, RotateCcw } from "lucide-react";
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
                transition={{ delay: 0.2, type: "spring" }}
                className="w-24 h-24 mx-auto mb-6 rounded-full gradient-primary flex items-center justify-center shadow-glow animate-pulse-glow"
              >
                <Trophy className="w-12 h-12 text-primary-foreground" />
              </motion.div>

              <h2 className="font-display text-5xl text-foreground mb-2">
                WORKOUT COMPLETE!
              </h2>
              <p className="text-muted-foreground text-lg mb-6">
                Amazing effort! You crushed it!
              </p>

              <div className="gradient-primary rounded-2xl p-6 mb-8">
                <p className="text-primary-foreground/80 text-sm uppercase tracking-wider mb-1">
                  Completion Rate
                </p>
                <p className="font-display text-6xl text-primary-foreground">
                  {Math.round(completionPercentage)}%
                </p>
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

          <div className="flex gap-4">
            {!isSuccess && onRetry && (
              <Button
                onClick={onRetry}
                variant="secondary"
                size="lg"
                className="flex-1 rounded-xl h-14"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Retry
              </Button>
            )}
            <Button
              onClick={onGoHome}
              className={`rounded-xl h-14 gradient-primary text-primary-foreground shadow-button hover:opacity-90 transition-opacity ${
                isSuccess || !onRetry ? "w-full" : "flex-1"
              }`}
            >
              <Home className="w-5 h-5 mr-2" />
              Go Home
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CompletionModal;
