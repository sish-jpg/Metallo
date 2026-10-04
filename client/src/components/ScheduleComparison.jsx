import React from 'react';
import { ArrowRight, TrendingDown, Zap, Clock, ShieldCheck, DollarSign } from 'lucide-react';
import { formatCurrency, formatKwh, formatKw, formatSec, formatTime } from '../utils/formatters';

export default function ScheduleComparison({ currentSchedule, optimizedSchedule }) {
  if (!currentSchedule || !optimizedSchedule) {
    return (
      <div className="p-8 text-center text-[#9da1b5] font-mono text-sm">
        No schedule data available. Click "Run Schedule Optimizer" to calculate.
      </div>
    );
  }

  const currentSummary = currentSchedule.summary || {};
  const optSummary = optimizedSchedule.summary || {};
  const savings = optimizedSchedule.potentialSavingsVsCurrent || {};

  return (
    <div className="space-y-6">
      {/* Dynamic Savings Callout Banner (Neumorphic Card) */}
      <div className="bg-[#25283a] border border-[#2e324a] rounded-[24px] p-6 shadow-[6px_6px_14px_rgba(20,21,42,0.45),-6px_-6px_14px_rgba(42,45,66,0.35)] relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-[#7c78e8] font-mono text-xs uppercase tracking-wider font-bold">
              <Zap size={14} />
              <span>METALLO Optimization Engine Results</span>
            </div>
            <div className="text-3xl font-mono font-bold text-[#f5f5f7] mt-1.5">
              {formatCurrency(savings.cost || 0)} <span className="text-sm font-normal text-[#9da1b5]">Estimated Daily Savings</span>
            </div>
            <div className="text-xs text-[#9da1b5] mt-1">
              Avoids {formatKwh(savings.energyKwh || 0)} of wasted thermal holding and reduces peak simultaneous draw by {formatKw(savings.peakDemandKwReduction || 0)}.
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-xs font-mono">
            <div className="nm-inset border border-[#2e324a] rounded-[16px] px-4 py-2.5">
              <div className="text-[#9da1b5]">Avoidable Holding</div>
              <div className="text-[#d8aa55] font-bold text-base mt-0.5">
                -{savings.holdingMinutesSaved || 0} min
              </div>
            </div>

            <div className="nm-inset border border-[#2e324a] rounded-[16px] px-4 py-2.5">
              <div className="text-[#9da1b5]">Peak Demand</div>
              <div className="text-[#72c69a] font-bold text-base mt-0.5">
                -{formatKw(savings.peakDemandKwReduction || 0)}
              </div>
            </div>

            <div className="nm-inset border border-[#2e324a] rounded-[16px] px-4 py-2.5">
              <div className="text-[#9da1b5]">SEC Delta</div>
              <div className="text-[#7c78e8] font-bold text-base mt-0.5">
                -{formatSec(savings.secReduction || 0)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Delta Comparison Table */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1: Energy */}
        <div className="bg-[#25283a] border border-[#2e324a] p-4 rounded-[20px] shadow-[4px_4px_10px_rgba(20,21,42,0.45),-4px_-4px_10px_rgba(42,45,66,0.35)]">
          <div className="text-xs text-[#9da1b5] mb-1.5 flex items-center justify-between">
            <span>Total Energy</span>
            <Zap size={14} className="text-[#7c78e8]" />
          </div>
          <div className="flex items-baseline gap-2 font-mono">
            <span className="text-[#9da1b5] line-through text-sm">{formatKwh(currentSummary.totalEnergyKwh)}</span>
            <ArrowRight size={12} className="text-[#9da1b5]" />
            <span className="text-[#f5f5f7] text-base font-bold">{formatKwh(optSummary.totalEnergyKwh)}</span>
          </div>
          <div className="text-[11px] text-[#72c69a] mt-1.5 font-mono">
            ↓ {formatKwh(savings.energyKwh)} (-{Math.round(((savings.energyKwh || 0) / (currentSummary.totalEnergyKwh || 1)) * 100)}%)
          </div>
        </div>

        {/* Metric 2: SEC */}
        <div className="bg-[#25283a] border border-[#2e324a] p-4 rounded-[20px] shadow-[4px_4px_10px_rgba(20,21,42,0.45),-4px_-4px_10px_rgba(42,45,66,0.35)]">
          <div className="text-xs text-[#9da1b5] mb-1.5 flex items-center justify-between">
            <span>Average SEC</span>
            <TrendingDown size={14} className="text-[#7c78e8]" />
          </div>
          <div className="flex items-baseline gap-2 font-mono">
            <span className="text-[#9da1b5] line-through text-sm">{formatSec(currentSummary.averageSec)}</span>
            <ArrowRight size={12} className="text-[#9da1b5]" />
            <span className="text-[#7c78e8] text-base font-bold">{formatSec(optSummary.averageSec)}</span>
          </div>
          <div className="text-[11px] text-[#72c69a] mt-1.5 font-mono">
            ↓ {formatSec(savings.secReduction)} reduction
          </div>
        </div>

        {/* Metric 3: Peak Demand */}
        <div className="bg-[#25283a] border border-[#2e324a] p-4 rounded-[20px] shadow-[4px_4px_10px_rgba(20,21,42,0.45),-4px_-4px_10px_rgba(42,45,66,0.35)]">
          <div className="text-xs text-[#9da1b5] mb-1.5 flex items-center justify-between">
            <span>Peak Demand</span>
            <ShieldCheck size={14} className="text-[#72c69a]" />
          </div>
          <div className="flex items-baseline gap-2 font-mono">
            <span className="text-[#d87878] text-sm line-through">{formatKw(currentSummary.peakDemandKw)}</span>
            <ArrowRight size={12} className="text-[#9da1b5]" />
            <span className="text-[#72c69a] text-base font-bold">{formatKw(optSummary.peakDemandKw)}</span>
          </div>
          <div className="text-[11px] text-[#72c69a] mt-1.5 font-mono">
            Staggered (demand safe)
          </div>
        </div>

        {/* Metric 4: Estimated Cost */}
        <div className="bg-[#25283a] border border-[#2e324a] p-4 rounded-[20px] shadow-[4px_4px_10px_rgba(20,21,42,0.45),-4px_-4px_10px_rgba(42,45,66,0.35)]">
          <div className="text-xs text-[#9da1b5] mb-1.5 flex items-center justify-between">
            <span>Estimated Cost</span>
            <DollarSign size={14} className="text-[#72c69a]" />
          </div>
          <div className="flex items-baseline gap-2 font-mono">
            <span className="text-[#9da1b5] line-through text-sm">{formatCurrency(currentSummary.totalCost)}</span>
            <ArrowRight size={12} className="text-[#9da1b5]" />
            <span className="text-[#f5f5f7] text-base font-bold">{formatCurrency(optSummary.totalCost)}</span>
          </div>
          <div className="text-[11px] text-[#72c69a] mt-1.5 font-mono">
            Saves {formatCurrency(savings.cost)}
          </div>
        </div>
      </div>

      {/* Side-by-side Gantt Schedule Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CURRENT PLAN */}
        <div className="bg-[#25283a] border border-[#2e324a] rounded-[24px] p-6 shadow-[6px_6px_14px_rgba(20,21,42,0.45),-6px_-6px_14px_rgba(42,45,66,0.35)]">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#2e324a]">
            <div>
              <div className="font-mono text-xs uppercase tracking-wider text-[#9da1b5]">UNOPTIMIZED BASELINE</div>
              <div className="font-bold text-base text-[#f5f5f7] mt-0.5">Current Production Schedule</div>
            </div>
            <span className="px-2.5 py-1 rounded-[10px] text-[11px] font-mono bg-[#d87878]/15 text-[#d87878] border border-[#d87878]/30 font-bold">
              High Holding Waste
            </span>
          </div>

          <div className="space-y-3.5">
            {(currentSchedule.items || []).map((item, idx) => (
              <div key={idx} className="nm-inset border border-[#2e324a] rounded-[16px] p-4 text-xs">
                <div className="flex items-center justify-between font-mono mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#f5f5f7]">{item.heatId}</span>
                    <span className="text-[#7c78e8] px-2 py-0.5 rounded-[8px] bg-[#1e2030] border border-[#2e324a] font-bold">{item.furnaceId}</span>
                    <span className="text-[#9da1b5]">{item.quantityTonnes}t</span>
                  </div>
                  <div className="text-[#9da1b5]">
                    Pour: <span className="text-[#f5f5f7] font-bold">{formatTime(item.plannedPourTime)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 font-mono text-[11px] text-[#9da1b5] bg-[#202234] border border-[#2e324a] p-2.5 rounded-[12px] mb-2.5">
                  <div>Melt: <span className="text-[#f5f5f7]">{formatTime(item.plannedStart)} – {formatTime(item.plannedEnd)}</span></div>
                  <div>Holding: <span className={item.holdingMinutes > 30 ? 'text-[#d87878] font-bold' : 'text-[#d8aa55]'}>{item.holdingMinutes} min</span></div>
                  <div>Tariff: <span className={item.tariffPeriod === 'PEAK' ? 'text-[#d87878] font-bold' : 'text-[#c5c9dc]'}>{item.tariffPeriod}</span></div>
                </div>

                {/* Progress bar visual */}
                <div className="h-2 w-full bg-[#1e2030] rounded-full overflow-hidden flex border border-[#2e324a]">
                  <div className="h-full bg-[#7c78e8]" style={{ width: `${Math.max(10, Math.min(80, (item.meltDurationMinutes / (item.meltDurationMinutes + item.holdingMinutes)) * 100))}%` }} />
                  <div className="h-full bg-[#d87878]" style={{ width: `${Math.max(5, Math.min(80, (item.holdingMinutes / (item.meltDurationMinutes + item.holdingMinutes)) * 100))}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* METALLO OPTIMIZED PLAN */}
        <div className="bg-[#25283a] border border-[#7c78e8]/50 rounded-[24px] p-6 shadow-[6px_6px_14px_rgba(20,21,42,0.45),-6px_-6px_14px_rgba(42,45,66,0.35)] relative">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#2e324a]">
            <div>
              <div className="font-mono text-xs uppercase tracking-wider text-[#7c78e8] font-bold">RECOMMENDED DISPATCH</div>
              <div className="font-bold text-base text-[#f5f5f7] mt-0.5">METALLO Optimized Schedule</div>
            </div>
            <span className="px-2.5 py-1 rounded-[10px] text-[11px] font-mono bg-[#72c69a]/15 text-[#72c69a] border border-[#72c69a]/30 font-bold">
              Staggered & Synchronized
            </span>
          </div>

          <div className="space-y-3.5">
            {(optimizedSchedule.items || []).map((item, idx) => (
              <div key={idx} className="nm-inset border border-[#2e324a] rounded-[16px] p-4 text-xs">
                <div className="flex items-center justify-between font-mono mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#f5f5f7]">{item.heatId}</span>
                    <span className="text-[#7c78e8] px-2 py-0.5 rounded-[8px] bg-[#1e2030] border border-[#2e324a] font-bold">{item.furnaceId}</span>
                    <span className="text-[#9da1b5]">{item.quantityTonnes}t</span>
                  </div>
                  <div className="text-[#9da1b5]">
                    Pour: <span className="text-[#f5f5f7] font-bold">{formatTime(item.plannedPourTime)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 font-mono text-[11px] text-[#9da1b5] bg-[#202234] border border-[#2e324a] p-2.5 rounded-[12px] mb-2.5">
                  <div>Melt: <span className="text-[#f5f5f7]">{formatTime(item.plannedStart)} – {formatTime(item.plannedEnd)}</span></div>
                  <div>Holding: <span className="text-[#72c69a] font-bold">{item.holdingMinutes} min</span></div>
                  <div>Tariff: <span className={item.tariffPeriod === 'PEAK' ? 'text-[#d87878] font-bold' : 'text-[#c5c9dc]'}>{item.tariffPeriod}</span></div>
                </div>

                {/* Progress bar visual */}
                <div className="h-2 w-full bg-[#1e2030] rounded-full overflow-hidden flex border border-[#2e324a]">
                  <div className="h-full bg-[#7c78e8]" style={{ width: '85%' }} />
                  <div className="h-full bg-[#72c69a]" style={{ width: '15%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
