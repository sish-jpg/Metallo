import React from 'react';
import AnimatedCounter from './AnimatedCounter';

export default function NeumorphicKpiCard({
  icon: Icon,
  iconColor = 'text-[#7c78e8]',
  iconBgGlow = 'rgba(124, 120, 232, 0.25)',
  badge = 'ACTIVE',
  badgeStatus = 'green', // 'green' | 'amber' | 'blue' | 'neutral'
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  title,
  subtitle,
  sparklineType = 'wave',
  sparklineColor = '#7c78e8',
  statusText,
  statusType = 'green' // 'green' | 'amber' | 'red' | 'neutral'
}) {
  const renderSparkline = () => {
    switch (sparklineType) {
      case 'wave':
        return (
          <path
            d="M2 18 C 25 18, 25 2, 50 10 C 75 18, 75 4, 98 12"
            fill="none"
            stroke={sparklineColor}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        );
      case 'upward':
        return (
          <path
            d="M2 22 C 30 22, 50 18, 70 8 C 85 0, 92 2, 98 2"
            fill="none"
            stroke={sparklineColor}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        );
      case 'zigzag':
        return (
          <path
            d="M2 14 L 28 8 L 52 20 L 76 8 L 98 16"
            fill="none"
            stroke={sparklineColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      case 'stepped':
        return (
          <path
            d="M2 20 L 40 20 L 40 8 L 75 8 L 75 2 L 98 2"
            fill="none"
            stroke={sparklineColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      default:
        return (
          <path
            d="M2 14 C 30 14, 50 4, 98 10"
            fill="none"
            stroke={sparklineColor}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        );
    }
  };

  const badgeColorMap = {
    green: 'text-[#72c69a]',
    amber: 'text-[#d8aa55]',
    blue: 'text-[#7c78e8]',
    neutral: 'text-[#9da1b5]'
  };

  const dotColorMap = {
    green: 'bg-[#72c69a]',
    amber: 'bg-[#d8aa55]',
    blue: 'bg-[#7c78e8]',
    neutral: 'bg-[#9da1b5]'
  };

  const statusColorMap = {
    green: 'text-[#72c69a]',
    amber: 'text-[#d8aa55]',
    red: 'text-[#d87878]',
    neutral: 'text-[#9da1b5]'
  };

  return (
    <div className="nm-card p-6 flex flex-col justify-between select-none">
      {/* Top Row: Icon + Inset Badge */}
      <div className="flex items-center justify-between mb-6">
        <div className="nm-icon-box w-12 h-12 float-bob">
          {Icon && (
            <Icon 
              size={22} 
              className={iconColor}
              style={{ filter: `drop-shadow(0 2px 8px ${iconBgGlow})` }} 
            />
          )}
        </div>

        <div className="nm-badge px-3 py-1">
          <span className={`w-1.5 h-1.5 rounded-full ${dotColorMap[badgeStatus] || dotColorMap.green}`} />
          <span className={`tracking-wider text-[10px] font-bold ${badgeColorMap[badgeStatus] || badgeColorMap.green}`}>
            {badge}
          </span>
        </div>
      </div>

      {/* Center: Big Number + Labels */}
      <div>
        <div className="text-3xl lg:text-4xl font-bold tracking-tight text-[#f5f5f7] flex items-baseline gap-1">
          {typeof value === 'number' ? (
            <AnimatedCounter
              target={value}
              decimals={decimals}
              prefix={prefix}
              suffix={suffix}
            />
          ) : (
            <span>{prefix}{value}{suffix}</span>
          )}
        </div>

        <div className="mt-2 text-xs font-semibold text-[#f5f5f7]">
          {title}
        </div>
        <div className="text-[11px] text-[#9da1b5]">
          {subtitle}
        </div>
      </div>

      {/* Bottom: Status Indicator + Sparkline */}
      <div className="mt-5 pt-3 border-t border-[rgba(42,45,66,0.5)] flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-medium">
          <span className={`w-2 h-2 rounded-full ${dotColorMap[statusType] || dotColorMap.green} dot-pulse`} />
          <span className={statusColorMap[statusType] || statusColorMap.green}>
            {statusText}
          </span>
        </div>

        <div className="w-20 h-6 shrink-0 flex items-center justify-end">
          <svg viewBox="0 0 100 24" className="w-full h-full overflow-visible">
            {renderSparkline()}
          </svg>
        </div>
      </div>
    </div>
  );
}
