"use client";

import React, { useState, useEffect } from 'react';
import {
    Activity, BarChart3, LayoutDashboard, Settings, Target, Shield, Radio
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { Tooltip } from '@/components/shared/Tooltip';
import { UserAvatar } from '../components/UserAvatar';

// Views
import { Overview } from '../components/views/Overview';
import { Analytics } from '../components/views/Analytics';
import { Campaigns } from '../components/views/Campaigns';
import { Security } from '../components/views/Security';
import { Settings as SettingsView } from '../components/views/Settings';

export default function Dashboard() {
    const [activeView, setActiveView] = useState('overview');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleNavClick = (view: string) => {
        setActiveView(view);
    };

    if (!mounted) return <div className="min-h-screen bg-[#050506]" />;

    return (
        <div className="min-h-screen bg-[#050506] text-white font-mono selection:bg-red-600/30">
            {/* Ambient Background Grid */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
                style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
            />
            <div className="scan-line" />

            {/* Sidebar Overlay */}
            <aside className="fixed left-0 top-0 bottom-0 w-28 bg-zinc-900/20 backdrop-blur-xl border-r border-white/5 flex flex-col items-center py-10 z-50">
                <div className="mb-14 relative group">
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 180 }}
                        className="w-16 h-16 bg-red-600 flex items-center justify-center rounded-sm shadow-[0_0_30px_rgba(229,9,20,0.2)]"
                    >
                        <Radio size={32} className="text-white" />
                    </motion.div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                </div>

                <nav className="flex flex-col gap-6 flex-1">
                    {[
                        { id: 'overview', icon: LayoutDashboard, label: 'Control_Center' },
                        { id: 'analytics', icon: BarChart3, label: 'Heuristics' },
                        { id: 'campaigns', icon: Target, label: 'Deployment' },
                        { id: 'security', icon: Shield, label: 'Integrity' }
                    ].map((item) => (
                        <Tooltip key={item.id} content={item.label}>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleNavClick(item.id)}
                                className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ${activeView === item.id ? 'bg-red-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}
                            >
                                <item.icon size={22} />
                            </motion.button>
                        </Tooltip>
                    ))}

                    <div className="flex-1" />

                    <Tooltip content="System_Config">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            onClick={() => handleNavClick('settings')}
                            className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ${activeView === 'settings' ? 'bg-red-600 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            <Settings size={22} />
                        </motion.button>
                    </Tooltip>
                </nav>

                <div className="mt-10 px-4 w-full">
                    <div className="bg-black/40 border border-white/5 rounded-lg p-3 text-center">
                        <div className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Status</div>
                        <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">LIVE_NODE</div>
                    </div>
                </div>
            </aside>

            <main className="ml-28 p-12 min-h-screen relative z-10">
                <header className="flex justify-between items-end mb-20">
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="px-4 py-1.5 bg-red-600 text-white text-[10px] font-black tracking-widest uppercase clip-tactical">
                                ARTEMIS_CORE_v4.2
                            </div>
                            <div className="h-px w-24 bg-gradient-to-r from-red-600/50 to-transparent" />
                            <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.4em] flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
                                STREAM_AVAILABILITY::MAX
                            </span>
                        </div>
                        <h1 className="text-9xl font-black italic tracking-tighter uppercase leading-[0.75] text-white">
                            STREAMING <br />
                            <span className="text-red-600 underline decoration-red-600/20 underline-offset-8">ENGINE</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="text-right">
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1 block italic">Operator_Terminal</span>
                            <div className="text-xl font-black text-white italic tracking-tighter uppercase underline decoration-zinc-800 underline-offset-4">AGENT_7719</div>
                        </div>
                        <div className="w-14 h-14 bg-zinc-900 border border-white/10 p-1 rounded-sm shadow-xl">
                            <UserAvatar />
                        </div>
                    </div>
                </header>

                <div className="max-w-[1600px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeView}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4, ease: "circOut" }}
                        >
                            {activeView === 'overview' && <Overview isPaused={false} setIsPaused={() => { }} />}
                            {activeView === 'analytics' && <Analytics />}
                            {activeView === 'campaigns' && <Campaigns />}
                            {activeView === 'security' && <Security />}
                            {activeView === 'settings' && <SettingsView />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            <footer className="ml-28 p-12 border-t border-white/5 bg-zinc-900/10 mt-20">
                <div className="flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex items-center gap-12">
                        <div className="flex items-center gap-4">
                            <div className="w-2 h-2 rounded-full bg-red-600 shadow-[0_0_10px_#ef4444]" />
                            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.5em]">SYSTEM_INGEST_ACTIVE</span>
                        </div>
                        <div className="h-4 w-px bg-zinc-800" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-700 italic">UPTIME: 14:02:44:12</span>
                    </div>
                    <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-800">
                        <span className="cursor-pointer hover:text-white transition-all tracking-widest">ARTEMIS_PROTOCOLS</span>
                        <span className="cursor-pointer hover:text-white transition-all tracking-widest">GEO_RELIABILITY</span>
                        <span className="cursor-pointer hover:text-white transition-all tracking-widest">API_SHELL</span>
                    </div>
                    <div className="text-[10px] font-black text-zinc-950 uppercase tracking-[1em] italic">MAR_SCI_ENGINEERING_PRM</div>
                </div>
            </footer>
        </div>
    );
}
