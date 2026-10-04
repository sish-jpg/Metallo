import React from 'react';
import {
  Zap,
  TrendingDown,
  Flame,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Gauge,
  CalendarClock,
  Clock
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import Tooltip from '../components/Tooltip';
import { formatCurrency, formatKwh, formatKw, formatSec, formatTime } from '../utils/formatters';

export default function Overview({ data, onNavigate, onSelectFurnace, onSelectHeat }) {
  if (!data) {
    return (
      <div className="p-8 text-center text-industrial-400 font-mono text-sm">
        Loading foundry state...
      </div>
    );
  }

  const { foundry, kpis, furnaces = [], recentAlerts = [], recentHeats = [], demandTrend = [] } = data;

  const demandPct = Math.min(100, Math.round(((kpis.currentDemandKw || 0) / (foundry.contractDemandKw || 1400)) * 100));
  const isDemandWarning = kpis.currentDemandKw >= (foundry.demandThresholdKw || 1100);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-industrial-800 pb-4">
        <div>
          <div className="text-[11px] font-mono tracking-widest text-industrial-400 uppercase">
            FOUNDRY OPERATIONS DASHBOARD
          </div>
          <h1 className="text-2xl font-mono font-bold tracking-tight text-white mt-0.5">
            Operational Energy Snapshot
          </h1>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="px-3 py-1.5 rounded bg-industrial-900 border border-industrial-800">
            <span className="text-industrial-400">Contract Demand: </span>
            <span className="text-white font-semibold">{formatKw(foundry.contractDemandKw)}</span>
          </div>

          <div className="px-3 py-1.5 rounded bg-industrial-900 border border-industrial-800">
            <span className="text-industrial-400">Target PF: </span>
            <span className="text-white font-semibold">≥{foundry.powerFactorThreshold}</span>
          </div>
        </div>
      </div>

      {/* Progressive Disclosure Top Energy Band (Orange Ombré) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Group 1: Production & Specific Energy Consumption */}
        <div
          onClick={() => onNavigate('heats')}
          className="bg-industrial-900/80 hover:bg-industrial-900 border border-industrial-800 hover:border-industrial-700 transition cursor-pointer rounded p-4 group"
        >
          <div className="flex items-center justify-between text-xs text-industrial-400 mb-2">
            <span className="font-mono uppercase tracking-wider">Output & Energy Intensity</span>
            <Tooltip
              term="SEC (Specific Energy Consumption)"
              text="Total kilowatt-hours used divided by tonnes of molten metal produced. Lower is more efficient."
            />
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-3xl font-mono font-bold text-white group-hover:text-metallo-orange transition-colors">
                {formatSec(kpis.todayAverageSec)}
              </div>
              <div className="text-xs text-industrial-400 mt-1 font-mono">
                SEC benchmark: <span className="text-industrial-300">580 kWh/t</span>
              </div>
            </div>

            <div className="text-right font-mono">
              <div className="text-sm font-semibold text-industrial-200">
                {kpis.todayProductionTonnes} tonnes
              </div>
              <div className="text-xs text-industrial-400">
                {formatKwh(kpis.todayEnergyKwh)}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-industrial-800/60 flex items-center justify-between text-[11px] text-industrial-400 font-mono">
            <span>Tap-to-tap efficiency</span>
            <span className="flex items-center gap-1 text-industrial-300 group-hover:text-metallo-orange">
              Inspect heats <ArrowRight size={12} />
            </span>
          </div>
        </div>

        {/* Group 2: Demand & Apparent Load */}
        <div
          onClick={() => onNavigate('pf')}
          className="bg-industrial-900/80 hover:bg-industrial-900 border border-industrial-800 hover:border-industrial-700 transition cursor-pointer rounded p-4 group"
        >
          <div className="flex items-center justify-between text-xs text-industrial-400 mb-2">
            <span className="font-mono uppercase tracking-wider">Active Demand & Power Factor</span>
            <Tooltip
              term="Apparent Power (kVA)"
              text="kVA = kW / PF. A poor power factor increases apparent load, exhausting transformer headroom and triggering utility surcharges."
            />
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <div className={`text-3xl font-mono font-bold transition-colors ${isDemandWarning ? 'text-red-400' : 'text-white group-hover:text-metallo-orange'}`}>
                {formatKw(kpis.currentDemandKw)}
              </div>
              <div className="text-xs text-industrial-400 mt-1 font-mono">
                Apparent: <span className="text-industrial-300">{formatKw(kpis.currentDemandKva).replace('kW', 'kVA')}</span>
              </div>
            </div>

            <div className="text-right font-mono">
              <div className={`text-lg font-bold ${kpis.plantPowerFactor < 0.95 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {kpis.plantPowerFactor} PF
              </div>
              <div className="text-[11px] text-industrial-400">
                {kpis.plantPowerFactor < 0.95 ? 'Sub-optimal' : 'Compliant'}
              </div>
            </div>
          </div>

          {/* Demand Progress Bar */}
          <div className="mt-4 pt-3 border-t border-industrial-800/60">
            <div className="flex items-center justify-between text-[11px] font-mono mb-1 text-industrial-400">
              <span>{demandPct}% of contract</span>
              <span>Sanction: {formatKw(foundry.contractDemandKw)}</span>
            </div>
            <div className="h-1.5 w-full bg-industrial-800 rounded-full overflow-hidden">
              <div
                style={{ width: `${demandPct}%` }}
                className={`h-full transition-all ${isDemandWarning ? 'bg-red-500' : 'bg-metallo-orange'}`}
              />
            </div>
          </div>
        </div>

        {/* Group 3: Financial Exposure & Potential Savings */}
        <div
          onClick={() => onNavigate('energy')}
          className="ombre-orange-gradient border border-metallo-orange/30 hover:border-metallo-orange/60 transition cursor-pointer rounded p-4 group"
        >
          <div className="flex items-center justify-between text-xs text-metallo-orange mb-2 font-mono">
            <span className="uppercase tracking-wider font-semibold">Energy Cost & Savings</span>
            <Zap size={14} />
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-3xl font-mono font-bold text-white">
                {formatCurrency(kpis.estimatedCostToday)}
              </div>
              <div className="text-xs text-industrial-300 mt-1 font-mono">
                HT Time-of-Day Tariff
              </div>
            </div>

            <div className="text-right font-mono">
              <div className="text-sm font-bold text-amber-400">
                {formatCurrency(kpis.potentialSavingsToday)}
              </div>
              <div className="text-[11px] text-industrial-400">
                Avoidable holding waste
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-industrial-800/60 flex items-center justify-between text-[11px] text-industrial-300 font-mono">
            <span>Schedule optimization</span>
            <span className="flex items-center gap-1 text-metallo-orange group-hover:underline">
              Analyze tariffs <ArrowRight size={12} />
            </span>
          </div>
        </div>
      </div>

      {/* Furnace-First Operational Hierarchy */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame size={18} className="text-metallo-orange" />
            <h2 className="font-mono text-base font-bold text-white tracking-tight">
              Primary Furnace Status
            </h2>
          </div>
          <button
            onClick={() => onNavigate('furnaces')}
            className="text-xs font-mono text-metallo-orange hover:underline flex items-center gap-1"
          >
            All Equipment <ArrowRight size={13} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {furnaces.map((furnace) => (
            <div
              key={furnace.furnaceId}
              onClick={() => onSelectFurnace(furnace.furnaceId)}
              className="bg-industrial-900 border border-industrial-800 hover:border-metallo-orange/50 transition cursor-pointer rounded p-4 group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-base font-bold text-white group-hover:text-metallo-orange transition-colors">
                    {furnace.name || furnace.furnaceId}
                  </span>
                  <StatusBadge status={furnace.status} />
                </div>
                <div className="text-xs font-mono text-industrial-400">
                  Heat: <span className="text-white font-semibold">{furnace.currentHeatId || 'None'}</span>
                </div>
              </div>

              {/* Minimalist Data Matrix */}
              <div className="grid grid-cols-4 gap-2 font-mono text-xs bg-industrial-950 p-3 rounded border border-industrial-800/80">
                <div>
                  <div className="text-[10px] text-industrial-500 uppercase">Power</div>
                  <div className="text-base font-bold text-white mt-0.5">{furnace.currentPowerKw} kW</div>
                </div>

                <div>
                  <div className="text-[10px] text-industrial-500 uppercase">Temp</div>
                  <div className="text-base font-bold text-metallo-orange mt-0.5">{furnace.temperatureC}°C</div>
                </div>

                <div>
                  <div className="text-[10px] text-industrial-500 uppercase">PF</div>
                  <div className={`text-base font-bold mt-0.5 ${furnace.hasPfWarning ? 'text-amber-400' : 'text-industrial-200'}`}>
                    {furnace.currentPf?.toFixed(2)}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-industrial-500 uppercase">Holding</div>
                  <div className={`text-base font-bold mt-0.5 ${furnace.hasHoldingWarning ? 'text-red-400' : 'text-industrial-200'}`}>
                    {furnace.currentHoldingMinutes}m
                  </div>
                </div>
              </div>

              {furnace.hasHoldingWarning && (
                <div className="mt-3 text-[11px] font-mono text-red-400 bg-red-500/10 border border-red-500/30 px-2.5 py-1 rounded flex items-center gap-1.5">
                  <AlertTriangle size={12} />
                  <span>Excessive holding detected ({furnace.currentHoldingMinutes} min &gt; 30 min threshold)</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Decision-Support Recommendation & Active Alerts Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* METALLO Schedule Optimizer Callout */}
        <div className="lg:col-span-2 bg-industrial-900 border border-industrial-800 rounded p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-metallo-orange font-semibold">
                <CalendarClock size={15} />
                <span>Production Schedule Optimizer</span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-metallo-orange/15 text-metallo-orange border border-metallo-orange/30">
                Action Available
              </span>
            </div>

            <h3 className="text-base font-mono font-bold text-white">
              Stagger Morning Melt Cycles to Eliminate Demand Surcharges
            </h3>
            <p className="text-xs text-industrial-300 mt-1.5 leading-relaxed">
              Current schedule runs Furnace F1 and F2 simultaneously at 08:30, pushing plant demand to 1,195 kW and triggering peak penalty bands. Shifting F2 melt start by 45 minutes reduces peak demand by 600 kW and eliminates ~₹5,700 in unnecessary holding thermal losses.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-industrial-800 flex items-center justify-between">
            <div className="text-xs font-mono text-industrial-400">
              Potential Daily Savings: <span className="text-emerald-400 font-bold">₹5,725</span>
            </div>
            <button
              onClick={() => onNavigate('schedule')}
              className="px-3 py-1.5 rounded bg-metallo-orange hover:bg-metallo-orange-glow text-white text-xs font-mono font-medium transition shadow-subtle flex items-center gap-1.5"
            >
              <span>View Optimized Plan</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Active Alerts Preview */}
        <div className="bg-industrial-900 border border-industrial-800 rounded p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-industrial-300 font-semibold">
                <ShieldAlert size={15} className="text-amber-400" />
                <span>Active Alerts ({recentAlerts.length})</span>
              </div>
              <button
                onClick={() => onNavigate('alerts')}
                className="text-[11px] font-mono text-industrial-400 hover:text-white"
              >
                View All
              </button>
            </div>

            <div className="space-y-2">
              {recentAlerts.length === 0 ? (
                <div className="text-xs font-mono text-industrial-500 py-6 text-center">
                  All systems operating within nominal limits.
                </div>
              ) : (
                recentAlerts.slice(0, 3).map((alert) => (
                  <div
                    key={alert.alertId}
                    onClick={() => onNavigate('alerts')}
                    className="p-2 rounded bg-industrial-950 border border-industrial-800/80 hover:border-industrial-700 transition cursor-pointer text-xs"
                  >
                    <div className="flex items-center justify-between font-mono text-[11px] mb-0.5">
                      <span className={alert.type === 'CRITICAL' ? 'text-red-400 font-bold' : 'text-amber-400 font-bold'}>
                        {alert.type}
                      </span>
                      <span className="text-industrial-500">{formatTime(alert.timestamp)}</span>
                    </div>
                    <div className="font-semibold text-industrial-200 line-clamp-1">
                      {alert.title}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-industrial-800/60 text-right">
            <button
              onClick={() => onNavigate('alerts')}
              className="text-[11px] font-mono text-metallo-orange hover:underline"
            >
              Resolve alerts &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
