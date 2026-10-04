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
      <div className="p-8 text-center text-[#9da1b5] font-mono text-sm">
        Loading energy & cost analytics...
      </div>
    );
  }

  const { summary = {}, furnaceDistribution = [], secTrend = [], tariffSettings = {} } = energyData;

  const tariffBarData = [
    {
      period: 'Peak Band (₹9.5/kWh)',
      energyKwh: summary.peakEnergyKwh || 0,
      cost: summary.peakCost || 0,
      fill: '#d87878'
    },
    {
      period: 'Normal Band (₹7.5/kWh)',
      energyKwh: summary.normalEnergyKwh || 0,
      cost: summary.normalCost || 0,
      fill: '#7c78e8'
    },
    {
      period: 'Off-Peak (₹6.0/kWh)',
      energyKwh: summary.offPeakEnergyKwh || 0,
      cost: summary.offPeakCost || 0,
      fill: '#72c69a'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-[#2a2d42] pb-4">
        <div>
          <div className="text-[11px] font-mono tracking-widest text-[#7c78e8] uppercase mb-1">
            COMMERCIAL & THERMODYNAMIC COST ENGINE
          </div>
          <h1 className="text-2xl font-mono font-bold tracking-tight text-[#f5f5f7]">
            Energy & Time-Of-Day Tariff Analysis
          </h1>
          <p className="mt-1 text-xs text-[#9da1b5]">
            Granular evaluation of power billing, tariff periods, and unit specific energy consumption.
          </p>
        </div>

        <div className="text-xs font-mono text-[#9da1b5] bg-[#25283a] border border-[#2e324a] px-3.5 py-1.5 rounded-[12px] shadow-[2px_2px_6px_rgba(20,21,42,0.45)]">
          DISCOM Tariff: <span className="text-[#f5f5f7] font-bold">{tariffSettings.discomName || 'HT-III-A'}</span>
        </div>
      </div>

      {/* KPI Cards (Neumorphic Surfaces) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#25283a] border border-[#2e324a] p-5 rounded-[22px] shadow-[4px_4px_10px_rgba(20,21,42,0.45),-4px_-4px_10px_rgba(42,45,66,0.35)] font-mono">
          <div className="text-[11px] text-[#9da1b5] uppercase mb-1 flex items-center justify-between">
            <span>Total Energy</span>
            <Zap size={14} className="text-[#7c78e8]" />
          </div>
          <div className="text-2xl font-bold text-[#f5f5f7] mt-1">{formatKwh(summary.totalEnergyKwh)}</div>
          <div className="text-[11px] text-[#9da1b5] mt-1 font-mono">Foundry cumulative</div>
        </div>

        <div className="bg-[#25283a] border border-[#2e324a] p-5 rounded-[22px] shadow-[4px_4px_10px_rgba(20,21,42,0.45),-4px_-4px_10px_rgba(42,45,66,0.35)] font-mono">
          <div className="text-[11px] text-[#9da1b5] uppercase mb-1 flex items-center justify-between">
            <span>Total Power Bill</span>
            <DollarSign size={14} className="text-[#72c69a]" />
          </div>
          <div className="text-2xl font-bold text-[#f5f5f7] mt-1">{formatCurrency(summary.totalCost)}</div>
          <div className="text-[11px] text-[#9da1b5] mt-1 font-mono">ToD integrated</div>
        </div>

        <div className="bg-[#25283a] border border-[#2e324a] p-5 rounded-[22px] shadow-[4px_4px_10px_rgba(20,21,42,0.45),-4px_-4px_10px_rgba(42,45,66,0.35)] font-mono">
          <div className="text-[11px] text-[#9da1b5] uppercase mb-1 flex items-center justify-between">
            <span>Peak Band Cost</span>
            <span className="text-[#d87878] font-bold">₹9.5/kWh</span>
          </div>
          <div className="text-2xl font-bold text-[#d87878] mt-1">{formatCurrency(summary.peakCost)}</div>
          <div className="text-[11px] text-[#9da1b5] mt-1 font-mono">{formatKwh(summary.peakEnergyKwh)} peak draw</div>
        </div>

        <div className="bg-[#25283a] border border-[#2e324a] p-5 rounded-[22px] shadow-[4px_4px_10px_rgba(20,21,42,0.45),-4px_-4px_10px_rgba(42,45,66,0.35)] font-mono">
          <div className="text-[11px] text-[#9da1b5] uppercase mb-1 flex items-center justify-between">
            <span>Standard + Off-Peak</span>
            <span className="text-[#72c69a] font-bold">Base</span>
          </div>
          <div className="text-2xl font-bold text-[#72c69a] mt-1">
            {formatCurrency((summary.normalCost || 0) + (summary.offPeakCost || 0))}
          </div>
          <div className="text-[11px] text-[#9da1b5] mt-1 font-mono">Base production cost</div>
        </div>
      </div>

      {/* Tabs (Neumorphic Pills) */}
      <div className="flex gap-2 text-xs font-mono p-1 bg-[#1e2030] rounded-[18px] shadow-[inset_2px_2px_5px_rgba(20,21,42,0.45),inset_-2px_-2px_5px_rgba(42,45,66,0.30)] w-fit border border-[#2e324a]">
        <button
          onClick={() => setActiveTab('tariffs')}
          className={`px-4 py-2 rounded-[14px] font-bold transition-all ${
            activeTab === 'tariffs'
              ? 'bg-[#25283a] text-[#7c78e8] shadow-[3px_3px_6px_rgba(20,21,42,0.45),-3px_-3px_6px_rgba(42,45,66,0.35)]'
              : 'text-[#9da1b5] hover:text-[#f5f5f7]'
          }`}
        >
          Tariff Period Breakdown
        </button>

        <button
          onClick={() => setActiveTab('furnaces')}
          className={`px-4 py-2 rounded-[14px] font-bold transition-all ${
            activeTab === 'furnaces'
              ? 'bg-[#25283a] text-[#7c78e8] shadow-[3px_3px_6px_rgba(20,21,42,0.45),-3px_-3px_6px_rgba(42,45,66,0.35)]'
              : 'text-[#9da1b5] hover:text-[#f5f5f7]'
          }`}
        >
          Consumption by Furnace
        </button>

        <button
          onClick={() => setActiveTab('sec')}
          className={`px-4 py-2 rounded-[14px] font-bold transition-all ${
            activeTab === 'sec'
              ? 'bg-[#25283a] text-[#7c78e8] shadow-[3px_3px_6px_rgba(20,21,42,0.45),-3px_-3px_6px_rgba(42,45,66,0.35)]'
              : 'text-[#9da1b5] hover:text-[#f5f5f7]'
          }`}
        >
          Batch SEC Evolution
        </button>
      </div>

      {/* Tab 1: Tariff Breakdown */}
      {activeTab === 'tariffs' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#25283a] border border-[#2e324a] rounded-[24px] p-6 shadow-[6px_6px_12px_rgba(20,21,42,0.45),-6px_-6px_12px_rgba(42,45,66,0.35)]">
            <div className="text-xs font-mono font-bold text-[#f5f5f7] uppercase tracking-wider mb-4">
              Energy Consumed by Tariff Band (kWh)
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tariffBarData}>
                  <CartesianGrid stroke="rgba(42, 45, 66, 0.45)" strokeDasharray="3 3" />
                  <XAxis dataKey="period" stroke="#9da1b5" fontSize={11} tickLine={false} />
                  <YAxis stroke="#9da1b5" fontSize={11} tickLine={false} unit=" kWh" />
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
                  <Bar dataKey="energyKwh" fill="#7c78e8" radius={[8, 8, 0, 0]} name="Energy (kWh)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#25283a] border border-[#2e324a] rounded-[24px] p-6 shadow-[6px_6px_12px_rgba(20,21,42,0.45),-6px_-6px_12px_rgba(42,45,66,0.35)]">
            <div className="text-xs font-mono font-bold text-[#f5f5f7] uppercase tracking-wider mb-4">
              Financial Cost by Tariff Band (₹)
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tariffBarData}>
                  <CartesianGrid stroke="rgba(42, 45, 66, 0.45)" strokeDasharray="3 3" />
                  <XAxis dataKey="period" stroke="#9da1b5" fontSize={11} tickLine={false} />
                  <YAxis stroke="#9da1b5" fontSize={11} tickLine={false} unit=" ₹" />
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
                  <Bar dataKey="cost" fill="#d8aa55" radius={[8, 8, 0, 0]} name="Cost (₹)" />
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
            <div key={f.furnaceId} className="bg-[#25283a] border border-[#2e324a] rounded-[24px] p-6 shadow-[6px_6px_12px_rgba(20,21,42,0.45),-6px_-6px_12px_rgba(42,45,66,0.35)] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-mono text-lg font-bold text-[#f5f5f7]">{f.name || f.furnaceId}</h3>
                  <div className="text-xs font-mono text-[#9da1b5]">Share of total foundry energy</div>
                </div>
                <span className="text-2xl font-mono font-bold text-[#7c78e8]">{f.percentageOfTotal}%</span>
              </div>

              <div className="grid grid-cols-3 gap-3 nm-inset p-4 rounded-[18px] font-mono text-xs border border-[#2e324a]">
                <div>
                  <div className="text-[10px] text-[#9da1b5] uppercase">ENERGY</div>
                  <div className="text-[#f5f5f7] font-bold mt-1 text-sm">{formatKwh(f.totalEnergyKwh)}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#9da1b5] uppercase">PRODUCTION</div>
                  <div className="text-[#f5f5f7] font-bold mt-1 text-sm">{f.totalProductionTonnes} tonnes</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#9da1b5] uppercase">AVG SEC</div>
                  <div className="text-[#7c78e8] font-bold mt-1 text-sm">{formatSec(f.averageSec)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: SEC Trend */}
      {activeTab === 'sec' && (
        <div className="bg-[#25283a] border border-[#2e324a] rounded-[24px] p-6 shadow-[6px_6px_12px_rgba(20,21,42,0.45),-6px_-6px_12px_rgba(42,45,66,0.35)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs font-mono font-bold text-[#f5f5f7] uppercase tracking-wider">
                Specific Energy Consumption Across Heats (kWh/t)
              </div>
              <div className="text-[11px] font-mono text-[#9da1b5] mt-0.5">
                Target Benchmark: 580 kWh/t. Elevations indicate holding radiation loss or lower electrical efficiency.
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={secTrend}>
                <CartesianGrid stroke="rgba(42, 45, 66, 0.45)" strokeDasharray="3 3" />
                <XAxis dataKey="heatId" stroke="#9da1b5" fontSize={11} tickLine={false} />
                <YAxis stroke="#9da1b5" fontSize={11} tickLine={false} domain={[500, 750]} unit=" kWh/t" />
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
                <Line type="monotone" dataKey="secKwhPerTonne" stroke="#7c78e8" strokeWidth={2.5} name="SEC (kWh/t)" />
                <Line type="monotone" dataKey="benchmarkSec" stroke="#72c69a" strokeDasharray="4 4" strokeWidth={1.5} name="Target Benchmark (580)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
