import React, { useState } from 'react';
import { Flame, Plus, AlertTriangle, ArrowRight, Activity, Thermometer, Zap } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import Tooltip from '../components/Tooltip';
import { formatKw, formatKva, formatKwh, formatSec } from '../utils/formatters';

export default function Furnaces({ furnaces = [], onSelectFurnace, onAddFurnace }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    furnaceId: 'F3',
    name: 'Furnace F3 — Induction',
    capacityTonnes: '1.0',
    meltingPowerKw: '600',
    holdingPowerKw: '100'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddFurnace(formData);
    setShowAddModal(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-industrial-800 pb-4">
        <div>
          <div className="text-[11px] font-mono tracking-widest text-industrial-400 uppercase">
            EQUIPMENT TELEMETRY
          </div>
          <h1 className="text-2xl font-mono font-bold tracking-tight text-white mt-0.5">
            Induction Furnaces ({furnaces.length})
          </h1>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-industrial-800 hover:bg-industrial-700 text-industrial-200 hover:text-white border border-industrial-700 text-xs font-mono transition"
        >
          <Plus size={14} />
          <span>Add Induction Furnace</span>
        </button>
      </div>

      {/* Furnace Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {furnaces.map((f) => {
          const hasHoldingWarning = f.status === 'HOLDING' && f.currentHoldingMinutes > 30;
          const hasPfWarning = f.currentPf < 0.95;

          return (
            <div
              key={f.furnaceId}
              onClick={() => onSelectFurnace(f.furnaceId)}
              className="bg-industrial-900 border border-industrial-800 hover:border-metallo-orange/60 rounded p-5 transition cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xl font-bold text-white group-hover:text-metallo-orange transition-colors">
                        {f.name || f.furnaceId}
                      </span>
                    </div>
                    <div className="text-xs font-mono text-industrial-400 mt-0.5">
                      {f.type} • {f.capacityTonnes}t Capacity • {f.meltingPowerKw} kW Rated Melt
                    </div>
                  </div>
                  <StatusBadge status={f.status} size="md" />
                </div>

                {/* Primary Metric Grid */}
                <div className="grid grid-cols-3 gap-3 bg-industrial-950 p-3.5 rounded border border-industrial-800/80 font-mono text-xs">
                  <div>
                    <div className="text-[10px] text-industrial-500 uppercase flex items-center gap-1">
                      <Zap size={11} />
                      <span>Active Draw</span>
                    </div>
                    <div className="text-lg font-bold text-white mt-0.5">
                      {formatKw(f.currentPowerKw)}
                    </div>
                    <div className="text-[10px] text-industrial-400">
                      Apparent: {formatKva(f.currentKva)}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-industrial-500 uppercase flex items-center gap-1">
                      <Thermometer size={11} />
                      <span>Bath Temp</span>
                    </div>
                    <div className="text-lg font-bold text-metallo-orange mt-0.5">
                      {f.temperatureC}°C
                    </div>
                    <div className="text-[10px] text-industrial-400">
                      Setpoint: 1480°C
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-industrial-500 uppercase flex items-center gap-1">
                      <Activity size={11} />
                      <span>Power Factor</span>
                    </div>
                    <div className={`text-lg font-bold mt-0.5 ${hasPfWarning ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {f.currentPf?.toFixed(2)}
                    </div>
                    <div className="text-[10px] text-industrial-400">
                      Target: ≥0.95
                    </div>
                  </div>
                </div>

                {/* Secondary Row: Heat & SEC */}
                <div className="mt-4 grid grid-cols-3 gap-2 font-mono text-xs border-t border-industrial-800/60 pt-3">
                  <div>
                    <div className="text-[10px] text-industrial-500">CURRENT HEAT</div>
                    <div className="font-semibold text-industrial-200 mt-0.5">
                      {f.currentHeatId || 'Standby'}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-industrial-500">TODAY'S ENERGY</div>
                    <div className="font-semibold text-industrial-200 mt-0.5">
                      {formatKwh(f.todayEnergyKwh)}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-industrial-500">SEC (DYNAMIC)</div>
                    <div className="font-semibold text-metallo-orange mt-0.5">
                      {formatSec(f.calculatedSec || 580)}
                    </div>
                  </div>
                </div>

                {/* Warning flags */}
                {hasHoldingWarning && (
                  <div className="mt-3 bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-1.5 rounded text-xs font-mono flex items-center gap-2">
                    <AlertTriangle size={13} />
                    <span>Holding for {f.currentHoldingMinutes} min (exceeds 30 min threshold)</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-industrial-800 flex items-center justify-between text-xs font-mono text-industrial-400">
                <span>Associated heats: {f.associatedHeats?.length || 3}</span>
                <span className="text-metallo-orange group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Open Furnace Analytics <ArrowRight size={13} />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Furnace Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-industrial-900 border border-industrial-700 rounded p-6 max-w-md w-full font-mono text-xs space-y-4">
            <h3 className="text-base font-bold text-white">Add New Induction Furnace</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-industrial-400 block mb-1">Furnace ID</label>
                <input
                  type="text"
                  value={formData.furnaceId}
                  onChange={(e) => setFormData({ ...formData, furnaceId: e.target.value })}
                  className="w-full bg-industrial-950 border border-industrial-700 px-3 py-2 rounded text-white"
                  required
                />
              </div>

              <div>
                <label className="text-industrial-400 block mb-1">Display Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-industrial-950 border border-industrial-700 px-3 py-2 rounded text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-industrial-400 block mb-1">Capacity (Tonnes)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.capacityTonnes}
                    onChange={(e) => setFormData({ ...formData, capacityTonnes: e.target.value })}
                    className="w-full bg-industrial-950 border border-industrial-700 px-3 py-2 rounded text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-industrial-400 block mb-1">Melt Power (kW)</label>
                  <input
                    type="number"
                    value={formData.meltingPowerKw}
                    onChange={(e) => setFormData({ ...formData, meltingPowerKw: e.target.value })}
                    className="w-full bg-industrial-950 border border-industrial-700 px-3 py-2 rounded text-white"
                    required
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
                  Save Furnace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
