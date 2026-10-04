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
      <div className="p-8 text-center text-[#9da1b5] font-mono text-sm">
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
  const actualKva = demandImpact.actualKva || demandImpact.currentKva || 628.4;
  const monthlyCost = demandImpact.monthlyDemandImpact !== undefined ? demandImpact.monthlyDemandImpact : (demandImpact.monthlyCostImpact || 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-[#2a2d42] pb-4">
        <div>
          <div className="text-[11px] font-mono tracking-widest text-[#7c78e8] uppercase mb-1">
            ELECTRICAL EFFICIENCY & REACTIVE POWER
          </div>
          <h1 className="text-2xl font-mono font-bold tracking-tight text-[#f5f5f7]">
            Power Factor (PF) & Apparent Load (kVA)
          </h1>
          <p className="mt-1 text-xs text-[#9da1b5]">
            Reactive power management, APFC capacitor bank health, and utility kVA demand penalty mitigation.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="px-4 py-2 rounded-[14px] bg-[#25283a] border border-[#2e324a] shadow-[2px_2px_6px_rgba(20,21,42,0.45)]">
            <span className="text-[#9da1b5]">DISCOM Compliance Target: </span>
            <span className="text-[#72c69a] font-bold">≥{targetPf}</span>
          </div>
        </div>
      </div>

      {/* Physics Concept Visualizer Callout */}
      <div className="bg-[#25283a] border border-[#2e324a] rounded-[24px] p-6 shadow-[6px_6px_14px_rgba(20,21,42,0.45),-6px_-6px_14px_rgba(42,45,66,0.35)]">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="text-xs font-mono uppercase tracking-wider text-[#7c78e8] font-bold flex items-center gap-1.5 mb-1">
              <Zap size={14} />
              <span>The Power Triangle: Real kW vs Apparent kVA</span>
            </div>
            <div className="text-sm font-semibold text-[#f5f5f7]">
              Formula: <span className="font-mono text-[#7c78e8]">PF = kW / kVA</span> and <span className="font-mono text-[#7c78e8]">kVA = kW / PF</span>
            </div>
            <p className="text-xs text-[#9da1b5] mt-1.5 leading-relaxed">
              When power factor drops, the foundry must draw significantly more total apparent power (kVA) from the grid to deliver the same thermal melting kilowatts. This inflates monthly maximum demand charges and triggers DISCOM low-PF penalties.
            </p>
          </div>

          <div className="nm-inset border border-[#2e324a] p-4 rounded-[18px] font-mono text-xs text-right min-w-[180px]">
            <div className="text-[10px] text-[#9da1b5] uppercase">Current Plant PF</div>
            <div className={`text-3xl font-bold mt-1 ${isPlantSuboptimal ? 'text-[#d8aa55]' : 'text-[#72c69a]'}`}>
              {plantPf?.toFixed(2)}
            </div>
            <div className="text-[11px] text-[#9da1b5] mt-1">
              {isPlantSuboptimal ? 'Reactive surcharge risk' : 'Nominal compliance'}
            </div>
          </div>
        </div>
      </div>

      {/* Demand & Financial Exposure */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        <div className="bg-[#25283a] border border-[#2e324a] p-5 rounded-[22px] shadow-[4px_4px_10px_rgba(20,21,42,0.45),-4px_-4px_10px_rgba(42,45,66,0.35)]">
          <div className="text-[#9da1b5] uppercase text-[10px] mb-1">Actual Apparent Load</div>
          <div className="text-2xl font-bold text-[#f5f5f7] mt-1">{formatKva(actualKva)}</div>
          <div className="text-[11px] text-[#9da1b5] mt-1">Total apparent grid draw</div>
        </div>

        <div className="bg-[#25283a] border border-[#2e324a] p-5 rounded-[22px] shadow-[4px_4px_10px_rgba(20,21,42,0.45),-4px_-4px_10px_rgba(42,45,66,0.35)]">
          <div className="text-[#9da1b5] uppercase text-[10px] mb-1">Target Load at 0.95 PF</div>
          <div className="text-2xl font-bold text-[#72c69a] mt-1">{formatKva(demandImpact.targetKva || actualKva)}</div>
          <div className="text-[11px] text-[#9da1b5] mt-1">Avoidable load: {formatKva(demandImpact.excessKva || 0)}</div>
        </div>

        <div className="bg-[#25283a] border border-[#2e324a] p-5 rounded-[22px] shadow-[4px_4px_10px_rgba(20,21,42,0.45),-4px_-4px_10px_rgba(42,45,66,0.35)]">
          <div className="text-[#9da1b5] uppercase text-[10px] mb-1">Monthly Demand Penalty</div>
          <div className="text-2xl font-bold text-[#7c78e8] mt-1">{formatCurrency(monthlyCost)}</div>
          <div className="text-[11px] text-[#9da1b5] mt-1">At ₹350/kVA demand tariff</div>
        </div>
      </div>

      {/* Furnace-level PF Status */}
      <div className="space-y-3">
        <div className="text-xs font-mono uppercase tracking-wider text-[#9da1b5] font-bold">
          Furnace Electrical Systems
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {furnaces.map((f) => {
            const isLow = f.currentPf < targetPf;
            return (
              <div
                key={f.furnaceId}
                className={`bg-[#25283a] border rounded-[22px] p-5 font-mono text-xs space-y-3 shadow-[4px_4px_10px_rgba(20,21,42,0.45),-4px_-4px_10px_rgba(42,45,66,0.35)] ${
                  isLow ? 'border-[#d8aa55]/40' : 'border-[#2e324a]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#f5f5f7] text-base">{f.name || f.furnaceId}</span>
                    <div className="text-[11px] text-[#9da1b5] mt-0.5">Active Draw: {formatKw(f.currentPowerKw)}</div>
                  </div>

                  <div className="text-right">
                    <div className={`text-2xl font-bold ${isLow ? 'text-[#d8aa55]' : 'text-[#72c69a]'}`}>
                      {f.currentPf?.toFixed(2)} PF
                    </div>
                    <div className="text-[10px] text-[#9da1b5]">{isLow ? 'Below threshold' : 'Compliant'}</div>
                  </div>
                </div>

                {isLow && (
                  <div className="bg-[#d8aa55]/10 border border-[#d8aa55]/30 p-3 rounded-[14px] text-[#d8aa55] space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-xs">
                      <AlertTriangle size={13} />
                      <span>Electrical Action Required</span>
                    </div>
                    <div className="text-[11px] text-[#d8aa55]/90 leading-relaxed">
                      Inspect furnace capacitor bank and APFC steps. Sub-optimal PF draws {formatKva(f.furnaceDemandImpact?.excessKva || 11)} excess apparent power.
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* PF Timeline Chart */}
      <div className="bg-[#25283a] border border-[#2e324a] rounded-[24px] p-6 shadow-[6px_6px_12px_rgba(20,21,42,0.45),-6px_-6px_12px_rgba(42,45,66,0.35)]">
        <div className="text-xs font-mono font-bold text-[#f5f5f7] uppercase tracking-wider mb-4">
          Power Factor Evolution Over Time
        </div>
        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={pfTimeline}>
              <CartesianGrid stroke="rgba(42, 45, 66, 0.45)" strokeDasharray="3 3" />
              <XAxis dataKey="time" stroke="#9da1b5" fontSize={11} tickLine={false} />
              <YAxis stroke="#9da1b5" fontSize={11} tickLine={false} domain={[0.8, 1.0]} />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: '#25283a',
                  borderColor: '#2e324a',
                  borderRadius: '14px',
                  color: '#f5f5f7',
                  fontSize: '12px',
                  boxShadow: '4px 4px 12px rgba(20,21,42,0.5)'
                }}
              />
              <Line type="monotone" dataKey="powerFactor" stroke="#72c69a" strokeWidth={2.5} dot={false} name="Power Factor" />
              <Line type="monotone" dataKey="targetPf" stroke="#d87878" strokeDasharray="3 3" strokeWidth={1.5} dot={false} name="Threshold (0.95)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Low-PF Event Log */}
      <div className="bg-[#25283a] border border-[#2e324a] rounded-[24px] overflow-hidden shadow-[6px_6px_12px_rgba(20,21,42,0.45),-6px_-6px_12px_rgba(42,45,66,0.35)]">
        <div className="p-4 bg-[#202234] border-b border-[#2e324a] text-xs font-mono font-bold text-[#f5f5f7] uppercase tracking-wider">
          Recorded Sub-Optimal PF Incidents
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#1e2030] text-[#9da1b5] border-b border-[#2e324a]">
              <tr>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">Furnace</th>
                <th className="p-3.5">Observed PF</th>
                <th className="p-3.5">Active kW</th>
                <th className="p-3.5">Apparent kVA</th>
                <th className="p-3.5">Machine State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2e324a]/60">
              {lowPfEvents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-[#9da1b5]">
                    No low-PF incidents recorded. All units operating within compliance threshold.
                  </td>
                </tr>
              ) : (
                lowPfEvents.map((ev, idx) => (
                  <tr key={idx} className="hover:bg-[#202234] transition">
                    <td className="p-3.5 text-[#9da1b5]">{formatTime(ev.timestamp)}</td>
                    <td className="p-3.5 font-bold text-[#7c78e8]">{ev.furnaceId}</td>
                    <td className="p-3.5 text-[#d8aa55] font-bold">{ev.powerFactor?.toFixed(2)}</td>
                    <td className="p-3.5 text-[#f5f5f7]">{formatKw(ev.powerKw)}</td>
                    <td className="p-3.5 text-[#f5f5f7]">{formatKva(ev.apparentPowerKva)}</td>
                    <td className="p-3.5 text-[#9da1b5]">{ev.state}</td>
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
