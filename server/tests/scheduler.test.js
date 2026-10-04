import assert from 'assert';
import { generateOptimizedSchedule, formatTime24 } from '../services/scheduleOptimizer.js';

console.log('--- RUNNING SCHEDULER & OPTIMIZER TESTS ---');

const demoFurnaces = [
  { furnaceId: 'F1', name: 'Furnace F1', meltingPowerKw: 600, holdingPowerKw: 100 },
  { furnaceId: 'F2', name: 'Furnace F2', meltingPowerKw: 600, holdingPowerKw: 100 }
];

const demoTariff = {
  peakStartHour: 6,
  peakEndHour: 10,
  peakEveningStartHour: 18,
  peakEveningEndHour: 22,
  offPeakStartHour: 22,
  offPeakEndHour: 6,
  peakRatePerKwh: 9.0,
  normalRatePerKwh: 7.5,
  offPeakRatePerKwh: 6.0
};

// Section 26 Demo Scenario
const demoHeats = [
  { heatId: 'H1', pourTime: '10:30', quantityTonnes: 1.0, meltDurationMinutes: 60, preferredFurnace: 'F1' },
  { heatId: 'H2', pourTime: '12:00', quantityTonnes: 1.0, meltDurationMinutes: 60, preferredFurnace: 'F2' },
  { heatId: 'H3', pourTime: '13:30', quantityTonnes: 1.0, meltDurationMinutes: 60, preferredFurnace: 'F1' },
  { heatId: 'H4', pourTime: '15:00', quantityTonnes: 1.0, meltDurationMinutes: 60, preferredFurnace: 'F2' }
];

const result = generateOptimizedSchedule(demoHeats, {
  furnaces: demoFurnaces,
  tariffSettings: demoTariff,
  safetyBufferMinutes: 10,
  demandThresholdKw: 1100
});

// Test 1: Structure verification
assert.ok(result.current, 'Current schedule must exist');
assert.ok(result.optimized, 'Optimized schedule must exist');
assert.strictEqual(result.current.items.length, 4, 'Current schedule must have 4 items');
assert.strictEqual(result.optimized.items.length, 4, 'Optimized schedule must have 4 items');
console.log('✓ Schedule Structure & Count Validated');

// Test 2: Rule 1 - Back-calculated start times
// In optimized plan, H1 pour is 10:30, melt duration is 60 min, safety buffer 10 min -> ideal end 10:20 or close to pour
const optH1 = result.optimized.items.find(i => i.heatId === 'H1');
const optH1End = new Date(optH1.plannedEnd);
const optH1Pour = new Date(optH1.plannedPourTime);
const h1Holding = (optH1Pour.getTime() - optH1End.getTime()) / (60 * 1000);
assert.ok(h1Holding <= 20, `Optimized H1 holding (${h1Holding}m) should be minimized compared to current holding`);
console.log('✓ Rule 1 (Back-calculate melt start & minimize holding) Validated');

// Test 3: Rule 3 - Avoid simultaneous melting (peak demand reduction)
assert.strictEqual(result.current.summary.peakDemandKw, 1200, 'Current plan peak demand should be 1200 kW due to parallel melting');
assert.strictEqual(result.optimized.summary.peakDemandKw, 600, 'Optimized plan peak demand should be 600 kW due to staggered melting');
assert.strictEqual(result.optimized.potentialSavingsVsCurrent.peakDemandKwReduction, 600, 'Demand reduction should be 600 kW');
console.log('✓ Rule 3 (Melt Staggering & Demand Spike Prevention) Validated');

// Test 4: Dynamic Savings Calculation
const savings = result.optimized.potentialSavingsVsCurrent;
assert.ok(savings.cost > 0, `Cost savings should be positive (calculated ₹${savings.cost})`);
assert.ok(savings.energyKwh > 0, `Energy savings should be positive (calculated ${savings.energyKwh} kWh)`);
assert.ok(savings.holdingMinutesSaved > 0, `Holding minutes saved should be positive (saved ${savings.holdingMinutesSaved} mins)`);
assert.ok(result.optimized.summary.averageSec <= result.current.summary.averageSec, 'Optimized SEC should be <= current SEC');
console.log(`✓ Dynamic Savings Calculation Validated: ₹${savings.cost} saved, ${savings.energyKwh} kWh avoided, ${savings.holdingMinutesSaved} min holding eliminated`);

console.log('ALL SCHEDULER & OPTIMIZATION TESTS PASSED! ✓\n');
