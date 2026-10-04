import React from 'react';
import { ArrowRight, TrendingDown, Zap, Clock, ShieldCheck, DollarSign } from 'lucide-react';
import { formatCurrency, formatKwh, formatKw, formatSec, formatTime } from '../utils/formatters';

export default function ScheduleComparison({ currentSchedule, optimizedSchedule }) {
  if (!currentSchedule || !optimizedSchedule) {
    return (
      <div className="p-8 text-center text-industrial-500 font-mono text-sm">
        No schedule data available. Click "Run Optimizer" to calculate.
      </div>
    );
  }

  const currentSummary = currentSchedule.summary || {};
  const optSummary = optimizedSchedule.summary || {};
  const savings = optimizedSchedule.potentialSavingsVsCurrent || {};

  return (
    <div className="space-y-6">
      {/* Dynamic Savings Callout Banner (Orange Ombré) */}
      <div className="ombre-orange-gradient border border-metallo-orange/30 rounded p-4 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-metallo-orange font-mono text-xs uppercase tracking-wider font-semibold">
              <Zap size={14} />
              <span>METALLO Optimization Engine Results</span>
            </div>
            <div className="text-2xl font-mono font-bold text-white mt-1">
              {formatCurrency(savings.cost || 0)} <span className="text-sm font-normal text-industrial-300">Estimated Daily Savings</span>
            </div>
            <div className="text-xs text-industrial-300 mt-0.5">
              Avoids {formatKwh(savings.energyKwh || 0)} of wasted thermal holding and reduces peak simultaneous draw by {formatKw(savings.peakDemandKwReduction || 0)}.
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-xs font-mono">
            <div className="bg-industrial-950/70 border border-industrial-800 rounded px-3 py-2">
              <div className="text-industrial-400">Avoidable Holding</div>
              <div className="text-amber-400 font-bold text-base mt-0.5">
                -{savings.holdingMinutesSaved || 0} min
              </div>
            </div>

            <div className="bg-industrial-950/70 border border-industrial-800 rounded px-3 py-2">
              <div className="text-industrial-400">Peak Demand</div>
              <div className="text-emerald-400 font-bold text-base mt-0.5">
                -{formatKw(savings.peakDemandKwReduction || 0)}
              </div>
            </div>

            <div className="bg-industrial-950/70 border border-industrial-800 rounded px-3 py-2">
              <div className="text-industrial-400">SEC Delta</div>
              <div className="text-metallo-orange font-bold text-base mt-0.5">
                -{formatSec(savings.secReduction || 0)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Delta Comparison Table */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Metric 1: Energy */}
        <div className="bg-industrial-900 border border-industrial-800 p-3 rounded">
          <div className="text-xs text-industrial-400 mb-1 flex items-center justify-between">
            <span>Total Energy</span>
            <Zap size={13} className="text-industrial-500" />
          </div>
          <div className="flex items-baseline gap-2 font-mono">
            <span className="text-industrial-400 line-through text-sm">{formatKwh(currentSummary.totalEnergyKwh)}</span>
            <ArrowRight size={12} className="text-industrial-500" />
            <span className="text-white text-base font-bold">{formatKwh(optSummary.totalEnergyKwh)}</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 font-mono">
            ↓ {formatKwh(savings.energyKwh)} (-{Math.round(((savings.energyKwh || 0) / (currentSummary.totalEnergyKwh || 1)) * 100)}%)
          </div>
        </div>

        {/* Metric 2: SEC */}
        <div className="bg-industrial-900 border border-industrial-800 p-3 rounded">
          <div className="text-xs text-industrial-400 mb-1 flex items-center justify-between">
            <span>Average SEC</span>
            <TrendingDown size={13} className="text-industrial-500" />
          </div>
          <div className="flex items-baseline gap-2 font-mono">
            <span className="text-industrial-400 line-through text-sm">{formatSec(currentSummary.averageSec)}</span>
            <ArrowRight size={12} className="text-industrial-500" />
            <span className="text-metallo-orange text-base font-bold">{formatSec(optSummary.averageSec)}</span>
          </div>
          <div className="text-[11px] text-metallo-orange mt-1 font-mono">
            ↓ {formatSec(savings.secReduction)} reduction
          </div>
        </div>

        {/* Metric 3: Peak Demand */}
        <div className="bg-industrial-900 border border-industrial-800 p-3 rounded">
          <div className="text-xs text-industrial-400 mb-1 flex items-center justify-between">
            <span>Peak Demand</span>
            <ShieldCheck size={13} className="text-industrial-500" />
          </div>
          <div className="flex items-baseline gap-2 font-mono">
            <span className="text-red-400 text-sm line-through">{formatKw(currentSummary.peakDemandKw)}</span>
            <ArrowRight size={12} className="text-industrial-500" />
            <span className="text-emerald-400 text-base font-bold">{formatKw(optSummary.peakDemandKw)}</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 font-mono">
            Staggered (demand safe)
          </div>
        </div>

        {/* Metric 4: Estimated Cost */}
        <div className="bg-industrial-900 border border-industrial-800 p-3 rounded">
          <div className="text-xs text-industrial-400 mb-1 flex items-center justify-between">
            <span>Estimated Cost</span>
            <DollarSign size={13} className="text-industrial-500" />
          </div>
          <div className="flex items-baseline gap-2 font-mono">
            <span className="text-industrial-400 line-through text-sm">{formatCurrency(currentSummary.totalCost)}</span>
            <ArrowRight size={12} className="text-industrial-500" />
            <span className="text-white text-base font-bold">{formatCurrency(optSummary.totalCost)}</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 font-mono">
            Saves {formatCurrency(savings.cost)}
          </div>
        </div>
      </div>

      {/* Side-by-side Gantt Schedule Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CURRENT PLAN */}
        <div className="bg-industrial-900/80 border border-industrial-800 rounded p-4">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-industrial-800">
            <div>
              <div className="font-mono text-xs uppercase tracking-wider text-industrial-400">UNOPTIMIZED BASELINE</div>
              <div className="font-bold text-base text-industrial-200">Current Production Schedule</div>
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-red-500/10 text-red-400 border border-red-500/30">
              High Holding Waste
            </span>
          </div>

          <div className="space-y-3">
            {(currentSchedule.items || []).map((item, idx) => (
              <div key={idx} className="bg-industrial-950 border border-industrial-800/80 rounded p-3 text-xs">
                <div className="flex items-center justify-between font-mono mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-industrial-100">{item.heatId}</span>
                    <span className="text-industrial-400 px-1.5 py-0.2 rounded bg-industrial-800">{item.furnaceId}</span>
                    <span className="text-industrial-400">{item.quantityTonnes}t</span>
                  </div>
                  <div className="text-industrial-300">
                    Pour: <span className="text-white font-semibold">{formatTime(item.plannedPourTime)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 font-mono text-[11px] text-industrial-400 bg-industrial-900/50 p-2 rounded mb-2">
                  <div>Melt: <span className="text-industrial-200">{formatTime(item.plannedStart)} – {formatTime(item.plannedEnd)}</span></div>
                  <div>Holding: <span className={item.holdingMinutes > 30 ? 'text-red-400 font-bold' : 'text-amber-400'}>{item.holdingMinutes} min</span></div>
                  <div>Tariff: <span className={item.tariffPeriod === 'PEAK' ? 'text-metallo-orange font-bold' : 'text-industrial-300'}>{item.tariffPeriod}</span></div>
                </div>

                {/* Progress bar visual */}
                <div className="h-2 w-full bg-industrial-800 rounded-full overflow-hidden flex">
                  <div className="h-full bg-metallo-orange/70" style={{ width: `${Math.max(10, Math.min(80, (item.meltDurationMinutes / (item.meltDurationMinutes + item.holdingMinutes)) * 100))}%` }} />
                  <div className="h-full bg-red-500/70" style={{ width: `${Math.max(5, Math.min(80, (item.holdingMinutes / (item.meltDurationMinutes + item.holdingMinutes)) * 100))}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* METALLO OPTIMIZED PLAN */}
        <div className="bg-industrial-900/80 border border-metallo-orange/40 rounded p-4 relative">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-industrial-800">
            <div>
              <div className="font-mono text-xs uppercase tracking-wider text-metallo-orange font-semibold">RECOMMENDED ACTION</div>
              <div className="font-bold text-base text-white">METALLO Optimized Schedule</div>
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Staggered & Synchronized
            </span>
          </div>

          <div className="space-y-3">
            {(optimizedSchedule.items || []).map((item, idx) => (
              <div key={idx} className="bg-industrial-950 border border-industrial-800/80 rounded p-3 text-xs">
                <div className="flex items-center justify-between font-mono mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-industrial-100">{item.heatId}</span>
                    <span className="text-industrial-400 px-1.5 py-0.2 rounded bg-industrial-800">{item.furnaceId}</span>
                    <span className="text-industrial-400">{item.quantityTonnes}t</span>
                  </div>
                  <div className="text-industrial-300">
                    Pour: <span className="text-white font-semibold">{formatTime(item.plannedPourTime)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 font-mono text-[11px] text-industrial-400 bg-industrial-900/50 p-2 rounded mb-2">
                  <div>Melt: <span className="text-industrial-200">{formatTime(item.plannedStart)} – {formatTime(item.plannedEnd)}</span></div>
                  <div>Holding: <span className="text-emerald-400 font-bold">{item.holdingMinutes} min</span></div>
                  <div>Tariff: <span className={item.tariffPeriod === 'PEAK' ? 'text-metallo-orange font-bold' : 'text-industrial-300'}>{item.tariffPeriod}</span></div>
                </div>

                {/* Progress bar visual */}
                <div className="h-2 w-full bg-industrial-800 rounded-full overflow-hidden flex">
                  <div className="h-full bg-metallo-orange" style={{ width: '85%' }} />
                  <div className="h-full bg-emerald-500/70" style={{ width: '15%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
