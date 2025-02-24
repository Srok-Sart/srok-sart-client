"use client"

import { motion } from "framer-motion"

export const PlantGrow = () => {
  const materialAmount = 1000; // Example value, should replace with the total weight
  const maxMaterial = 1000;
  const progress = Math.min(100, (materialAmount / maxMaterial) * 100);

  const treeHeight = Math.min(160, progress * 1.6);
  const trunkWidth = Math.min(14, Math.max(6, progress / 6));
  const leafScale = Math.min(1, Math.max(0, (progress - 20) / 60));

  const diyMaterials = [
    { name: "Plastic Bottles", amount: 50 },
    { name: "Cardboard", amount: 30 },
    { name: "Glass Jars", amount: 20 },
    { name: "Tin Cans", amount: 15 },
  ];

  return (
    <div className="w-full min-h-[400px] p-4 flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-center gap-8">
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <div className="relative w-full max-w-[300px] aspect-square flex items-end justify-center mb-8">
            <div
              className="absolute bottom-0 w-32 h-3 bg-amber-900/20 rounded-full"
              style={{ transform: `scale(${Math.min(1, progress / 20)})` }}
            />
            <motion.div
              className="absolute bottom-0 bg-amber-800 rounded-t-lg origin-bottom"
              style={{
                width: trunkWidth,
                height: treeHeight,
                scale: progress > 5 ? 1 : 0,
              }}
              animate={{ height: treeHeight, width: trunkWidth }}
              transition={{ type: "spring", stiffness: 70, damping: 15 }}
            >
              <motion.div
                className="absolute -left-20 -right-20 bottom-[60%] flex items-center justify-center"
                style={{ scale: leafScale }}
                animate={{ scale: leafScale }}
                transition={{ type: "spring", stiffness: 70, damping: 15 }}
              >
                <div className="absolute bottom-0 w-40 h-32 rounded-full bg-green-600" />
                <div className="absolute bottom-8 w-36 h-32 rounded-full bg-green-500" />
                <div className="absolute bottom-16 w-32 h-32 rounded-full bg-green-400" />
              </motion.div>
            </motion.div>
          </div>
          <div className="flex flex-col items-center gap-4 mb-4">
            <p className="text-lg font-semibold text-gray-800">
              Total Materials: {materialAmount} / {maxMaterial}
            </p>
          </div>
          <div className="text-sm text-gray-600">
            Growth Progress: {progress.toFixed(1)}%
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <h2 className="text-xl font-semibold mb-4 text-center md:text-left text-gray-800">DIY Materials Saved</h2>
          <div className="space-y-4">
            {diyMaterials.map((material, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{material.name}</span>
                <div className="flex-1 mx-4">
                  <div className="h-2 bg-gray-200 rounded-full">
                    <motion.div
                      className="h-full bg-[#6437A0] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(material.amount / materialAmount) * 100}%` }}
                      transition={{ duration: 1, ease: "easeInOut" }}
                    />
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-700">{material.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
