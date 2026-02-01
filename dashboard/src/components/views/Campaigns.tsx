"use client";

import React, { useState } from 'react';
import { Target, MoreHorizontal, Plus, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const INITIAL_CAMPAIGNS = [
    { id: 'CMP-001', name: 'Netflix_Q1_WWE', channel: 'Social', budget: 50000, spend: 42000, status: 'Active', roi: 2.4 },
    { id: 'CMP-002', name: 'Stranger_Things_S5_Teaser', channel: 'YouTube', budget: 120000, spend: 15000, status: 'Active', roi: 3.1 },
    { id: 'CMP-003', name: 'Bridgerton_Retargeting', channel: 'Display', budget: 30000, spend: 28500, status: 'Paused', roi: 1.8 },
    { id: 'CMP-004', name: 'Squid_Game_S2_Launch', channel: 'TV', budget: 500000, spend: 0, status: 'Scheduled', roi: 0 },
    { id: 'CMP-005', name: 'Standard_Search_Brand', channel: 'Search', budget: 10000, spend: 8200, status: 'Active', roi: 4.5 },
];

export function Campaigns() {
    const [campaigns, setCampaigns] = useState(INITIAL_CAMPAIGNS);
    const [filter, setFilter] = useState('');

    const toggleStatus = (id: string) => {
        setCampaigns(prev => prev.map(c => {
            if (c.id === id) {
                return { ...c, status: c.status === 'Active' ? 'Paused' : 'Active' };
            }
            return c;
        }));
    };

    const filteredCampaigns = campaigns.filter(c => c.name.toLowerCase().includes(filter.toLowerCase()));

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black italic tracking-tighter uppercase text-white leading-none mb-2">Campaign_Command</h2>
                    <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.4em]">Budget_Allocation & Performance::Live</p>
                </div>
                <button className="px-8 py-4 bg-red-600 text-white font-black text-xs uppercase tracking-widest hover:bg-red-500 transition-all flex items-center gap-3 active:scale-95 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                    <Plus size={18} /> INITIATE_DEPLOYMENT
                </button>
            </div>

            <div className="flex gap-6">
                <div className="flex-1 bg-black/40 border border-white/5 flex items-center px-6 py-4 rounded-2xl focus-within:border-red-600/50 transition-all group">
                    <Search className="text-zinc-600 group-focus-within:text-red-600 transition-colors mr-4" size={20} />
                    <input
                        type="text"
                        placeholder="FILTER_HEURISTICS..."
                        className="bg-transparent border-none outline-none text-white text-xs font-black font-mono w-full placeholder:text-zinc-800 uppercase tracking-widest"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
                <button className="w-14 h-14 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-center text-zinc-600 hover:text-white hover:border-white/20 transition-all">
                    <Filter size={20} />
                </button>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-sm">
                <table className="w-full text-left text-[10px] font-mono border-collapse">
                    <thead className="bg-white/5 text-zinc-600 uppercase tracking-widest">
                        <tr>
                            <th className="px-8 py-6 font-black">NODE_ID</th>
                            <th className="px-8 py-6 font-black">CAMPAIGN_SPEC</th>
                            <th className="px-8 py-6 font-black">CHANNEL_MAP</th>
                            <th className="px-8 py-6 font-black">BUDGET_PRECISION</th>
                            <th className="px-8 py-6 font-black text-center">STATUS</th>
                            <th className="px-8 py-6 font-black text-right">ROI_ALPHA</th>
                            <th className="px-8 py-6 font-black text-center">OP</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        <AnimatePresence>
                            {filteredCampaigns.map((campaign) => (
                                <motion.tr
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    key={campaign.id}
                                    className="hover:bg-white/[0.02] transition-colors group"
                                >
                                    <td className="px-8 py-6 text-zinc-700 font-black group-hover:text-zinc-500 transition-colors">{campaign.id}</td>
                                    <td className="px-8 py-6 font-black text-zinc-300 italic group-hover:text-white transition-colors">{campaign.name.toUpperCase()}</td>
                                    <td className="px-8 py-6">
                                        <span className="px-3 py-1.5 bg-black/40 text-zinc-500 text-[9px] font-black uppercase tracking-widest border border-white/5 rounded-sm group-hover:border-red-600/20 transition-colors">
                                            {campaign.channel.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 w-72">
                                        <div className="flex justify-between mb-2 text-[9px] font-black tracking-tighter">
                                            <span className="text-zinc-400 group-hover:text-red-500 transition-colors">${campaign.spend.toLocaleString()}</span>
                                            <span className="text-zinc-700">/ ${campaign.budget.toLocaleString()}</span>
                                        </div>
                                        <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(campaign.spend / campaign.budget) * 100}%` }}
                                                transition={{ duration: 1, ease: "circOut" }}
                                                className={`h-full ${campaign.spend / campaign.budget > 0.9 ? 'bg-red-600 shadow-[0_0_10px_#ef4444]' : 'bg-red-600/40'}`}
                                            />
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <button
                                            onClick={() => toggleStatus(campaign.id)}
                                            className={`px-4 py-1.5 rounded-sm text-[8px] font-black uppercase tracking-[0.2em] border transition-all ${campaign.status === 'Active'
                                                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                                                    : campaign.status === 'Paused'
                                                        ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                                                        : 'bg-zinc-800 text-zinc-600 border-zinc-700'
                                                }`}
                                        >
                                            {campaign.status}
                                        </button>
                                    </td>
                                    <td className="px-8 py-6 font-black text-right text-white italic tracking-widest">{campaign.roi > 0 ? campaign.roi + 'x' : '---'}</td>
                                    <td className="px-8 py-6 text-zinc-800 hover:text-white cursor-pointer transition-colors text-center">
                                        <MoreHorizontal size={16} />
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
