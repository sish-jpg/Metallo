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
    if (onAddFurnace) {
      onAddFurnace(formData);
    }
    setShowAddModal(false);
  };

  const meltingCount = furnaces.filter((f) => f.status === 'MELTING' || f.status === 'RUNNING').length;
  const holdingCount = furnaces.filter((f) => f.status === 'HOLDING').length;
  const attentionCount = furnaces.filter(
    (f) =>
      (f.status === 'HOLDING' && Number(f.currentHoldingMinutes || 0) > 30) ||
      Number(f.currentPf || 1) < 0.95
  ).length;

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-[#2a2d42] pb-4">
        <div>
          <div className="text-[11px] font-mono tracking-widest text-[#7c78e8] uppercase mb-1">
            EQUIPMENT MONITORING & TELEMETRY
          </div>

          <h1 className="text-2xl font-mono font-bold tracking-tight text-[#f5f5f7]">
            Furnaces
          </h1>

          <p className="mt-1 text-xs text-[#9da1b5] max-w-xl">
            Live operating condition, thermodynamic performance and energy efficiency
            across the foundry's induction melting furnaces.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="
            nm-btn
            flex items-center gap-2
            px-4 py-2.5
            rounded-[18px]
            bg-[#7c78e8]
            hover:bg-[#918df2]
            text-[#f5f5f7]
            text-xs font-mono font-bold
            transition-all
            shadow-[4px_4px_10px_rgba(20,21,42,0.45),-4px_-4px_10px_rgba(42,45,66,0.35)]
          "
        >
          <Plus size={14} />
          <span>Add Furnace</span>
        </button>
      </div>

      {/* =====================================================
          SUMMARY STRIP (Neumorphic Cards)
      ===================================================== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <div className="bg-[#25283a] border border-[#2e324a] rounded-[20px] p-4 shadow-[4px_4px_10px_rgba(20,21,42,0.45),-4px_-4px_10px_rgba(42,45,66,0.35)] font-mono">
          <div className="text-[10px] uppercase tracking-wider text-[#9da1b5]">
            Installed
          </div>
          <div className="text-2xl font-bold text-[#f5f5f7] mt-1">
            {furnaces.length}
          </div>
          <div className="text-xs text-[#9da1b5] mt-1">
            induction units
          </div>
        </div>

        <div className="bg-[#25283a] border border-[#2e324a] rounded-[20px] p-4 shadow-[4px_4px_10px_rgba(20,21,42,0.45),-4px_-4px_10px_rgba(42,45,66,0.35)] font-mono">
          <div className="text-[10px] uppercase tracking-wider text-[#72c69a]">
            Actively Melting
          </div>
          <div className="text-2xl font-bold text-[#72c69a] mt-1">
            {meltingCount}
          </div>
          <div className="text-xs text-[#9da1b5] mt-1">
            high thermal draw
          </div>
        </div>

        <div className="bg-[#25283a] border border-[#2e324a] rounded-[20px] p-4 shadow-[4px_4px_10px_rgba(20,21,42,0.45),-4px_-4px_10px_rgba(42,45,66,0.35)] font-mono">
          <div className="text-[10px] uppercase tracking-wider text-[#d8aa55]">
            Holding Phase
          </div>
          <div className="text-2xl font-bold text-[#d8aa55] mt-1">
            {holdingCount}
          </div>
          <div className="text-xs text-[#9da1b5] mt-1">
            thermal standby
          </div>
        </div>

        <div className="bg-[#25283a] border border-[#2e324a] rounded-[20px] p-4 shadow-[4px_4px_10px_rgba(20,21,42,0.45),-4px_-4px_10px_rgba(42,45,66,0.35)] font-mono">
          <div className="text-[10px] uppercase tracking-wider text-[#d87878]">
            Attention Required
          </div>
          <div className="text-2xl font-bold text-[#d87878] mt-1">
            {attentionCount}
          </div>
          <div className="text-xs text-[#9da1b5] mt-1">
            holding / PF alerts
          </div>
        </div>

      </div>

      {/* =====================================================
          FURNACE LIST (Neumorphic Surfaces)
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
                rounded-[24px]
                border
                cursor-pointer
                transition-all duration-300
                bg-[#25283a]
                shadow-[6px_6px_14px_rgba(20,21,42,0.45),-6px_-6px_14px_rgba(42,45,66,0.35)]
                ${
                  hasWarning
                    ? 'border-[#d8aa55]/40 hover:border-[#d8aa55]'
                    : 'border-[#2e324a] hover:border-[#7c78e8]/60'
                }
                hover:-translate-y-1
              `}
            >
              <div className="p-6 md:p-7">

                {/* =================================================
                    FURNACE HEADER
                ================================================= */}
                <div className="flex flex-wrap items-start justify-between gap-4">

                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl md:text-3xl font-mono font-bold text-[#f5f5f7] leading-none">
                        {f.name || f.furnaceId}
                      </h2>

                      <StatusBadge
                        status={f.status}
                        size="md"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2.5 text-xs font-mono text-[#9da1b5]">
                      <span>{f.type || 'Induction furnace'}</span>
                      <span className="text-[#383c56]">•</span>
                      <span>{f.capacityTonnes} t capacity</span>
                      <span className="text-[#383c56]">•</span>
                      <span>{f.meltingPowerKw} kW rated melt</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-wider text-[#9da1b5]">
                      Furnace ID
                    </div>

                    <div className="font-mono text-sm font-bold text-[#c5c9dc] mt-0.5">
                      {f.furnaceId}
                    </div>
                  </div>

                </div>

                {/* =================================================
                    PRIMARY TELEMETRY (Neumorphic Insets)
                ================================================= */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">

                  {/* Power */}
                  <div className="nm-inset rounded-[18px] p-4">
                    <div className="flex items-center gap-2 text-[10px] uppercase font-mono tracking-wider text-[#9da1b5]">
                      <Zap size={13} className="text-[#7c78e8]" />
                      Active Power
                    </div>

                    <div className="flex items-end gap-2 mt-2">
                      <span className="text-2xl md:text-3xl font-mono font-bold text-[#f5f5f7]">
                        {formatKw(f.currentPowerKw)}
                      </span>
                    </div>

                    <div className="text-xs text-[#9da1b5] mt-1 font-mono">
                      Apparent load: {formatKva(f.currentKva)}
                    </div>
                  </div>

                  {/* Temperature */}
                  <div className="nm-inset rounded-[18px] p-4">
                    <div className="flex items-center gap-2 text-[10px] uppercase font-mono tracking-wider text-[#9da1b5]">
                      <Thermometer size={13} className="text-[#7c78e8]" />
                      Bath Temperature
                    </div>

                    <div className="flex items-end gap-2 mt-2">
                      <span className="text-2xl md:text-3xl font-mono font-bold text-[#7c78e8]">
                        {f.temperatureC}°C
                      </span>
                    </div>

                    <div className="text-xs text-[#9da1b5] mt-1 font-mono">
                      Target setpoint: 1480°C
                    </div>
                  </div>

                  {/* PF */}
                  <div className="nm-inset rounded-[18px] p-4">
                    <div className="flex items-center gap-2 text-[10px] uppercase font-mono tracking-wider text-[#9da1b5]">
                      <Activity size={13} className="text-[#72c69a]" />
                      Power Factor
                    </div>

                    <div className="flex items-end gap-2 mt-2">
                      <span
                        className={`text-2xl md:text-3xl font-mono font-bold ${
                          hasPfWarning
                            ? 'text-[#d8aa55]'
                            : 'text-[#72c69a]'
                        }`}
                      >
                        {f.currentPf?.toFixed(2)}
                      </span>
                    </div>

                    <div className="text-xs text-[#9da1b5] mt-1 font-mono">
                      HT Target ≥ 0.95
                    </div>
                  </div>

                </div>

                {/* =================================================
                    OPERATING DATA TILES
                ================================================= */}
                <div className="mt-3.5 grid grid-cols-1 md:grid-cols-3 gap-3 font-mono">

                  <div className="bg-[#202234] border border-[#2e324a] rounded-[16px] px-4 py-3">
                    <div className="text-[10px] uppercase tracking-wider text-[#9da1b5]">
                      Current Heat
                    </div>

                    <div className="text-sm font-bold text-[#f5f5f7] mt-1">
                      {f.currentHeatId || 'Standby'}
                    </div>
                  </div>

                  <div className="bg-[#202234] border border-[#2e324a] rounded-[16px] px-4 py-3">
                    <div className="text-[10px] uppercase tracking-wider text-[#9da1b5]">
                      Today's Energy
                    </div>

                    <div className="text-sm font-bold text-[#f5f5f7] mt-1">
                      {formatKwh(f.todayEnergyKwh)}
                    </div>
                  </div>

                  <div className="bg-[#202234] border border-[#2e324a] rounded-[16px] px-4 py-3">
                    <div className="text-[10px] uppercase tracking-wider text-[#9da1b5]">
                      Specific Energy (SEC)
                    </div>

                    <div className="text-sm font-bold text-[#7c78e8] mt-1">
                      {formatSec(f.calculatedSec || f.secKwhPerTonne || 580)}
                    </div>
                  </div>

                </div>

                {/* =================================================
                    WARNINGS
                ================================================= */}
                {hasWarning && (
                  <div className="mt-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-[16px] border border-[#d8aa55]/30 bg-[#d8aa55]/10 px-4 py-3">

                    <div className="flex items-start gap-3">
                      <AlertTriangle
                        size={16}
                        className="text-[#d8aa55] mt-0.5 shrink-0"
                      />

                      <div>
                        {hasHoldingWarning && (
                          <div className="text-xs font-bold text-[#d8aa55]">
                            Excessive Holding: {f.currentHoldingMinutes} min (threshold: 30 min)
                          </div>
                        )}

                        {hasPfWarning && (
                          <div className="text-xs font-bold text-[#d8aa55]">
                            Power factor sub-optimal ({f.currentPf?.toFixed(2)} &lt; 0.95)
                          </div>
                        )}

                        <div className="text-[11px] text-[#d8aa55]/80 mt-0.5">
                          Review furnace operational status to prevent avoidable energy waste and DISCOM penalty surcharges.
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#d8aa55] shrink-0 font-bold">
                      Attention required
                    </span>
                  </div>
                )}

                {/* =================================================
                    FOOTER ACTION
                ================================================= */}
                <div className="mt-5 pt-4 border-t border-[#2e324a] flex flex-wrap items-center justify-between gap-3">

                  <div className="flex items-center gap-2 text-xs font-mono text-[#9da1b5]">
                    <Gauge size={13} />
                    <span>
                      {f.associatedHeats?.length || 3} associated heats logged today
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#7c78e8] group-hover:text-[#918df2] transition-colors">
                    <span>View Furnace Telemetry</span>
                    <ArrowRight
                      size={14}
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
          ADD FURNACE MODAL (Neumorphic Dialog)
      ===================================================== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#14152a]/80 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="bg-[#25283a] border border-[#2e324a] rounded-[24px] p-6 max-w-md w-full shadow-[8px_8px_24px_rgba(20,21,42,0.6)]">

            <div className="mb-5">
              <div className="text-[10px] uppercase tracking-widest text-[#7c78e8] font-mono">
                EQUIPMENT CONFIGURATION
              </div>

              <h3 className="text-2xl font-mono font-bold text-[#f5f5f7] mt-1">
                Add Induction Furnace
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label className="text-xs font-mono text-[#9da1b5] block mb-1.5">
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
                  className="w-full nm-inset px-3.5 py-2.5 rounded-[14px] text-[#f5f5f7] font-mono text-sm outline-none border border-[#2e324a] focus:border-[#7c78e8]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-mono text-[#9da1b5] block mb-1.5">
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
                  className="w-full nm-inset px-3.5 py-2.5 rounded-[14px] text-[#f5f5f7] font-mono text-sm outline-none border border-[#2e324a] focus:border-[#7c78e8]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">

                <div>
                  <label className="text-xs font-mono text-[#9da1b5] block mb-1.5">
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
                    className="w-full nm-inset px-3.5 py-2.5 rounded-[14px] text-[#f5f5f7] font-mono text-sm outline-none border border-[#2e324a] focus:border-[#7c78e8]"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-[#9da1b5] block mb-1.5">
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
                    className="w-full nm-inset px-3.5 py-2.5 rounded-[14px] text-[#f5f5f7] font-mono text-sm outline-none border border-[#2e324a] focus:border-[#7c78e8]"
                    required
                  />
                </div>

              </div>

              <div className="flex justify-end gap-2.5 pt-3">

                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="nm-btn px-4 py-2 rounded-[14px] text-xs font-mono text-[#9da1b5] hover:text-[#f5f5f7]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="nm-btn px-5 py-2 rounded-[14px] bg-[#7c78e8] text-[#f5f5f7] font-mono text-xs font-bold shadow-[0_0_15px_rgba(124,120,232,0.3)] hover:bg-[#918df2]"
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