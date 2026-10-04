import React from 'react';
import { Zap, Flame, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function RecentActivityWidget({ onNavigate }) {
  const activities = [
    {
      id: 1,
      icon: Zap,
      iconColor: 'text-[#7c78e8]',
      title: 'Peak Load Shifting Activated',
      detail: (
        <>
          Furnace <strong className="text-[#7c78e8]">F1</strong> dialed to 380 kW holding to avoid ₹9.0/kWh peak tariff.
        </>
      ),
      time: '12 MINUTES AGO'
    },
    {
      id: 2,
      icon: Flame,
      iconColor: 'text-[#d8aa55]',
      title: 'Melt Tap Readiness Confirmed',
      detail: (
        <>
          Shift Supervisor verified <strong className="text-[#f5f5f7]">Heat #142</strong> optical spectrometry at 1,480°C.
        </>
      ),
      time: '45 MINUTES AGO'
    },
    {
      id: 3,
      icon: ShieldCheck,
      iconColor: 'text-[#72c69a]',
      title: 'Power Factor Correction Synchronized',
      detail: (
        <>
          Capacitor Bank 3 engaged automatically, maintaining PF at <strong className="text-[#72c69a]">0.982</strong>.
        </>
      ),
      time: '2 HOURS AGO'
    },
    {
      id: 4,
      icon: AlertTriangle,
      iconColor: 'text-[#d8aa55]',
      title: 'Scrap Preheating Optimization',
      detail: (
        <>
          Batch charge moisture low; SEC predicted at <strong className="text-[#f5f5f7]">508 kWh/t</strong> (-6% vs baseline).
        </>
      ),
      time: '3 HOURS AGO'
    }
  ];

  return (
    <div className="nm-card-static p-6 lg:p-7 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-[#f5f5f7]">
          Recent Activity
        </h3>

        <button
          onClick={() => onNavigate && onNavigate('alerts')}
          className="nm-btn px-4 py-1.5 text-[11px] font-bold tracking-wider text-[#7c78e8] uppercase"
        >
          View All
        </button>
      </div>

      {/* Activity Timeline */}
      <div className="relative space-y-6">
        {activities.map((item, index) => {
          const Icon = item.icon;
          const isLast = index === activities.length - 1;

          return (
            <div key={item.id} className="relative flex items-start gap-4">
              {!isLast && (
                <div 
                  className="absolute left-5 top-10 bottom-[-24px] w-[2px] bg-[rgba(42,45,66,0.6)]" 
                  aria-hidden="true" 
                />
              )}

              {/* Icon Box */}
              <div className="nm-icon-box w-10 h-10 shrink-0 z-10 bg-[#25283a]">
                <Icon size={18} className={item.iconColor} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="text-xs sm:text-sm text-[#c5c9dc] leading-snug">
                  {item.detail}
                </div>
                <div className="mt-1.5 text-[10px] font-bold tracking-wider text-[#9da1b5] uppercase">
                  {item.time}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
