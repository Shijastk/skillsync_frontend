"use client";

import { motion } from "framer-motion";
import { Users, BookOpen, Award, Zap, Globe, Shield } from "lucide-react";

const features = [
    {
        icon: Users,
        title: "Connect with Learners",
        description: "Find people who want to learn your skills and teach you theirs. Build meaningful connections.",
        color: "violet",
    },
    {
        icon: BookOpen,
        title: "Skill Exchange",
        description: "Trade your expertise for new knowledge. No money involved, just pure skill sharing.",
        color: "violet",
    },
    {
        icon: Award,
        title: "Verified Skills",
        description: "Showcase your verified skills and build credibility within the community.",
        color: "violet",
    },
    {
        icon: Zap,
        title: "Instant Matching",
        description: "Our smart algorithm matches you with the perfect skill exchange partners instantly.",
        color: "violet",
    },
    {
        icon: Globe,
        title: "Global Community",
        description: "Connect with skill swappers from around the world. Learn languages, coding, art, and more.",
        color: "violet",
    },
    {
        icon: Shield,
        title: "Safe & Secure",
        description: "Verified profiles, secure messaging, and community guidelines ensure a safe experience.",
        color: "violet",
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.5,
        },
    },
};

const Features = () => {
    return (
        <section className="relative w-full min-h-screen bg-[#030303] py-20 px-4 overflow-hidden">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-500/[0.03] to-transparent" />

            {/* Floating shapes */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl" />

            <div className="relative z-10 container mx-auto max-w-7xl">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.1] backdrop-blur-sm mb-6">
                        <Zap className="w-4 h-4 text-violet-400" />
                        <span className="text-sm text-white/90 tracking-wide font-medium">Why SkillSwap</span>
                    </div>

                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                        <span className="text-white">Everything you need to</span>
                        <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-200 via-rose-200 to-cyan-200">
                            swap skills effortlessly
                        </span>
                    </h2>

                    <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto">
                        Join thousands of learners exchanging skills, building connections, and growing together.
                    </p>
                </motion.div>

                {/* Features grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            whileHover={{ y: -8, transition: { duration: 0.2 } }}
                            className="group relative p-8 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05] hover:border-white/[0.15] transition-all duration-300 backdrop-blur-sm"
                        >
                            {/* Icon */}
                            <div className={`inline-flex p-3 rounded-xl bg-${feature.color}-500/10 border border-${feature.color}-500/20 mb-6 group-hover:bg-${feature.color}-500/15 transition-colors`}>
                                <feature.icon className={`w-6 h-6 text-${feature.color}-300`} />
                            </div>

                            {/* Content */}
                            <h3 className="text-xl font-semibold text-white mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-white/70 leading-relaxed">
                                {feature.description}
                            </p>

                            {/* Hover effect */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/0 to-rose-500/0 group-hover:from-violet-500/5 group-hover:to-rose-500/5 transition-all duration-300 pointer-events-none" />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Features;
