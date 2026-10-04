import React from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { formatTime, formatNumber, formatCurrency } from '../utils/formatters';

export default function VisualTimeline({
  meltDurationMinutes = 60,
  holdingDurationMinutes = 0,
  holdingThresholdMinutes = 30,
  meltingEnergyKwh = 580,
  holdingEnergyKwh = 0,
  excessHoldingCost = 0,
  startTime,
  pourTime,
  showLabels = true
}) {
  const totalMins = Math.max(1, meltDurationMinutes + holdingDurationMinutes);
  const meltPct = Math.min(100, Math.round((meltDurationMinutes / totalMins) * 100));

  const normalHoldingMins = Math.min(holdingDurationMinutes, holdingThresholdMinutes);
  const excessHoldingMins = Math.max(0, holdingDurationMinutes - holdingThresholdMinutes);

  const normalHoldPct = Math.round((normalHoldingMins / totalMins) * 100);
  const excessHoldPct = Math.round((excessHoldingMins / totalMins) * 100);

  return (
    <div className="w-full">
      {/* Timeline Bar with Neumorphic Inset */}
      <div className="h-7 w-full bg-[#1e2030] rounded-[10px] overflow-hidden flex border border-[#2e324a] shadow-[inset_2px_2px_5px_rgba(20,21,42,0.5)]">
        {/* Melting Phase */}
        <div
          style={{ width: `${meltPct}%` }}
          className="h-full bg-[#7c78e8] flex items-center justify-center text-[10px] font-mono text-[#f5f5f7] font-bold transition-all relative group cursor-pointer"
          title={`Melting: ${meltDurationMinutes} min | ${formatNumber(meltingEnergyKwh, 0)} kWh`}
        >
          {meltPct > 18 && <span>MELT ({meltDurationMinutes}m)</span>}
        </div>

        {/* Normal Holding Phase */}
        {normalHoldPct > 0 && (
          <div
            style={{ width: `${normalHoldPct}%` }}
            className="h-full bg-[#d8aa55]/70 border-l border-[#25283a] flex items-center justify-center text-[10px] font-mono text-[#f5f5f7] font-semibold transition-all cursor-pointer"
            title={`Normal Holding: ${normalHoldingMins} min`}
          >
            {normalHoldPct > 14 && <span>HOLD ({normalHoldingMins}m)</span>}
          </div>
        )}

        {/* Excess Holding Phase (Highlighted in red/amber pulse) */}
        {excessHoldPct > 0 && (
          <div
            style={{ width: `${excessHoldPct}%` }}
            className="h-full bg-[#d87878] border-l border-[#25283a] flex items-center justify-center text-[10px] font-mono text-[#f5f5f7] font-bold animate-pulse cursor-pointer shadow-[0_0_12px_rgba(216,120,120,0.5)]"
            title={`EXCESS HOLDING: ${excessHoldingMins} min beyond threshold! Cost penalty: ${formatCurrency(excessHoldingCost)}`}
          >
            <span className="flex items-center gap-1">
              <AlertTriangle size={11} />
              {excessHoldPct > 16 && `+${excessHoldingMins}m EXCESS`}
            </span>
          </div>
        )}
      </div>

      {/* Markers & Metadata */}
      {showLabels && (
        <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-[#9da1b5]">
          <div className="flex items-center gap-1.5">
            <span className="text-[#6b7280]">Start:</span>
            <span className="text-[#f5f5f7] font-semibold">{formatTime(startTime)}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#7c78e8] inline-block" />
              <span>Melt {meltDurationMinutes}m</span>
            </span>

            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${excessHoldingMins > 0 ? 'bg-[#d87878]' : 'bg-[#d8aa55]'} inline-block`} />
              <span>Hold {holdingDurationMinutes}m</span>
              {excessHoldingMins > 0 && (
                <span className="text-[#d87878] font-bold">({excessHoldingMins}m excess)</span>
              )}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[#6b7280]">Pour:</span>
            <span className="text-[#f5f5f7] font-semibold">{formatTime(pourTime)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
