"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaLeaf, FaRecycle, FaSeedling } from "react-icons/fa"

interface TreeVisualizationProps {
  activeProgress: number
  totalMaterialsSaved?: number  // This is totalSavedWeight from MaterialSavedSummary
  itemsReused?: number          // This is totalSavedItems from MaterialSavedSummary 
  projectsCompleted?: number    // This is totalPostsCompleted from MaterialSavedSummary
  className?: string
}
export const TreeVisualization = ({
  activeProgress,
  totalMaterialsSaved = 0,
  itemsReused = 0,
  projectsCompleted = 0,
  className = "",
}: TreeVisualizationProps) => {
  const [windowWidth, setWindowWidth] = useState(0)

  // Responsive sizing
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    handleResize() // Set initial size
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Calculate responsive dimensions
  const baseSize = windowWidth < 640 ? 220 : windowWidth < 1024 ? 260 : 300
  const treeHeight = baseSize * 0.7
  const trunkWidth = baseSize * 0.07
  const seedlingScale = Math.min(1, (20 - activeProgress) / 10) * (windowWidth < 640 ? 0.8 : 1)
  const trunkScale = Math.min(1, activeProgress / 30) 
  const leafScale = Math.min(1, activeProgress / 50) * (windowWidth < 640 ? 0.8 : 1)
  const fruitScale = activeProgress > 40 ? Math.min(0.8, (activeProgress - 40) / 50) : 0

  // Generate leaves based on progress
  const leafCount = Math.floor(activeProgress / 5)

  // Calculate dynamic margin for the milestone badge based on progress
  const milestoneBadgeMargin = Math.max(24, Math.min(40, 24 + activeProgress / 3))

  // Calculate milestone achievements
  const milestones = [
    { threshold: 10, label: "Seedling" },
    { threshold: 20, label: "Growing" },
    { threshold: 60, label: "Thriving" },
    { threshold: 80, label: "Flourishing" },
    { threshold: 100, label: "Abundant" },
  ]

  const currentMilestone = milestones.filter((m) => activeProgress >= m.threshold).pop() || milestones[0]

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Current milestone badge */}
      <div
        className="w-full flex justify-start"
        style={{ maxWidth: `${baseSize}px`, marginLeft: '-150px' }}
      >
        <motion.div
          className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
          style={{ marginBottom: `${milestoneBadgeMargin}px` }}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          {currentMilestone.label}
        </motion.div>
      </div>

      {/* Tree visualization container */}
      <div className="relative w-full" style={{ maxWidth: `${baseSize}px`, aspectRatio: "1/1" }}>
        {/* Enhanced ground/soil with gradient and texture */}
        <div className="absolute bottom-0 w-full h-8 flex justify-center">
          <motion.div
            className="w-3/4 h-4 bg-gradient-to-r from-amber-800/30 via-amber-700/40 to-amber-800/30 rounded-full"
            style={{
              boxShadow: "0 -2px 10px rgba(0,0,0,0.1) inset",
            }}
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{
              scale: Math.min(1.2, 0.8 + (activeProgress / 100) * 0.4),
              opacity: Math.min(1, 0.5 + (activeProgress / 100) * 0.5),
              background: activeProgress > 50 
                ? "linear-gradient(to right, rgba(146, 64, 14, 0.4), rgba(180, 83, 9, 0.5), rgba(146, 64, 14, 0.4))" 
                : "linear-gradient(to right, rgba(146, 64, 14, 0.3), rgba(180, 83, 9, 0.4), rgba(146, 64, 14, 0.3))"
            }}
            transition={{ type: "spring", stiffness: 50, damping: 15 }}
          />
        </div>

        {/* Seedling (shown when progress is low) */}
        <AnimatePresence>
          {activeProgress <= 10 && (
            <motion.div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 text-green-600 dark:text-green-500"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: seedlingScale, opacity: seedlingScale * 2 }}
              exit={{ scale: 0, opacity: 0 }}
              style={{ fontSize: baseSize * 0.15 }}
            >
              <FaSeedling />
            </motion.div>
          )}
        </AnimatePresence>


        {/* Tree trunk with texture and gradient */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-gradient-to-t from-amber-800 to-amber-700 rounded-t-lg origin-bottom"
          style={{
            width: trunkWidth,
            height: activeProgress >= 10 ? treeHeight * trunkScale : 0,
            boxShadow: "2px 0 3px rgba(0,0,0,0.1)",
            opacity: Math.min(1, activeProgress / 20),
          }}
          animate={{
            height: activeProgress >= 10 ? treeHeight * trunkScale : 0,
            width: trunkWidth,
          }}
          transition={{ type: "spring", stiffness: 60, damping: 15 }}
        >
          {/* Tree branches */}
          {activeProgress > 30 && (
            <>
              <motion.div
                className="absolute h-3 bg-amber-700 rounded-full"
                style={{
                  width: baseSize * 0.2,
                  left: -baseSize * 0.05,
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
                className="absolute h-3 bg-amber-700 rounded-full"
                style={{
                  width: baseSize * 0.16,
                  right: -baseSize * 0.04,
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
                className="absolute h-2.5 bg-amber-700 rounded-full"
                style={{
                  width: baseSize * 0.14,
                  left: -baseSize * 0.03,
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
                className="absolute h-2.5 bg-amber-700 rounded-full"
                style={{
                  width: baseSize * 0.12,
                  right: -baseSize * 0.02,
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

        {/* Enhanced tree leaves with multiple layers and gradients */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 z-20"
          style={{
            scale: leafScale,
            bottom: `${treeHeight * 0.6 * trunkScale}px`,
          }}
          animate={{ 
            scale: leafScale,
            bottom: `${treeHeight * 0.6 * trunkScale}px`,
          }}
          transition={{ type: "spring", stiffness: 70, damping: 15 }}
        >
          {activeProgress > 15 && (
            <>
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-b from-green-700 to-green-600"
                style={{
                  width: baseSize * 0.48,
                  height: baseSize * 0.4,
                  filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))",
                  opacity: Math.min(0.9, 0.4 + (activeProgress - 20) / 80 * 0.5)
                }}
              />
              <div
                className="absolute left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-b from-green-600 to-green-500 opacity-95"
                style={{
                  width: baseSize * 0.44,
                  height: baseSize * 0.4,
                  bottom: baseSize * 0.08,
                  filter: "drop-shadow(0 4px 4px rgba(0,0,0,0.1))",
                }}
              />
              <div
                className="absolute left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-b from-green-500 to-green-400"
                style={{
                  width: baseSize * 0.4,
                  height: baseSize * 0.4,
                  bottom: baseSize * 0.16,
                  filter: "drop-shadow(0 4px 3px rgba(0,0,0,0.05))",
                }}
              />
            </>
          )}

          {/* Leaf icons scattered throughout the tree */}
          {activeProgress > 30 &&
            Array.from({ length: leafCount }).map((_, i) => (
              <motion.div
                key={`leaf-${i}`}
                className="absolute text-green-500"
                style={{
                  fontSize: baseSize * 0.04 + Math.random() * baseSize * 0.03,
                  left: -baseSize * 0.2 + Math.random() * baseSize * 0.4,
                  bottom: baseSize * 0.1 + Math.random() * baseSize * 0.2,
                  opacity: 0.7 + Math.random() * 0.3,
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 * i }}
              >
                <FaLeaf />
              </motion.div>
            ))}

          {/* Recycle icons representing reused items */}
          {activeProgress > 50 && itemsReused > 0 && (
            <>
              <motion.div
                className="absolute text-blue-500"
                style={{
                  fontSize: baseSize * 0.06,
                  left: -baseSize * 0.15,
                  bottom: baseSize * 0.25,
                }}
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ delay: 0.6, duration: 1 }}
              >
                <FaRecycle />
              </motion.div>
              {itemsReused > 5 && (
                <motion.div
                  className="absolute text-blue-500"
                  style={{
                    fontSize: baseSize * 0.05,
                    right: -baseSize * 0.12,
                    bottom: baseSize * 0.18,
                  }}
                  initial={{ scale: 0, rotate: 0 }}
                  animate={{ scale: 1, rotate: 360 }}
                  transition={{ delay: 0.8, duration: 1 }}
                >
                  <FaRecycle />
                </motion.div>
              )}
            </>
          )}

          {/* Fruits representing completed projects */}
          {fruitScale > 0 && (
            <>
              <motion.div
                className="absolute rounded-full bg-gradient-to-br from-red-400 to-red-600"
                style={{
                  width: baseSize * 0.05,
                  height: baseSize * 0.05,
                  bottom: baseSize * 0.12,
                  left: -baseSize * 0.04,
                  boxShadow: "0 0 10px rgba(239, 68, 68, 0.4)",
                  filter: "brightness(1.1)",
                }}
                initial={{ scale: 0 }}
                animate={{ scale: fruitScale }}
              />
              <motion.div
                className="absolute rounded-full bg-gradient-to-br from-red-400 to-red-600"
                style={{
                  width: baseSize * 0.05,
                  height: baseSize * 0.05,
                  bottom: baseSize * 0.2,
                  left: baseSize * 0.08,
                  boxShadow: "0 0 10px rgba(239, 68, 68, 0.4)",
                  filter: "brightness(1.1)",
                }}
                initial={{ scale: 0 }}
                animate={{ scale: fruitScale }}
                transition={{ delay: 0.2 }}
              />
              <motion.div
                className="absolute rounded-full bg-gradient-to-br from-red-400 to-red-600"
                style={{
                  width: baseSize * 0.05,
                  height: baseSize * 0.05,
                  bottom: baseSize * 0.12,
                  right: baseSize * 0.05,
                  boxShadow: "0 0 10px rgba(239, 68, 68, 0.4)",
                  filter: "brightness(1.1)",
                }}
                initial={{ scale: 0 }}
                animate={{ scale: fruitScale }}
                transition={{ delay: 0.3 }}
              />
              {activeProgress > 70 && (
                <motion.div
                  className="absolute rounded-full bg-gradient-to-br from-red-400 to-red-600"
                  style={{
                    width: baseSize * 0.05,
                    height: baseSize * 0.05,
                    bottom: baseSize * 0.24,
                    right: baseSize * 0.1,
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
      </div>

      {/* Key metrics display */}
      <div className="mt-4 grid grid-cols-3 gap-2 w-full max-w-xs text-center">
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400">Materials</span>
          <span className="font-semibold">
            {totalMaterialsSaved ? Math.round(totalMaterialsSaved * 1000) : 0}g
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400">Items</span>
          <span className="font-semibold">{itemsReused || 0}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400">DIYs</span>
          <span className="font-semibold">{projectsCompleted || 0}</span>
        </div>
      </div>

      {/* Roots visualization (for early growth stages) */}
      {activeProgress >= 10 && activeProgress < 40 && (
        <>
          <motion.div
            className="absolute bg-gradient-to-r from-amber-700 to-amber-800 rounded-full"
            style={{
              height: 2,
              width: baseSize * 0.15 * (Math.min(1, (activeProgress - 10) / 20)),
              bottom: 4,
              left: "50%",
              transformOrigin: "left center",
              transform: "rotate(15deg)",
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.1 }}
          />
          <motion.div
            className="absolute bg-gradient-to-l from-amber-700 to-amber-800 rounded-full"
            style={{
              height: 2,
              width: baseSize * 0.12 * (Math.min(1, (activeProgress - 10) / 20)),
              bottom: 3,
              right: "50%",
              transformOrigin: "right center",
              transform: "rotate(-20deg)",
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.2 }}
          />
        </>
      )}


      {/* Progress bar */}
      <div className="w-full max-w-xs mt-4 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
        <motion.div
          className="bg-green-600 h-2.5 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: `${activeProgress}%` }}
          transition={{ duration: 1 }}
        />
      </div>
    </div>
  )
}

