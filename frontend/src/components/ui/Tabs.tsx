'use client';

import React from 'react';

interface Tab { label: string; value: string; icon?: React.ReactNode; count?: number }

interface TabsProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (value: string) => void;
    variant?: 'underline' | 'pill';
}

export default function Tabs({ tabs, activeTab, onTabChange, variant = 'underline' }: TabsProps) {
    if (variant === 'pill') {
        return (
            <div className="flex gap-1 p-1 bg-white/5 rounded-card" role="tablist">
                {tabs.map((tab) => (
                    <button
                        key={tab.value}
                        role="tab"
                        aria-selected={activeTab === tab.value}
                        onClick={() => onTabChange(tab.value)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-button text-xs font-medium transition-all ${activeTab === tab.value
                                ? 'bg-accent/20 text-accent'
                                : 'text-white/50 hover:text-white/70 hover:bg-white/5'
                            }`}
                    >
                        {tab.icon}
                        {tab.label}
                        {tab.count !== undefined && (
                            <span className="ml-1 text-[10px] opacity-60">{tab.count}</span>
                        )}
                    </button>
                ))}
            </div>
        );
    }

    return (
        <div className="flex border-b border-white/10" role="tablist">
            {tabs.map((tab) => (
                <button
                    key={tab.value}
                    role="tab"
                    aria-selected={activeTab === tab.value}
                    onClick={() => onTabChange(tab.value)}
                    className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium transition-colors relative ${activeTab === tab.value
                            ? 'text-accent'
                            : 'text-white/50 hover:text-white/70'
                        }`}
                >
                    {tab.icon}
                    {tab.label}
                    {tab.count !== undefined && (
                        <span className="ml-1 text-[10px] opacity-50">{tab.count}</span>
                    )}
                    {activeTab === tab.value && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full" />
                    )}
                </button>
            ))}
        </div>
    );
}
