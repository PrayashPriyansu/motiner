"use client"

import { motion } from "motion/react"

export function TestMotion() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="p-4 bg-blue-500 text-white rounded-lg"
    >
      Motion is working! 🎉
    </motion.div>
  )
}