import React, { useState } from 'react';
import {
  Zap,
  DollarSign,
  TrendingDown,
  Layers,
  PieChart as PieIcon,
  Flame
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import Tooltip from '../components/Tooltip';
import { formatCurrency, formatKwh, formatSec } from '../utils/formatters';

export default function EnergyCost({ energyData }) {
  const [activeTab, setActiveTab] = useState('tariffs'); // 'tariffs' | 'furnaces' | 'sec'

  if (!energyData) {
    return (
      <div className="p-8 text-center text-industrial-400 font-mono text-sm">
        Loading energy & cost analytics...
      </div>
    );
  }

  const { summary = {}, furnaceDistribution = [], secTrend = [], tariffSettings = {} } = energyData;

  const tariffBarData = [
    {
      period: 'Peak Band (₹9.0/kWh)',
      energyKwh: summary.peakEnergyKwh || 0,
      cost: summary.peakCost || 0,
      color: '#ff5a1f'
    },
    {
      period: 'Normal Band (₹7.5/kWh)',
      energyKwh: summary.normalEnergyKwh || 0,
      cost: summary.normalCost || 0,
      color: '#3b82f6'
    },
    {
      period: 'Off-Peak (₹6.0/kWh)',
      energyKwh: summary.offPeakEnergyKwh || 0,
      cost: summary.offPeakCost || 0,
      color: '#10b981'
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-industrial-800 pb-4">
        <div>
          <div className="text-[11px] font-mono tracking-widest text-industrial-400 uppercase">
            COMMERCIAL & THERMODYNAMIC COST ENGINE
          </div>
          <h1 className="text-2xl font-mono font-bold tracking-tight text-white mt-0.5">
            Energy & Time-Of-Day Tariff Analysis
          </h1>
        </div>

        <div className="text-xs font-mono text-industrial-400">
          DISCOM Tariff: <span className="text-white font-semibold">{tariffSettings.discomName || 'HT-III-A'}</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-industrial-900 border border-industrial-800 p-4 rounded font-mono">
          <div className="text-[11px] text-industrial-400 uppercase mb-1 flex items-center justify-between">
            <span>Total Energy</span>
            <Zap size={14} className="text-metallo-orange" />
          </div>
          <div className="text-2xl font-bold text-white">{formatKwh(summary.totalEnergyKwh)}</div>
          <div className="text-[11px] text-industrial-400 mt-1">Foundry cumulative</div>
        </div>

        <div className="bg-industrial-900 border border-industrial-800 p-4 rounded font-mono">
          <div className="text-[11px] text-industrial-400 uppercase mb-1 flex items-center justify-between">
            <span>Total Power Bill</span>
            <DollarSign size={14} className="text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">{formatCurrency(summary.totalCost)}</div>
          <div className="text-[11px] text-industrial-400 mt-1">ToD integrated</div>
        </div>

        <div className="bg-industrial-900 border border-industrial-800 p-4 rounded font-mono">
          <div className="text-[11px] text-industrial-400 uppercase mb-1 flex items-center justify-between">
            <span>Peak Band Cost</span>
            <span className="text-metallo-orange font-bold">₹9.0/kWh</span>
          </div>
          <div className="text-2xl font-bold text-metallo-orange">{formatCurrency(summary.peakCost)}</div>
          <div className="text-[11px] text-industrial-400 mt-1">{formatKwh(summary.peakEnergyKwh)} peak draw</div>
        </div>

        <div className="bg-industrial-900 border border-industrial-800 p-4 rounded font-mono">
          <div className="text-[11px] text-industrial-400 uppercase mb-1 flex items-center justify-between">
            <span>Normal + Off-Peak</span>
            <span className="text-emerald-400 font-bold">Standard</span>
          </div>
          <div className="text-2xl font-bold text-emerald-400">
            {formatCurrency((summary.normalCost || 0) + (summary.offPeakCost || 0))}
          </div>
          <div className="text-[11px] text-industrial-400 mt-1">Base production cost</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-industrial-800 text-xs font-mono">
        <button
          onClick={() => setActiveTab('tariffs')}
          className={`px-4 py-2 font-medium border-b-2 transition ${
            activeTab === 'tariffs'
              ? 'border-metallo-orange text-white'
              : 'border-transparent text-industrial-400 hover:text-industrial-200'
          }`}
        >
          Tariff Period Breakdown
        </button>

        <button
          onClick={() => setActiveTab('furnaces')}
          className={`px-4 py-2 font-medium border-b-2 transition ${
            activeTab === 'furnaces'
              ? 'border-metallo-orange text-white'
              : 'border-transparent text-industrial-400 hover:text-industrial-200'
          }`}
        >
          Consumption by Furnace
        </button>

        <button
          onClick={() => setActiveTab('sec')}
          className={`px-4 py-2 font-medium border-b-2 transition ${
            activeTab === 'sec'
              ? 'border-metallo-orange text-white'
              : 'border-transparent text-industrial-400 hover:text-industrial-200'
          }`}
        >
          Batch SEC Evolution
        </button>
      </div>

      {/* Tab 1: Tariff Breakdown */}
      {activeTab === 'tariffs' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-industrial-900 border border-industrial-800 rounded p-4">
            <div className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-4">
              Energy Consumed by Tariff Band (kWh)
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tariffBarData}>
                  <CartesianGrid stroke="#22222a" strokeDasharray="3 3" />
                  <XAxis dataKey="period" stroke="#78788c" fontSize={11} tickLine={false} />
                  <YAxis stroke="#78788c" fontSize={11} tickLine={false} unit=" kWh" />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: '#111114', borderColor: '#282830', fontSize: '12px' }}
                  />
                  <Bar dataKey="energyKwh" fill="#ff5a1f" radius={[4, 4, 0, 0]} name="Energy (kWh)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-industrial-900 border border-industrial-800 rounded p-4">
            <div className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-4">
              Financial Cost by Tariff Band (₹)
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tariffBarData}>
                  <CartesianGrid stroke="#22222a" strokeDasharray="3 3" />
                  <XAxis dataKey="period" stroke="#78788c" fontSize={11} tickLine={false} />
                  <YAxis stroke="#78788c" fontSize={11} tickLine={false} unit=" ₹" />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: '#111114', borderColor: '#282830', fontSize: '12px' }}
                  />
                  <Bar dataKey="cost" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Cost (₹)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Consumption by Furnace */}
      {activeTab === 'furnaces' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {furnaceDistribution.map((f) => (
            <div key={f.furnaceId} className="bg-industrial-900 border border-industrial-800 rounded p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-mono text-lg font-bold text-white">{f.name || f.furnaceId}</h3>
                  <div className="text-xs font-mono text-industrial-400">Share of total plant energy</div>
                </div>
                <span className="text-xl font-mono font-bold text-metallo-orange">{f.percentageOfTotal}%</span>
              </div>

              <div className="grid grid-cols-3 gap-2 bg-industrial-950 p-3 rounded font-mono text-xs border border-industrial-800">
                <div>
                  <div className="text-[10px] text-industrial-500">ENERGY</div>
                  <div className="text-white font-bold mt-0.5">{formatKwh(f.totalEnergyKwh)}</div>
                </div>
                <div>
                  <div className="text-[10px] text-industrial-500">PRODUCTION</div>
                  <div className="text-white font-bold mt-0.5">{f.totalProductionTonnes} tonnes</div>
                </div>
                <div>
                  <div className="text-[10px] text-industrial-500">AVG SEC</div>
                  <div className="text-metallo-orange font-bold mt-0.5">{formatSec(f.averageSec)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: SEC Trend */}
      {activeTab === 'sec' && (
        <div className="bg-industrial-900 border border-industrial-800 rounded p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Specific Energy Consumption Across Heats (kWh/t)
              </div>
              <div className="text-[11px] font-mono text-industrial-400 mt-0.5">
                Benchmark: 580 kWh/t. Spikes correlate with excessive holding & moulding delays.
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={secTrend}>
                <CartesianGrid stroke="#22222a" strokeDasharray="3 3" />
                <XAxis dataKey="heatId" stroke="#78788c" fontSize={11} tickLine={false} />
                <YAxis stroke="#78788c" fontSize={11} tickLine={false} domain={[500, 750]} unit=" kWh/t" />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: '#111114', borderColor: '#282830', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="secKwhPerTonne" stroke="#ff5a1f" strokeWidth={2.5} name="SEC (kWh/t)" />
                <Line type="monotone" dataKey="benchmarkSec" stroke="#10b981" strokeDasharray="4 4" strokeWidth={1.5} name="Target Benchmark (580)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
