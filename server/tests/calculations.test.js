import assert from 'assert';
import {
  calculateSEC,
  calculateKva,
  calculatePF,
  calculateHoldingEnergy,
  analyzeExcessHolding,
  getTariffForTimestamp,
  calculateIntervalEnergyAndCost,
  calculatePfDemandImpact
} from '../services/energyCalculator.js';

console.log('--- RUNNING CALCULATIONS UNIT TESTS ---');

// Test 1: SEC Calculation (Section 15: 600 kWh / 1 tonne = 600 kWh/t)
{
  const sec1 = calculateSEC(600, 1.0);
  assert.strictEqual(sec1, 600, 'SEC should be 600 kWh/t for 600 kWh and 1 tonne');

  const sec2 = calculateSEC(1250, 2.0);
  assert.strictEqual(sec2, 625, 'SEC should be 625 kWh/t for 1250 kWh and 2 tonnes');

  const secZero = calculateSEC(600, 0);
  assert.strictEqual(secZero, 0, 'SEC should safely handle 0 tonnes');
  console.log('✓ SEC Calculations Passed');
}

// Test 2: PF and kVA (Section 19: PF = kW / kVA and kVA = kW / PF)
{
  const kva = calculateKva(582, 0.94);
  assert.strictEqual(Math.round(kva), 619, 'kVA should be ~619 for 582 kW at 0.94 PF');

  const pf = calculatePF(582, 619.15);
  assert.strictEqual(pf, 0.94, 'PF should be 0.94 for 582 kW and 619.15 kVA');

  const kvaZero = calculateKva(0, 0.95);
  assert.strictEqual(kvaZero, 0, 'kVA should be 0 when power is 0');
  console.log('✓ PF and kVA Calculations Passed');
}

// Test 3: Holding Energy & Excessive Holding Analysis (Section 16)
{
  // 100 kW holding power for 30 minutes = 50 kWh
  const holdingKwh = calculateHoldingEnergy(100, 30);
  assert.strictEqual(holdingKwh, 50, '100 kW for 30 min should be 50 kWh');

  // Holding 47 min with 30 min threshold => 17 min excess = ~28.33 kWh
  const holdingAnalysis = analyzeExcessHolding(100, 47, 30, 7.5);
  assert.strictEqual(holdingAnalysis.isExcessive, true, '47 min holding should be flagged excessive');
  assert.strictEqual(holdingAnalysis.excessMinutes, 17, 'Excess minutes should be 17');
  assert.strictEqual(Math.round(holdingAnalysis.excessEnergyKwh), 28, 'Excess holding energy should be ~28 kWh');
  assert.ok(holdingAnalysis.excessCost > 0, 'Excess holding cost should be positive');

  // Holding 20 min with 30 min threshold => 0 excess
  const normalHolding = analyzeExcessHolding(100, 20, 30, 7.5);
  assert.strictEqual(normalHolding.isExcessive, false);
  assert.strictEqual(normalHolding.excessMinutes, 0);
  assert.strictEqual(normalHolding.excessEnergyKwh, 0);
  console.log('✓ Holding Time & Excess Energy Analysis Passed');
}

// Test 4: Time-of-day Tariff Rates (Section 17)
{
  const mockSettings = {
    peakRatePerKwh: 9.0,
    peakStartHour: 6,
    peakEndHour: 10,
    peakEveningStartHour: 18,
    peakEveningEndHour: 22,
    normalRatePerKwh: 7.5,
    offPeakRatePerKwh: 6.0,
    offPeakStartHour: 22,
    offPeakEndHour: 6
  };

  const peakMorning = new Date('2026-10-04T08:30:00');
  assert.strictEqual(getTariffForTimestamp(peakMorning, mockSettings).type, 'PEAK');
  assert.strictEqual(getTariffForTimestamp(peakMorning, mockSettings).rate, 9.0);

  const normalAfternoon = new Date('2026-10-04T14:00:00');
  assert.strictEqual(getTariffForTimestamp(normalAfternoon, mockSettings).type, 'NORMAL');
  assert.strictEqual(getTariffForTimestamp(normalAfternoon, mockSettings).rate, 7.5);

  const offPeakNight = new Date('2026-10-04T02:00:00');
  assert.strictEqual(getTariffForTimestamp(offPeakNight, mockSettings).type, 'OFF_PEAK');
  assert.strictEqual(getTariffForTimestamp(offPeakNight, mockSettings).rate, 6.0);
  console.log('✓ Time-of-Day Tariff Engine Passed');
}

// Test 5: PF Demand Impact and Surcharge (Section 29)
{
  const impact = calculatePfDemandImpact(600, 0.88, 0.95, 350);
  assert.strictEqual(impact.isSuboptimal, true, '0.88 PF should be flagged suboptimal');
  assert.ok(impact.excessKva > 0, 'Excess kVA should be > 0');
  assert.ok(impact.monthlyDemandImpact > 0, 'Monthly demand impact should be positive');
  console.log('✓ PF Demand Impact Calculations Passed');
}

console.log('ALL CALCULATION TESTS PASSED SUCCESSFULLY! ✓\n');
