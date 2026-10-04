import React from 'react';
import {
  LayoutDashboard,
  Zap,
  Flame,
  FlameKindling,
  CalendarClock,
  Gauge,
  Bell,
  Settings,
  X
} from 'lucide-react';

export default function Sidebar({
  currentTab = 'overview',
  onTabChange,
  activeAlertsCount = 3,
  mobileOpen = false,
  onCloseMobile
}) {
  const navItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard
    },
    {
      id: 'furnaces',
      label: 'Furnaces',
      icon: Flame
    },
    {
      id: 'heats',
      label: 'Heat Analytics',
      icon: FlameKindling
    },
    {
      id: 'schedule',
      label: 'Schedule',
      icon: CalendarClock
    },
    {
      id: 'energy',
      label: 'Energy & Cost',
      icon: Zap
    },
    {
      id: 'pf',
      label: 'Power Factor',
      icon: Gauge
    },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: Bell,
      badge: activeAlertsCount
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings
    }
  ];

  const handleItemClick = (id) => {
    if (onTabChange) onTabChange(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed lg:static top-0 bottom-0 left-0
          w-72 shrink-0
          p-6 flex flex-col justify-between
          z-50
          transition-transform duration-300 ease-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="space-y-6">
          {/* Top METALLO Branding Card (Matches screenshot console style with master METALLO brand) */}
          <div className="nm-raised-container p-4 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="nm-icon-box w-11 h-11 text-[#7c78e8] bg-[rgba(124,120,232,0.12)]">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="7" height="7" rx="2" />
                  <rect x="14" y="3" width="7" height="7" rx="2" />
                  <rect x="14" y="14" width="7" height="7" rx="2" />
                  <rect x="3" y="14" width="7" height="7" rx="2" />
                </svg>
              </div>

              <div>
                <h2 className="text-lg font-bold text-[#f5f5f7] tracking-tight leading-none">
                  METALLO
                </h2>
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#9da1b5]">
                  Industrial Intelligence
                </span>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1 text-[#9da1b5] hover:text-[#f5f5f7]"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                currentTab === item.id ||
                (item.id === 'overview' && (currentTab === 'overview' || !currentTab));

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`
                    w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold
                    transition-all duration-200
                    ${
                      isActive
                        ? 'nm-nav-active'
                        : 'text-[#9da1b5] hover:text-[#f5f5f7]'
                    }
                  `}
                >
                  <div className="flex items-center gap-3.5">
                    <Icon
                      size={18}
                      className={
                        isActive
                          ? 'text-[#7c78e8]'
                          : 'text-[#6b7280]'
                      }
                    />
                    <span className="tracking-wide">{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="nm-badge px-2 py-0.5 text-[10px] text-[#d8aa55]">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Foundry Status Card */}
        <div className="nm-card-static p-4 rounded-2xl">
          <div className="flex items-center justify-between text-[11px] mb-2 font-bold tracking-wider text-[#9da1b5] uppercase">
            <span>Grid Status</span>
            <span className="text-[#72c69a] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#72c69a] dot-pulse" />
              ONLINE
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-[#9da1b5]">
              <span>TOD Tariff</span>
              <span className="font-bold text-[#f5f5f7]">Normal Band</span>
            </div>
            <div className="flex justify-between text-[#9da1b5]">
              <span>Current Rate</span>
              <span className="font-mono font-semibold text-[#f5f5f7]">₹7.50 / kWh</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
