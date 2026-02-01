"use client";

import React, { useState } from 'react';

interface TooltipProps {
    content: string;
    children: React.ReactNode;
    position?: 'left' | 'right';
}

export const Tooltip = ({ content, children, position = 'right' }: TooltipProps) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            {isVisible && (
                <div className={`absolute ${position === 'left' ? 'right-14' : 'left-14'} top-1/2 -translate-y-1/2 w-64 carbon-plate-glass border border-zinc-700/60 p-4 z-50 pointer-events-none shadow-[0_8px_32px_rgba(0,0,0,0.5)] animate-in fade-in duration-200`}>
                    <div className={`absolute ${position === 'left' ? '-right-1' : '-left-1'} top-1/2 -translate-y-1/2 w-2 h-2 bg-zinc-800/80 rotate-45`}></div>
                    <p className="text-[10px] text-zinc-300 font-medium leading-relaxed">{content}</p>
                </div>
            )}
        </div>
    );
};

interface InfoPanelProps {
    title: string;
    description: string;
    purpose: string;
    mechanics: string;
    value: string;
    isOpen: boolean;
    onToggle: () => void;
}

export const InfoPanel = ({ title, description, purpose, mechanics, value, isOpen, onToggle }: InfoPanelProps) => (
    <div className="carbon-plate-glass border border-zinc-800/60 p-6 rounded-xl mb-4 gradient-border hover:border-red-600/30 hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)] transition-all duration-300">
        <button
            onClick={onToggle}
            className="w-full flex items-center justify-between text-left group"
        >
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 border border-red-600/30 flex items-center justify-center bg-gradient-to-br from-red-600/10 to-transparent group-hover:border-red-600/50 group-hover:shadow-[0_0_20px_rgba(229,9,20,0.15)] transition-all">
                    <span className="text-red-500 text-sm font-black group-hover:scale-110 transition-transform">?</span>
                </div>
                <div>
                    <h4 className="text-sm font-black uppercase text-white group-hover:bg-gradient-to-r group-hover:from-red-600 group-hover:to-red-500 group-hover:bg-clip-text group-hover:text-transparent transition-all">{title}</h4>
                    <p className="text-[10px] text-zinc-600 uppercase tracking-widest group-hover:text-zinc-500 transition-colors">What is this?</p>
                </div>
            </div>
            <div className={`w-6 h-6 flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>
                <span className="text-zinc-600 text-xl font-black group-hover:text-zinc-400 transition-colors">+</span>
            </div>
        </button>
        {isOpen && (
            <div className="mt-4 pt-4 border-t border-zinc-800/50 space-y-4 animate-in slide-in-from-top-2 fade-in duration-300">
                <div className="hover:bg-zinc-900/30 -mx-2 px-2 py-2 rounded-lg transition-colors">
                    <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1">DESCRIPTION</p>
                    <p className="text-xs text-zinc-400 leading-relaxed hover:text-zinc-300 transition-colors">{description}</p>
                </div>
                <div className="hover:bg-zinc-900/30 -mx-2 px-2 py-2 rounded-lg transition-colors">
                    <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1">PURPOSE</p>
                    <p className="text-xs text-zinc-400 leading-relaxed hover:text-zinc-300 transition-colors">{purpose}</p>
                </div>
                <div className="hover:bg-zinc-900/30 -mx-2 px-2 py-2 rounded-lg transition-colors">
                    <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1">HOW IT WORKS</p>
                    <p className="text-xs text-zinc-400 leading-relaxed hover:text-zinc-300 transition-colors">{mechanics}</p>
                </div>
                <div className="hover:bg-zinc-900/30 -mx-2 px-2 py-2 rounded-lg transition-colors">
                    <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1">BUSINESS VALUE</p>
                    <p className="text-xs text-zinc-400 leading-relaxed hover:text-zinc-300 transition-colors">{value}</p>
                </div>
            </div>
        )}
    </div>
);
