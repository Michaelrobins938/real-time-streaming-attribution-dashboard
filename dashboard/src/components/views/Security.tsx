"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Shield, Lock, Globe, Terminal, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LOG_TYPES = ['INFO', 'WARN', 'AUTH', 'CRITICAL'];
const LOG_MESSAGES = [
    "Handshake established with 192.168.1.45",
    "Token validated for user_id: 88291",
    "Rate limit warning: API/v2/ingest",
    "Encryption key rotation scheduled",
    "Anomaly detected in eu-central-1",
    "Firewall blocked connection from 82.11.22.3",
    "Global policy update received",
];

export function Security() {
    const [logs, setLogs] = useState<string[]>([]);
    const logEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            const type = LOG_TYPES[Math.floor(Math.random() * LOG_TYPES.length)];
            const msg = LOG_MESSAGES[Math.floor(Math.random() * LOG_MESSAGES.length)];
            const time = new Date().toISOString().split('T')[1].split('.')[0];
            const newLog = `[${time}] [${type}] ${msg}`;

            setLogs(prev => [...prev.slice(-25), newLog]);
        }, 1500);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black italic tracking-tighter uppercase text-white leading-none mb-2">Security_Ops</h2>
                    <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.4em]">Threat_Detection & Access_Control::Shield_Active</p>
                </div>
                <div className="flex items-center gap-4 px-8 py-4 bg-emerald-500 text-black font-black text-xs uppercase tracking-widest clip-tactical animate-pulse shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                    <Shield size={18} />
                    SYSTEM_INTEGRITY::NOMINAL
                </div>
            </div>

            <div className="grid grid-cols-12 gap-10">
                <div className="col-span-12 lg:col-span-8 bg-black/40 border border-white/5 p-10 rounded-[3rem] backdrop-blur-sm">
                    <div className="flex items-center gap-4 mb-10 text-zinc-600 border-b border-white/5 pb-6">
                        <Terminal size={18} className="text-red-600" />
                        <span className="text-xs font-black uppercase tracking-[0.3em]">LIVE_AUDIT_STREAM</span>
                    </div>
                    <div className="h-[500px] overflow-hidden relative font-mono text-[10px] bg-black/20 p-6 rounded-2xl border border-white/5">
                        <div className="absolute inset-0 p-8 flex flex-col justify-end space-y-2">
                            <AnimatePresence>
                                {logs.map((log, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={`truncate flex gap-4 ${log.includes('CRITICAL') ? 'text-red-500 font-bold' : log.includes('WARN') ? 'text-amber-500' : 'text-zinc-500'}`}
                                    >
                                        <span className="text-zinc-800">{'>'}{'>'}{'>'}</span>
                                        {log}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            <div ref={logEndRef} />
                        </div>
                    </div>
                </div>

                <div className="col-span-12 lg:col-span-4 space-y-10">
                    <div className="bg-black/40 border border-white/5 p-10 rounded-[2.5rem] backdrop-blur-sm group">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-2 bg-blue-600/10 rounded-lg group-hover:rotate-12 transition-transform">
                                <Globe className="text-blue-500" size={24} />
                            </div>
                            <h3 className="text-xl font-black italic uppercase tracking-widest text-white italic">Active_Symmetry</h3>
                        </div>
                        <div className="space-y-6">
                            {['US-EAST-1', 'EU-WEST-2', 'AP-SOUTH-1'].map(region => (
                                <div key={region} className="space-y-2">
                                    <div className="flex justify-between items-center text-[9px] font-black tracking-widest text-zinc-600">
                                        <span>{region}</span>
                                        <span className="text-zinc-400">READY</span>
                                    </div>
                                    <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${60 + Math.random() * 40}%` }}
                                            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                                            className="h-full bg-blue-600"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-black/40 border border-white/5 p-10 rounded-[2.5rem] backdrop-blur-sm group">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-2 bg-emerald-500/10 rounded-lg group-hover:rotate-12 transition-transform">
                                <Lock className="text-emerald-500" size={24} />
                            </div>
                            <h3 className="text-xl font-black italic uppercase tracking-widest text-white italic">Auth_Compliance</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-black/40 p-6 border border-white/5 rounded-2xl group-hover:border-emerald-500/30 transition-all">
                                <div className="text-[10px] font-black text-zinc-700 uppercase mb-2 tracking-widest">MFA_DENSITY</div>
                                <div className="text-3xl font-black text-white italic tracking-tighter">98.2%</div>
                            </div>
                            <div className="bg-black/40 p-6 border border-white/5 rounded-2xl group-hover:border-red-500/30 transition-all">
                                <div className="text-[10px] font-black text-zinc-700 uppercase mb-2 tracking-widest">FAIL_INDEX</div>
                                <div className="text-3xl font-black text-white italic tracking-tighter">0.01%</div>
                            </div>
                        </div>

                        <div className="mt-8 border-t border-white/5 pt-8/5 pt-6">
                            <div className="flex items-center gap-4">
                                <Activity size={16} className="text-zinc-700 animate-pulse" />
                                <span className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.4em]">VALIDATING_SESSION_KEYS...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
