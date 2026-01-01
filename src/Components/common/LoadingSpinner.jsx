import React from 'react';
import { motion } from 'framer-motion';

/**
 * Premium Loading Spinner Component
 * A sleek, animated loader with a double-ring effect and pulsing center.
 */
const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white/50 backdrop-blur-sm">
        <div className="relative flex items-center justify-center">
            {/* Outer Spinning Ring */}
            <motion.div
                className="w-16 h-16 border-4 border-gray-100 border-t-black rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />

            {/* Inner Counter-Spinning Ring */}
            <motion.div
                className="absolute w-10 h-10 border-4 border-gray-100 border-b-gray-400 rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />

            {/* Central Pulsing Dot */}
            <motion.div
                className="absolute w-2 h-2 bg-black rounded-full"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
            />
        </div>

        {/* Loading Text */}
        <motion.p
            className="mt-6 text-xs font-semibold text-gray-400 tracking-[0.2em] uppercase"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
            Loading SkillSwap
        </motion.p>
    </div>
);

export default LoadingSpinner;
