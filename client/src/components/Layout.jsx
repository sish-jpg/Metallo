import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { Menu } from 'lucide-react';

export default function Layout({
  children,
  currentTab = 'overview',
  onTabChange,
  activeAlertsCount = 3,
  criticalAlertsCount = 0,
  isSimRunning = false,
  foundryName = 'METALLO Demo Foundry'
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const tabTitles = {
    overview: 'Overview',
    furnaces: 'Furnaces',
    'furnace-detail': 'Furnace Detail',
    heats: 'Heat Analytics',
    schedule: 'Schedule Optimizer',
    energy: 'Energy & Cost',
    pf: 'Power Factor',
    alerts: 'Operational Alerts',
    settings: 'Settings'
  };

  const currentTitle = tabTitles[currentTab] || 'Overview';
  const breadcrumbs = ['Dashboard', currentTitle];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row antialiased bg-[#1e2030] text-[#f5f5f7]">
      {/* 288px Neumorphic Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={onTabChange}
        activeAlertsCount={activeAlertsCount}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 p-4 sm:p-6 lg:p-8">
        {/* Mobile Header Bar */}
        <div className="lg:hidden flex items-center justify-between pb-4">
          <button
            onClick={() => setMobileOpen(true)}
            className="nm-btn p-2.5 text-[#f5f5f7]"
            aria-label="Open navigation menu"
          >
            <Menu size={20} />
          </button>

          <span className="font-bold text-sm tracking-wider text-[#f5f5f7] uppercase">
            METALLO
          </span>

          <div className="w-8" />
        </div>

        {/* 72px Floating Neumorphic Header */}
        <Header
          breadcrumbs={breadcrumbs}
          activeAlertsCount={activeAlertsCount}
          onNavigate={onTabChange}
        />

        {/* Page Content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}