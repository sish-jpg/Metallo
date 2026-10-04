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
  Radio
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

  const navGroups = [
    {
      title: 'Operations',
      items: [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'furnaces', label: 'Furnaces', icon: Flame },
        { id: 'heats', label: 'Heat Analytics', icon: FlameKindling }
      ]
    },
    {
      title: 'Optimize',
      items: [
        { id: 'schedule', label: 'Schedule', icon: CalendarClock },
        { id: 'energy', label: 'Energy & Cost', icon: Zap }
      ]
    },
    {
      title: 'Monitor',
      items: [
        { id: 'pf', label: 'Power Factor', icon: Gauge },
        {
          id: 'alerts',
          label: 'Alerts',
          icon: Bell,
          badge: activeAlertsCount > 0 ? activeAlertsCount : null,
          badgeCritical: criticalAlertsCount > 0
        }
      ]
    },
    {
      title: 'System',
      items: [
        { id: 'settings', label: 'Settings', icon: SettingsIcon }
      ]
    }
  ];

  const handleNavigation = (id) => {
    onTabChange(id);
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-industrial-950 text-industrial-100 flex flex-col antialiased">

      {/* =====================================================
          HEADER
          ===================================================== */}
      <header className="h-16 shrink-0 border-b border-industrial-800/70 bg-industrial-950/95 backdrop-blur-sm sticky top-0 z-40">

        <div className="h-full px-5 lg:px-7 flex items-center justify-between">

          {/* Brand */}
          <div className="flex items-center gap-4">

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-1 text-industrial-400 hover:text-white transition-colors"
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <button
              onClick={() => handleNavigation('overview')}
              className="text-left group"
            >
              <div className="font-sans text-xl lg:text-2xl font-semibold tracking-[0.12em] text-white group-hover:text-metallo-orange transition-colors">
                METALLO
              </div>

              <div className="hidden sm:block text-[9px] uppercase tracking-[0.22em] text-industrial-500 mt-0.5">
                Industrial Energy Intelligence
              </div>
            </button>

          </div>

          {/* Header Status */}
          <div className="flex items-center gap-3 lg:gap-5">

            <div className="hidden md:block text-right">
              <div className="text-[10px] uppercase tracking-[0.16em] text-industrial-500">
                Foundry
              </div>

              <div className="text-xs text-industrial-300 mt-0.5">
                {foundryName}
              </div>
            </div>

            {criticalAlertsCount > 0 && (
              <button
                onClick={() => handleNavigation('alerts')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/25 text-red-400 text-[10px] uppercase tracking-wider font-semibold"
              >
                <Bell size={12} />
                <span>{criticalAlertsCount} Critical</span>
              </button>
            )}

            <div className="flex items-center gap-2 pl-2 lg:pl-4 border-l border-industrial-800/70">

              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isSimRunning
                    ? 'bg-metallo-orange animate-pulse'
                    : 'bg-industrial-600'
                }`}
              />

              <span className="hidden sm:inline text-[10px] uppercase tracking-[0.16em] text-industrial-400">
                {isSimRunning ? 'Live' : 'Offline'}
              </span>

              <Radio
                size={13}
                className={
                  isSimRunning
                    ? 'text-metallo-orange'
                    : 'text-industrial-600'
                }
              />

            </div>

          </div>

        </div>
      </header>


      {/* =====================================================
          APP BODY
          ===================================================== */}
      <div className="flex-1 flex min-h-0">

        {/* Mobile overlay */}
        {mobileOpen && (
          <button
            className="fixed inset-0 top-16 bg-black/50 z-20 md:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
          />
        )}


        {/* ===================================================
            SIDEBAR
            =================================================== */}
        <aside
          className={`
            fixed md:static
            inset-y-16 left-0
            w-56
            shrink-0
            bg-industrial-950
            border-r border-industrial-800/70
            z-30
            transition-transform duration-200 ease-out
            ${
              mobileOpen
                ? 'translate-x-0'
                : '-translate-x-full md:translate-x-0'
            }
          `}
        >

          <div className="h-full flex flex-col px-3 py-6">

            {/* Navigation */}
            <nav className="flex-1">

              {navGroups.map((group) => (
                <div key={group.title} className="mb-7">

                  <div className="px-3 mb-2 text-[9px] uppercase tracking-[0.2em] text-industrial-600">
                    {group.title}
                  </div>

                  <div className="space-y-0.5">

                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = currentTab === item.id;

                      return (
                        <button
                          key={item.id}
                          onClick={() => handleNavigation(item.id)}
                          className={`
                            relative
                            w-full
                            flex items-center justify-between
                            px-3 py-2.5
                            rounded-lg
                            text-sm
                            transition-all duration-150
                            ${
                              isActive
                                ? 'bg-metallo-orange/10 text-white'
                                : 'text-industrial-400 hover:text-industrial-200 hover:bg-industrial-900/70'
                            }
                          `}
                        >

                          {/* Active indicator */}
                          {isActive && (
                            <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-metallo-orange" />
                          )}

                          <div className="flex items-center gap-3">

                            <Icon
                              size={16}
                              strokeWidth={1.7}
                              className={
                                isActive
                                  ? 'text-metallo-orange'
                                  : 'text-industrial-600'
                              }
                            />

                            <span>{item.label}</span>

                          </div>

                          {item.badge !== null &&
                            item.badge !== undefined && (
                              <span
                                className={`
                                  min-w-5 h-5 px-1.5
                                  flex items-center justify-center
                                  rounded-full
                                  text-[9px]
                                  font-semibold
                                  ${
                                    item.badgeCritical
                                      ? 'bg-red-500/15 text-red-400 border border-red-500/25'
                                      : 'bg-industrial-800 text-industrial-300'
                                  }
                                `}
                              >
                                {item.badge}
                              </span>
                            )}

                        </button>
                      );
                    })}

                  </div>

                </div>
              ))}

            </nav>


            {/* Tariff information */}
            <div className="border-t border-industrial-800/60 pt-5 px-3">

              <div className="text-[9px] uppercase tracking-[0.18em] text-industrial-600">
                Current Tariff
              </div>

              <div className="mt-3 space-y-1.5 text-[11px]">

                <div className="flex justify-between">
                  <span className="text-industrial-500">Peak</span>
                  <span className="text-industrial-300">₹9.0/kWh</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-industrial-500">Normal</span>
                  <span className="text-industrial-300">₹7.5/kWh</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-industrial-500">Off-Peak</span>
                  <span className="text-industrial-300">₹6.0/kWh</span>
                </div>

              </div>

            </div>

          </div>

        </aside>


        {/* ===================================================
            CONTENT
            =================================================== */}
        <main className="flex-1 min-w-0 overflow-y-auto bg-industrial-950">
          {children}
        </main>

      </div>

    </div>
  );
}