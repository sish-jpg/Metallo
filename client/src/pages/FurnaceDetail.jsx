import React, { useState } from 'react';
import {
  ArrowLeft,
  Flame,
  Zap,
  Thermometer,
  Activity,
  AlertTriangle,
  Clock,
  TrendingDown,
  Layers,
  ShieldAlert
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
import StatusBadge from '../components/StatusBadge';
import VisualTimeline from '../components/VisualTimeline';
import { formatKw, formatKva, formatKwh, formatSec, formatTime, formatCurrency } from '../utils/formatters';

export default function FurnaceDetail({ furnace, onBack, onSelectHeat }) {
  const [activeTab, setActiveTab] = useState('trends'); // 'trends' | 'heats' | 'alerts'

  if (!furnace) {
    return (
      <div className="p-8 text-center text-[#9da1b5] font-mono text-sm">
        Furnace not found. <button onClick={onBack} className="text-[#7c78e8] underline">Return to Furnaces</button>
      </div>
    );
  }

  const trends = furnace.trends || [];
  const associatedHeats = furnace.associatedHeats || [];
  const activeAlerts = furnace.activeAlerts || [];
  const currentHeat = furnace.currentHeat;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Navigation & Header */}
      <div className="flex items-center gap-4 border-b border-[#2a2d42] pb-4">
        <button
          onClick={onBack}
          className="nm-btn p-2 rounded-[14px] text-[#9da1b5] hover:text-[#f5f5f7] transition"
          aria-label="Back to Furnaces"
        >
          <ArrowLeft size={16} />
        </button>

        <div className="flex-1 flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <div className="text-[11px] font-mono tracking-widest text-[#7c78e8] uppercase mb-1">
              FURNACE DEEP DIVE & TELEMETRY
            </div>
            <h1 className="text-2xl font-mono font-bold tracking-tight text-[#f5f5f7] flex items-center gap-3">
              <span>{furnace.name || furnace.furnaceId}</span>
              <StatusBadge status={furnace.status} size="md" />
            </h1>
          </div>

          <div className="text-xs font-mono text-[#9da1b5]">
            Active Melt Heat: <span className="text-[#f5f5f7] font-bold">{furnace.currentHeatId || 'Standby'}</span>
          </div>
        </div>
      </div>

      {/* Key Electrical & Thermal Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-[#25283a] border border-[#2e324a] p-3.5 rounded-[18px] shadow-[4px_4px_10px_rgba(20,21,42,0.45),-4px_-4px_10px_rgba(42,45,66,0.35)] font-mono">
          <div className="text-[10px] text-[#9da1b5] uppercase">Active Power</div>
          <div className="text-lg font-bold text-[#f5f5f7] mt-0.5">{formatKw(furnace.currentPowerKw)}</div>
          <div className="text-[10px] text-[#9da1b5]">Rated: {furnace.meltingPowerKw} kW</div>
        </div>

        <div className="bg-[#25283a] border border-[#2e324a] p-3.5 rounded-[18px] shadow-[4px_4px_10px_rgba(20,21,42,0.45),-4px_-4px_10px_rgba(42,45,66,0.35)] font-mono">
          <div className="text-[10px] text-[#9da1b5] uppercase">Bath Temp</div>
          <div className="text-lg font-bold text-[#7c78e8] mt-0.5">{furnace.temperatureC}°C</div>
          <div className="text-[10px] text-[#9da1b5]">Target: 1480°C</div>
        </div>

        <div className="bg-[#25283a] border border-[#2e324a] p-3.5 rounded-[18px] shadow-[4px_4px_10px_rgba(20,21,42,0.45),-4px_-4px_10px_rgba(42,45,66,0.35)] font-mono">
          <div className="text-[10px] text-[#9da1b5] uppercase">Power Factor</div>
          <div className={`text-lg font-bold mt-0.5 ${furnace.currentPf < 0.95 ? 'text-[#d8aa55]' : 'text-[#72c69a]'}`}>
            {furnace.currentPf?.toFixed(2)}
          </div>
          <div className="text-[10px] text-[#9da1b5]">Target: ≥0.95</div>
        </div>

        <div className="bg-[#25283a] border border-[#2e324a] p-3.5 rounded-[18px] shadow-[4px_4px_10px_rgba(20,21,42,0.45),-4px_-4px_10px_rgba(42,45,66,0.35)] font-mono">
          <div className="text-[10px] text-[#9da1b5] uppercase">Apparent Load</div>
          <div className="text-lg font-bold text-[#f5f5f7] mt-0.5">{formatKva(furnace.currentKva)}</div>
          <div className="text-[10px] text-[#9da1b5]">kVA Demand</div>
        </div>

        <div className="bg-[#25283a] border border-[#2e324a] p-3.5 rounded-[18px] shadow-[4px_4px_10px_rgba(20,21,42,0.45),-4px_-4px_10px_rgba(42,45,66,0.35)] font-mono">
          <div className="text-[10px] text-[#9da1b5] uppercase">Today's Energy</div>
          <div className="text-lg font-bold text-[#f5f5f7] mt-0.5">{formatKwh(furnace.todayEnergyKwh)}</div>
          <div className="text-[10px] text-[#9da1b5]">{furnace.todayProductionTonnes || 2}t tapped</div>
        </div>

        <div className="bg-[#25283a] border border-[#2e324a] p-3.5 rounded-[18px] shadow-[4px_4px_10px_rgba(20,21,42,0.45),-4px_-4px_10px_rgba(42,45,66,0.35)] font-mono">
          <div className="text-[10px] text-[#9da1b5] uppercase">Dynamic SEC</div>
          <div className="text-lg font-bold text-[#7c78e8] mt-0.5">{formatSec(furnace.calculatedSec || 580)}</div>
          <div className="text-[10px] text-[#9da1b5]">Base: 580 kWh/t</div>
        </div>
      </div>

      {/* Active Heat Visual Timeline (If current heat exists) */}
      {currentHeat && (
        <div className="bg-[#25283a] border border-[#2e324a] rounded-[22px] p-5 shadow-[4px_4px_10px_rgba(20,21,42,0.45),-4px_-4px_10px_rgba(42,45,66,0.35)] space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono uppercase tracking-wider text-[#7c78e8] font-bold flex items-center gap-1.5">
              <Clock size={14} />
              <span>Current Heat Timeline ({currentHeat.heatId})</span>
            </div>
            <div className="text-xs font-mono text-[#9da1b5]">
              Grade: <span className="text-[#f5f5f7]">{currentHeat.grade}</span> • {currentHeat.productionTonnes}t
            </div>
          </div>

          <VisualTimeline
            meltDurationMinutes={currentHeat.meltingDurationMinutes || 60}
            holdingDurationMinutes={currentHeat.holdingDurationMinutes || furnace.currentHoldingMinutes}
            holdingThresholdMinutes={30}
            meltingEnergyKwh={currentHeat.meltingEnergyKwh || 580}
            holdingEnergyKwh={currentHeat.holdingEnergyKwh || 0}
            excessHoldingCost={currentHeat.excessHoldingCost || 0}
            startTime={currentHeat.meltStartTime}
            pourTime={currentHeat.plannedPourTime}
          />
        </div>
      )}

      {/* Tab Navigation (Neumorphic Pills) */}
      <div className="flex gap-2 text-xs font-mono p-1 bg-[#1e2030] rounded-[18px] shadow-[inset_2px_2px_5px_rgba(20,21,42,0.45),inset_-2px_-2px_5px_rgba(42,45,66,0.30)] w-fit border border-[#2e324a]">
        <button
          onClick={() => setActiveTab('trends')}
          className={`px-4 py-2 rounded-[14px] font-bold transition-all ${
            activeTab === 'trends'
              ? 'bg-[#25283a] text-[#7c78e8] shadow-[3px_3px_6px_rgba(20,21,42,0.45),-3px_-3px_6px_rgba(42,45,66,0.35)]'
              : 'text-[#9da1b5] hover:text-[#f5f5f7]'
          }`}
        >
          Telemetry Trends
        </button>

        <button
          onClick={() => setActiveTab('heats')}
          className={`px-4 py-2 rounded-[14px] font-bold transition-all ${
            activeTab === 'heats'
              ? 'bg-[#25283a] text-[#7c78e8] shadow-[3px_3px_6px_rgba(20,21,42,0.45),-3px_-3px_6px_rgba(42,45,66,0.35)]'
              : 'text-[#9da1b5] hover:text-[#f5f5f7]'
          }`}
        >
          Associated Heats ({associatedHeats.length})
        </button>

        <button
          onClick={() => setActiveTab('alerts')}
          className={`px-4 py-2 rounded-[14px] font-bold transition-all ${
            activeTab === 'alerts'
              ? 'bg-[#25283a] text-[#7c78e8] shadow-[3px_3px_6px_rgba(20,21,42,0.45),-3px_-3px_6px_rgba(42,45,66,0.35)]'
              : 'text-[#9da1b5] hover:text-[#f5f5f7]'
          }`}
        >
          Active Alerts ({activeAlerts.length})
        </button>
      </div>

      {/* Tab 1: Telemetry Trends */}
      {activeTab === 'trends' && (
        <div className="space-y-6">
          {/* Power Trend Chart */}
          <div className="bg-[#25283a] border border-[#2e324a] rounded-[24px] p-6 shadow-[6px_6px_12px_rgba(20,21,42,0.45),-6px_-6px_12px_rgba(42,45,66,0.35)]">
            <div className="flex items-center justify-between mb-4 text-xs font-mono">
              <span className="font-bold text-[#f5f5f7] uppercase tracking-wider">
                Active Power Draw (kW) & Apparent Load (kVA)
              </span>
              <span className="text-[#9da1b5] text-[11px]">Real-time Telemetry Series</span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trends}>
                  <CartesianGrid stroke="rgba(42, 45, 66, 0.45)" strokeDasharray="3 3" />
                  <XAxis dataKey="time" stroke="#9da1b5" fontSize={11} tickLine={false} />
                  <YAxis stroke="#9da1b5" fontSize={11} tickLine={false} unit="kW" />
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
                  <Line type="monotone" dataKey="powerKw" stroke="#7c78e8" strokeWidth={2.5} dot={false} name="Active Power (kW)" />
                  <Line type="monotone" dataKey="apparentPowerKva" stroke="#72c69a" strokeWidth={1.5} dot={false} strokeDasharray="4 4" name="Apparent Load (kVA)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Temperature & Power Factor Trends (Side by Side) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#25283a] border border-[#2e324a] rounded-[24px] p-6 shadow-[6px_6px_12px_rgba(20,21,42,0.45),-6px_-6px_12px_rgba(42,45,66,0.35)]">
              <div className="text-xs font-mono font-bold text-[#f5f5f7] uppercase tracking-wider mb-4">
                Bath Temperature Trend (°C)
              </div>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trends}>
                    <CartesianGrid stroke="rgba(42, 45, 66, 0.45)" strokeDasharray="3 3" />
                    <XAxis dataKey="time" stroke="#9da1b5" fontSize={11} tickLine={false} />
                    <YAxis stroke="#9da1b5" fontSize={11} tickLine={false} domain={[400, 1600]} unit="°C" />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: '#25283a',
                        borderColor: '#2e324a',
                        borderRadius: '14px',
                        color: '#f5f5f7',
                        fontSize: '12px'
                      }}
                    />
                    <Line type="monotone" dataKey="temperatureC" stroke="#d8aa55" strokeWidth={2} dot={false} name="Temp (°C)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-[#25283a] border border-[#2e324a] rounded-[24px] p-6 shadow-[6px_6px_12px_rgba(20,21,42,0.45),-6px_-6px_12px_rgba(42,45,66,0.35)]">
              <div className="text-xs font-mono font-bold text-[#f5f5f7] uppercase tracking-wider mb-4">
                Power Factor Evolution
              </div>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trends}>
                    <CartesianGrid stroke="rgba(42, 45, 66, 0.45)" strokeDasharray="3 3" />
                    <XAxis dataKey="time" stroke="#9da1b5" fontSize={11} tickLine={false} />
                    <YAxis stroke="#9da1b5" fontSize={11} tickLine={false} domain={[0.8, 1.0]} />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: '#25283a',
                        borderColor: '#2e324a',
                        borderRadius: '14px',
                        color: '#f5f5f7',
                        fontSize: '12px'
                      }}
                    />
                    <Line type="monotone" dataKey="powerFactor" stroke="#72c69a" strokeWidth={2} dot={false} name="PF" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Associated Heats */}
      {activeTab === 'heats' && (
        <div className="bg-[#25283a] border border-[#2e324a] rounded-[24px] p-6 shadow-[6px_6px_12px_rgba(20,21,42,0.45),-6px_-6px_12px_rgba(42,45,66,0.35)] font-mono text-xs overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#2e324a] text-[#9da1b5] uppercase text-[10px]">
                <th className="pb-3 font-semibold">Heat ID</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Tonnage</th>
                <th className="pb-3 font-semibold">Grade</th>
                <th className="pb-3 font-semibold">Melt Start</th>
                <th className="pb-3 font-semibold">Melt (min)</th>
                <th className="pb-3 font-semibold">Hold (min)</th>
                <th className="pb-3 font-semibold">Total Energy</th>
                <th className="pb-3 font-semibold">SEC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2e324a]/60">
              {associatedHeats.map((h) => (
                <tr
                  key={h.heatId}
                  onClick={() => onSelectHeat && onSelectHeat(h.heatId)}
                  className="hover:bg-[#202234] cursor-pointer transition"
                >
                  <td className="py-3 font-bold text-[#7c78e8]">{h.heatId}</td>
                  <td className="py-3">
                    <StatusBadge status={h.status} size="sm" />
                  </td>
                  <td className="py-3 text-[#f5f5f7]">{h.productionTonnes}t</td>
                  <td className="py-3 text-[#9da1b5]">{h.grade}</td>
                  <td className="py-3 text-[#9da1b5]">{formatTime(h.meltStartTime)}</td>
                  <td className="py-3 text-[#f5f5f7]">{h.meltingDurationMinutes}m</td>
                  <td className="py-3">
                    <span className={h.holdingDurationMinutes > 30 ? 'text-[#d87878] font-bold' : 'text-[#9da1b5]'}>
                      {h.holdingDurationMinutes}m
                    </span>
                  </td>
                  <td className="py-3 text-[#f5f5f7]">{formatKwh(h.totalEnergyKwh)}</td>
                  <td className="py-3 font-bold text-[#7c78e8]">{formatSec(h.secKwhPerTonne)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Active Alerts */}
      {activeTab === 'alerts' && (
        <div className="space-y-3 font-mono">
          {activeAlerts.length === 0 ? (
            <div className="bg-[#25283a] border border-[#2e324a] rounded-[24px] p-8 text-center text-[#9da1b5] text-xs">
              No unresolved alerts detected on this furnace. Operating normally.
            </div>
          ) : (
            activeAlerts.map((a) => (
              <div
                key={a.alertId || a._id}
                className="bg-[#25283a] border border-[#2e324a] rounded-[20px] p-5 shadow-[4px_4px_10px_rgba(20,21,42,0.45),-4px_-4px_10px_rgba(42,45,66,0.35)] space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#f5f5f7] flex items-center gap-2">
                    <ShieldAlert size={14} className={a.type === 'CRITICAL' ? 'text-[#d87878]' : 'text-[#d8aa55]'} />
                    <span>{a.title}</span>
                  </span>
                  <span className="text-[10px] uppercase text-[#9da1b5]">
                    {formatTime(a.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-[#9da1b5] leading-relaxed">
                  {a.message}
                </p>
                {a.explainableAction && (
                  <div className="bg-[#202234] border border-[#2e324a] rounded-[14px] p-3 text-[11px] text-[#72c69a]">
                    <span className="font-bold">Recommendation: </span>
                    {a.explainableAction}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
