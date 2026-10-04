import React from 'react';
import { Activity, Database, Cpu, Thermometer } from 'lucide-react';

export default function HardwarePulseWidget() {
  const hardwareItems = [
    {
      id: 'telemetry',
      label: 'INDUCTION COIL TELEMETRY',
      value: '42MS',
      percent: 88,
      icon: Activity,
      iconColor: 'text-[#7c78e8]',
      gradient: 'linear-gradient(90deg, #635fc9 0%, #7c78e8 100%)',
      glow: 'rgba(124, 120, 232, 0.4)'
    },
    {
      id: 'capacitor',
      label: 'CAPACITOR BANK & PF SYNC',
      value: 'STABLE (0.98)',
      percent: 94,
      icon: Database,
      iconColor: 'text-[#72c69a]',
      gradient: 'linear-gradient(90deg, #429d71 0%, #72c69a 100%)',
      glow: 'rgba(114, 198, 154, 0.4)'
    },
    {
      id: 'transformer',
      label: 'TRANSFORMER LOAD (1400 kW)',
      value: '74% LOAD',
      percent: 74,
      icon: Cpu,
      iconColor: 'text-[#d8aa55]',
      gradient: 'linear-gradient(90deg, #b88a38 0%, #d8aa55 100%)',
      glow: 'rgba(216, 170, 85, 0.4)'
    },
    {
      id: 'cooling',
      label: 'COOLING WATER TEMP',
      value: '36°C NOMINAL',
      percent: 62,
      icon: Thermometer,
      iconColor: 'text-[#7c78e8]',
      gradient: 'linear-gradient(90deg, #5350b5 0%, #7c78e8 100%)',
      glow: 'rgba(124, 120, 232, 0.4)'
    }
  ];

  return (
    <div className="nm-card-static p-6 lg:p-7 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-[#f5f5f7]">
            Hardware Pulse
          </h3>
          <div className="text-[11px] text-[#9da1b5]">
            Sub-second telemetry & foundry edge node health
          </div>
        </div>

        {/* Operational Status Pill */}
        <div className="nm-badge px-3.5 py-1 text-[#72c69a]">
          <span className="w-2 h-2 rounded-full bg-[#72c69a] dot-pulse" />
          <span className="text-[11px] font-bold tracking-wider">HEALTHY</span>
        </div>
      </div>

      {/* Telemetry Tracks */}
      <div className="space-y-5">
        {hardwareItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-bold tracking-wider text-[11px] text-[#c5c9dc]">
                  <Icon size={14} className={item.iconColor} />
                  <span>{item.label}</span>
                </div>
                <span className="font-mono font-bold text-[11px] text-[#9da1b5]">
                  {item.value}
                </span>
              </div>

              {/* 10px Inset Progress Track with moving shimmer & gradient fill */}
              <div className="pulse-progress-track">
                <div
                  className="pulse-progress-fill pulse-glow"
                  style={{
                    width: `${item.percent}%`,
                    background: item.gradient,
                    boxShadow: `0 0 10px ${item.glow}`
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
