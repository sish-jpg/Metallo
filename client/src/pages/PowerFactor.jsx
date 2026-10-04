import React from 'react';
import {
  Gauge,
  Zap,
  Activity,
  AlertTriangle,
  HelpCircle,
  TrendingDown,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import Tooltip from '../components/Tooltip';
import { formatKw, formatKva, formatCurrency, formatTime } from '../utils/formatters';

export default function PowerFactor({ pfData }) {
  if (!pfData) {
    return (
      <div className="p-8 text-center text-industrial-400 font-mono text-sm">
        Loading electrical power factor analytics...
      </div>
    );
  }

  const {
    plantPf = 0.95,
    targetPf = 0.95,
    demandImpact = {},
    furnaces = [],
    lowPfEvents = [],
    pfTimeline = []
  } = pfData;

  const isPlantSuboptimal = plantPf < targetPf;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-industrial-800 pb-4">
        <div>
          <div className="text-[11px] font-mono tracking-widest text-industrial-400 uppercase">
            ELECTRICAL EFFICIENCY & REACTIVE POWER
          </div>
          <h1 className="text-2xl font-mono font-bold tracking-tight text-white mt-0.5">
            Power Factor (PF) & Apparent Load (kVA)
          </h1>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="px-3 py-1.5 rounded bg-industrial-900 border border-industrial-800">
            <span className="text-industrial-400">DISCOM Compliance Target: </span>
            <span className="text-emerald-400 font-bold">≥{targetPf}</span>
          </div>
        </div>
      </div>

      {/* Physics Concept Visualizer Callout */}
      <div className="bg-industrial-900 border border-industrial-800 rounded p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-2xl">
            <div className="text-xs font-mono uppercase tracking-wider text-metallo-orange font-semibold flex items-center gap-1.5 mb-1">
              <Zap size={14} />
              <span>The Power Triangle: Real kW vs Apparent kVA</span>
            </div>
            <div className="text-sm font-semibold text-white">
              Formula: <span className="font-mono text-metallo-orange">PF = kW / kVA</span> and <span className="font-mono text-metallo-orange">kVA = kW / PF</span>
            </div>
            <p className="text-xs text-industrial-300 mt-1 leading-relaxed">
              When power factor drops, the foundry must draw significantly more total apparent power (kVA) from the utility to deliver the same thermal melting kilowatts. This inflates monthly maximum demand charges and triggers DISCOM low-PF penalties.
            </p>
          </div>

          <div className="bg-industrial-950 border border-industrial-800 p-3 rounded font-mono text-xs text-right">
            <div className="text-[10px] text-industrial-500 uppercase">Current Plant PF</div>
            <div className={`text-3xl font-bold mt-0.5 ${isPlantSuboptimal ? 'text-amber-400' : 'text-emerald-400'}`}>
              {plantPf?.toFixed(2)}
            </div>
            <div className="text-[11px] text-industrial-400 mt-0.5">
              {isPlantSuboptimal ? 'Reactive surcharge risk' : 'Nominal compliance'}
            </div>
          </div>
        </div>
      </div>

      {/* Demand & Financial Exposure */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        <div className="bg-industrial-900 border border-industrial-800 p-4 rounded">
          <div className="text-industrial-400 uppercase text-[10px] mb-1">Actual Apparent Load</div>
          <div className="text-2xl font-bold text-white">{formatKva(demandImpact.actualKva)}</div>
          <div className="text-[11px] text-industrial-400 mt-1">Total apparent grid demand</div>
        </div>

        <div className="bg-industrial-900 border border-industrial-800 p-4 rounded">
          <div className="text-industrial-400 uppercase text-[10px] mb-1">Ideal Load at 0.95 PF</div>
          <div className="text-2xl font-bold text-emerald-400">{formatKva(demandImpact.targetKva)}</div>
          <div className="text-[11px] text-industrial-400 mt-1">Headroom savings: {formatKva(demandImpact.excessKva)}</div>
        </div>

        <div className="bg-industrial-900 border border-industrial-800 p-4 rounded">
          <div className="text-industrial-400 uppercase text-[10px] mb-1">Monthly Demand Penalty</div>
          <div className="text-2xl font-bold text-metallo-orange">{formatCurrency(demandImpact.monthlyDemandImpact)}</div>
          <div className="text-[11px] text-industrial-400 mt-1">At ₹350/kVA demand tariff</div>
        </div>
      </div>

      {/* Furnace-level PF Status */}
      <div className="space-y-3">
        <div className="text-xs font-mono uppercase tracking-wider text-industrial-400 font-semibold">
          Furnace Electrical Systems
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {furnaces.map((f) => {
            const isLow = f.currentPf < targetPf;
            return (
              <div
                key={f.furnaceId}
                className={`bg-industrial-900 border rounded p-4 font-mono text-xs space-y-3 ${
                  isLow ? 'border-amber-500/40 bg-amber-950/10' : 'border-industrial-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white text-base">{f.name || f.furnaceId}</span>
                    <div className="text-[11px] text-industrial-400">Power: {formatKw(f.currentPowerKw)}</div>
                  </div>

                  <div className="text-right">
                    <div className={`text-2xl font-bold ${isLow ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {f.currentPf?.toFixed(2)} PF
                    </div>
                    <div className="text-[10px] text-industrial-400">{isLow ? 'Below threshold' : 'Optimal'}</div>
                  </div>
                </div>

                {isLow && (
                  <div className="bg-amber-500/10 border border-amber-500/30 p-2.5 rounded text-amber-300 space-y-1">
                    <div className="font-semibold flex items-center gap-1.5">
                      <AlertTriangle size={13} />
                      <span>Electrical Action Required</span>
                    </div>
                    <div className="text-[11px] text-amber-200/90 leading-relaxed">
                      Inspect furnace tuning capacitor bank and harmonic filter steps. Low PF draws {formatKva(f.furnaceDemandImpact?.excessKva)} excess apparent power.
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* PF Timeline Chart */}
      <div className="bg-industrial-900 border border-industrial-800 rounded p-4">
        <div className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-4">
          Power Factor Evolution Over Time
        </div>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={pfTimeline}>
              <CartesianGrid stroke="#22222a" strokeDasharray="3 3" />
              <XAxis dataKey="time" stroke="#78788c" fontSize={11} tickLine={false} />
              <YAxis stroke="#78788c" fontSize={11} tickLine={false} domain={[0.8, 1.0]} />
              <RechartsTooltip
                contentStyle={{ backgroundColor: '#111114', borderColor: '#282830', fontSize: '12px' }}
              />
              <Line type="monotone" dataKey="powerFactor" stroke="#10b981" strokeWidth={2.5} dot={false} name="Power Factor" />
              <Line type="monotone" dataKey="targetPf" stroke="#ef4444" strokeDasharray="3 3" strokeWidth={1.5} dot={false} name="Threshold (0.95)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Low-PF Event Log */}
      <div className="bg-industrial-900 border border-industrial-800 rounded overflow-hidden">
        <div className="p-3 bg-industrial-950 border-b border-industrial-800 text-xs font-mono font-bold text-white uppercase tracking-wider">
          Recorded Sub-Optimal PF Incidents
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-industrial-950 text-industrial-400 border-b border-industrial-800">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Furnace</th>
                <th className="p-3">Observed PF</th>
                <th className="p-3">Active kW</th>
                <th className="p-3">Apparent kVA</th>
                <th className="p-3">Machine State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-industrial-800/60">
              {lowPfEvents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-industrial-500">
                    No low-PF incidents recorded.
                  </td>
                </tr>
              ) : (
                lowPfEvents.map((ev, idx) => (
                  <tr key={idx} className="hover:bg-industrial-800/30">
                    <td className="p-3 text-industrial-300">{formatTime(ev.timestamp)}</td>
                    <td className="p-3 font-bold text-white">{ev.furnaceId}</td>
                    <td className="p-3 text-amber-400 font-bold">{ev.powerFactor?.toFixed(2)}</td>
                    <td className="p-3">{formatKw(ev.powerKw)}</td>
                    <td className="p-3">{formatKva(ev.apparentPowerKva)}</td>
                    <td className="p-3 text-industrial-400">{ev.state}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
