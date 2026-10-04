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
    if (onCreateHeat) {
      onCreateHeat(formData);
    }
    setShowAddModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-[#2a2d42] pb-4">
        <div>
          <div className="text-[11px] font-mono tracking-widest text-[#7c78e8] uppercase mb-1">
            BATCH THERMODYNAMICS & HOLDING METRICS
          </div>
          <h1 className="text-2xl font-mono font-bold tracking-tight text-[#f5f5f7]">
            Heat Analytics & Holding Analysis
          </h1>
          <p className="mt-1 text-xs text-[#9da1b5]">
            Batch-by-batch thermodynamic energy consumption, excess holding cost penalties, and SEC metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="nm-btn flex items-center gap-2 px-4 py-2.5 rounded-[18px] bg-[#7c78e8] hover:bg-[#918df2] text-[#f5f5f7] text-xs font-mono font-bold transition shadow-[4px_4px_10px_rgba(20,21,42,0.45),-4px_-4px_10px_rgba(42,45,66,0.35)]"
          >
            <Plus size={14} />
            <span>Log Manual Heat</span>
          </button>
        </div>
      </div>

      {/* Filter and Summary Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#25283a] border border-[#2e324a] p-4 rounded-[20px] shadow-[4px_4px_10px_rgba(20,21,42,0.45),-4px_-4px_10px_rgba(42,45,66,0.35)] text-xs font-mono">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[#9da1b5] flex items-center gap-1.5">
              <Filter size={13} className="text-[#7c78e8]" />
              <span>Furnace:</span>
            </span>
            <select
              value={selectedFurnace}
              onChange={(e) => setSelectedFurnace(e.target.value)}
              className="nm-inset text-[#f5f5f7] rounded-[12px] px-3 py-1.5 text-xs border border-[#2e324a] outline-none"
            >
              <option value="ALL">All Furnaces</option>
              {furnaces.map((f) => (
                <option key={f.furnaceId} value={f.furnaceId}>
                  {f.furnaceId} ({f.name})
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2 text-[#c5c9dc] cursor-pointer">
            <input
              type="checkbox"
              checked={filterWarningOnly}
              onChange={(e) => setFilterWarningOnly(e.target.checked)}
              className="rounded bg-[#1e2030] border-[#2e324a] text-[#7c78e8] focus:ring-0"
            />
            <span>Show Inefficient / Warning Heats Only</span>
          </label>
        </div>

        <div className="text-[#9da1b5]">
          Displaying <span className="text-[#f5f5f7] font-bold">{filteredHeats.length}</span> of {heats.length} heats
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
              className={`bg-[#25283a] border rounded-[22px] p-5 shadow-[4px_4px_10px_rgba(20,21,42,0.45),-4px_-4px_10px_rgba(42,45,66,0.35)] transition-all ${
                hasHoldingWarning
                  ? 'border-[#d87878]/40 hover:border-[#d87878]'
                  : 'border-[#2e324a] hover:border-[#7c78e8]/50'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-lg font-bold text-[#f5f5f7]">{heat.heatId}</span>
                    <span className="text-xs font-mono px-2.5 py-0.5 rounded-[8px] bg-[#1e2030] border border-[#2e324a] text-[#7c78e8] font-bold">
                      {heat.furnaceId}
                    </span>
                  </div>

                  <span className="text-xs font-mono text-[#9da1b5]">
                    {heat.grade} • {heat.productionTonnes}t
                  </span>

                  {hasHoldingWarning && (
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-[10px] bg-[#d87878]/15 border border-[#d87878]/30 text-[#d87878] font-bold flex items-center gap-1.5">
                      <AlertTriangle size={12} />
                      Excess Holding ({heat.holdingDurationMinutes}m)
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="text-right">
                    <div className="text-[#9da1b5] text-[10px] uppercase">TOTAL ENERGY</div>
                    <div className="font-bold text-[#f5f5f7]">{formatKwh(heat.totalEnergyKwh)}</div>
                  </div>

                  <div className="text-right">
                    <div className="text-[#9da1b5] text-[10px] uppercase">SEC (DYNAMIC)</div>
                    <div className={`font-bold ${heat.secKwhPerTonne > 640 ? 'text-[#d87878]' : 'text-[#7c78e8]'}`}>
                      {formatSec(heat.secKwhPerTonne)}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[#9da1b5] text-[10px] uppercase">TOTAL COST</div>
                    <div className="font-bold text-[#f5f5f7]">{formatCurrency(heat.tariffBreakdown?.totalCost)}</div>
                  </div>

                  <button
                    onClick={() => setExpandedHeatId(isExpanded ? null : heat.heatId)}
                    className="nm-btn p-2 rounded-[12px] text-[#9da1b5] hover:text-[#f5f5f7] transition"
                    aria-label="Toggle details"
                  >
                    <ArrowRight size={14} className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Compact Visual Timeline Bar */}
              <div className="mt-4">
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
                <div className="mt-4 pt-4 border-t border-[#2e324a] grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                  {/* Energy Division */}
                  <div className="nm-inset p-4 rounded-[16px] border border-[#2e324a] space-y-2">
                    <div className="text-[#7c78e8] font-bold mb-1 uppercase text-[10px] tracking-wider">Energy Partition</div>
                    <div className="flex justify-between">
                      <span className="text-[#9da1b5]">Melting Energy:</span>
                      <span className="text-[#f5f5f7] font-semibold">{formatKwh(heat.meltingEnergyKwh)} ({heat.meltingDurationMinutes}m)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#9da1b5]">Holding Energy:</span>
                      <span className={heat.holdingEnergyKwh > 30 ? 'text-[#d8aa55] font-bold' : 'text-[#f5f5f7]'}>
                        {formatKwh(heat.holdingEnergyKwh)} ({heat.holdingDurationMinutes}m)
                      </span>
                    </div>
                    <div className="flex justify-between pt-1.5 border-t border-[#2e324a]">
                      <span className="text-[#9da1b5]">Total Consumed:</span>
                      <span className="text-[#7c78e8] font-bold">{formatKwh(heat.totalEnergyKwh)}</span>
                    </div>
                  </div>

                  {/* Holding Loss Analysis */}
                  <div className="nm-inset p-4 rounded-[16px] border border-[#2e324a] space-y-2">
                    <div className="text-[#d8aa55] font-bold mb-1 uppercase text-[10px] tracking-wider">Holding Impact Analysis</div>
                    <div className="flex justify-between">
                      <span className="text-[#9da1b5]">Threshold:</span>
                      <span className="text-[#c5c9dc]">30 min target</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#9da1b5]">Excess Duration:</span>
                      <span className={heat.excessHoldingMinutes > 0 ? 'text-[#d87878] font-bold' : 'text-[#72c69a] font-bold'}>
                        {heat.excessHoldingMinutes > 0 ? `+${heat.excessHoldingMinutes} min` : '0 min (Optimal)'}
                      </span>
                    </div>
                    <div className="flex justify-between pt-1.5 border-t border-[#2e324a]">
                      <span className="text-[#9da1b5]">Avoidable Loss:</span>
                      <span className="text-[#d87878] font-bold">{formatCurrency(heat.excessHoldingCost || 0)}</span>
                    </div>
                  </div>

                  {/* Tariff & Power Factor */}
                  <div className="nm-inset p-4 rounded-[16px] border border-[#2e324a] space-y-2">
                    <div className="text-[#72c69a] font-bold mb-1 uppercase text-[10px] tracking-wider">Tariff & Power Factor</div>
                    <div className="flex justify-between">
                      <span className="text-[#9da1b5]">Average PF:</span>
                      <span className={heat.averagePf < 0.95 ? 'text-[#d8aa55] font-bold' : 'text-[#72c69a] font-bold'}>
                        {heat.averagePf?.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#9da1b5]">Peak Window Draw:</span>
                      <span className={heat.tariffBreakdown?.peakKwh > 0 ? 'text-[#d87878] font-bold' : 'text-[#c5c9dc]'}>
                        {formatKwh(heat.tariffBreakdown?.peakKwh || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-1.5 border-t border-[#2e324a]">
                      <span className="text-[#9da1b5]">Calculated Cost:</span>
                      <span className="text-[#f5f5f7] font-bold">{formatCurrency(heat.tariffBreakdown?.totalCost)}</span>
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
        <div className="fixed inset-0 z-50 bg-[#14152a]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#25283a] border border-[#2e324a] rounded-[24px] p-6 max-w-lg w-full font-mono text-xs space-y-4 shadow-[8px_8px_24px_rgba(20,21,42,0.6)]">
            <h3 className="text-base font-bold text-[#f5f5f7]">Log Manual Heat Production</h3>
            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#9da1b5] block mb-1">Heat ID</label>
                  <input
                    type="text"
                    value={formData.heatId}
                    onChange={(e) => setFormData({ ...formData, heatId: e.target.value })}
                    className="w-full nm-inset px-3 py-2 rounded-[12px] text-[#f5f5f7] border border-[#2e324a] outline-none focus:border-[#7c78e8]"
                    required
                  />
                </div>
                <div>
                  <label className="text-[#9da1b5] block mb-1">Furnace</label>
                  <select
                    value={formData.furnaceId}
                    onChange={(e) => setFormData({ ...formData, furnaceId: e.target.value })}
                    className="w-full nm-inset px-3 py-2 rounded-[12px] text-[#f5f5f7] border border-[#2e324a] outline-none"
                  >
                    {furnaces.map((f) => (
                      <option key={f.furnaceId} value={f.furnaceId}>{f.furnaceId} ({f.name})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#9da1b5] block mb-1">Quantity (Tonnes)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.productionTonnes}
                    onChange={(e) => setFormData({ ...formData, productionTonnes: e.target.value })}
                    className="w-full nm-inset px-3 py-2 rounded-[12px] text-[#f5f5f7] border border-[#2e324a] outline-none focus:border-[#7c78e8]"
                    required
                  />
                </div>
                <div>
                  <label className="text-[#9da1b5] block mb-1">Grade</label>
                  <input
                    type="text"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full nm-inset px-3 py-2 rounded-[12px] text-[#f5f5f7] border border-[#2e324a] outline-none focus:border-[#7c78e8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#9da1b5] block mb-1">Melting Duration (min)</label>
                  <input
                    type="number"
                    value={formData.meltingDurationMinutes}
                    onChange={(e) => setFormData({ ...formData, meltingDurationMinutes: e.target.value })}
                    className="w-full nm-inset px-3 py-2 rounded-[12px] text-[#f5f5f7] border border-[#2e324a] outline-none focus:border-[#7c78e8]"
                  />
                </div>
                <div>
                  <label className="text-[#9da1b5] block mb-1">Holding Duration (min)</label>
                  <input
                    type="number"
                    value={formData.holdingDurationMinutes}
                    onChange={(e) => setFormData({ ...formData, holdingDurationMinutes: e.target.value })}
                    className="w-full nm-inset px-3 py-2 rounded-[12px] text-[#f5f5f7] border border-[#2e324a] outline-none focus:border-[#7c78e8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#9da1b5] block mb-1">Total Energy (kWh)</label>
                  <input
                    type="number"
                    value={formData.totalEnergyKwh}
                    onChange={(e) => setFormData({ ...formData, totalEnergyKwh: e.target.value })}
                    className="w-full nm-inset px-3 py-2 rounded-[12px] text-[#f5f5f7] border border-[#2e324a] outline-none focus:border-[#7c78e8]"
                    required
                  />
                </div>
                <div>
                  <label className="text-[#9da1b5] block mb-1">Power Factor (PF)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.1"
                    max="1.0"
                    value={formData.averagePf}
                    onChange={(e) => setFormData({ ...formData, averagePf: e.target.value })}
                    className="w-full nm-inset px-3 py-2 rounded-[12px] text-[#f5f5f7] border border-[#2e324a] outline-none focus:border-[#7c78e8]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="nm-btn px-4 py-2 rounded-[14px] text-[#9da1b5] hover:text-[#f5f5f7]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="nm-btn px-5 py-2 rounded-[14px] bg-[#7c78e8] text-[#f5f5f7] font-bold hover:bg-[#918df2]"
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
