"use client";

import { motion } from "framer-motion";
import { Search, UserPlus, MessageCircle, CheckCircle } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Find Your Match",
    description: "Browse skills you want to learn and find people who want to learn what you know.",
    color: "violet",
  },
  {
    number: "02",
    icon: UserPlus,
    title: "Connect & Agree",
    description: "Send a swap request and agree on the skills you'll exchange and schedule.",
    color: "rose",
  },
  {
    number: "03",
    icon: MessageCircle,
    title: "Start Learning",
    description: "Meet virtually or in-person, share your knowledge, and learn something new.",
    color: "cyan",
  },
  {
    number: "04",
    icon: CheckCircle,
    title: "Rate & Repeat",
    description: "Rate your experience, build your reputation, and continue swapping skills.",
    color: "amber",
  },
];

const HowItWorks = () => {
  return (
    <section className="relative w-full min-h-screen bg-gradient-to-b from-[#030303] via-[#0a0a0a] to-[#030303] py-20 px-4 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto max-w-7xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.1] backdrop-blur-sm mb-6">
            <CheckCircle className="w-4 h-4 text-rose-400" />
            <span className="text-sm text-white/90 tracking-wide font-medium">Simple Process</span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white">How</span>{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-200 via-rose-200 to-cyan-200">
              SkillSwap Works
            </span>
          </h2>

          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            Start swapping skills in four simple steps. It's easy, free, and rewarding.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              {/* Connecting line (hidden on mobile, shown on desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-white/20 to-transparent -translate-x-1/2 z-0" />
              )}

              {/* Card */}
              <div className="relative bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 hover:bg-white/[0.05] hover:border-white/[0.15] transition-all duration-300 backdrop-blur-sm h-full">
                {/* Number */}
                <div className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white/20 to-white/5 mb-4">
                  {step.number}
                </div>

                {/* Icon */}
                {/* <div className={`inline-flex p-3 rounded-xl bg-${step.color}-500/10 border border-${step.color}-500/20 mb-6`}>
                  <step.icon className={`w-6 h-6 text-${step.color}-300`} />
                </div> */}

                {/* Content */}
                <h3 className="text-2xl font-bold text-white mb-4">
                  {step.title}
                </h3>
                <p className="text-white/70 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <button className="px-8 py-4 bg-gradient-to-r from-violet-500 to-rose-500 text-white font-semibold rounded-xl hover:from-violet-600 hover:to-rose-600 transition-all duration-300 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-105">
            Start Swapping Skills
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
