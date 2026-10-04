
import React from 'react';
import {
  ArrowRight,
  CalendarClock,
  ShieldAlert,
  Zap,
  TrendingDown
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import {
  formatCurrency,
  formatKw,
  formatSec,
  formatTime
} from '../utils/formatters';

export default function Overview({
  data,
  onNavigate,
  onSelectFurnace
}) {
  if (!data) {
    return (
      <div className="min-h-full flex items-center justify-center p-8 text-industrial-400 text-sm">
        Loading foundry state...
      </div>
    );
  }

  const {
    foundry,
    kpis,
    furnaces = [],
    recentAlerts = [],
    demandTrend = []
  } = data;

  const contractDemand = foundry.contractDemandKw || 1400;

  const demandPct = Math.min(
    100,
    Math.round(
      ((kpis.currentDemandKw || 0) / contractDemand) * 100
    )
  );

  const isDemandWarning =
    kpis.currentDemandKw >=
    (foundry.demandThresholdKw || 1100);

  const efficiencyTarget = 580;

  const efficiencyPercent = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        ((efficiencyTarget - (kpis.todayAverageSec || 0)) /
          efficiencyTarget) *
          100
      )
    )
  );

  return (
    <div className="max-w-[1500px] mx-auto px-5 py-8 lg:px-8 lg:py-10">

      {/* =====================================================
          PAGE INTRO
          ===================================================== */}

      <section className="relative overflow-hidden rounded-[24px] border border-industrial-800 bg-industrial-900/60 p-7 lg:p-10 mb-7">

        <div className="absolute -right-24 -top-32 w-96 h-96 rounded-full bg-metallo-orange/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl">

          <div className="flex items-center gap-2 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-metallo-orange" />

            <span className="text-[10px] uppercase tracking-[0.22em] text-industrial-500">
              Today's Operations
            </span>
          </div>

          <h1 className="text-4xl lg:text-6xl text-white leading-none tracking-wide mb-4">
            FOUNDRY operating at{' '}
            <span className="text-metallo-orange">
              {efficiencyPercent >= 0
                ? 'target efficiency'
                : 'attention required'}
            </span>
          </h1>

          <p className="max-w-2xl text-sm lg:text-base text-industrial-400 leading-relaxed">
            Metallo is monitoring energy intensity, demand,
            furnace utilization and production timing across
            the foundry.
          </p>

          <div className="flex flex-wrap gap-8 mt-8">

            <div>
              <div className="text-3xl lg:text-4xl font-semibold text-white tracking-tight">
                {formatSec(kpis.todayAverageSec)}
              </div>

              <div className="text-[10px] uppercase tracking-[0.16em] text-industrial-500 mt-1">
                Energy intensity
              </div>
            </div>

            <div className="w-px bg-industrial-800 hidden sm:block" />

            <div>
              <div className="text-3xl lg:text-4xl font-semibold text-white tracking-tight">
                {formatCurrency(kpis.potentialSavingsToday)}
              </div>

              <div className="text-[10px] uppercase tracking-[0.16em] text-industrial-500 mt-1">
                Potential daily saving
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          KEY METRICS
          ===================================================== */}

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

        {/* Energy */}
        <button
          onClick={() => onNavigate('heats')}
          className="text-left group rounded-[18px] border border-industrial-800 bg-industrial-900/50 p-5 hover:border-metallo-orange/40 transition-colors"
        >
          <div className="flex items-center justify-between mb-7">

            <span className="text-[10px] uppercase tracking-[0.18em] text-industrial-500">
              Energy intensity
            </span>

            <TrendingDown
              size={16}
              className="text-metallo-orange"
            />

          </div>

          <div className="text-3xl font-semibold text-white">
            {formatSec(kpis.todayAverageSec)}
          </div>

          <div className="text-xs text-industrial-500 mt-1">
            Benchmark {efficiencyTarget} kWh/t
          </div>

          <div className="mt-6 pt-4 border-t border-industrial-800/70 flex items-center justify-between">

            <span className="text-xs text-industrial-500">
              {kpis.todayProductionTonnes} tonnes produced
            </span>

            <ArrowRight
              size={14}
              className="text-industrial-600 group-hover:text-metallo-orange transition-colors"
            />

          </div>
        </button>


        {/* Demand */}
        <button
          onClick={() => onNavigate('pf')}
          className="text-left group rounded-[18px] border border-industrial-800 bg-industrial-900/50 p-5 hover:border-metallo-orange/40 transition-colors"
        >
          <div className="flex items-center justify-between mb-7">

            <span className="text-[10px] uppercase tracking-[0.18em] text-industrial-500">
              Current demand
            </span>

            <Zap
              size={16}
              className={
                isDemandWarning
                  ? 'text-red-400'
                  : 'text-metallo-orange'
              }
            />

          </div>

          <div
            className={`text-3xl font-semibold ${
              isDemandWarning
                ? 'text-red-400'
                : 'text-white'
            }`}
          >
            {formatKw(kpis.currentDemandKw)}
          </div>

          <div className="text-xs text-industrial-500 mt-1">
            {demandPct}% of {formatKw(contractDemand)} contract
          </div>

          <div className="mt-5">

            <div className="h-1 w-full bg-industrial-800 rounded-full overflow-hidden">

              <div
                style={{ width: `${demandPct}%` }}
                className={`h-full transition-all ${
                  isDemandWarning
                    ? 'bg-red-500'
                    : 'bg-metallo-orange'
                }`}
              />

            </div>

          </div>
        </button>


        {/* Cost */}
        <button
          onClick={() => onNavigate('energy')}
          className="text-left group rounded-[18px] border border-metallo-orange/25 bg-gradient-to-br from-metallo-orange/10 to-industrial-900/50 p-5 hover:border-metallo-orange/50 transition-colors"
        >
          <div className="flex items-center justify-between mb-7">

            <span className="text-[10px] uppercase tracking-[0.18em] text-metallo-orange">
              Today's energy cost
            </span>

            <Zap
              size={16}
              className="text-metallo-orange"
            />

          </div>

          <div className="text-3xl font-semibold text-white">
            {formatCurrency(kpis.estimatedCostToday)}
          </div>

          <div className="text-xs text-industrial-400 mt-1">
            Time-of-day tariff exposure
          </div>

          <div className="mt-6 pt-4 border-t border-metallo-orange/15 flex items-center justify-between">

            <span className="text-xs text-industrial-400">
              {formatCurrency(kpis.potentialSavingsToday)} avoidable
            </span>

            <ArrowRight
              size={14}
              className="text-metallo-orange group-hover:translate-x-1 transition-transform"
            />

          </div>
        </button>

      </section>


      {/* =====================================================
          DECISION SUPPORT
          ===================================================== */}

      <section className="grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-4 mb-8">

        {/* Recommended Action */}
        <div className="relative overflow-hidden rounded-[22px] border border-metallo-orange/30 bg-gradient-to-br from-metallo-orange/12 via-industrial-900/60 to-industrial-950 p-6 lg:p-8">

          <div className="absolute -right-16 -bottom-24 w-72 h-72 rounded-full bg-metallo-orange/10 blur-3xl pointer-events-none" />

          <div className="relative">

            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">

              <div className="flex items-center gap-2 text-metallo-orange">

                <CalendarClock size={17} />

                <span className="text-[10px] uppercase tracking-[0.18em] font-semibold">
                  Recommended action
                </span>

              </div>

              <span className="px-2.5 py-1 rounded-full border border-metallo-orange/25 bg-metallo-orange/10 text-[9px] uppercase tracking-wider text-metallo-orange">
                Action available
              </span>

            </div>

            <h2 className="text-2xl lg:text-4xl text-white max-w-2xl leading-tight">
              Delay Furnace F2 to prevent simultaneous peak demand.
            </h2>

            <p className="text-sm text-industrial-400 max-w-2xl mt-4 leading-relaxed">
              Staggering the melt cycle reduces the demand spike
              while avoiding unnecessary holding energy.
            </p>

            <div className="flex flex-wrap gap-8 mt-7">

              <div>

                <div className="text-[9px] uppercase tracking-wider text-industrial-600">
                  Peak demand
                </div>

                <div className="text-xl text-white mt-1">
                  1,200
                  <span className="text-industrial-600 mx-2">
                    →
                  </span>
                  600 kW
                </div>

              </div>

              <div>

                <div className="text-[9px] uppercase tracking-wider text-industrial-600">
                  Estimated saving
                </div>

                <div className="text-xl text-metallo-orange mt-1">
                  ₹5,725/day
                </div>

              </div>

            </div>

            <button
              onClick={() => onNavigate('schedule')}
              className="mt-7 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-metallo-orange text-white text-xs font-semibold hover:bg-metallo-orange-glow transition-colors"
            >
              Review optimized schedule
              <ArrowRight size={14} />
            </button>

          </div>

        </div>


        {/* Alerts */}
        <div className="rounded-[22px] border border-industrial-800 bg-industrial-900/50 p-6 lg:p-7">

          <div className="flex items-center justify-between mb-6">

            <div>

              <div className="text-[10px] uppercase tracking-[0.18em] text-industrial-500">
                Attention
              </div>

              <h2 className="text-2xl text-white mt-1">
                Alerts
              </h2>

            </div>

            <ShieldAlert
              size={18}
              className={
                recentAlerts.length > 0
                  ? 'text-amber-400'
                  : 'text-industrial-600'
              }
            />

          </div>

          {recentAlerts.length === 0 ? (

            <div className="py-8 text-sm text-industrial-500">
              All systems operating within nominal limits.
            </div>

          ) : (

            <div className="space-y-3">

              {recentAlerts.slice(0, 3).map((alert) => (

                <button
                  key={alert.alertId}
                  onClick={() => onNavigate('alerts')}
                  className="w-full text-left pb-3 border-b border-industrial-800/70 last:border-0 group"
                >

                  <div className="flex items-center justify-between gap-3">

                    <span
                      className={`text-[9px] uppercase tracking-wider font-semibold ${
                        alert.type === 'CRITICAL'
                          ? 'text-red-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {alert.type}
                    </span>

                    <span className="text-[9px] text-industrial-600">
                      {formatTime(alert.timestamp)}
                    </span>

                  </div>

                  <div className="text-xs text-industrial-300 mt-1 group-hover:text-white transition-colors">
                    {alert.title}
                  </div>

                </button>

              ))}

            </div>

          )}

          <button
            onClick={() => onNavigate('alerts')}
            className="mt-5 flex items-center gap-2 text-xs text-metallo-orange hover:gap-3 transition-all"
          >
            View all alerts
            <ArrowRight size={13} />
          </button>

        </div>

      </section>


      {/* =====================================================
          DEMAND PROFILE
          ===================================================== */}

      <section className="rounded-[22px] border border-industrial-800 bg-industrial-900/40 overflow-hidden mb-8">

        <div className="p-6 lg:p-7 flex flex-wrap items-start justify-between gap-4">

          <div>

            <div className="text-[10px] uppercase tracking-[0.2em] text-industrial-500 mb-2">
              Energy performance
            </div>

            <h2 className="text-2xl lg:text-3xl text-white">
              Demand profile
            </h2>

          </div>

          <div className="text-right">

            <div className="text-xs text-industrial-500">
              Contract demand
            </div>

            <div className="text-lg text-white mt-1">
              {formatKw(contractDemand)}
            </div>

          </div>

        </div>

        <div className="px-6 lg:px-7 pb-7">

          <div className="relative h-48 lg:h-64 border-l border-b border-industrial-800">

            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between">

              <div className="border-t border-industrial-800/50" />
              <div className="border-t border-industrial-800/50" />
              <div className="border-t border-industrial-800/50" />
              <div className="border-t border-industrial-800/50" />

            </div>

            {/* Demand visualization */}
            <div className="absolute inset-x-4 bottom-0 top-5 flex items-end gap-2 lg:gap-4">

              {(demandTrend.length > 0
                ? demandTrend
                : [
                    { demandKw: 620 },
                    { demandKw: 760 },
                    { demandKw: 690 },
                    { demandKw: 920 },
                    { demandKw: 840 },
                    { demandKw: 1060 },
                    { demandKw: 820 },
                    { demandKw: 720 }
                  ]
              ).map((point, index, arr) => {

                const value =
                  point.demandKw ||
                  point.currentDemandKw ||
                  0;

                const maxValue = Math.max(
                  contractDemand,
                  ...arr.map(
                    (item) =>
                      item.demandKw ||
                      item.currentDemandKw ||
                      0
                  )
                );

                const height = Math.max(
                  8,
                  Math.round((value / maxValue) * 100)
                );

                const warning =
                  value >=
                  (foundry.demandThresholdKw || 1100);

                return (
                  <div
                    key={index}
                    className="flex-1 h-full flex items-end"
                  >

                    <div
                      style={{ height: `${height}%` }}
                      className={`w-full rounded-t-sm transition-all ${
                        warning
                          ? 'bg-red-500/70'
                          : 'bg-metallo-orange/60 hover:bg-metallo-orange'
                      }`}
                      title={`${formatKw(value)} demand`}
                    />

                  </div>
                );
              })}

            </div>

            {/* Threshold line */}
            <div
              className="absolute left-0 right-0 border-t border-dashed border-red-400/40"
              style={{
                bottom: `${Math.min(
                  95,
                  (foundry.demandThresholdKw || 1100) /
                    Math.max(contractDemand, 1400) *
                    100
                )}%`
              }}
            >
              <span className="absolute right-0 -top-5 text-[9px] uppercase tracking-wider text-red-400/70">
                Threshold
              </span>
            </div>

          </div>

          <div className="flex justify-between mt-3 text-[9px] uppercase tracking-[0.16em] text-industrial-600">
            <span>Start of shift</span>
            <span>Current</span>
            <span>End of shift</span>
          </div>

        </div>
      </section>


      {/* =====================================================
          FURNACES
          ===================================================== */}

      <section className="mb-8">

        <div className="flex items-end justify-between mb-4">

          <div>

            <div className="text-[10px] uppercase tracking-[0.2em] text-industrial-500 mb-1">
              Production floor
            </div>

            <h2 className="text-2xl lg:text-3xl text-white">
              Furnaces
            </h2>

          </div>

          <button
            onClick={() => onNavigate('furnaces')}
            className="flex items-center gap-2 text-xs text-industrial-400 hover:text-metallo-orange transition-colors"
          >
            View all
            <ArrowRight size={14} />
          </button>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {furnaces.map((furnace) => (

            <button
              key={furnace.furnaceId}
              onClick={() =>
                onSelectFurnace(furnace.furnaceId)
              }
              className="text-left group relative overflow-hidden rounded-[20px] border border-industrial-800 bg-industrial-900/50 p-6 hover:border-metallo-orange/40 transition-colors"
            >

              <div className="flex items-start justify-between">

                <div>

                  <div className="text-[9px] uppercase tracking-[0.18em] text-industrial-600 mb-2">
                    Induction furnace
                  </div>

                  <div className="text-xl text-white">
                    {furnace.name || furnace.furnaceId}
                  </div>

                </div>

                <StatusBadge status={furnace.status} />

              </div>

              <div className="grid grid-cols-3 gap-4 mt-8">

                <div>

                  <div className="text-[9px] uppercase tracking-wider text-industrial-600">
                    Power
                  </div>

                  <div className="text-xl text-white mt-1">
                    {furnace.currentPowerKw}
                    <span className="text-xs text-industrial-500 ml-1">
                      kW
                    </span>
                  </div>

                </div>

                <div>

                  <div className="text-[9px] uppercase tracking-wider text-industrial-600">
                    Temperature
                  </div>

                  <div className="text-xl text-metallo-orange mt-1">
                    {furnace.temperatureC}
                    <span className="text-xs text-industrial-500 ml-1">
                      °C
                    </span>
                  </div>

                </div>

                <div>

                  <div className="text-[9px] uppercase tracking-wider text-industrial-600">
                    PF
                  </div>

                  <div
                    className={`text-xl mt-1 ${
                      furnace.hasPfWarning
                        ? 'text-amber-400'
                        : 'text-white'
                    }`}
                  >
                    {furnace.currentPf?.toFixed(2)}
                  </div>

                </div>

              </div>

              <div className="mt-6 pt-4 border-t border-industrial-800/70 flex items-center justify-between">

                <div className="text-xs text-industrial-500">

                  Heat{' '}
                  <span className="text-industrial-300">
                    {furnace.currentHeatId || 'None'}
                  </span>

                </div>

                <div className="text-xs text-industrial-500">

                  Holding{' '}
                  <span
                    className={
                      furnace.hasHoldingWarning
                        ? 'text-red-400'
                        : 'text-industrial-300'
                    }
                  >
                    {furnace.currentHoldingMinutes} min
                  </span>

                </div>

              </div>

              {furnace.hasHoldingWarning && (

                <div className="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-wider text-red-400">

                  <ShieldAlert size={13} />

                  Excessive holding detected

                </div>

              )}

            </button>

          ))}

        </div>

      </section>

    </div>
  );
}

