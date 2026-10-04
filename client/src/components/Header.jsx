import React, { useState } from 'react';
import { Search, Sun, Bell, ChevronRight } from 'lucide-react';

export default function Header({
  breadcrumbs = ['Dashboard', 'Overview'],
  activeAlertsCount = 3,
  onNavigate
}) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="h-[72px] shrink-0 sticky top-4 z-40 mb-6">
      <div className="nm-raised-container h-full px-6 flex items-center justify-between gap-4">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm font-medium">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={crumb}>
                {idx > 0 && (
                  <ChevronRight size={14} className="text-[#9da1b5]" />
                )}
                <span
                  className={
                    isLast
                      ? 'font-bold text-[#f5f5f7]'
                      : 'text-[#9da1b5] hover:text-[#f5f5f7] transition-colors cursor-pointer'
                  }
                >
                  {crumb}
                </span>
              </React.Fragment>
            );
          })}
        </nav>

        {/* Right Section: Inset Search Bar + Theme Icon + Notification Bell + User Avatar */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* 288px Inset Search Bar */}
          <div className="relative w-48 sm:w-72 hidden md:block">
            <Search
              size={15}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9da1b5]"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search anything..."
              className="nm-search-bar w-full h-10 pl-10 pr-4 text-xs text-[#f5f5f7] placeholder:text-[#6b7280]"
            />
          </div>

          {/* Theme Indicator / Button */}
          <button
            className="nm-btn w-10 h-10 rounded-full flex items-center justify-center text-[#9da1b5] hover:text-[#7c78e8] transition-colors"
            title="Theme: Tactile Neumorphic Dark"
            aria-label="Theme mode"
          >
            <Sun size={17} />
          </button>

          {/* Notifications Button with Badge */}
          <button
            onClick={() => onNavigate && onNavigate('alerts')}
            className="nm-btn relative w-10 h-10 rounded-full flex items-center justify-center text-[#9da1b5] hover:text-[#7c78e8] transition-colors"
            title="Operational Alerts"
            aria-label="Alerts"
          >
            <Bell size={17} />
            {activeAlertsCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#d87878] ring-2 ring-[#25283a]" />
            )}
          </button>

          {/* User Avatar Circle JD */}
          <div
            className="nm-btn w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-[#7c78e8] cursor-pointer select-none"
            title="User Profile: Chief Foundry Engineer"
          >
            JD
          </div>
        </div>
      </div>
    </header>
  );
}
