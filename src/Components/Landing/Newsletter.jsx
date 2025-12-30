"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mail, Sparkles, TrendingUp, Users } from "lucide-react";

// Floating shape component for ambient background
function FloatingShape({ className = "", delay = 0, size = 300 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
      animate={{
        opacity: 1,
        scale: 1,
        rotate: 0,
        y: [0, 20, 0]
      }}
      transition={{
        duration: 2,
        delay,
        y: {
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }}
      className={`absolute ${className}`}
      style={{ width: size, height: size }}
    >
      <div className="w-full h-full rounded-full bg-gradient-to-r from-violet-500/10 via-rose-500/10 to-cyan-500/10 blur-3xl" />
    </motion.div>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const Newsletter = () => {
  return (
    <div className="relative font-sans w-full min-h-screen flex items-center justify-center overflow-hidden p-4 bg-[#030303]">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/[0.08] via-transparent to-rose-500/[0.08]" />

      {/* Floating ambient shapes */}
      <FloatingShape className="top-[10%] left-[5%]" delay={0.2} size={400} />
      <FloatingShape className="bottom-[15%] right-[10%]" delay={0.4} size={350} />
      <FloatingShape className="top-[50%] right-[5%]" delay={0.6} size={250} />

      {/* Main content */}
      <motion.div
        className="relative z-10 container mx-auto text-center max-w-4xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.08] border border-white/[0.15] backdrop-blur-sm mb-6"
        >
          <Sparkles className="w-4 h-4 text-violet-300" />
          <span className="text-sm text-white/90 tracking-wide font-medium">Start Your Journey</span>
        </motion.div>

        {/* Headline with gradient text */}
        <motion.h2
          className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight mb-6"
          variants={itemVariants}
        >
          <span className="text-white">
            Ready to swap skills and
          </span>
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-200 via-rose-200 to-cyan-200">
            unlock your potential?
          </span>
        </motion.h2>

        {/* Subheadline */}
        <motion.p
          className="mt-6 text-lg md:text-xl text-white max-w-2xl mx-auto leading-relaxed"
          variants={itemVariants}
        >
          Join our community of skill swappers. Get early access, exclusive features, and be part of the knowledge-sharing revolution.
        </motion.p>

        <motion.form
          className="mt-12 mx-auto w-full max-w-2xl"
          onSubmit={(e) => e.preventDefault()}
          variants={itemVariants}
        >
          <div className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-0 bg-white/10 backdrop-blur-xl p-2 rounded-2xl sm:rounded-full border border-white/20 transition-all duration-300 shadow-[0_8px_32px_0_rgba(139,92,246,0.15)]">

            {/* Input wrapper */}
            <div className="relative flex items-center flex-1">
              {/* Icon */}
              <Mail className="absolute left-4 h-5 w-5 text-violet-300 hidden sm:block pointer-events-none" />

              {/* Input */}
              <input
                type="email"
                placeholder="Enter your email address"
                className="
          w-full
          bg-transparent
          pl-5 sm:pl-12
          pr-5
          py-4
          text-white
          placeholder:text-white/60
          outline-none
          text-center sm:text-left
          rounded-xl sm:rounded-none
        "
                required
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="
        w-full sm:w-auto
        px-8
        py-4
        bg-gradient-to-r from-violet-500 to-rose-500
        text-white font-semibold
        rounded-xl sm:rounded-full
        transition-all duration-300
        shadow-lg shadow-violet-500/30
        hover:shadow-violet-500/50
        hover:scale-[1.02]
        active:scale-[0.97]
      "
            >
              Get Notified
            </button>
          </div>

          {/* Privacy note */}
          <p className="mt-3 text-sm text-white/80 text-center">
            No spam, unsubscribe anytime. We respect your privacy.
          </p>
        </motion.form>


        {/* Feature highlights */}
        <motion.div
          className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto"
          variants={containerVariants}
        >
          {[
            { icon: Sparkles, text: "Exclusive early access", color: "violet" },
            { icon: TrendingUp, text: "Premium features", color: "rose" },
            { icon: Users, text: "Vibrant community", color: "cyan" },
          ].map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.05] border border-white/[0.12] hover:bg-white/[0.08] hover:border-white/[0.18] transition-all duration-300 group"
            >
              <div className={`p-2 rounded-lg bg-${item.color}-500/15 border border-${item.color}-500/30 group-hover:bg-${item.color}-500/20 transition-colors`}>
                <item.icon className={`w-5 h-5 text-${item.color}-300`} />
              </div>
              <span className="text-white text-base font-medium">{item.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#030303] to-transparent pointer-events-none" />
    </div>
  );
};

export default function NewsletterSection() {
  return <Newsletter />;
}
