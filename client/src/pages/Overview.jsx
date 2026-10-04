import React from 'react';
import NeumorphicKpiCard from '../components/NeumorphicKpiCard';
import QuickCommands from '../components/QuickCommands';
import EnergyProcessChart from '../components/EnergyProcessChart';
import RecentActivityWidget from '../components/RecentActivityWidget';
import HardwarePulseWidget from '../components/HardwarePulseWidget';
import AiRecommendationCard from '../components/AiRecommendationCard';
import { Zap, DollarSign, Flame, Layers } from 'lucide-react';

export default function Overview({
  data,
  onNavigate,
  onSelectFurnace,
  onSelectHeat
}) {
  const kpis = data?.kpis || {};

  const energyIntensity = kpis.todayAverageSec || 428;
  const energyCost = kpis.todayCost ? Math.round(kpis.todayCost / 1000) : 18.4;
  const efficiency = kpis.efficiencyPct || 91.6;
  const productionTons = kpis.productionTons || 46.8;

  return (
    <div className="space-y-8 pb-12">
      {/* Title & Subtitle Section */}
      <div>
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-[#f5f5f7]">
          System Overview
        </h1>
        <p className="mt-1 text-sm text-[#9da1b5]">
          Intelligent energy & heat cycle optimization center for foundry operations.
        </p>
      </div>

      {/* Four KPI Cards Grid (4 Columns Desktop, 1 Column Mobile) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI 1: Specific Energy Intensity */}
        <NeumorphicKpiCard
          icon={Zap}
          iconColor="text-[#7c78e8]"
          iconBgGlow="rgba(124, 120, 232, 0.4)"
          badge="ACTIVE"
          badgeStatus="green"
          value={energyIntensity}
          decimals={0}
          suffix=" kWh/t"
          title="Specific Energy Intensity (SEC)"
          subtitle="Benchmark: 520 kWh/t"
          sparklineType="wave"
          sparklineColor="#7c78e8"
          statusText="▼ -8.4% this shift"
          statusType="green"
        />

        {/* KPI 2: Daily Energy Cost */}
        <NeumorphicKpiCard
          icon={DollarSign}
          iconColor="text-[#72c69a]"
          iconBgGlow="rgba(114, 198, 154, 0.4)"
          badge="OPTIMIZED"
          badgeStatus="green"
          value={energyCost}
          decimals={1}
          prefix="₹"
          suffix="k"
          title="Daily Energy Cost"
          subtitle="Peak Tariff Avoided"
          sparklineType="upward"
          sparklineColor="#72c69a"
          statusText="▲ ₹2,100 saved today"
          statusType="green"
        />

        {/* KPI 3: Furnace Thermal Efficiency */}
        <NeumorphicKpiCard
          icon={Flame}
          iconColor="text-[#d8aa55]"
          iconBgGlow="rgba(216, 170, 85, 0.4)"
          badge="TAP CYCLE"
          badgeStatus="amber"
          value={efficiency}
          decimals={1}
          suffix="%"
          title="Furnace Thermal Efficiency"
          subtitle="Avg Tap-to-Tap: 78m"
          sparklineType="zigzag"
          sparklineColor="#d8aa55"
          statusText="● 3 furnaces active"
          statusType="amber"
        />

        {/* KPI 4: Production Output */}
        <NeumorphicKpiCard
          icon={Layers}
          iconColor="text-[#d87878]"
          iconBgGlow="rgba(216, 120, 120, 0.4)"
          badge="ON TRACK"
          badgeStatus="blue"
          value={productionTons}
          decimals={1}
          suffix=" Tons"
          title="Production Output"
          subtitle="Target: 50.0 Tons"
          sparklineType="stepped"
          sparklineColor="#d87878"
          statusText="Heat #142 pouring"
          statusType="green"
        />
      </section>

      {/* Quick Commands Row */}
      <QuickCommands
        onCommand={(cmdId) => {
          if (cmdId === 'log-heat' && onSelectHeat) onSelectHeat();
          if (cmdId === 'peak-shave' && onNavigate) onNavigate('energy');
          if (cmdId === 'tapping-sequence' && onNavigate) onNavigate('furnaces');
        }}
      />

      {/* Main Energy / Process Visualization Chart */}
      <section>
        <EnergyProcessChart />
      </section>

      {/* Two-Column Activity & Telemetry Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity Timeline Widget */}
        <RecentActivityWidget onNavigate={onNavigate} />

        {/* Hardware Pulse Telemetry Widget */}
        <HardwarePulseWidget />
      </section>

      {/* AI Optimization Recommendation Section */}
      <section>
        <AiRecommendationCard />
      </section>
    </div>
  );
}
