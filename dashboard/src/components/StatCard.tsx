import React from 'react';
import { Info } from 'lucide-react';

type IconType = React.ElementType;

export interface StatCardProps {
    title: string;
    value: string;
    subValue: string;
    icon: IconType;
    trend: number;
    colorClass: string;
}

export const StatCard = ({ title, value, subValue, icon: Icon, trend, colorClass }: StatCardProps) => (
    <div className="carbon-plate border border-zinc-800/80 p-6 hover:border-red-600/40 hover:shadow-[0_8px_24px_rgba(229,9,20,0.15)] hover:-translate-y-1 transition-all duration-300 group overflow-hidden cursor-pointer gradient-border">
        <div className={`absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity ${colorClass}`}>
            <Icon size={120} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
                <div className={`w-10 h-10 carbon-plate border border-zinc-700/50 flex items-center justify-center shrink-0 group-hover:border-red-600/40 group-hover:shadow-[0_0_20px_rgba(229,9,20,0.2)] transition-all`}>
                    <Icon size={20} className="text-zinc-100" />
                </div>
                <span className="text-zinc-500 font-bold text-xs uppercase tracking-widest font-mono group-hover:text-zinc-400 transition-colors">{title}</span>
                <Info size={12} className="text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity ml-auto group-hover:translate-x-1" />
            </div>
            <div className="flex items-baseline gap-2">
                <h3 className="text-4xl font-black italic text-zinc-100 tracking-tighter uppercase font-mono group-hover:bg-gradient-to-r group-hover:from-red-600 group-hover:to-red-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">{value}</h3>
            </div>
            <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold font-mono ${trend > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {trend > 0 ? '▲' : '▼'} {Math.abs(trend)}%
                    </span>
                    <span className="text-zinc-600 text-[10px] uppercase font-bold tracking-tight font-mono group-hover:text-zinc-500 transition-colors">{subValue}</span>
                </div>
                <div className="h-1 w-12 bg-zinc-800/60 overflow-hidden group-hover:bg-zinc-700 transition-colors">
                    <div className={`h-full bg-gradient-to-r ${trend > 0 ? 'from-emerald-500 to-emerald-400' : 'from-red-500 to-red-400'} group-hover:opacity-100 transition-all`} style={{ width: '70%' }}></div>
                </div>
            </div>
        </div>
    </div>
);
