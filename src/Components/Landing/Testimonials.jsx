"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
    {
        name: "Sarah Chen",
        role: "Graphic Designer",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
        content: "I learned Spanish from Maria while teaching her design. SkillSwap changed my life! The connections I've made are invaluable.",
        rating: 5,
        skills: "Design ↔ Spanish",
    },
    {
        name: "Marcus Johnson",
        role: "Software Developer",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
        content: "Traded my coding skills for guitar lessons. Best decision ever! The platform makes it so easy to find the perfect match.",
        rating: 5,
        skills: "Coding ↔ Guitar",
    },
    {
        name: "Priya Patel",
        role: "Yoga Instructor",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
        content: "Taught yoga, learned photography. The community is amazing and supportive. I've made friends from around the world!",
        rating: 5,
        skills: "Yoga ↔ Photography",
    },
];

const Testimonials = () => {
    return (
        <section className="relative w-full min-h-screen bg-[#030303] py-20 px-4 overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/[0.05] via-transparent to-rose-500/[0.05]" />
            <div className="absolute top-1/3 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

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
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="text-sm text-white/90 tracking-wide font-medium">Success Stories</span>
                    </div>

                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                        <span className="text-white">Loved by</span>{" "}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-200 via-rose-200 to-cyan-200">
                            skill swappers
                        </span>
                    </h2>

                    <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
                        See what our community members are saying about their SkillSwap experiences.
                    </p>
                </motion.div>

                {/* Testimonials grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -8 }}
                            className="relative group"
                        >
                            {/* Card */}
                            <div className="relative bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 hover:bg-white/[0.05] hover:border-white/[0.15] transition-all duration-300 backdrop-blur-sm h-full flex flex-col">
                                {/* Quote icon */}
                                <div className="absolute top-6 right-6 opacity-10">
                                    <Quote className="w-16 h-16 text-white" />
                                </div>

                                {/* Rating */}
                                <div className="flex gap-1 mb-6">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                                    ))}
                                </div>

                                {/* Content */}
                                <p className="text-white/90 text-lg leading-relaxed mb-6 flex-grow">
                                    "{testimonial.content}"
                                </p>

                                {/* Skills exchanged */}
                                <div className="mb-6">
                                    <div className="inline-flex px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20">
                                        <span className="text-sm text-violet-300 font-medium">{testimonial.skills}</span>
                                    </div>
                                </div>

                                {/* Author */}
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-white/10">
                                            <img
                                                src={testimonial.image}
                                                alt={testimonial.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-violet-500 to-rose-500 rounded-full border-2 border-[#030303]" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-semibold">{testimonial.name}</h4>
                                        <p className="text-white/60 text-sm">{testimonial.role}</p>
                                    </div>
                                </div>

                                {/* Hover gradient */}
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/0 to-rose-500/0 group-hover:from-violet-500/5 group-hover:to-rose-500/5 transition-all duration-300 pointer-events-none" />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
                >
                    {[
                        { number: "10,000+", label: "Active Users" },
                        { number: "50,000+", label: "Skills Swapped" },
                        { number: "95%", label: "Satisfaction Rate" },
                        { number: "150+", label: "Countries" },
                    ].map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-200 to-rose-200 mb-2">
                                {stat.number}
                            </div>
                            <div className="text-white/70">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Testimonials;
