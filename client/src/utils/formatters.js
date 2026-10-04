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
    bg: 'bg-[#7c78e8]/15',
    text: 'text-[#7c78e8]',
    border: 'border-[#7c78e8]/30',
    indicator: 'bg-[#7c78e8]',
    label: 'MELTING'
  },
  HOLDING: {
    bg: 'bg-[#d8aa55]/15',
    text: 'text-[#d8aa55]',
    border: 'border-[#d8aa55]/30',
    indicator: 'bg-[#d8aa55]',
    label: 'HOLDING'
  },
  POURING: {
    bg: 'bg-[#d87878]/15',
    text: 'text-[#d87878]',
    border: 'border-[#d87878]/30',
    indicator: 'bg-[#d87878]',
    label: 'POURING'
  },
  READY: {
    bg: 'bg-[#72c69a]/15',
    text: 'text-[#72c69a]',
    border: 'border-[#72c69a]/30',
    indicator: 'bg-[#72c69a]',
    label: 'READY'
  },
  RUNNING: {
    bg: 'bg-[#7c78e8]/15',
    text: 'text-[#7c78e8]',
    border: 'border-[#7c78e8]/30',
    indicator: 'bg-[#7c78e8]',
    label: 'RUNNING'
  },
  IDLE: {
    bg: 'bg-[#9da1b5]/15',
    text: 'text-[#9da1b5]',
    border: 'border-[#9da1b5]/30',
    indicator: 'bg-[#9da1b5]',
    label: 'IDLE'
  },
  OFF: {
    bg: 'bg-[#58627e]/15',
    text: 'text-[#58627e]',
    border: 'border-[#58627e]/30',
    indicator: 'bg-[#58627e]',
    label: 'OFF'
  }
};
