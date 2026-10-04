import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { Zap, Thermometer } from 'lucide-react';

const mockChartData = [
  { time: '06:00', power: 420, temp: 280, tariff: 'Off-Peak', cost: '₹6.0' },
  { time: '07:00', power: 780, temp: 650, tariff: 'Off-Peak', cost: '₹6.0' },
  { time: '08:00', power: 1150, temp: 1120, tariff: 'Normal', cost: '₹7.5' },
  { time: '09:00', power: 1320, temp: 1390, tariff: 'Normal', cost: '₹7.5' },
  { time: '10:00', power: 1280, temp: 1460, tariff: 'Normal', cost: '₹7.5' },
  { time: '11:00', power: 850, temp: 1485, tariff: 'Normal', cost: '₹7.5' },
  { time: '12:00', power: 1100, temp: 800, tariff: 'Normal', cost: '₹7.5' },
  { time: '13:00', power: 1250, temp: 1220, tariff: 'Normal', cost: '₹7.5' },
  { time: '14:00', power: 1180, temp: 1440, tariff: 'Normal', cost: '₹7.5' },
  { time: '15:00', power: 920, temp: 1490, tariff: 'Normal', cost: '₹7.5' },
  { time: '16:00', power: 640, temp: 1100, tariff: 'Peak Shift', cost: '₹9.0' },
  { time: '17:00', power: 580, temp: 1250, tariff: 'Peak Shift', cost: '₹9.0' },
  { time: '18:00', power: 980, temp: 1420, tariff: 'Normal', cost: '₹7.5' }
];

export default function EnergyProcessChart() {
  const [activeRange, setActiveRange] = useState('8H');
  const ranges = ['1H', '8H', '24H'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="nm-card-static px-4 py-3 border border-[rgba(42,45,66,0.8)] text-xs shadow-xl min-w-[170px] bg-[#25283a]">
          <div className="font-bold text-[#f5f5f7] flex items-center justify-between pb-1.5 border-b border-[rgba(42,45,66,0.6)]">
            <span>Time: {label}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[rgba(124,120,232,0.15)] text-[#7c78e8] font-semibold">
              {data.tariff}
            </span>
          </div>

          <div className="mt-2 space-y-1.5">
            <div className="flex items-center justify-between text-[#7c78e8] font-medium">
              <span className="flex items-center gap-1.5">
                <Zap size={12} /> Power Demand:
              </span>
              <span className="font-bold">{data.power} kW</span>
            </div>

            <div className="flex items-center justify-between text-[#d8aa55] font-medium">
              <span className="flex items-center gap-1.5">
                <Thermometer size={12} /> Melt Temp:
              </span>
              <span className="font-bold">{data.temp} °C</span>
            </div>

            <div className="text-[10px] text-[#9da1b5] pt-1 text-right">
              Rate: {data.cost}/kWh
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="nm-card-static p-6 lg:p-7">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-[#f5f5f7]">
              Energy Demand & Thermal Profile
            </h3>
            <span className="nm-badge text-[#7c78e8]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7c78e8] dot-pulse" />
              LIVE TELEMETRY
            </span>
          </div>
          <div className="text-xs text-[#9da1b5] mt-1">
            Real-time induction power vs crucible bath temperature and TOD tariff bands
          </div>
        </div>

        {/* Range Switcher */}
        <div className="flex items-center gap-2">
          {ranges.map((range) => (
            <button
              key={range}
              onClick={() => setActiveRange(range)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all duration-200 ${
                activeRange === range
                  ? 'nm-inset-sm text-[#7c78e8] font-bold'
                  : 'nm-btn text-[#9da1b5] hover:text-[#f5f5f7]'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mockChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="powerGradientDark" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c78e8" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#7c78e8" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="tempGradientDark" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#d8aa55" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#d8aa55" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(42, 45, 66, 0.45)"
            />

            <XAxis
              dataKey="time"
              stroke="#9da1b5"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              stroke="#9da1b5"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}`}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="power"
              name="Power Demand (kW)"
              stroke="#7c78e8"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#powerGradientDark)"
            />

            <Area
              type="monotone"
              dataKey="temp"
              name="Bath Temp (°C)"
              stroke="#d8aa55"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#tempGradientDark)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-[rgba(42,45,66,0.5)] flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#7c78e8] shadow-sm" />
            <span className="font-semibold text-[#f5f5f7]">Active Power (kW)</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#d8aa55] shadow-sm" />
            <span className="font-semibold text-[#f5f5f7]">Melt Bath Temp (°C)</span>
          </div>
        </div>

        <div className="text-[11px] text-[#9da1b5] font-medium">
          Peak Demand Threshold: <strong className="text-[#f5f5f7]">1,400 kW</strong> • Current Headroom: <strong className="text-[#72c69a]">420 kW</strong>
        </div>
      </div>
    </div>
  );
}
