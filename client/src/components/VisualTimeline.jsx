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
      {/* Timeline Bar */}
      <div className="h-6 w-full bg-industrial-900 rounded-sm overflow-hidden flex border border-industrial-800">
        {/* Melting Phase */}
        <div
          style={{ width: `${meltPct}%` }}
          className="h-full bg-gradient-to-r from-metallo-orange/70 to-metallo-orange flex items-center justify-center text-[10px] font-mono text-white font-semibold transition-all relative group cursor-pointer"
          title={`Melting: ${meltDurationMinutes} min | ${formatNumber(meltingEnergyKwh, 0)} kWh`}
        >
          {meltPct > 20 && <span>MELT ({meltDurationMinutes}m)</span>}
        </div>

        {/* Normal Holding Phase */}
        {normalHoldPct > 0 && (
          <div
            style={{ width: `${normalHoldPct}%` }}
            className="h-full bg-amber-500/70 border-l border-amber-600 flex items-center justify-center text-[10px] font-mono text-amber-100 font-semibold transition-all cursor-pointer"
            title={`Normal Holding: ${normalHoldingMins} min`}
          >
            {normalHoldPct > 15 && <span>HOLD ({normalHoldingMins}m)</span>}
          </div>
        )}

        {/* Excess Holding Phase (Highlighted in red/amber pulse) */}
        {excessHoldPct > 0 && (
          <div
            style={{ width: `${excessHoldPct}%` }}
            className="h-full bg-red-600/80 border-l border-red-400 flex items-center justify-center text-[10px] font-mono text-white font-bold animate-pulse cursor-pointer"
            title={`EXCESS HOLDING: ${excessHoldingMins} min beyond threshold! Cost penalty: ${formatCurrency(excessHoldingCost)}`}
          >
            <span className="flex items-center gap-1">
              <AlertTriangle size={11} />
              {excessHoldPct > 18 && `+${excessHoldingMins}m EXCESS`}
            </span>
          </div>
        )}
      </div>

      {/* Markers & Metadata */}
      {showLabels && (
        <div className="mt-1.5 flex items-center justify-between text-[11px] font-mono text-industrial-400">
          <div className="flex items-center gap-1">
            <span className="text-industrial-500">Start:</span>
            <span className="text-industrial-200">{formatTime(startTime)}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-metallo-orange inline-block" />
              <span>Melt {meltDurationMinutes}m</span>
            </span>

            <span className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${excessHoldingMins > 0 ? 'bg-red-500' : 'bg-amber-400'} inline-block`} />
              <span>Hold {holdingDurationMinutes}m</span>
              {excessHoldingMins > 0 && (
                <span className="text-red-400 font-semibold">({excessHoldingMins}m excess)</span>
              )}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-industrial-500">Pour:</span>
            <span className="text-industrial-200">{formatTime(pourTime)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
