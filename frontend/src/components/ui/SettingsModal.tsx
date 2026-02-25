'use client';

import React, { useState } from 'react';
import Modal from './Modal';
import { useUIStore } from '@/store/uiStore';
import { useSettingsStore } from '@/store/settingsStore';
import { KEYBOARD_SHORTCUTS } from '@/lib/constants/keyboardShortcuts';

const TABS = ['General', 'Display', 'Data', 'Shortcuts', 'About'] as const;
type SettingsTab = (typeof TABS)[number];

export default function SettingsModal() {
    const settingsOpen = useUIStore((s) => s.settingsOpen);
    const setSettingsOpen = useUIStore((s) => s.setSettingsOpen);
    const settings = useUIStore((s) => s.settings);
    const updateSettings = useUIStore((s) => s.updateSettings);
    const layers = useUIStore((s) => s.layers);
    const toggleLayer = useUIStore((s) => s.toggleLayer);
    const shaderSettings = useSettingsStore((s) => s.shaderSettings);
    const updateShaderSetting = useSettingsStore((s) => s.updateShaderSetting);
    const [activeTab, setActiveTab] = useState<SettingsTab>('General');

    return (
        <Modal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} title="Settings" width="600px">
            {/* Tabs */}
            <div className="flex border-b border-white/10 px-4">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2.5 text-xs font-medium uppercase tracking-wider border-b-2 transition-colors ${activeTab === tab
                                ? 'text-accent border-accent'
                                : 'text-white/50 border-transparent hover:text-white/70'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
                {activeTab === 'General' && (
                    <>
                        <SettingRow label="Units">
                            <select
                                value={settings.units}
                                onChange={(e) => updateSettings({ units: e.target.value as any })}
                                className="glass-input text-sm w-40"
                            >
                                <option value="metric">Metric</option>
                                <option value="imperial">Imperial</option>
                            </select>
                        </SettingRow>
                        <SettingRow label="Update interval (seconds)">
                            <input
                                type="range"
                                min={1}
                                max={30}
                                value={settings.updateInterval}
                                onChange={(e) => updateSettings({ updateInterval: Number(e.target.value) })}
                                className="w-32"
                            />
                            <span className="text-xs text-white/60 ml-2 font-mono w-6">{settings.updateInterval}</span>
                        </SettingRow>
                        <SettingRow label="Show FPS">
                            <Checkbox checked={settings.showFPS} onChange={(v) => updateSettings({ showFPS: v })} />
                        </SettingRow>
                        <SettingRow label="Language">
                            <select
                                value={settings.language}
                                onChange={(e) => updateSettings({ language: e.target.value })}
                                className="glass-input text-sm w-40"
                            >
                                <option value="en">English</option>
                                <option value="es">Español</option>
                                <option value="fr">Français</option>
                                <option value="de">Deutsch</option>
                            </select>
                        </SettingRow>
                    </>
                )}

                {activeTab === 'Display' && (
                    <>
                        <SettingRow label="Bloom intensity">
                            <input
                                type="range"
                                min={0}
                                max={200}
                                value={shaderSettings.bloomIntensity * 100}
                                onChange={(e) => updateShaderSetting('bloomIntensity', Number(e.target.value) / 100)}
                                className="w-32"
                            />
                            <span className="text-xs text-white/60 ml-2 font-mono w-10">
                                {shaderSettings.bloomIntensity.toFixed(1)}
                            </span>
                        </SettingRow>
                        <SettingRow label="Scanline density (CRT)">
                            <input
                                type="range"
                                min={0}
                                max={200}
                                value={shaderSettings.scanlineIntensity * 100}
                                onChange={(e) => updateShaderSetting('scanlineIntensity', Number(e.target.value) / 100)}
                                className="w-32"
                            />
                            <span className="text-xs text-white/60 ml-2 font-mono w-10">
                                {shaderSettings.scanlineIntensity.toFixed(1)}
                            </span>
                        </SettingRow>
                        <SettingRow label="Night vision noise">
                            <input
                                type="range"
                                min={0}
                                max={50}
                                value={shaderSettings.noiseAmount * 100}
                                onChange={(e) => updateShaderSetting('noiseAmount', Number(e.target.value) / 100)}
                                className="w-32"
                            />
                            <span className="text-xs text-white/60 ml-2 font-mono w-10">
                                {shaderSettings.noiseAmount.toFixed(2)}
                            </span>
                        </SettingRow>
                    </>
                )}

                {activeTab === 'Data' && (
                    <>
                        <SettingRow label="Enable civilian flights">
                            <Checkbox checked={layers.civilian} onChange={() => toggleLayer('civilian')} />
                        </SettingRow>
                        <SettingRow label="Enable military flights">
                            <Checkbox checked={layers.military} onChange={() => toggleLayer('military')} />
                        </SettingRow>
                        <SettingRow label="Enable satellites">
                            <Checkbox checked={layers.satellites} onChange={() => toggleLayer('satellites')} />
                        </SettingRow>
                        <SettingRow label="Enable CCTV">
                            <Checkbox checked={layers.cctv} onChange={() => toggleLayer('cctv')} />
                        </SettingRow>
                        <SettingRow label="Enable road traffic">
                            <Checkbox checked={layers.traffic} onChange={() => toggleLayer('traffic')} />
                        </SettingRow>
                    </>
                )}

                {activeTab === 'Shortcuts' && (
                    <div className="space-y-1">
                        {KEYBOARD_SHORTCUTS.map((shortcut) => (
                            <div
                                key={shortcut.key}
                                className="flex items-center justify-between py-2 border-b border-white/5"
                            >
                                <span className="text-sm text-white/70">{shortcut.action}</span>
                                <kbd className="px-2 py-1 bg-white/8 border border-white/15 rounded text-xs text-white/60 font-mono">
                                    {shortcut.key}
                                </kbd>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'About' && (
                    <div className="space-y-4 text-white/70">
                        <div>
                            <h3 className="text-lg font-semibold text-white">Heimdallr</h3>
                            <p className="text-sm">v1.0.0 – Real‑Time Geospatial Intelligence Dashboard</p>
                        </div>
                        <p className="text-xs text-white/50">
                            © 2025 KAWACU RUGIRANEZA Arnaud Kennedy. All rights reserved.
                        </p>
                        <div>
                            <h4 className="text-sm font-medium text-white/80 mb-1">Credits</h4>
                            <p className="text-xs text-white/40">
                                CesiumJS • Supabase • OpenStreetMap • OpenSky Network • ADS-B Exchange • Google 3D Tiles
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
}

function SettingRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between py-2">
            <span className="text-sm text-white/70">{label}</span>
            <div className="flex items-center">{children}</div>
        </div>
    );
}

function Checkbox({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
    return (
        <button
            onClick={() => onChange(!checked)}
            className={`w-8 h-4 rounded-full transition-colors ${checked ? 'bg-accent' : 'bg-white/15'}`}
            role="checkbox"
            aria-checked={checked}
        >
            <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform mt-[1px] ${checked ? 'translate-x-4' : 'translate-x-0.5'
                    }`}
            />
        </button>
    );
}
