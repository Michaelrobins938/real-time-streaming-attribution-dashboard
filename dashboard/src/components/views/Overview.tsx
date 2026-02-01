"use client";

import React, { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    AreaChart, Area, Cell, PieChart, Pie
} from 'recharts';
import {
    Activity, Zap, Shield, Users, Info, Target, Plus, Download
} from 'lucide-react';
import { motion } from 'framer-motion';

import { StatCard } from '@/components/shared/StatCard';
import { InfoPanel } from '@/components/shared/InfoPanel';
import { Tooltip } from '@/components/shared/Tooltip';

// --- Types ---
interface WebSocketData {
    attribution?: Record<string, number>;
    events_sec?: number;
    health?: {
        fill_rate: number;
        ctr: number;
        conversion_rate: number;
        frequency_avg: number;
    };
}

// --- Mock Data ---
const INITIAL_ATTRIBUTION = [
    { name: 'Search', value: 25, color: '#E50914' },
    { name: 'Social', value: 35, color: '#B81D24' },
    { name: 'Display', value: 20, color: '#221F1F' },
    { name: 'Email', value: 20, color: '#F5F5F1' },
];

const INITIAL_TIMELINE = Array.from({ length: 20 }, (_, i) => ({
    time: `${i}:00`,
    Search: 20 + Math.random() * 10,
    Social: 30 + Math.random() * 15,
    Display: 15 + Math.random() * 5,
    Email: 18 + Math.random() * 7,
}));

export function Overview({ isPaused }: { isPaused: boolean, setIsPaused: (v: boolean) => void }) {
    const [attribution, setAttribution] = useState(INITIAL_ATTRIBUTION);
    const [timeline] = useState(INITIAL_TIMELINE);
    const [eventsSec, setEventsSec] = useState(208333);
    const [health, setHealth] = useState({ fillRate: 94.2, ctr: 2.35, convRate: 5.1, freq: 2.1 });
    const [activeKernelLog, setActiveKernelLog] = useState(0);

    const kernelLogs = [
        { id: 1, time: '14:22:01', event: 'Logic_Rebalance', details: 'Adjusting Search weight by +0.12% based on cross-device link in Chicago cluster.', impact: 'Neutralizing last-touch bias.' },
        { id: 2, time: '14:22:45', event: 'IVT_Filter_Active', details: 'Filtering 842 anomalous sessions from SOMA_DATACENTER_04.', impact: 'Protecting attribution integrity.' },
        { id: 3, time: '14:23:12', event: 'Model_Sync_Complete', details: 'Artemis System v4.2.1 synchronized across all global regions.', impact: 'Ensuring consistent attribution scoring.' }
    ];

    // Simulation Logic
    useEffect(() => {
        const interval = setInterval(() => {
            if (isPaused) return;
            setEventsSec(prev => Math.floor(prev + (Math.random() - 0.5) * 5000));
            setAttribution(prev => {
                const jittered = prev.map(item => ({
                    ...item,
                    value: Math.max(5, Math.min(60, item.value + (Math.random() - 0.5) * 5))
                }));
                const total = jittered.reduce((sum, item) => sum + item.value, 0);
                return jittered.map(item => ({ ...item, value: (item.value / total) * 100 }));
            });
            setHealth(prev => ({
                ...prev,
                fillRate: Math.min(100, Math.max(80, prev.fillRate + (Math.random() - 0.5)))
            }));
        }, 3000);
        return () => clearInterval(interval);
    }, [isPaused]);

    return (
        <div className="space-y-12">
            {/* Header / Info Section */}
            <div className="bg-black/40 border border-white/5 p-8 rounded-3xl backdrop-blur-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 text-red-600 transition-opacity group-hover:opacity-10 pointer-events-none">
                    <Activity size={200} />
                </div>
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-2 bg-red-600/10 rounded-lg group-hover:rotate-12 transition-transform">
                        <Info size={18} className="text-red-500" />
                    </div>
                    <h4 className="text-[12px] font-black uppercase tracking-[0.3em] text-white italic">Real-Time_Heuristics</h4>
                </div>
                <p className="text-sm text-zinc-400 font-medium leading-relaxed mb-8 uppercase tracking-tight max-w-3xl">
                    Artemis streaming engine processing <span className="text-white italic">pico-second attribution signals</span> across global distributed nodes.
                    Utilizing Shapley-based removal effects for deterministic channel valuation.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoPanel
                        title="Shapley_Vector_Calibrator"
                        description="Calculates marginal contribution across 1B+ daily journeys."
                        details="Removal effect methodology ensuring zero-sum credit allocation across concurrent channels."
                        useCase="Used to detect credit inflation in social and search remarketing."
                        technical="Rust-based streaming kernels with sub-10ms P99 latency."
                    />
                    <InfoPanel
                        title="IVT_Shield_Detection"
                        description="Invalid traffic filtering at the ingestion edge."
                        details="Behavioral profiling identifying non-human engagement patterns based on mouse-jitter and timing."
                        useCase="Protects CPA metrics from data-center originating fraudulent pings."
                        technical="XGBoost Classifier deployed to AWS Lambda@Edge nodes."
                    />
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="Streaming Throughput"
                    value={`${(eventsSec / 1000).toFixed(0)}K`}
                    trend="+12.4% CAP"
                    trendType="up"
                    subValue="EVENTS / SEC"
                    color="#ef4444"
                    icon={Zap}
                />
                <StatCard
                    label="Pipeline Health"
                    value={`${health.fillRate.toFixed(1)}%`}
                    trend="OPTIMAL_SYNC"
                    trendType="up"
                    subValue="DATA CONSISTENCY"
                    color="#4b5563"
                    icon={Activity}
                />
                <StatCard
                    label="Causal Confidence"
                    value="89.4%"
                    trend="+5.2% ACC"
                    trendType="up"
                    subValue="SHAPLEY VARIANCE"
                    color="#b91c1c"
                    icon={Shield}
                />
                <StatCard
                    label="Active Sessions"
                    value="432K"
                    trend="+8.1% VOL"
                    trendType="up"
                    subValue="30M TICK WINDOW"
                    color="#71717a"
                    icon={Users}
                />
            </div>

            <div className="grid grid-cols-12 gap-10">
                {/* Main Distribution Chart */}
                <div className="col-span-12 lg:col-span-8 bg-black/40 border border-white/5 p-12 rounded-[3rem] relative overflow-hidden group backdrop-blur-sm">
                    <div className="flex justify-between items-end mb-16">
                        <div>
                            <h3 className="text-4xl font-black italic uppercase tracking-tighter leading-none mb-2">Live Attribution Vector</h3>
                            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em]">Removal_Effects::Sub_Second_Calib</p>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="px-5 py-2.5 bg-red-600/10 border border-red-600/30 rounded-xl flex items-center gap-3">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-[0_0_15px_#ef4444] animate-pulse" />
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">LIVE_ENGINE</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-[450px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={attribution} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="1 4" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#3f3f46', fontSize: 10, fontWeight: 900 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#3f3f46', fontSize: 10, fontWeight: 900 }} dx={-10} />
                                <RechartsTooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                    contentStyle={{ backgroundColor: '#050505', border: '1px solid #1e293b', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase' }}
                                />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={60}>
                                    {attribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Sidebar: Kernel Log */}
                <div className="col-span-12 lg:col-span-4 space-y-8">
                    <div className="bg-black/40 border border-white/5 p-10 rounded-[2.5rem] backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-4">
                                <Terminal size={22} className="text-red-600" />
                                <h3 className="text-xl font-black italic uppercase tracking-widest text-zinc-400">Artemis_Log</h3>
                            </div>
                            <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">Kernel_v4.2</span>
                        </div>

                        <div className="space-y-6">
                            {kernelLogs.map((log, i) => (
                                <motion.div
                                    key={log.id}
                                    onMouseEnter={() => setActiveKernelLog(i)}
                                    className={`p-6 rounded-2xl border transition-all cursor-pointer ${activeKernelLog === i ? 'bg-red-600/10 border-red-600/40 shadow-xl shadow-red-900/10 scale-[1.02]' : 'bg-black/40 border-white/5 opacity-50'}`}
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] font-black text-white uppercase tracking-tighter">{log.event}</span>
                                        <span className="text-[8px] font-bold text-zinc-600">[{log.time}]</span>
                                    </div>
                                    <p className="text-[11px] text-zinc-400 font-bold mb-3 leading-tight">{log.details}</p>
                                    {activeKernelLog === i && (
                                        <div className="border-t border-red-600/20 pt-3 mt-3 flex items-center justify-between">
                                            <span className="text-[8px] font-black text-red-500 uppercase flex items-center gap-2">
                                                <Target size={10} /> IMPACT: {log.impact}
                                            </span>
                                            <Plus size={10} className="text-red-950" />
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>

                        <button className="w-full mt-12 py-5 bg-red-600 text-white rounded-xl font-black italic uppercase tracking-widest text-xs hover:bg-red-500 transition-all flex items-center justify-center gap-3 group">
                            <Download size={16} className="group-hover:translate-y-1 transition-transform" />
                            EXPORT_AUDIT_DATA
                        </button>
                    </div>

                    <div className="bg-gradient-to-br from-red-600 to-red-900 p-10 rounded-[2.5rem] relative overflow-hidden group">
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="relative z-10">
                            <h3 className="text-xl font-black italic uppercase tracking-widest text-white/50 mb-8">System_Shield</h3>
                            <div className="flex items-center gap-6 mb-8">
                                <div className="w-16 h-16 bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center rounded-2xl">
                                    <Shield size={32} className="text-white" />
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-white italic tracking-tighter">ENCRYPTED</div>
                                    <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">P2P_TUNNEL_PROTOCOL</div>
                                </div>
                            </div>
                            <p className="text-[10px] text-white/60 font-black leading-relaxed uppercase tracking-widest mb-4">
                                Authentication validated across 25 nodes.
                                No unauthorized ingest attempts in 48h.
                            </p>
                            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="h-full bg-white/40"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const Terminal = Shield; // Mapping icon if Terminal not found or using Shield for tactical look
