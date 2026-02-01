"use client";

import React, { useState } from 'react';
import { Save, Lock, Database, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export function Settings() {
    const [settings, setSettings] = useState({
        notifications: true,
        autoArchiving: false,
        debugMode: true,
        retentionDays: 90,
        apiKey: 'sk_live_x5529_artemis_kernel'
    });

    return (
        <div className="space-y-12 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-white/5 pb-8">
                <div>
                    <h2 className="text-4xl font-black italic tracking-tighter uppercase text-white leading-none mb-2">System_Config</h2>
                    <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.4em]">Global_Parameters & Secure_Keys::Operator_Access</p>
                </div>
                <button className="px-10 py-4 bg-white text-black font-black uppercase tracking-[0.2em] hover:bg-red-600 hover:text-white transition-all flex items-center gap-3 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.05)] text-xs">
                    <Save size={18} /> SAVE_MANIFEST
                </button>
            </div>

            <div className="grid grid-cols-1 gap-10">
                <div className="bg-black/40 border border-white/5 p-10 rounded-[3rem] backdrop-blur-sm group">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="p-3 bg-red-600/10 rounded-xl">
                            <Database className="text-red-500" size={28} />
                        </div>
                        <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">Data_Persistence</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-zinc-700 uppercase tracking-widest block">RETENTION_PERIOD (TICK_DAYS)</label>
                            <input
                                type="number"
                                className="w-full bg-zinc-950/50 border border-white/5 p-4 text-white font-black font-mono focus:border-red-600/50 outline-none transition-all rounded-xl text-lg italic tracking-tighter"
                                value={settings.retentionDays}
                                onChange={(e) => setSettings({ ...settings, retentionDays: parseInt(e.target.value) })}
                            />
                            <p className="text-[9px] text-zinc-800 font-black uppercase tracking-widest italic">Warning: Values over 365 requires S3 glacier scaling.</p>
                        </div>

                        <div className="flex items-center justify-between bg-black/40 p-8 border border-white/5 rounded-[2rem] hover:border-red-600/20 transition-all group/toggle">
                            <div>
                                <span className="text-xs font-black text-white italic uppercase tracking-wider block mb-1">AUTO_ARCHIVING</span>
                                <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest italic">HEURISTIC_BACKUP_PROTOCOL</span>
                            </div>
                            <div
                                onClick={() => setSettings(prev => ({ ...prev, autoArchiving: !prev.autoArchiving }))}
                                className={`w-16 h-8 rounded-full p-1.5 cursor-pointer transition-all ${settings.autoArchiving ? 'bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'bg-zinc-900 border border-white/5'}`}
                            >
                                <motion.div
                                    animate={{ x: settings.autoArchiving ? 32 : 0 }}
                                    className="w-5 h-5 bg-white rounded-full shadow-lg"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-black/40 border border-white/5 p-10 rounded-[3rem] backdrop-blur-sm group">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="p-3 bg-emerald-500/10 rounded-xl">
                            <Lock className="text-emerald-500" size={28} />
                        </div>
                        <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">API_Integrity</h3>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-zinc-700 uppercase tracking-widest block">SECRET_KERNEL_KEY</label>
                            <div className="flex gap-6">
                                <input
                                    type="password"
                                    className="flex-1 bg-zinc-950/50 border border-white/5 p-4 text-zinc-500 font-black font-mono rounded-xl italic tracking-tighter"
                                    value={settings.apiKey}
                                    readOnly
                                />
                                <button className="px-8 py-4 bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:border-red-600/50 uppercase text-[10px] font-black transition-all flex items-center gap-3 active:scale-95 rounded-xl">
                                    <RefreshCw size={14} /> REGENERATE
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                            {[
                                { label: 'TLS_STATUS', val: '1.3_ENFORCED', col: 'text-emerald-500' },
                                { label: 'ACCESS_LEVEL', val: 'SUDO_OPERATOR', col: 'text-red-500' },
                                { label: 'LAST_ROTATION', val: '22_HOURS_AGO', col: 'text-zinc-500' }
                            ].map((item, i) => (
                                <div key={i} className="bg-black/40 p-6 border border-white/5 rounded-2xl">
                                    <div className="text-[8px] font-black text-zinc-700 uppercase mb-2 tracking-widest">{item.label}</div>
                                    <div className={`text-xs font-black italic tracking-tighter uppercase ${item.col}`}>{item.val}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
