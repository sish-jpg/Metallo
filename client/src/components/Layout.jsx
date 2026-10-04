import React, { useState } from 'react';
import {
  LayoutDashboard,
  Flame,
  FlameKindling,
  CalendarClock,
  Zap,
  Gauge,
  Bell,
  Settings as SettingsIcon,
  Menu,
  X,
  Radio,
  FileSpreadsheet
} from 'lucide-react';

export default function Layout({
  children,
  currentTab,
  onTabChange,
  activeAlertsCount = 0,
  criticalAlertsCount = 0,
  isSimRunning = false,
  foundryName = 'METALLO Demo Foundry'
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'furnaces', label: 'Furnaces', icon: Flame },
    { id: 'heats', label: 'Heat Analytics', icon: FlameKindling },
    { id: 'schedule', label: 'Schedule Optimizer', icon: CalendarClock },
    { id: 'energy', label: 'Energy & Cost', icon: Zap },
    { id: 'pf', label: 'Power Factor', icon: Gauge },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: Bell,
      badge: activeAlertsCount > 0 ? activeAlertsCount : null,
      badgeCritical: criticalAlertsCount > 0
    },
    { id: 'settings', label: 'Settings & Data', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-industrial-950 text-industrial-100 flex flex-col antialiased selection:bg-metallo-orange selection:text-white">
      {/* Top Header */}
      <header className="h-14 bg-industrial-950 border-b border-industrial-800/80 px-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-industrial-400 hover:text-white p-1"
            aria-label="Toggle Navigation"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Large Editorial Wordmark */}
          <div
            onClick={() => onTabChange('overview')}
            className="flex items-baseline gap-2.5 cursor-pointer group"
          >
            <span className="font-mono text-2xl font-black tracking-tight text-white group-hover:text-metallo-orange transition-colors">
              METALLO
            </span>
            <span className="hidden sm:inline-block text-[10px] font-mono tracking-widest text-industrial-400 uppercase">
              Energy Decision Support
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded bg-industrial-900 border border-industrial-800 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-metallo-orange" />
            <span className="text-industrial-300 font-mono">{foundryName}</span>
          </div>

          {criticalAlertsCount > 0 && (
            <button
              onClick={() => onTabChange('alerts')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-mono font-semibold animate-pulse"
            >
              <Bell size={12} />
              <span>{criticalAlertsCount} CRITICAL</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 text-xs font-mono text-industrial-400">
            <Radio size={12} className={isSimRunning ? 'text-metallo-orange animate-pulse' : 'text-industrial-600'} />
            <span className="hidden sm:inline">{isSimRunning ? 'LIVE' : 'OFFLINE'}</span>
          </div>
        </div>
      </header>

      {/* Main App Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <aside
          className={`fixed md:static inset-y-14 left-0 w-64 bg-industrial-900/95 md:bg-industrial-950 border-r border-industrial-800/80 z-30 transition-transform duration-200 ease-in-out md:translate-x-0 ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-3">
            <div className="text-[10px] font-mono uppercase tracking-wider text-industrial-500 px-3 py-2">
              Foundry Intelligence
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id);
                      setMobileOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-industrial-800 text-white border-l-2 border-metallo-orange'
                        : 'text-industrial-400 hover:text-industrial-200 hover:bg-industrial-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={16} className={isActive ? 'text-metallo-orange' : 'text-industrial-500'} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== null && item.badge !== undefined && (
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                          item.badgeCritical
                            ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                            : 'bg-industrial-800 text-industrial-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="mt-8 pt-4 border-t border-industrial-800/60 px-3">
              <div className="text-[11px] font-mono text-industrial-500">
                HT Tariff III-A
              </div>
              <div className="text-[11px] text-industrial-400 mt-1">
                Peak: ₹9.0/kWh <br />
                Normal: ₹7.5/kWh <br />
                Off-Peak: ₹6.0/kWh
              </div>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-industrial-950 pb-16">
          {children}
        </main>
      </div>
    </div>
  );
}
