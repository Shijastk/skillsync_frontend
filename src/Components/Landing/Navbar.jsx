'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Home, Settings, Bell, User, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const menuItems = [
    {
        icon: <Home className="h-5 w-5" />,
        label: "Home",
        href: "#",
        gradient: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(37,99,235,0.06) 50%, rgba(29,78,216,0) 100%)",
        iconColor: "group-hover:text-blue-500 text-blue-500"
    },
    {
        icon: <Bell className="h-5 w-5" />,
        label: "Notifications",
        href: "#",
        gradient: "radial-gradient(circle, rgba(249,115,22,0.15) 0%, rgba(234,88,12,0.06) 50%, rgba(194,65,12,0) 100%)",
        iconColor: "group-hover:text-orange-500 text-orange-500"
    },
    {
        icon: <Settings className="h-5 w-5" />,
        label: "Settings",
        href: "#",
        gradient: "radial-gradient(circle, rgba(34,197,94,0.15) 0%, rgba(22,163,74,0.06) 50%, rgba(21,128,61,0) 100%)",
        iconColor: "group-hover:text-green-500 text-green-500"
    },
    {
        icon: <User className="h-5 w-5" />,
        label: "Profile",
        href: "#",
        gradient: "radial-gradient(circle, rgba(239,68,68,0.15) 0%, rgba(220,38,38,0.06) 50%, rgba(185,28,28,0) 100%)",
        iconColor: "group-hover:text-red-500 text-red-500"
    }
];

const itemVariants = {
    initial: { rotateX: 0, opacity: 1 },
    hover: { rotateX: -90, opacity: 0 }
};

const backVariants = {
    initial: { rotateX: 90, opacity: 0 },
    hover: { rotateX: 0, opacity: 1 }
};

const glowVariants = {
    initial: { opacity: 0, scale: 0.8 },
    hover: {
        opacity: 1,
        scale: 2,
        transition: {
            opacity: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
            scale: { duration: 0.5, type: "spring", stiffness: 300, damping: 25 }
        }
    }
};

const navGlowVariants = {
    initial: { opacity: 0 },
    hover: {
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1]
        }
    }
};

const sharedTransition = {
    type: "spring",
    stiffness: 100,
    damping: 20,
    duration: 0.5
};

function MenuBar() {
    
    return (
        <motion.nav
            className="p-2 rounded-2xl bg-[#1a1a1a]/80 backdrop-blur-lg border border-white/[0.08] shadow-lg relative overflow-hidden"
            initial="initial"
            whileHover="hover"
        >
            <motion.div
                className="absolute -inset-2 rounded-3xl z-0 pointer-events-none"
                style={{
                    background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(147,51,234,0.15) 50%, rgba(239,68,68,0.15) 100%)"
                }}
                variants={navGlowVariants}
            />
            <ul className="flex items-center gap-2 relative z-10">
                {menuItems.map((item) => (
                    <motion.li key={item.label} className="relative">
                        <motion.div
                            className="block rounded-xl overflow-visible group relative"
                            style={{ perspective: "600px" }}
                            whileHover="hover"
                            initial="initial"
                        >
                            <motion.div
                                className="absolute inset-0 z-0 pointer-events-none rounded-2xl"
                                variants={glowVariants}
                                style={{
                                    background: item.gradient,
                                    opacity: 0
                                }}
                            />
                            <motion.a
                                href={item.href}
                                className="flex items-center gap-2 px-4 py-2 relative z-10 bg-transparent text-gray-400 group-hover:text-white transition-colors rounded-xl"
                                variants={itemVariants}
                                transition={sharedTransition}
                                style={{
                                    transformStyle: "preserve-3d",
                                    transformOrigin: "center bottom"
                                }}
                            >
                                <span className={`transition-colors duration-300 ${item.iconColor}`}>
                                    {item.icon}
                                </span>
                                <span className="font-medium">{item.label}</span>
                            </motion.a>
                            <motion.a
                                href={item.href}
                                className="flex items-center gap-2 px-4 py-2 absolute inset-0 z-10 bg-transparent text-gray-400 group-hover:text-white transition-colors rounded-xl"
                                variants={backVariants}
                                transition={sharedTransition}
                                style={{
                                    transformStyle: "preserve-3d",
                                    transformOrigin: "center top",
                                    transform: "rotateX(90deg)"
                                }}
                            >
                                <span className={`transition-colors duration-300 ${item.iconColor}`}>
                                    {item.icon}
                                </span>
                                <span className="font-medium">{item.label}</span>
                            </motion.a>
                        </motion.div>
                    </motion.li>
                ))}
            </ul>
        </motion.nav>
    );
}

export default function Navbar() {
    const navigate = useNavigate();
    return (
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between w-full px-4 md:px-8 py-6 pointer-events-none">
            {/* Logo */}
            <div className="pointer-events-auto flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/20 group cursor-pointer hover:scale-105 transition-transform duration-300">
                    <Zap className="w-5 h-5 text-white" fill="currentColor" />
                </div>
                <span className="text-xl font-bold text-white tracking-tight cursor-pointer">SkillSwap</span>
            </div>

            {/* Center Menu (Desktop) */}
            {/* <div className="pointer-events-auto hidden md:block absolute left-1/2 top-6 -translate-x-1/2">
                <MenuBar />
            </div> */}

            {/* Auth Buttons */}
            <div className="pointer-events-auto flex items-center gap-6">
                <button className="text-sm font-medium text-white/70 hover:text-white transition-colors" onClick={()=>navigate('/login')}>
                    Sign In
                </button>
                <button className="group relative px-6 py-2.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-gray-100 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95">
                    <span className="relative z-10 flex items-center gap-2" onClick={()=>navigate('/register')}>
                        Sign Up
                    </span>
                </button>
            </div>
        </div>
    );
}