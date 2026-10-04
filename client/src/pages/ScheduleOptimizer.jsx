import React, { useState } from 'react';
import {
  CalendarClock,
  Zap,
  Play,
  CheckCircle2,
  Clock,
  Shield,
  Layers,
  TrendingDown
} from 'lucide-react';
import ScheduleComparison from '../components/ScheduleComparison';
import Tooltip from '../components/Tooltip';

export default function ScheduleOptimizer({ currentSchedule, optimizedSchedule, onOptimize }) {
  const [safetyBuffer, setSafetyBuffer] = useState(10);
  const [demandLimit, setDemandLimit] = useState(1100);
  const [optimizing, setOptimizing] = useState(false);

  // Editable planned heats configuration
  const [plannedHeats, setPlannedHeats] = useState([
    { heatId: 'H1', pourTime: '10:30', quantityTonnes: 1.0, meltDurationMinutes: 60, preferredFurnace: 'F1' },
    { heatId: 'H2', pourTime: '12:00', quantityTonnes: 1.0, meltDurationMinutes: 60, preferredFurnace: 'F2' },
    { heatId: 'H3', pourTime: '13:30', quantityTonnes: 1.0, meltDurationMinutes: 60, preferredFurnace: 'F1' },
    { heatId: 'H4', pourTime: '15:00', quantityTonnes: 1.0, meltDurationMinutes: 60, preferredFurnace: 'F2' }
  ]);

  const handleHeatChange = (index, field, value) => {
    const updated = [...plannedHeats];
    updated[index][field] = value;
    setPlannedHeats(updated);
  };

  const handleRunOptimizer = async () => {
    try {
      setOptimizing(true);
      if (onOptimize) {
        await onOptimize({
          heats: plannedHeats,
          safetyBufferMinutes: Number(safetyBuffer),
          demandThresholdKw: Number(demandLimit)
        });
      }
    } finally {
      setOptimizing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-[#2a2d42] pb-4">
        <div>
          <div className="text-[11px] font-mono tracking-widest text-[#7c78e8] uppercase mb-1">
            ENERGY DECISION SUPPORT & PRODUCTION DISPATCH
          </div>
          <h1 className="text-2xl font-mono font-bold tracking-tight text-[#f5f5f7]">
            Production Schedule Optimizer
          </h1>
          <p className="mt-1 text-xs text-[#9da1b5]">
            Algorithmic melt sequence optimization: back-calculated taps, peak tariff band avoidance, and staggered draw.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRunOptimizer}
            disabled={optimizing}
            className="nm-btn flex items-center gap-2 px-5 py-2.5 rounded-[18px] bg-[#7c78e8] hover:bg-[#918df2] text-[#f5f5f7] font-mono font-bold text-xs transition shadow-[4px_4px_10px_rgba(20,21,42,0.45),-4px_-4px_10px_rgba(42,45,66,0.35)] disabled:opacity-50"
          >
            <Play size={13} fill="currentColor" />
            <span>{optimizing ? 'OPTIMIZING SCHEDULE...' : 'RUN SCHEDULE OPTIMIZER'}</span>
          </button>
        </div>
      </div>

      {/* 4 Explainable Decision Rules Callout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
        <div className="bg-[#25283a] border border-[#2e324a] p-4 rounded-[20px] shadow-[4px_4px_10px_rgba(20,21,42,0.45),-4px_-4px_10px_rgba(42,45,66,0.35)]">
          <div className="text-[#7c78e8] font-bold flex items-center gap-1.5 mb-1.5">
            <Clock size={14} />
            <span>Rule 1: Back-Calculation</span>
          </div>
          <p className="text-[#9da1b5] text-[11px] leading-relaxed">
            Melt start = Mould pour time minus melt duration minus safety buffer. Minimizes unproductive bath holding.
          </p>
        </div>

        <div className="bg-[#25283a] border border-[#2e324a] p-4 rounded-[20px] shadow-[4px_4px_10px_rgba(20,21,42,0.45),-4px_-4px_10px_rgba(42,45,66,0.35)]">
          <div className="text-[#72c69a] font-bold flex items-center gap-1.5 mb-1.5">
            <Zap size={14} />
            <span>Rule 2: Peak Avoidance</span>
          </div>
          <p className="text-[#9da1b5] text-[11px] leading-relaxed">
            Shifts melts outside 06:00–10:00 & 18:00–22:00 peak DISCOM tariff windows when pour deadlines allow.
          </p>
        </div>

        <div className="bg-[#25283a] border border-[#2e324a] p-4 rounded-[20px] shadow-[4px_4px_10px_rgba(20,21,42,0.45),-4px_-4px_10px_rgba(42,45,66,0.35)]">
          <div className="text-[#d8aa55] font-bold flex items-center gap-1.5 mb-1.5">
            <Shield size={14} />
            <span>Rule 3: Stagger Melts</span>
          </div>
          <p className="text-[#9da1b5] text-[11px] leading-relaxed">
            Prevents simultaneous melting of 600 kW furnaces to avoid exceeding 1,100 kW plant demand threshold.
          </p>
        </div>

        <div className="bg-[#25283a] border border-[#2e324a] p-4 rounded-[20px] shadow-[4px_4px_10px_rgba(20,21,42,0.45),-4px_-4px_10px_rgba(42,45,66,0.35)]">
          <div className="text-[#d87878] font-bold flex items-center gap-1.5 mb-1.5">
            <TrendingDown size={14} />
            <span>Rule 4: Holding Flag</span>
          </div>
          <p className="text-[#9da1b5] text-[11px] leading-relaxed">
            Quantifies avoidable kilowatt-hours for any holding exceeding the configured 30-minute threshold.
          </p>
        </div>
      </div>

      {/* Input Parameters & Planned Heats Table */}
      <div className="bg-[#25283a] border border-[#2e324a] rounded-[24px] p-6 shadow-[6px_6px_14px_rgba(20,21,42,0.45),-6px_-6px_14px_rgba(42,45,66,0.35)] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs font-mono uppercase tracking-wider text-[#f5f5f7] font-bold flex items-center gap-2">
            <Layers size={14} className="text-[#7c78e8]" />
            <span>Production Commitments & Optimization Constraints</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-[#9da1b5]">Safety Buffer:</span>
              <input
                type="number"
                value={safetyBuffer}
                onChange={(e) => setSafetyBuffer(e.target.value)}
                className="w-16 nm-inset border border-[#2e324a] px-2 py-1.5 rounded-[10px] text-[#f5f5f7] text-center outline-none focus:border-[#7c78e8]"
              />
              <span className="text-[#9da1b5]">min</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[#9da1b5]">Demand Limit:</span>
              <input
                type="number"
                value={demandLimit}
                onChange={(e) => setDemandLimit(e.target.value)}
                className="w-20 nm-inset border border-[#2e324a] px-2 py-1.5 rounded-[10px] text-[#f5f5f7] text-center outline-none focus:border-[#7c78e8]"
              />
              <span className="text-[#9da1b5]">kW</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#1e2030] text-[#9da1b5] border-b border-[#2e324a]">
              <tr>
                <th className="p-3 font-semibold">Heat ID</th>
                <th className="p-3 font-semibold">Required Mould Pour Time</th>
                <th className="p-3 font-semibold">Production Tonnes</th>
                <th className="p-3 font-semibold">Melt Duration</th>
                <th className="p-3 font-semibold">Assigned Furnace</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2e324a]/60">
              {plannedHeats.map((h, idx) => (
                <tr key={idx} className="hover:bg-[#202234] transition">
                  <td className="p-3 font-bold text-[#7c78e8]">{h.heatId}</td>
                  <td className="p-3">
                    <input
                      type="time"
                      value={h.pourTime}
                      onChange={(e) => handleHeatChange(idx, 'pourTime', e.target.value)}
                      className="nm-inset border border-[#2e324a] px-2.5 py-1 rounded-[10px] text-[#f5f5f7] text-xs font-mono outline-none"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      step="0.1"
                      value={h.quantityTonnes}
                      onChange={(e) => handleHeatChange(idx, 'quantityTonnes', parseFloat(e.target.value))}
                      className="w-16 nm-inset border border-[#2e324a] px-2 py-1 rounded-[10px] text-[#f5f5f7] text-xs font-mono text-center outline-none"
                    />
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        value={h.meltDurationMinutes}
                        onChange={(e) => handleHeatChange(idx, 'meltDurationMinutes', parseInt(e.target.value))}
                        className="w-16 nm-inset border border-[#2e324a] px-2 py-1 rounded-[10px] text-[#f5f5f7] text-xs font-mono text-center outline-none"
                      />
                      <span className="text-[#9da1b5]">min</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <select
                      value={h.preferredFurnace}
                      onChange={(e) => handleHeatChange(idx, 'preferredFurnace', e.target.value)}
                      className="nm-inset border border-[#2e324a] px-2.5 py-1 rounded-[10px] text-[#f5f5f7] text-xs font-mono outline-none"
                    >
                      <option value="F1">Furnace F1 (600 kW)</option>
                      <option value="F2">Furnace F2 (600 kW)</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comparison View (CURRENT vs OPTIMIZED) */}
      <ScheduleComparison
        currentSchedule={currentSchedule}
        optimizedSchedule={optimizedSchedule}
      />
    </div>
  );
}
