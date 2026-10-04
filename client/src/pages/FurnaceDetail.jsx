import React, { useState } from 'react';
import {
  ArrowLeft,
  Flame,
  Zap,
  Thermometer,
  Activity,
  AlertTriangle,
  Clock,
  TrendingDown
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
      <div className="p-8 text-center text-industrial-400 font-mono text-sm">
        Furnace not found. <button onClick={onBack} className="text-metallo-orange underline">Return</button>
      </div>
    );
  }

  const trends = furnace.trends || [];
  const associatedHeats = furnace.associatedHeats || [];
  const activeAlerts = furnace.activeAlerts || [];
  const currentHeat = furnace.currentHeat;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Navigation & Header */}
      <div className="flex items-center gap-4 border-b border-industrial-800 pb-4">
        <button
          onClick={onBack}
          className="p-1.5 rounded bg-industrial-900 border border-industrial-800 text-industrial-400 hover:text-white transition"
          aria-label="Back to Furnaces"
        >
          <ArrowLeft size={16} />
        </button>

        <div className="flex-1 flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <div className="text-[11px] font-mono tracking-widest text-industrial-400 uppercase">
              FURNACE DEEP DIVE
            </div>
            <h1 className="text-2xl font-mono font-bold tracking-tight text-white mt-0.5 flex items-center gap-3">
              <span>{furnace.name || furnace.furnaceId}</span>
              <StatusBadge status={furnace.status} size="md" />
            </h1>
          </div>

          <div className="text-xs font-mono text-industrial-400">
            Current Heat: <span className="text-white font-bold">{furnace.currentHeatId || 'None'}</span>
          </div>
        </div>
      </div>

      {/* Key Electrical & Thermal Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-industrial-900 border border-industrial-800 p-3 rounded font-mono">
          <div className="text-[10px] text-industrial-500 uppercase">Active Power</div>
          <div className="text-lg font-bold text-white mt-0.5">{formatKw(furnace.currentPowerKw)}</div>
          <div className="text-[10px] text-industrial-400">Rated: {furnace.meltingPowerKw} kW</div>
        </div>

        <div className="bg-industrial-900 border border-industrial-800 p-3 rounded font-mono">
          <div className="text-[10px] text-industrial-500 uppercase">Bath Temp</div>
          <div className="text-lg font-bold text-metallo-orange mt-0.5">{furnace.temperatureC}°C</div>
          <div className="text-[10px] text-industrial-400">Target: 1480°C</div>
        </div>

        <div className="bg-industrial-900 border border-industrial-800 p-3 rounded font-mono">
          <div className="text-[10px] text-industrial-500 uppercase">Power Factor</div>
          <div className={`text-lg font-bold mt-0.5 ${furnace.currentPf < 0.95 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {furnace.currentPf?.toFixed(2)}
          </div>
          <div className="text-[10px] text-industrial-400">Target: ≥0.95</div>
        </div>

        <div className="bg-industrial-900 border border-industrial-800 p-3 rounded font-mono">
          <div className="text-[10px] text-industrial-500 uppercase">Apparent Load</div>
          <div className="text-lg font-bold text-white mt-0.5">{formatKva(furnace.currentKva)}</div>
          <div className="text-[10px] text-industrial-400">kW / PF</div>
        </div>

        <div className="bg-industrial-900 border border-industrial-800 p-3 rounded font-mono">
          <div className="text-[10px] text-industrial-500 uppercase">Today's Energy</div>
          <div className="text-lg font-bold text-white mt-0.5">{formatKwh(furnace.todayEnergyKwh)}</div>
          <div className="text-[10px] text-industrial-400">{furnace.todayProductionTonnes}t tapped</div>
        </div>

        <div className="bg-industrial-900 border border-industrial-800 p-3 rounded font-mono">
          <div className="text-[10px] text-industrial-500 uppercase">Dynamic SEC</div>
          <div className="text-lg font-bold text-metallo-orange mt-0.5">{formatSec(furnace.calculatedSec || 580)}</div>
          <div className="text-[10px] text-industrial-400">Base: 580 kWh/t</div>
        </div>
      </div>

      {/* Active Heat Visual Timeline (If current heat exists) */}
      {currentHeat && (
        <div className="bg-industrial-900 border border-industrial-800 rounded p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono uppercase tracking-wider text-metallo-orange font-semibold flex items-center gap-1.5">
              <Clock size={14} />
              <span>Current Heat Timeline ({currentHeat.heatId})</span>
            </div>
            <div className="text-xs font-mono text-industrial-400">
              Grade: <span className="text-industrial-200">{currentHeat.grade}</span> • {currentHeat.productionTonnes}t
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

      {/* Tab Navigation */}
      <div className="flex border-b border-industrial-800 text-xs font-mono">
        <button
          onClick={() => setActiveTab('trends')}
          className={`px-4 py-2 font-medium border-b-2 transition ${
            activeTab === 'trends'
              ? 'border-metallo-orange text-white'
              : 'border-transparent text-industrial-400 hover:text-industrial-200'
          }`}
        >
          Telemetry Trends
        </button>

        <button
          onClick={() => setActiveTab('heats')}
          className={`px-4 py-2 font-medium border-b-2 transition ${
            activeTab === 'heats'
              ? 'border-metallo-orange text-white'
              : 'border-transparent text-industrial-400 hover:text-industrial-200'
          }`}
        >
          Associated Heats ({associatedHeats.length})
        </button>

        <button
          onClick={() => setActiveTab('alerts')}
          className={`px-4 py-2 font-medium border-b-2 transition ${
            activeTab === 'alerts'
              ? 'border-metallo-orange text-white'
              : 'border-transparent text-industrial-400 hover:text-industrial-200'
          }`}
        >
          Active Alerts ({activeAlerts.length})
        </button>
      </div>

      {/* Tab 1: Telemetry Trends */}
      {activeTab === 'trends' && (
        <div className="space-y-6">
          {/* Power Trend Chart */}
          <div className="bg-industrial-900 border border-industrial-800 rounded p-4">
            <div className="flex items-center justify-between mb-3 text-xs font-mono">
              <span className="font-bold text-white uppercase tracking-wider">
                Power Draw (kW) & Apparent Load (kVA)
              </span>
              <span className="text-industrial-400 text-[11px]">Real-time Telemetry Trend</span>
            </div>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trends}>
                  <CartesianGrid stroke="#22222a" strokeDasharray="3 3" />
                  <XAxis dataKey="time" stroke="#78788c" fontSize={11} tickLine={false} />
                  <YAxis stroke="#78788c" fontSize={11} tickLine={false} unit="kW" />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: '#111114', borderColor: '#282830', fontSize: '12px' }}
                  />
                  <Line type="monotone" dataKey="powerKw" stroke="#ff5a1f" strokeWidth={2} dot={false} name="Active Power (kW)" />
                  <Line type="monotone" dataKey="apparentPowerKva" stroke="#3b82f6" strokeWidth={1.5} dot={false} strokeDasharray="4 4" name="Apparent Load (kVA)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Temperature & Power Factor Trends (Side by Side) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Temp Chart */}
            <div className="bg-industrial-900 border border-industrial-800 rounded p-4">
              <div className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-2">
                Bath Temperature (°C)
              </div>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trends}>
                    <CartesianGrid stroke="#22222a" strokeDasharray="3 3" />
                    <XAxis dataKey="time" stroke="#78788c" fontSize={10} tickLine={false} />
                    <YAxis stroke="#78788c" fontSize={10} tickLine={false} domain={[400, 1600]} unit="°C" />
                    <RechartsTooltip
                      contentStyle={{ backgroundColor: '#111114', borderColor: '#282830', fontSize: '11px' }}
                    />
                    <Line type="monotone" dataKey="temperatureC" stroke="#f59e0b" strokeWidth={2} dot={false} name="Temperature (°C)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* PF Chart */}
            <div className="bg-industrial-900 border border-industrial-800 rounded p-4">
              <div className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-2">
                Power Factor (Target ≥ 0.95)
              </div>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trends}>
                    <CartesianGrid stroke="#22222a" strokeDasharray="3 3" />
                    <XAxis dataKey="time" stroke="#78788c" fontSize={10} tickLine={false} />
                    <YAxis stroke="#78788c" fontSize={10} tickLine={false} domain={[0.8, 1.0]} />
                    <RechartsTooltip
                      contentStyle={{ backgroundColor: '#111114', borderColor: '#282830', fontSize: '11px' }}
                    />
                    <Line type="monotone" dataKey="powerFactor" stroke="#10b981" strokeWidth={2} dot={false} name="Power Factor" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Associated Heats */}
      {activeTab === 'heats' && (
        <div className="bg-industrial-900 border border-industrial-800 rounded overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-industrial-950 text-industrial-400 border-b border-industrial-800">
                <tr>
                  <th className="p-3">Heat ID</th>
                  <th className="p-3">Grade</th>
                  <th className="p-3">Tonnes</th>
                  <th className="p-3">Melt Time</th>
                  <th className="p-3">Holding</th>
                  <th className="p-3">Energy</th>
                  <th className="p-3">SEC</th>
                  <th className="p-3">Cost</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-industrial-800/60">
                {associatedHeats.map((h) => (
                  <tr key={h.heatId} className="hover:bg-industrial-800/40">
                    <td className="p-3 font-bold text-white">{h.heatId}</td>
                    <td className="p-3 text-industrial-300">{h.grade}</td>
                    <td className="p-3">{h.productionTonnes}t</td>
                    <td className="p-3">{h.meltingDurationMinutes}m</td>
                    <td className={`p-3 font-semibold ${h.holdingDurationMinutes > 30 ? 'text-red-400' : 'text-industrial-300'}`}>
                      {h.holdingDurationMinutes}m
                    </td>
                    <td className="p-3">{formatKwh(h.totalEnergyKwh)}</td>
                    <td className="p-3 text-metallo-orange font-bold">{formatSec(h.secKwhPerTonne)}</td>
                    <td className="p-3">{formatCurrency(h.tariffBreakdown?.totalCost)}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onSelectHeat(h.heatId)}
                        className="text-metallo-orange hover:underline text-[11px]"
                      >
                        Inspect &rarr;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Active Alerts */}
      {activeTab === 'alerts' && (
        <div className="space-y-3">
          {activeAlerts.length === 0 ? (
            <div className="bg-industrial-900 border border-industrial-800 p-8 rounded text-center text-industrial-500 font-mono text-xs">
              No active alerts logged for this furnace.
            </div>
          ) : (
            activeAlerts.map((alert) => (
              <div
                key={alert.alertId}
                className="bg-industrial-900 border border-industrial-800 rounded p-4 text-xs font-mono space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded font-bold ${alert.type === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {alert.type} • {alert.category}
                  </span>
                  <span className="text-industrial-500">{formatTime(alert.timestamp)}</span>
                </div>
                <div className="font-bold text-white text-sm">{alert.title}</div>
                <div className="text-industrial-300">{alert.message}</div>
                <div className="bg-industrial-950 p-2.5 rounded border border-industrial-800 text-industrial-400">
                  <span className="text-metallo-orange font-semibold">Recommended Inspection: </span>
                  {alert.explainableAction}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
