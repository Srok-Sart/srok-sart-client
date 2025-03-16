"use client";

// Renders the animated tree visualization based on the sustainability progress.
import { motion } from "framer-motion";

interface TreeVisualizationProps {
  activeProgress: number;
  treeHeight: number;
  trunkWidth: number;
  leafScale: number;
  fruitScale: number;
}

export const TreeVisualization = ({
  activeProgress,
  treeHeight,
  trunkWidth,
  leafScale,
  fruitScale,
}: TreeVisualizationProps) => {
  return (
    <div className="relative w-full max-w-[280px] aspect-square flex items-end justify-center mb-4">
      {/* Ground/soil visualization */}
      <div className="absolute bottom-0 w-full h-8 flex justify-center">
        <div
          className="w-48 h-4 bg-gradient-to-r from-amber-800/30 via-amber-700/40 to-amber-800/30 rounded-full"
          style={{
            transform: `scale(${Math.min(1.2, activeProgress / 15)})`,
            boxShadow: "0 -2px 10px rgba(0,0,0,0.1) inset",
          }}
        />
      </div>

      {/* Tree trunk and branches */}
      <motion.div
        className="absolute bottom-0 bg-gradient-to-t from-amber-800 to-amber-700 rounded-t-lg origin-bottom"
        style={{
          width: trunkWidth,
          height: treeHeight,
          scale: activeProgress > 5 ? 1 : 0,
          boxShadow: "2px 0 3px rgba(0,0,0,0.1)",
        }}
        animate={{ height: treeHeight, width: trunkWidth }}
        transition={{ type: "spring", stiffness: 70, damping: 15 }}
      >
        {activeProgress > 30 && (
          <>
            <motion.div
              className="absolute w-20 h-3 bg-amber-700 rounded-full"
              style={{
                left: -15,
                bottom: treeHeight * 0.6,
                transformOrigin: "right center",
                transform: "rotate(-25deg)",
                boxShadow: "0 2px 2px rgba(0,0,0,0.1)",
              }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            />
            <motion.div
              className="absolute w-16 h-3 bg-amber-700 rounded-full"
              style={{
                right: -12,
                bottom: treeHeight * 0.7,
                transformOrigin: "left center",
                transform: "rotate(20deg)",
                boxShadow: "0 2px 2px rgba(0,0,0,0.1)",
              }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            />
          </>
        )}
        {activeProgress > 50 && (
          <>
            <motion.div
              className="absolute w-14 h-2.5 bg-amber-700 rounded-full"
              style={{
                left: -10,
                bottom: treeHeight * 0.4,
                transformOrigin: "right center",
                transform: "rotate(-15deg)",
                boxShadow: "0 2px 2px rgba(0,0,0,0.1)",
              }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            />
            <motion.div
              className="absolute w-12 h-2.5 bg-amber-700 rounded-full"
              style={{
                right: -8,
                bottom: treeHeight * 0.5,
                transformOrigin: "left center",
                transform: "rotate(15deg)",
                boxShadow: "0 2px 2px rgba(0,0,0,0.1)",
              }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            />
          </>
        )}
      </motion.div>

      {/* Tree leaves, fruits, and additional details */}
      <motion.div
        className="absolute -left-24 -right-24 bottom-[60%] flex items-center justify-center"
        style={{ scale: leafScale }}
        animate={{ scale: leafScale }}
        transition={{ type: "spring", stiffness: 70, damping: 15 }}
      >
        <div
          className="absolute bottom-0 w-48 h-40 rounded-full bg-gradient-to-b from-green-700 to-green-600 opacity-90"
          style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))" }}
        />
        <div
          className="absolute bottom-8 w-44 h-40 rounded-full bg-gradient-to-b from-green-600 to-green-500 opacity-95"
          style={{ filter: "drop-shadow(0 4px 4px rgba(0,0,0,0.1))" }}
        />
        <div
          className="absolute bottom-16 w-40 h-40 rounded-full bg-gradient-to-b from-green-500 to-green-400"
          style={{ filter: "drop-shadow(0 4px 3px rgba(0,0,0,0.05))" }}
        />

        {activeProgress > 40 && (
          <>
            <motion.div
              className="absolute -left-12 bottom-4 w-20 h-16 rounded-full bg-gradient-to-b from-green-600 to-green-500"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            />
            <motion.div
              className="absolute -right-14 bottom-6 w-22 h-18 rounded-full bg-gradient-to-b from-green-600 to-green-500"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
            />
          </>
        )}

        {activeProgress > 30 &&
          Array.from({ length: Math.floor(activeProgress / 8) }).map((_, i) => (
            <motion.div
              key={`leaf-${i}`}
              className="absolute rounded-full bg-green-400"
              style={{
                width: 4 + Math.random() * 8,
                height: 4 + Math.random() * 8,
                left: -20 + Math.random() * 80,
                bottom: 10 + Math.random() * 40,
                opacity: 0.7 + Math.random() * 0.3,
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 * i }}
            />
          ))}

        {fruitScale > 0 && (
          <>
            <motion.div
              className="absolute bottom-12 -left-4 w-5 h-5 rounded-full bg-gradient-to-br from-red-400 to-red-600"
              style={{
                boxShadow: "0 0 10px rgba(239, 68, 68, 0.4)",
                filter: "brightness(1.1)",
              }}
              initial={{ scale: 0 }}
              animate={{ scale: fruitScale }}
            />
            <motion.div
              className="absolute bottom-20 left-8 w-5 h-5 rounded-full bg-gradient-to-br from-red-400 to-red-600"
              style={{
                boxShadow: "0 0 10px rgba(239, 68, 68, 0.4)",
                filter: "brightness(1.1)",
              }}
              initial={{ scale: 0 }}
              animate={{ scale: fruitScale }}
              transition={{ delay: 0.2 }}
            />
            <motion.div
              className="absolute bottom-12 right-5 w-5 h-5 rounded-full bg-gradient-to-br from-red-400 to-red-600"
              style={{
                boxShadow: "0 0 10px rgba(239, 68, 68, 0.4)",
                filter: "brightness(1.1)",
              }}
              initial={{ scale: 0 }}
              animate={{ scale: fruitScale }}
              transition={{ delay: 0.3 }}
            />
            {activeProgress > 70 && (
              <motion.div
                className="absolute bottom-24 right-10 w-5 h-5 rounded-full bg-gradient-to-br from-red-400 to-red-600"
                style={{
                  boxShadow: "0 0 10px rgba(239, 68, 68, 0.4)",
                  filter: "brightness(1.1)",
                }}
                initial={{ scale: 0 }}
                animate={{ scale: fruitScale }}
                transition={{ delay: 0.4 }}
              />
            )}
          </>
        )}
      </motion.div>

      {/* Optional animated butterflies or birds */}
      {activeProgress > 60 && (
        <>
          <motion.div
            className="absolute w-4 h-4"
            style={{
              top: "30%",
              left: "30%",
            }}
            animate={{
              x: [0, 20, 0, -20, 0],
              y: [0, -10, -20, -10, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
              <path d="M12 2L15 6L12 10L9 6L12 2Z" fill="#FB923C" />
              <path d="M12 10L15 14L12 18L9 14L12 10Z" fill="#FB923C" />
            </svg>
          </motion.div>
          <motion.div
            className="absolute w-3 h-3"
            style={{
              top: "20%",
              right: "35%",
            }}
            animate={{
              x: [0, -15, 0, 15, 0],
              y: [0, -5, -15, -5, 0],
            }}
            transition={{
              duration: 5,
              delay: 1,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
              <path d="M12 2L15 6L12 10L9 6L12 2Z" fill="#3B82F6" />
              <path d="M12 10L15 14L12 18L9 14L12 10Z" fill="#3B82F6" />
            </svg>
          </motion.div>
        </>
      )}
    </div>
  );
};
