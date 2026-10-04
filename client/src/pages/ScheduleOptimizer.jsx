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
      await onOptimize({
        heats: plannedHeats,
        safetyBufferMinutes: Number(safetyBuffer),
        demandThresholdKw: Number(demandLimit)
      });
    } finally {
      setOptimizing(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-industrial-800 pb-4">
        <div>
          <div className="text-[11px] font-mono tracking-widest text-industrial-400 uppercase">
            ENERGY DECISION SUPPORT
          </div>
          <h1 className="text-2xl font-mono font-bold tracking-tight text-white mt-0.5">
            Production Schedule Optimizer
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRunOptimizer}
            disabled={optimizing}
            className="flex items-center gap-2 px-4 py-2 rounded bg-metallo-orange hover:bg-metallo-orange-glow text-white font-mono font-bold text-xs transition shadow-subtle disabled:opacity-50"
          >
            <Play size={13} fill="currentColor" />
            <span>{optimizing ? 'OPTIMIZING...' : 'RUN SCHEDULE OPTIMIZER'}</span>
          </button>
        </div>
      </div>

      {/* 4 Explainable Decision Rules Callout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
        <div className="bg-industrial-900 border border-industrial-800 p-3 rounded">
          <div className="text-metallo-orange font-bold flex items-center gap-1.5 mb-1">
            <Clock size={14} />
            <span>Rule 1: Back-Calculation</span>
          </div>
          <p className="text-industrial-300 text-[11px] leading-relaxed">
            Melt start = Mould pour time minus melt duration minus safety buffer. Minimizes unproductive bath holding.
          </p>
        </div>

        <div className="bg-industrial-900 border border-industrial-800 p-3 rounded">
          <div className="text-metallo-orange font-bold flex items-center gap-1.5 mb-1">
            <Zap size={14} />
            <span>Rule 2: Peak Avoidance</span>
          </div>
          <p className="text-industrial-300 text-[11px] leading-relaxed">
            Shifts melts outside 06:00–10:00 & 18:00–22:00 peak DISCOM tariff windows when pour deadlines allow.
          </p>
        </div>

        <div className="bg-industrial-900 border border-industrial-800 p-3 rounded">
          <div className="text-metallo-orange font-bold flex items-center gap-1.5 mb-1">
            <Shield size={14} />
            <span>Rule 3: Stagger Melts</span>
          </div>
          <p className="text-industrial-300 text-[11px] leading-relaxed">
            Prevents simultaneous melting of 600 kW furnaces to avoid exceeding 1,100 kW plant demand threshold.
          </p>
        </div>

        <div className="bg-industrial-900 border border-industrial-800 p-3 rounded">
          <div className="text-metallo-orange font-bold flex items-center gap-1.5 mb-1">
            <TrendingDown size={14} />
            <span>Rule 4: Holding Flag</span>
          </div>
          <p className="text-industrial-300 text-[11px] leading-relaxed">
            Quantifies avoidable kilowatt-hours for any holding exceeding the configured 30-minute threshold.
          </p>
        </div>
      </div>

      {/* Input Parameters & Planned Heats Table */}
      <div className="bg-industrial-900 border border-industrial-800 rounded p-4 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs font-mono uppercase tracking-wider text-white font-bold flex items-center gap-2">
            <Layers size={14} className="text-metallo-orange" />
            <span>Production Commitments & Optimization Constraints</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-industrial-400">Safety Buffer:</span>
              <input
                type="number"
                value={safetyBuffer}
                onChange={(e) => setSafetyBuffer(e.target.value)}
                className="w-16 bg-industrial-950 border border-industrial-700 px-2 py-1 rounded text-white text-center"
              />
              <span className="text-industrial-400">min</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-industrial-400">Demand Limit:</span>
              <input
                type="number"
                value={demandLimit}
                onChange={(e) => setDemandLimit(e.target.value)}
                className="w-20 bg-industrial-950 border border-industrial-700 px-2 py-1 rounded text-white text-center"
              />
              <span className="text-industrial-400">kW</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-industrial-950 text-industrial-400 border-b border-industrial-800">
              <tr>
                <th className="p-2.5">Heat ID</th>
                <th className="p-2.5">Required Mould Pour Time</th>
                <th className="p-2.5">Production Tonnes</th>
                <th className="p-2.5">Melt Duration</th>
                <th className="p-2.5">Assigned Furnace</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-industrial-800/60">
              {plannedHeats.map((h, idx) => (
                <tr key={idx} className="hover:bg-industrial-800/30">
                  <td className="p-2.5 font-bold text-white">{h.heatId}</td>
                  <td className="p-2.5">
                    <input
                      type="time"
                      value={h.pourTime}
                      onChange={(e) => handleHeatChange(idx, 'pourTime', e.target.value)}
                      className="bg-industrial-950 border border-industrial-700 px-2 py-1 rounded text-white text-xs font-mono"
                    />
                  </td>
                  <td className="p-2.5">
                    <input
                      type="number"
                      step="0.1"
                      value={h.quantityTonnes}
                      onChange={(e) => handleHeatChange(idx, 'quantityTonnes', parseFloat(e.target.value))}
                      className="w-16 bg-industrial-950 border border-industrial-700 px-2 py-1 rounded text-white text-xs font-mono"
                    />
                  </td>
                  <td className="p-2.5">
                    <input
                      type="number"
                      value={h.meltDurationMinutes}
                      onChange={(e) => handleHeatChange(idx, 'meltDurationMinutes', parseInt(e.target.value))}
                      className="w-20 bg-industrial-950 border border-industrial-700 px-2 py-1 rounded text-white text-xs font-mono"
                    /> min
                  </td>
                  <td className="p-2.5">
                    <select
                      value={h.preferredFurnace}
                      onChange={(e) => handleHeatChange(idx, 'preferredFurnace', e.target.value)}
                      className="bg-industrial-950 border border-industrial-700 px-2 py-1 rounded text-white text-xs font-mono"
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
