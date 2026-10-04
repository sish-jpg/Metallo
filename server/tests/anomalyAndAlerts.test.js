import assert from 'assert';
import { detectFurnaceAnomalies, checkPlantDemandThreshold, checkHeatSecAnomaly } from '../services/anomalyDetector.js';

console.log('--- RUNNING ANOMALY & ALERT TESTS ---');

// Test 1: High Melting Power Anomaly
{
  const furnaceOverpower = {
    furnaceId: 'F2',
    name: 'Furnace F2',
    status: 'MELTING',
    currentPowerKw: 685, // Normal is 550-630
    normalMeltingMinKw: 550,
    normalMeltingMaxKw: 630,
    currentPf: 0.95,
    holdingPowerKw: 100,
    currentHoldingMinutes: 0
  };
  const anomalies = detectFurnaceAnomalies(furnaceOverpower, { powerFactorThreshold: 0.95 });
  assert.ok(anomalies.some(a => a.category === 'ANOMALY' && a.title.includes('High Melting Power')), 'Should detect high melting power anomaly');
  assert.ok(anomalies[0].explainableAction.includes('insulation'), 'Action should include explainable inspection steps');
  console.log('✓ High Melting Power Anomaly Detection Passed');
}

// Test 2: Low PF Anomaly
{
  const furnaceLowPf = {
    furnaceId: 'F2',
    status: 'HOLDING',
    currentPowerKw: 105,
    currentPf: 0.88, // Below 0.95
    holdingPowerKw: 100,
    currentHoldingMinutes: 10
  };
  const anomalies = detectFurnaceAnomalies(furnaceLowPf, { powerFactorThreshold: 0.95 });
  assert.ok(anomalies.some(a => a.category === 'POWER_FACTOR'), 'Should detect low PF anomaly');
  console.log('✓ Low Power Factor Anomaly Detection Passed');
}

// Test 3: Excessive Holding Anomaly
{
  const furnaceExcessHolding = {
    furnaceId: 'F1',
    status: 'HOLDING',
    currentPowerKw: 100,
    currentPf: 0.95,
    holdingPowerKw: 100,
    currentHoldingMinutes: 48, // > 30 min
    currentHeatId: 'H-104'
  };
  const anomalies = detectFurnaceAnomalies(furnaceExcessHolding, { holdingThresholdMinutes: 30, powerFactorThreshold: 0.95 });
  assert.ok(anomalies.some(a => a.category === 'HOLDING'), 'Should detect excessive holding duration');
  console.log('✓ Excessive Holding Anomaly Detection Passed');
}

// Test 4: Plant Demand Breach
{
  const breach = checkPlantDemandThreshold(1250, 1315, { demandThresholdKw: 1100, contractDemandKw: 1400 });
  assert.ok(breach, 'Should trigger warning when demand exceeds 1100 kW');
  assert.strictEqual(breach.type, 'CRITICAL');
  assert.strictEqual(breach.category, 'DEMAND');

  const safe = checkPlantDemandThreshold(950, 1000, { demandThresholdKw: 1100, contractDemandKw: 1400 });
  assert.strictEqual(safe, null, 'Safe demand should not trigger alert');
  console.log('✓ Plant Demand Threshold Monitoring Passed');
}

// Test 5: Heat SEC Anomaly
{
  const highSecHeat = { heatId: 'H-99', furnaceId: 'F1', productionTonnes: 1.0, secKwhPerTonne: 690 };
  const secAnomaly = checkHeatSecAnomaly(highSecHeat, 580);
  assert.ok(secAnomaly, 'SEC of 690 kWh/t should be flagged when baseline is 580');
  assert.ok(secAnomaly.explainableAction.includes('holding'), 'SEC anomaly should suggest holding / scrap inspection');
  console.log('✓ Heat SEC Anomaly Detection Passed');
}

console.log('ALL ANOMALY & ALERT TESTS PASSED! ✓\n');
