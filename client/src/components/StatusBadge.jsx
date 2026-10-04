import React from 'react';
import { STATUS_THEME } from '../utils/formatters';

export default function StatusBadge({ status = 'IDLE', size = 'md' }) {
  const theme = STATUS_THEME[status] || STATUS_THEME.IDLE;
  const isMelting = status === 'MELTING';
  const isHolding = status === 'HOLDING';

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3.5 py-1.5'
  }[size] || 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono tracking-wider font-semibold rounded-sm border ${theme.bg} ${theme.text} ${theme.border} ${sizeClasses}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${theme.indicator} ${
          isMelting ? 'heat-badge-pulse' : isHolding ? 'animate-pulse' : ''
        }`}
      />
      {theme.label}
    </span>
  );
}
