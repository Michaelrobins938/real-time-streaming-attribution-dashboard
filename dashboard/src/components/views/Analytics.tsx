"use client";

import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';
import { TrendingUp, Users, DollarSign, Calendar, Download } from 'lucide-react';
import { motion } from 'framer-motion';

import { StatCard } from '@/components/shared/StatCard';

const RETENTION_DATA = [
    { cohort: 'Jan 22', w0: 100, w1: 85, w2: 78, w3: 75, w4: 72, w5: 70 },
    { cohort: 'Feb 22', w0: 100, w1: 88, w2: 82, w3: 79, w4: 77, w5: null },
    { cohort: 'Mar 22', w0: 100, w1: 82, w2: 75, w3: 72, w4: null, w5: null },
    { cohort: 'Apr 22', w0: 100, w1: 89, w2: 85, w3: null, w4: null, w5: null },
    { cohort: 'May 22', w0: 100, w1: 91, w2: null, w3: null, w4: null, w5: null },
    { cohort: 'Jun 22', w0: 100, w1: null, w2: null, w3: null, w4: null, w5: null },
];

const LTV_DATA = Array.from({ length: 30 }, (_, i) => ({
    day: `D${i + 1}`,
    ltv: Math.log(i + 1) * 25 + Math.random() * 5,
    cac: 45 + Math.random() * 2
}));

export function Analytics() {
    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black italic tracking-tighter uppercase text-white leading-none mb-2">Deep_Dive_Analytics</h2>
                    <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.4em]">Cohort_Analysis & Unit_Economics::Locked</p>
                </div>
                <div className="flex gap-4">
                    <button className="px-6 py-3 bg-white/5 border border-white/10 hover:border-red-600/50 text-[10px] font-black text-zinc-400 hover:text-white uppercase tracking-widest transition-all flex items-center gap-3 active:scale-95">
                        <Download size={14} /> EXPORT_SIGNAL_CSV
                    </button>
                    <button className="px-6 py-3 bg-white/5 border border-white/10 text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-3">
                        <Calendar size={14} /> 30_DAY_WINDOW
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    label="ARPU (Avg Revenue)"
                    value="$42.85"
                    trend="+12.3% YIELD"
                    trendType="up"
                    subValue="PER_ACTIVE_USER"
                    color="#10b981"
                    icon={DollarSign}
                />
                <StatCard
                    label="Total Active Subs"
                    value="1.2M"
                    trend="+5.1% GROWTH"
                    trendType="up"
                    subValue="GLOBAL_REACH"
                    color="#3b82f6"
                    icon={Users}
                />
                <StatCard
                    label="Churn Rate"
                    value="2.1%"
                    trend="-0.3% DECAY"
                    trendType="up"
                    subValue="RETENTION_SCORE"
                    color="#ef4444"
                    icon={TrendingUp}
                />
            </div>

            <div className="grid grid-cols-12 gap-10">
                <div className="col-span-12 lg:col-span-7 bg-black/40 border border-white/5 p-10 rounded-[3rem] backdrop-blur-sm relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-12">
                        <div>
                            <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-2">LTV vs CAC Progression</h3>
                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Inference_Engine::LTV_Prediction_v2</p>
                        </div>
                    </div>

                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={LTV_DATA}>
                                <CartesianGrid strokeDasharray="1 4" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                <XAxis dataKey="day" hide />
                                <YAxis hide domain={[0, 100]} />
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: '#050505', border: '1px solid #1e293b', borderRadius: '12px' }}
                                    itemStyle={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase' }}
                                />
                                <Line type="monotone" dataKey="ltv" stroke="#ef4444" strokeWidth={4} dot={false} animationDuration={2000} />
                                <Line type="monotone" dataKey="cac" stroke="#27272a" strokeWidth={2} strokeDasharray="8 4" dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="flex items-center gap-8 mt-8 border-t border-white/5 pt-8/5 pt-6">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-red-600 rounded-full" />
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">PREDICTED_LTV</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-zinc-800 rounded-full border border-dashed border-white/20" />
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">CAC_CEILING</span>
                        </div>
                    </div>
                </div>

                <div className="col-span-12 lg:col-span-5 bg-black/40 border border-white/5 p-10 rounded-[3rem] backdrop-blur-sm">
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-10">Cohort_Retention</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-[10px] font-mono border-collapse">
                            <thead>
                                <tr className="text-zinc-600 border-b border-white/5">
                                    <th className="py-4 text-left font-black uppercase tracking-widest uppercase">COHORT_ID</th>
                                    <th className="py-4 text-center font-black uppercase tracking-widest uppercase">M0</th>
                                    <th className="py-4 text-center font-black uppercase tracking-widest uppercase">M1</th>
                                    <th className="py-4 text-center font-black uppercase tracking-widest uppercase">M2</th>
                                    <th className="py-4 text-center font-black uppercase tracking-widest uppercase">M3</th>
                                </tr>
                            </thead>
                            <tbody>
                                {RETENTION_DATA.map((row, i) => (
                                    <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                        <td className="py-4 font-black text-zinc-400 group-hover:text-white transition-colors">{row.cohort.toUpperCase().replace(' ', '_')}</td>
                                        {[row.w0, row.w1, row.w2, row.w3].map((val, idx) => (
                                            <td key={idx} className="py-4 text-center">
                                                {val ? (
                                                    <div
                                                        className="inline-block px-3 py-1.5 rounded-sm font-black border border-white/5"
                                                        style={{
                                                            backgroundColor: `rgba(239, 68, 68, ${(val / 100) * 0.4})`,
                                                            color: val > 80 ? '#fff' : '#71717a'
                                                        }}
                                                    >
                                                        {val}%
                                                    </div>
                                                ) : <span className="text-zinc-800">---</span>}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
