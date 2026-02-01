import React from 'react';
import { AlertTriangle, Clock, Zap } from 'lucide-react';

export interface AlertItemProps {
    type: 'CRITICAL' | 'WARNING' | 'INFO';
    category: string;
    time: string;
    message: string;
}

export const AlertItem = ({ type, message, time, category }: AlertItemProps) => {
    const colors = {
        CRITICAL: {
            border: 'border-red-500/40',
            bg: 'bg-gradient-to-br from-red-600/10 to-transparent',
            iconBg: 'border-red-500 bg-red-600/5',
            iconColor: 'text-red-500',
            text: 'text-red-500'
        },
        WARNING: {
            border: 'border-amber-500/40',
            bg: 'bg-gradient-to-br from-amber-600/10 to-transparent',
            iconBg: 'border-amber-500 bg-amber-600/5',
            iconColor: 'text-amber-500',
            text: 'text-amber-500'
        },
        INFO: {
            border: 'border-blue-500/40',
            bg: 'bg-gradient-to-br from-blue-600/10 to-transparent',
            iconBg: 'border-blue-500 bg-blue-600/5',
            iconColor: 'text-blue-500',
            text: 'text-blue-500'
        }
    };

    const c = colors[type];

    return (
        <div className={`p-4 carbon-plate border mb-3 flex items-start gap-4 transition-all duration-300 hover:translate-x-1 hover:shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 ${c.border} ${c.bg}`}>
            <div className={`mt-1 shrink-0 w-8 h-8 carbon-plate flex items-center justify-center border ${c.iconBg} hover:scale-110 transition-transform`}>
                {type === 'CRITICAL' ? <AlertTriangle size={16} className={c.iconColor} /> :
                    type === 'WARNING' ? <Clock size={16} className={c.iconColor} /> :
                        <Zap size={16} className={c.iconColor} />}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${c.text}`}>{category}</span>
                    <span className="text-[10px] text-zinc-600 font-mono italic">{time}</span>
                </div>
                <p className="text-sm text-zinc-300 leading-tight font-medium truncate hover:text-zinc-200 transition-colors">{message}</p>
            </div>
        </div>
    );
};
