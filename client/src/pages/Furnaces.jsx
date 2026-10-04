import React, { useState } from 'react';
import {
  Plus,
  AlertTriangle,
  ArrowRight,
  Activity,
  Thermometer,
  Zap,
  Gauge
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { formatKw, formatKva, formatKwh, formatSec } from '../utils/formatters';

export default function Furnaces({
  furnaces = [],
  onSelectFurnace,
  onAddFurnace
}) {
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
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <div className="text-[11px] uppercase tracking-[0.22em] text-metallo-orange font-mono mb-2">
            EQUIPMENT MONITORING
          </div>

          <h1 className="text-4xl md:text-5xl text-white leading-none">
            Furnaces
          </h1>

          <p className="mt-3 text-sm text-industrial-400 max-w-xl">
            Live operating condition, energy performance and efficiency
            across the foundry's induction furnaces.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="
            flex items-center gap-2
            px-4 py-2.5
            rounded-xl
            bg-metallo-orange
            hover:bg-metallo-orange-glow
            text-white
            text-sm font-semibold
            transition
            shadow-lg shadow-orange-950/20
          "
        >
          <Plus size={16} />
          Add Furnace
        </button>
      </div>

      {/* =====================================================
          SUMMARY STRIP
      ===================================================== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

        <div className="matte-surface border border-industrial-800 rounded-2xl px-4 py-4">
          <div className="text-[10px] uppercase tracking-wider text-industrial-500">
            Installed
          </div>
          <div className="text-2xl font-mono text-white mt-1">
            {furnaces.length}
          </div>
          <div className="text-xs text-industrial-500 mt-1">
            induction furnaces
          </div>
        </div>

        <div className="matte-surface border border-industrial-800 rounded-2xl px-4 py-4">
          <div className="text-[10px] uppercase tracking-wider text-industrial-500">
            Running
          </div>
          <div className="text-2xl font-mono text-white mt-1">
            {furnaces.filter((f) => f.status === 'RUNNING').length}
          </div>
          <div className="text-xs text-industrial-500 mt-1">
            actively melting
          </div>
        </div>

        <div className="matte-surface border border-industrial-800 rounded-2xl px-4 py-4">
          <div className="text-[10px] uppercase tracking-wider text-industrial-500">
            Holding
          </div>
          <div className="text-2xl font-mono text-white mt-1">
            {furnaces.filter((f) => f.status === 'HOLDING').length}
          </div>
          <div className="text-xs text-industrial-500 mt-1">
            currently holding
          </div>
        </div>

        <div className="matte-surface border border-industrial-800 rounded-2xl px-4 py-4">
          <div className="text-[10px] uppercase tracking-wider text-industrial-500">
            Attention
          </div>
          <div className="text-2xl font-mono text-white mt-1">
            {
              furnaces.filter(
                (f) =>
                  (f.status === 'HOLDING' &&
                    Number(f.currentHoldingMinutes || 0) > 30) ||
                  Number(f.currentPf || 1) < 0.95
              ).length
            }
          </div>
          <div className="text-xs text-industrial-500 mt-1">
            require review
          </div>
        </div>

      </div>

      {/* =====================================================
          FURNACE LIST
      ===================================================== */}
      <div className="space-y-5">

        {furnaces.map((f) => {
          const hasHoldingWarning =
            f.status === 'HOLDING' &&
            Number(f.currentHoldingMinutes || 0) > 30;

          const hasPfWarning =
            Number(f.currentPf || 1) < 0.95;

          const hasWarning =
            hasHoldingWarning || hasPfWarning;

          return (
            <div
              key={f.furnaceId}
              onClick={() => onSelectFurnace(f.furnaceId)}
              className={`
                group relative overflow-hidden
                rounded-3xl
                border
                cursor-pointer
                transition-all duration-300
                ${
                  hasWarning
                    ? 'border-amber-500/25 bg-amber-500/[0.025]'
                    : 'border-industrial-800 bg-industrial-900/70'
                }
                hover:border-metallo-orange/50
                hover:-translate-y-[1px]
              `}
            >

              {/* subtle orange atmosphere */}
              <div className="absolute inset-0 pointer-events-none opacity-60">
                <div
                  className="absolute -top-32 right-0 w-96 h-96 rounded-full blur-3xl"
                  style={{
                    background: 'rgba(216, 121, 50, 0.055)'
                  }}
                />
              </div>

              <div className="relative p-6 md:p-7">

                {/* =================================================
                    FURNACE HEADER
                ================================================= */}
                <div className="flex flex-wrap items-start justify-between gap-4">

                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-3xl md:text-4xl text-white leading-none">
                        {f.name || f.furnaceId}
                      </h2>

                      <StatusBadge
                        status={f.status}
                        size="md"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 text-xs font-mono text-industrial-400">
                      <span>{f.type || 'Induction'}</span>
                      <span className="text-industrial-700">•</span>
                      <span>{f.capacityTonnes} t capacity</span>
                      <span className="text-industrial-700">•</span>
                      <span>{f.meltingPowerKw} kW rated melt</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-[0.16em] text-industrial-500">
                      Furnace ID
                    </div>

                    <div className="font-mono text-sm text-industrial-300 mt-1">
                      {f.furnaceId}
                    </div>
                  </div>

                </div>

                {/* =================================================
                    PRIMARY TELEMETRY
                ================================================= */}
                <div className="mt-7 grid grid-cols-1 md:grid-cols-3 gap-3">

                  {/* Power */}
                  <div className="matte-surface rounded-2xl border border-industrial-800/80 p-5">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-industrial-500">
                      <Zap size={13} />
                      Active Draw
                    </div>

                    <div className="flex items-end gap-2 mt-3">
                      <span className="text-3xl font-mono text-white">
                        {formatKw(f.currentPowerKw)}
                      </span>
                    </div>

                    <div className="text-xs text-industrial-500 mt-2 font-mono">
                      Apparent power {formatKva(f.currentKva)}
                    </div>
                  </div>

                  {/* Temperature */}
                  <div className="matte-surface rounded-2xl border border-industrial-800/80 p-5">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-industrial-500">
                      <Thermometer size={13} />
                      Bath Temperature
                    </div>

                    <div className="flex items-end gap-2 mt-3">
                      <span className="text-3xl font-mono text-metallo-orange">
                        {f.temperatureC}°
                      </span>

                      <span className="text-xs text-industrial-500 mb-1">
                        C
                      </span>
                    </div>

                    <div className="text-xs text-industrial-500 mt-2 font-mono">
                      Setpoint 1480°C
                    </div>
                  </div>

                  {/* PF */}
                  <div className="matte-surface rounded-2xl border border-industrial-800/80 p-5">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-industrial-500">
                      <Activity size={13} />
                      Power Factor
                    </div>

                    <div className="flex items-end gap-2 mt-3">
                      <span
                        className={`text-3xl font-mono ${
                          hasPfWarning
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {f.currentPf?.toFixed(2)}
                      </span>
                    </div>

                    <div className="text-xs text-industrial-500 mt-2 font-mono">
                      Target ≥ 0.95
                    </div>
                  </div>

                </div>

                {/* =================================================
                    OPERATING DATA
                ================================================= */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">

                  <div className="border border-industrial-800/70 rounded-2xl px-5 py-4">
                    <div className="text-[10px] uppercase tracking-wider text-industrial-500">
                      Current Heat
                    </div>

                    <div className="text-sm font-mono text-industrial-200 mt-2">
                      {f.currentHeatId || 'Standby'}
                    </div>
                  </div>

                  <div className="border border-industrial-800/70 rounded-2xl px-5 py-4">
                    <div className="text-[10px] uppercase tracking-wider text-industrial-500">
                      Today's Energy
                    </div>

                    <div className="text-sm font-mono text-industrial-200 mt-2">
                      {formatKwh(f.todayEnergyKwh)}
                    </div>
                  </div>

                  <div className="border border-industrial-800/70 rounded-2xl px-5 py-4">
                    <div className="text-[10px] uppercase tracking-wider text-industrial-500">
                      Specific Energy
                    </div>

                    <div className="text-sm font-mono text-metallo-orange mt-2">
                      {formatSec(f.calculatedSec || 580)}
                    </div>
                  </div>

                </div>

                {/* =================================================
                    WARNINGS
                ================================================= */}
                {hasWarning && (
                  <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/[0.06] px-4 py-3">

                    <div className="flex items-start gap-3">
                      <AlertTriangle
                        size={16}
                        className="text-amber-400 mt-0.5 shrink-0"
                      />

                      <div>
                        {hasHoldingWarning && (
                          <div className="text-sm text-amber-300">
                            Holding for {f.currentHoldingMinutes} min
                          </div>
                        )}

                        {hasPfWarning && (
                          <div className="text-sm text-amber-300">
                            Power factor below target
                          </div>
                        )}

                        <div className="text-xs text-amber-400/60 mt-0.5">
                          Review furnace operation to reduce avoidable energy use.
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] uppercase tracking-wider text-amber-400/70">
                      Attention required
                    </span>
                  </div>
                )}

                {/* =================================================
                    FOOTER ACTION
                ================================================= */}
                <div className="mt-6 pt-5 border-t border-industrial-800/70 flex flex-wrap items-center justify-between gap-3">

                  <div className="flex items-center gap-2 text-xs font-mono text-industrial-500">
                    <Gauge size={13} />
                    <span>
                      {f.associatedHeats?.length || 3} associated heats today
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-metallo-orange">
                    View furnace analytics
                    <ArrowRight
                      size={15}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </div>

                </div>

              </div>
            </div>
          );
        })}

      </div>

      {/* =====================================================
          ADD FURNACE MODAL
      ===================================================== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="bg-industrial-900 border border-industrial-700 rounded-2xl p-6 max-w-md w-full shadow-2xl">

            <div className="mb-5">
              <div className="text-[10px] uppercase tracking-[0.18em] text-metallo-orange font-mono">
                EQUIPMENT SETUP
              </div>

              <h3 className="text-2xl text-white mt-1">
                Add Induction Furnace
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label className="text-xs text-industrial-400 block mb-1.5">
                  Furnace ID
                </label>

                <input
                  type="text"
                  value={formData.furnaceId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      furnaceId: e.target.value
                    })
                  }
                  className="w-full bg-industrial-950 border border-industrial-700 px-3 py-2.5 rounded-xl text-white outline-none focus:border-metallo-orange/60"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-industrial-400 block mb-1.5">
                  Display Name
                </label>

                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value
                    })
                  }
                  className="w-full bg-industrial-950 border border-industrial-700 px-3 py-2.5 rounded-xl text-white outline-none focus:border-metallo-orange/60"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">

                <div>
                  <label className="text-xs text-industrial-400 block mb-1.5">
                    Capacity (Tonnes)
                  </label>

                  <input
                    type="number"
                    step="0.1"
                    value={formData.capacityTonnes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        capacityTonnes: e.target.value
                      })
                    }
                    className="w-full bg-industrial-950 border border-industrial-700 px-3 py-2.5 rounded-xl text-white outline-none focus:border-metallo-orange/60"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-industrial-400 block mb-1.5">
                    Melt Power (kW)
                  </label>

                  <input
                    type="number"
                    value={formData.meltingPowerKw}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        meltingPowerKw: e.target.value
                      })
                    }
                    className="w-full bg-industrial-950 border border-industrial-700 px-3 py-2.5 rounded-xl text-white outline-none focus:border-metallo-orange/60"
                    required
                  />
                </div>

              </div>

              <div className="flex justify-end gap-2 pt-3">

                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-industrial-700 text-industrial-300 hover:text-white hover:bg-industrial-800 transition text-sm"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-metallo-orange text-white font-semibold hover:bg-metallo-orange-glow transition text-sm"
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