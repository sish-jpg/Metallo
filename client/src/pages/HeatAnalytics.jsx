import React, { useState } from 'react';
import {
  FlameKindling,
  Clock,
  AlertTriangle,
  Plus,
  Filter,
  ArrowRight,
  TrendingDown,
  Zap,
  DollarSign
} from 'lucide-react';
import VisualTimeline from '../components/VisualTimeline';
import Tooltip from '../components/Tooltip';
import { formatCurrency, formatKwh, formatSec, formatTime, formatNumber } from '../utils/formatters';

export default function HeatAnalytics({ heats = [], furnaces = [], onCreateHeat }) {
  const [selectedFurnace, setSelectedFurnace] = useState('ALL');
  const [filterWarningOnly, setFilterWarningOnly] = useState(false);
  const [expandedHeatId, setExpandedHeatId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New heat manual entry form state
  const [formData, setFormData] = useState({
    heatId: 'H-108',
    furnaceId: 'F1',
    productionTonnes: '1.0',
    grade: 'Grey Iron FG260',
    meltingDurationMinutes: '60',
    holdingDurationMinutes: '15',
    totalEnergyKwh: '605',
    averagePf: '0.95',
    notes: 'Manually entered heat cycle'
  });

  const filteredHeats = heats.filter((h) => {
    if (selectedFurnace !== 'ALL' && h.furnaceId !== selectedFurnace) return false;
    if (filterWarningOnly && !h.hasHoldingWarning && !h.hasSecWarning) return false;
    return true;
  });

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    onCreateHeat(formData);
    setShowAddModal(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-industrial-800 pb-4">
        <div>
          <div className="text-[11px] font-mono tracking-widest text-industrial-400 uppercase">
            BATCH THERMODYNAMICS & SEC
          </div>
          <h1 className="text-2xl font-mono font-bold tracking-tight text-white mt-0.5">
            Heat Analytics & Holding Analysis
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-metallo-orange hover:bg-metallo-orange-glow text-white text-xs font-mono font-semibold transition shadow-subtle"
          >
            <Plus size={14} />
            <span>Log Manual Heat</span>
          </button>
        </div>
      </div>

      {/* Filter and Summary Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-industrial-900 border border-industrial-800 p-3.5 rounded text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="text-industrial-400 flex items-center gap-1">
            <Filter size={13} />
            <span>Furnace:</span>
          </span>
          <select
            value={selectedFurnace}
            onChange={(e) => setSelectedFurnace(e.target.value)}
            className="bg-industrial-950 border border-industrial-700 text-white rounded px-2.5 py-1 text-xs"
          >
            <option value="ALL">All Furnaces</option>
            {furnaces.map((f) => (
              <option key={f.furnaceId} value={f.furnaceId}>
                {f.furnaceId} ({f.name})
              </option>
            ))}
          </select>

          <label className="flex items-center gap-1.5 text-industrial-300 cursor-pointer ml-2">
            <input
              type="checkbox"
              checked={filterWarningOnly}
              onChange={(e) => setFilterWarningOnly(e.target.checked)}
              className="rounded bg-industrial-950 border-industrial-700 text-metallo-orange focus:ring-0"
            />
            <span>Show Inefficient / Warning Heats Only</span>
          </label>
        </div>

        <div className="text-industrial-400">
          Showing <span className="text-white font-bold">{filteredHeats.length}</span> of {heats.length} heats
        </div>
      </div>

      {/* Heats List / Cards */}
      <div className="space-y-4">
        {filteredHeats.map((heat) => {
          const isExpanded = expandedHeatId === heat.heatId;
          const hasHoldingWarning = heat.holdingDurationMinutes > 30;

          return (
            <div
              key={heat.heatId}
              className={`bg-industrial-900 border rounded p-4 transition ${
                hasHoldingWarning
                  ? 'border-red-500/40 bg-red-950/10'
                  : 'border-industrial-800 hover:border-industrial-700'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-lg font-bold text-white">{heat.heatId}</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-industrial-800 text-industrial-300">
                      {heat.furnaceId}
                    </span>
                  </div>

                  <span className="text-xs font-mono text-industrial-400">
                    {heat.grade} • {heat.productionTonnes}t
                  </span>

                  {hasHoldingWarning && (
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-red-500/20 border border-red-500/40 text-red-400 font-semibold flex items-center gap-1">
                      <AlertTriangle size={11} />
                      Excess Holding ({heat.holdingDurationMinutes}m)
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="text-right">
                    <div className="text-industrial-500 text-[10px]">TOTAL ENERGY</div>
                    <div className="font-bold text-white">{formatKwh(heat.totalEnergyKwh)}</div>
                  </div>

                  <div className="text-right">
                    <div className="text-industrial-500 text-[10px]">SEC (DYNAMIC)</div>
                    <div className={`font-bold ${heat.secKwhPerTonne > 640 ? 'text-red-400' : 'text-metallo-orange'}`}>
                      {formatSec(heat.secKwhPerTonne)}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-industrial-500 text-[10px]">TOTAL COST</div>
                    <div className="font-bold text-white">{formatCurrency(heat.tariffBreakdown?.totalCost)}</div>
                  </div>

                  <button
                    onClick={() => setExpandedHeatId(isExpanded ? null : heat.heatId)}
                    className="p-1.5 rounded bg-industrial-800 hover:bg-industrial-700 text-industrial-300 hover:text-white transition"
                    aria-label="Toggle details"
                  >
                    <ArrowRight size={14} className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Compact Visual Timeline Bar */}
              <div className="mt-3">
                <VisualTimeline
                  meltDurationMinutes={heat.meltingDurationMinutes || 60}
                  holdingDurationMinutes={heat.holdingDurationMinutes || 0}
                  holdingThresholdMinutes={30}
                  meltingEnergyKwh={heat.meltingEnergyKwh || 580}
                  holdingEnergyKwh={heat.holdingEnergyKwh || 0}
                  excessHoldingCost={heat.excessHoldingCost || 0}
                  startTime={heat.meltStartTime}
                  pourTime={heat.actualPourTime || heat.plannedPourTime}
                  showLabels={isExpanded}
                />
              </div>

              {/* Progressive Disclosure: Deep Dive Breakdown */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-industrial-800 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                  {/* Energy Division */}
                  <div className="bg-industrial-950 p-3 rounded border border-industrial-800/80 space-y-1.5">
                    <div className="text-industrial-400 font-semibold mb-1 uppercase text-[10px]">Energy Partition</div>
                    <div className="flex justify-between">
                      <span className="text-industrial-500">Melting Energy:</span>
                      <span className="text-white">{formatKwh(heat.meltingEnergyKwh)} ({heat.meltingDurationMinutes}m)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-industrial-500">Holding Energy:</span>
                      <span className={heat.holdingEnergyKwh > 30 ? 'text-amber-400 font-semibold' : 'text-white'}>
                        {formatKwh(heat.holdingEnergyKwh)} ({heat.holdingDurationMinutes}m)
                      </span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-industrial-800">
                      <span className="text-industrial-400">Total Consumed:</span>
                      <span className="text-metallo-orange font-bold">{formatKwh(heat.totalEnergyKwh)}</span>
                    </div>
                  </div>

                  {/* Holding Loss Analysis */}
                  <div className="bg-industrial-950 p-3 rounded border border-industrial-800/80 space-y-1.5">
                    <div className="text-industrial-400 font-semibold mb-1 uppercase text-[10px]">Holding Impact Analysis</div>
                    <div className="flex justify-between">
                      <span className="text-industrial-500">Threshold:</span>
                      <span className="text-industrial-300">30 min recommended</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-industrial-500">Excess Duration:</span>
                      <span className={heat.excessHoldingMinutes > 0 ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                        {heat.excessHoldingMinutes > 0 ? `+${heat.excessHoldingMinutes} min` : '0 min (Nominal)'}
                      </span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-industrial-800">
                      <span className="text-industrial-400">Avoidable Loss:</span>
                      <span className="text-red-400 font-bold">{formatCurrency(heat.excessHoldingCost || 0)}</span>
                    </div>
                  </div>

                  {/* Tariff & Power Factor */}
                  <div className="bg-industrial-950 p-3 rounded border border-industrial-800/80 space-y-1.5">
                    <div className="text-industrial-400 font-semibold mb-1 uppercase text-[10px]">Tariff & Power Factor</div>
                    <div className="flex justify-between">
                      <span className="text-industrial-500">Average PF:</span>
                      <span className={heat.averagePf < 0.95 ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                        {heat.averagePf?.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-industrial-500">Peak Window Overlap:</span>
                      <span className={heat.tariffBreakdown?.peakKwh > 0 ? 'text-metallo-orange font-semibold' : 'text-industrial-300'}>
                        {formatKwh(heat.tariffBreakdown?.peakKwh || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-industrial-800">
                      <span className="text-industrial-400">Calculated Cost:</span>
                      <span className="text-white font-bold">{formatCurrency(heat.tariffBreakdown?.totalCost)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Manual Entry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-industrial-900 border border-industrial-700 rounded p-6 max-w-lg w-full font-mono text-xs space-y-4">
            <h3 className="text-base font-bold text-white">Log Manual Heat Production</h3>
            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-industrial-400 block mb-1">Heat ID</label>
                  <input
                    type="text"
                    value={formData.heatId}
                    onChange={(e) => setFormData({ ...formData, heatId: e.target.value })}
                    className="w-full bg-industrial-950 border border-industrial-700 px-3 py-2 rounded text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-industrial-400 block mb-1">Furnace</label>
                  <select
                    value={formData.furnaceId}
                    onChange={(e) => setFormData({ ...formData, furnaceId: e.target.value })}
                    className="w-full bg-industrial-950 border border-industrial-700 px-3 py-2 rounded text-white"
                  >
                    {furnaces.map((f) => (
                      <option key={f.furnaceId} value={f.furnaceId}>{f.furnaceId} ({f.name})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-industrial-400 block mb-1">Quantity (Tonnes)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.productionTonnes}
                    onChange={(e) => setFormData({ ...formData, productionTonnes: e.target.value })}
                    className="w-full bg-industrial-950 border border-industrial-700 px-3 py-2 rounded text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-industrial-400 block mb-1">Grade</label>
                  <input
                    type="text"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full bg-industrial-950 border border-industrial-700 px-3 py-2 rounded text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-industrial-400 block mb-1">Melting Duration (min)</label>
                  <input
                    type="number"
                    value={formData.meltingDurationMinutes}
                    onChange={(e) => setFormData({ ...formData, meltingDurationMinutes: e.target.value })}
                    className="w-full bg-industrial-950 border border-industrial-700 px-3 py-2 rounded text-white"
                  />
                </div>
                <div>
                  <label className="text-industrial-400 block mb-1">Holding Duration (min)</label>
                  <input
                    type="number"
                    value={formData.holdingDurationMinutes}
                    onChange={(e) => setFormData({ ...formData, holdingDurationMinutes: e.target.value })}
                    className="w-full bg-industrial-950 border border-industrial-700 px-3 py-2 rounded text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-industrial-400 block mb-1">Total Energy (kWh)</label>
                  <input
                    type="number"
                    value={formData.totalEnergyKwh}
                    onChange={(e) => setFormData({ ...formData, totalEnergyKwh: e.target.value })}
                    className="w-full bg-industrial-950 border border-industrial-700 px-3 py-2 rounded text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-industrial-400 block mb-1">Power Factor (PF)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.1"
                    max="1.0"
                    value={formData.averagePf}
                    onChange={(e) => setFormData({ ...formData, averagePf: e.target.value })}
                    className="w-full bg-industrial-950 border border-industrial-700 px-3 py-2 rounded text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded bg-industrial-800 text-industrial-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-metallo-orange text-white font-semibold hover:bg-metallo-orange-glow"
                >
                  Save Heat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
