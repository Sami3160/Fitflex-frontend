import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const CountdownOverlay = ({ isActive, onComplete }) => {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (!isActive) {
      setCount(3);
      return;
    }

    if (count === 0) {
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setCount(count - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isActive, count, onComplete]);

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
      >
        <motion.div
          key={count}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          {count > 0 ? (
            <>
              <div className="font-display text-[200px] leading-none text-gradient">
                {count}
              </div>
              <p className="text-2xl text-muted-foreground mt-4">Get Ready!</p>
            </>
          ) : (
            <div className="font-display text-8xl text-gradient">GO!</div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CountdownOverlay;
