// For tree interface

"use client";

import { motion } from "framer-motion";

interface TreeVisualizationProps {
  activeProgress: number;
}

const TreeVisualization = ({ activeProgress }: TreeVisualizationProps) => {
  // Tree growth calculations with minimums so even low progress shows a seed/sprout
  const treeHeight = Math.max(30, Math.min(160, activeProgress * 1.6));
  const trunkWidth = Math.max(6, Math.min(14, activeProgress / 6));
  const leafScale = activeProgress > 20 ? Math.min(1, (activeProgress - 20) / 60) : 0.3;
  const fruitScale = Math.max(0, (activeProgress - 50) / 50);

  return (
    <div className="relative w-full max-w-[300px] aspect-square flex items-end justify-center mb-8">
      {/* Ground */}
      <div
        className="absolute bottom-0 w-32 h-3 bg-amber-900/20 rounded-full"
        style={{ transform: `scale(${Math.min(1, activeProgress / 20)})` }}
      />
      {/* Tree Trunk */}
      <motion.div
        className="absolute bottom-0 bg-amber-800 rounded-t-lg origin-bottom"
        style={{ width: trunkWidth, height: treeHeight, scale: activeProgress > 5 ? 1 : 0 }}
        animate={{ height: treeHeight, width: trunkWidth }}
        transition={{ type: "spring", stiffness: 70, damping: 15 }}
      >
        {/* Leaves and Fruits */}
        <motion.div
          className="absolute -left-20 -right-20 bottom-[60%] flex items-center justify-center"
          style={{ scale: leafScale }}
          animate={{ scale: leafScale }}
          transition={{ type: "spring", stiffness: 70, damping: 15 }}
        >
          <div className="absolute bottom-0 w-40 h-32 rounded-full bg-green-600" />
          <div className="absolute bottom-8 w-36 h-32 rounded-full bg-green-500" />
          <div className="absolute bottom-16 w-32 h-32 rounded-full bg-green-400" />
          {fruitScale > 0 && (
            <>
              {/* <motion.div
                className="absolute bottom-32 -right1 w-4 h-4 rounded-full bg-red-500"
                initial={{ scale: 1 }}
                animate={{ scale: fruitScale }}
              />
              <motion.div
                className="absolute bottom-12 -right1 w-4 h-4 rounded-full bg-red-500"
                initial={{ scale: 1 }}
                animate={{ scale: fruitScale }}
              />
              <motion.div
                className="absolute bottom-12 left-8 w-4 h-4 rounded-full bg-red-500"
                initial={{ scale: 0 }}
                animate={{ scale: fruitScale }}
                transition={{ delay: 0.2 }}
              />
              <motion.div
                className="absolute bottom-12 right-5 w-4 h-4 rounded-full bg-red-500"
                initial={{ scale: 0 }}
                animate={{ scale: fruitScale }}
                transition={{ delay: 0.3 }}
              /> */}
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TreeVisualization;
