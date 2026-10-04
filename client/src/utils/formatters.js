export function formatCurrency(val, symbol = '₹') {
  if (val === undefined || val === null || isNaN(val)) return `${symbol}0`;
  return `${symbol}${Number(val).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

export function formatNumber(val, decimals = 1) {
  if (val === undefined || val === null || isNaN(val)) return '0';
  return Number(val).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

export function formatKw(val) {
  return `${formatNumber(val, 0)} kW`;
}

export function formatKwh(val) {
  return `${formatNumber(val, 0)} kWh`;
}

export function formatKva(val) {
  return `${formatNumber(val, 0)} kVA`;
}

export function formatSec(val) {
  return `${formatNumber(val, 0)} kWh/t`;
}

export function formatTime(dateStr) {
  if (!dateStr) return '--:--';
  const d = new Date(dateStr);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '--';
  const d = new Date(dateStr);
  return d.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

export const STATUS_THEME = {
  MELTING: {
    bg: 'bg-metallo-orange/15',
    text: 'text-metallo-orange',
    border: 'border-metallo-orange/40',
    indicator: 'bg-metallo-orange',
    label: 'MELTING'
  },
  HOLDING: {
    bg: 'bg-amber-500/15',
    text: 'text-amber-400',
    border: 'border-amber-500/40',
    indicator: 'bg-amber-400',
    label: 'HOLDING'
  },
  POURING: {
    bg: 'bg-red-500/15',
    text: 'text-red-400',
    border: 'border-red-500/40',
    indicator: 'bg-red-400',
    label: 'POURING'
  },
  READY: {
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-400',
    border: 'border-emerald-500/40',
    indicator: 'bg-emerald-400',
    label: 'READY'
  },
  IDLE: {
    bg: 'bg-industrial-700/30',
    text: 'text-industrial-300',
    border: 'border-industrial-600/40',
    indicator: 'bg-industrial-400',
    label: 'IDLE'
  },
  OFF: {
    bg: 'bg-industrial-800/40',
    text: 'text-industrial-400',
    border: 'border-industrial-700/40',
    indicator: 'bg-industrial-600',
    label: 'OFF'
  }
};
