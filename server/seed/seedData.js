/**
 * METALLO Demo Data Seeder
 * Populates realistic industrial data:
 * - METALLO Demo Foundry config
 * - Furnaces F1 & F2 (induction, 1t, 600kW melt, 100kW hold)
 * - Historical & active Heats (H-101 to H-107) with dynamic SEC & holding
 * - 24-hour EnergyReadings telemetry profile
 * - Standard industrial HT Tariff III-A (Peak ₹9, Normal ₹7.5, Off-peak ₹6)
 * - Demo Current vs Optimized Schedule
 * - Realistic explainable Alerts
 */

import { connectDB, saveEmbeddedStore } from '../config/db.js';
import { Foundry } from '../models/Foundry.js';
import { Furnace } from '../models/Furnace.js';
import { Heat } from '../models/Heat.js';
import { EnergyReading } from '../models/EnergyReading.js';
import { TariffSettings } from '../models/TariffSettings.js';
import { Schedule } from '../models/Schedule.js';
import { Alert } from '../models/Alert.js';
import { SimulationState } from '../models/SimulationState.js';
import { calculateSEC, calculateHoldingEnergy, calculateIntervalEnergyAndCost, calculateKva } from '../services/energyCalculator.js';
import { generateOptimizedSchedule } from '../services/scheduleOptimizer.js';

export async function seedDatabase() {
  await connectDB();
  console.log('[SEED] Clearing existing collections...');

  await Foundry.deleteMany({});
  await Furnace.deleteMany({});
  await Heat.deleteMany({});
  await EnergyReading.deleteMany({});
  await TariffSettings.deleteMany({});
  await Schedule.deleteMany({});
  await Alert.deleteMany({});
  await SimulationState.deleteMany({});

  console.log('[SEED] Inserting Tariff Settings...');
  const tariffSettings = await TariffSettings.create({
    discomName: 'State Electricity Distribution Corp (HT-III-A)',
    currencySymbol: '₹',
    peakRatePerKwh: 9.0,
    peakStartHour: 6,
    peakEndHour: 10,
    peakEveningStartHour: 18,
    peakEveningEndHour: 22,
    normalRatePerKwh: 7.5,
    offPeakRatePerKwh: 6.0,
    offPeakStartHour: 22,
    offPeakEndHour: 6,
    demandChargePerKva: 350,
    pfPenaltyThreshold: 0.95,
    kwhPenaltyPerLowPf: 0.02,
    notes: 'Industrial HT connection with time-of-day two-part tariff structure.'
  });

  console.log('[SEED] Inserting Foundry profile...');
  await Foundry.create({
    name: 'METALLO Demo Foundry',
    location: 'Coimbatore Industrial Area, TN, India',
    contactEmail: 'operations@metallofoundry.com',
    totalInstalledCapacity: 2.0,
    contractDemandKw: 1400,
    demandThresholdKw: 1100,
    powerFactorThreshold: 0.95,
    holdingThresholdMinutes: 30,
    safetyBufferMinutes: 15,
    operatingHoursPerDay: 16
  });

  console.log('[SEED] Inserting Furnaces F1 & F2...');
  const f1 = await Furnace.create({
    furnaceId: 'F1',
    name: 'Furnace F1 — Medium Frequency Induction',
    type: 'Induction furnace',
    capacityTonnes: 1.0,
    meltingPowerKw: 600,
    holdingPowerKw: 100,
    idlePowerKw: 15,
    status: 'MELTING',
    currentPowerKw: 582,
    temperatureC: 1420,
    currentPf: 0.95,
    currentKva: 613,
    currentHeatId: 'H-104',
    todayEnergyKwh: 1245.5,
    todayProductionTonnes: 2.0,
    currentHoldingMinutes: 8,
    baselineSecKwhPerTonne: 580,
    normalMeltingMinKw: 550,
    normalMeltingMaxKw: 630,
    insulationCondition: 'GOOD'
  });

  const f2 = await Furnace.create({
    furnaceId: 'F2',
    name: 'Furnace F2 — Medium Frequency Induction',
    type: 'Induction furnace',
    capacityTonnes: 1.0,
    meltingPowerKw: 600,
    holdingPowerKw: 100,
    idlePowerKw: 15,
    status: 'HOLDING',
    currentPowerKw: 102,
    temperatureC: 1490,
    currentPf: 0.88, // Intentionally suboptimal PF to trigger demo PF alert
    currentKva: 116,
    currentHeatId: 'H-105',
    todayEnergyKwh: 1390.2,
    todayProductionTonnes: 2.0,
    currentHoldingMinutes: 47, // Intentionally >30 min to demonstrate holding alert
    baselineSecKwhPerTonne: 580,
    normalMeltingMinKw: 550,
    normalMeltingMaxKw: 630,
    insulationCondition: 'INSPECT_SOON'
  });

  console.log('[SEED] Generating realistic historical and active Heats...');
  const baseToday = new Date();
  baseToday.setHours(0, 0, 0, 0);

  const heatsData = [
    {
      heatId: 'H-101',
      furnaceId: 'F1',
      productionTonnes: 1.0,
      grade: 'Grey Iron FG260',
      status: 'COMPLETED',
      meltStartTime: new Date(baseToday.getTime() + 6.5 * 3600 * 1000), // 06:30
      meltEndTime: new Date(baseToday.getTime() + 7.5 * 3600 * 1000),   // 07:30
      plannedPourTime: new Date(baseToday.getTime() + 7.75 * 3600 * 1000), // 07:45
      actualPourTime: new Date(baseToday.getTime() + 7.75 * 3600 * 1000),
      meltingDurationMinutes: 60,
      holdingDurationMinutes: 15,
      meltingEnergyKwh: 585.0,
      holdingEnergyKwh: 25.0,
      totalEnergyKwh: 610.0,
      secKwhPerTonne: calculateSEC(610.0, 1.0),
      averagePf: 0.95,
      excessHoldingMinutes: 0,
      excessHoldingEnergyKwh: 0,
      excessHoldingCost: 0,
      hasHoldingWarning: false,
      hasSecWarning: false,
      notes: 'Clean morning melt, standard operation'
    },
    {
      heatId: 'H-102',
      furnaceId: 'F2',
      productionTonnes: 1.0,
      grade: 'Grey Iron FG260',
      status: 'COMPLETED',
      meltStartTime: new Date(baseToday.getTime() + 8.0 * 3600 * 1000), // 08:00
      meltEndTime: new Date(baseToday.getTime() + 9.0 * 3600 * 1000),   // 09:00
      plannedPourTime: new Date(baseToday.getTime() + 9.25 * 3600 * 1000), // 09:15
      actualPourTime: new Date(baseToday.getTime() + 9.8 * 3600 * 1000),   // 09:48 (delayed mould)
      meltingDurationMinutes: 60,
      holdingDurationMinutes: 48, // Excessive holding!
      meltingEnergyKwh: 590.0,
      holdingEnergyKwh: 80.0,
      totalEnergyKwh: 670.0,
      secKwhPerTonne: calculateSEC(670.0, 1.0),
      averagePf: 0.93,
      excessHoldingMinutes: 18,
      excessHoldingEnergyKwh: calculateHoldingEnergy(100, 18),
      excessHoldingCost: Number((calculateHoldingEnergy(100, 18) * 9.0).toFixed(2)), // peak rate
      hasHoldingWarning: true,
      hasSecWarning: true,
      notes: 'Moulding line crane breakdown forced 48 min holding. Elevated SEC to 670 kWh/t.'
    },
    {
      heatId: 'H-103',
      furnaceId: 'F1',
      productionTonnes: 1.0,
      grade: 'Grey Iron FG200',
      status: 'COMPLETED',
      meltStartTime: new Date(baseToday.getTime() + 10.25 * 3600 * 1000), // 10:15
      meltEndTime: new Date(baseToday.getTime() + 11.25 * 3600 * 1000),  // 11:15
      plannedPourTime: new Date(baseToday.getTime() + 11.5 * 3600 * 1000), // 11:30
      actualPourTime: new Date(baseToday.getTime() + 11.45 * 3600 * 1000),
      meltingDurationMinutes: 60,
      holdingDurationMinutes: 12,
      meltingEnergyKwh: 578.0,
      holdingEnergyKwh: 20.0,
      totalEnergyKwh: 598.0,
      secKwhPerTonne: calculateSEC(598.0, 1.0),
      averagePf: 0.96,
      excessHoldingMinutes: 0,
      excessHoldingEnergyKwh: 0,
      excessHoldingCost: 0,
      hasHoldingWarning: false,
      hasSecWarning: false,
      notes: 'Optimal tap-to-tap timing post-peak window'
    },
    {
      heatId: 'H-104',
      furnaceId: 'F1',
      productionTonnes: 1.0,
      grade: 'Grey Iron FG260',
      status: 'MELTING',
      meltStartTime: new Date(baseToday.getTime() + 11.75 * 3600 * 1000), // 11:45
      meltEndTime: null,
      plannedPourTime: new Date(baseToday.getTime() + 13.0 * 3600 * 1000), // 13:00
      actualPourTime: null,
      meltingDurationMinutes: 60,
      holdingDurationMinutes: 0,
      meltingEnergyKwh: 380.0,
      holdingEnergyKwh: 0,
      totalEnergyKwh: 380.0,
      secKwhPerTonne: calculateSEC(380.0, 1.0),
      averagePf: 0.95,
      excessHoldingMinutes: 0,
      excessHoldingEnergyKwh: 0,
      excessHoldingCost: 0,
      hasHoldingWarning: false,
      hasSecWarning: false,
      notes: 'Active melt in progress (current power: 582 kW, temp: 1420°C)'
    },
    {
      heatId: 'H-105',
      furnaceId: 'F2',
      productionTonnes: 1.0,
      grade: 'Grey Iron FG260',
      status: 'HOLDING',
      meltStartTime: new Date(baseToday.getTime() + 11.0 * 3600 * 1000), // 11:00
      meltEndTime: new Date(baseToday.getTime() + 12.0 * 3600 * 1000),   // 12:00
      plannedPourTime: new Date(baseToday.getTime() + 12.25 * 3600 * 1000), // 12:15
      actualPourTime: null,
      meltingDurationMinutes: 60,
      holdingDurationMinutes: 47, // In holding for 47 mins
      meltingEnergyKwh: 595.0,
      holdingEnergyKwh: 78.3,
      totalEnergyKwh: 673.3,
      secKwhPerTonne: calculateSEC(673.3, 1.0),
      averagePf: 0.88,
      excessHoldingMinutes: 17,
      excessHoldingEnergyKwh: calculateHoldingEnergy(100, 17),
      excessHoldingCost: Number((calculateHoldingEnergy(100, 17) * 7.5).toFixed(2)),
      hasHoldingWarning: true,
      hasSecWarning: true,
      notes: 'Actively holding past recommended 30 min threshold. High avoidable energy cost.'
    },
    {
      heatId: 'H-106',
      furnaceId: 'F1',
      productionTonnes: 1.0,
      grade: 'Grey Iron FG260',
      status: 'PLANNED',
      meltStartTime: new Date(baseToday.getTime() + 13.5 * 3600 * 1000),
      meltEndTime: new Date(baseToday.getTime() + 14.5 * 3600 * 1000),
      plannedPourTime: new Date(baseToday.getTime() + 14.75 * 3600 * 1000),
      actualPourTime: null,
      meltingDurationMinutes: 60,
      holdingDurationMinutes: 15,
      meltingEnergyKwh: 580.0,
      holdingEnergyKwh: 25.0,
      totalEnergyKwh: 605.0,
      secKwhPerTonne: 605.0,
      averagePf: 0.95,
      excessHoldingMinutes: 0,
      excessHoldingEnergyKwh: 0,
      excessHoldingCost: 0,
      hasHoldingWarning: false,
      hasSecWarning: false,
      notes: 'Scheduled afternoon heat'
    },
    {
      heatId: 'H-107',
      furnaceId: 'F2',
      productionTonnes: 1.0,
      grade: 'Grey Iron FG260',
      status: 'PLANNED',
      meltStartTime: new Date(baseToday.getTime() + 14.75 * 3600 * 1000),
      meltEndTime: new Date(baseToday.getTime() + 15.75 * 3600 * 1000),
      plannedPourTime: new Date(baseToday.getTime() + 16.0 * 3600 * 1000),
      actualPourTime: null,
      meltingDurationMinutes: 60,
      holdingDurationMinutes: 15,
      meltingEnergyKwh: 580.0,
      holdingEnergyKwh: 25.0,
      totalEnergyKwh: 605.0,
      secKwhPerTonne: 605.0,
      averagePf: 0.95,
      excessHoldingMinutes: 0,
      excessHoldingEnergyKwh: 0,
      excessHoldingCost: 0,
      hasHoldingWarning: false,
      hasSecWarning: false,
      notes: 'Scheduled afternoon heat'
    }
  ];

  for (const h of heatsData) {
    const tariffCalc = calculateIntervalEnergyAndCost(
      h.meltStartTime,
      h.actualPourTime || new Date(h.meltStartTime.getTime() + (h.meltingDurationMinutes + h.holdingDurationMinutes) * 60 * 1000),
      580,
      tariffSettings
    );
    h.tariffBreakdown = tariffCalc.breakdown;
    h.tariffBreakdown.totalCost = tariffCalc.totalCost;
    await Heat.create(h);
  }

  console.log('[SEED] Generating 24-hour Energy Readings for trends...');
  const readings = [];
  const startHour = 6;
  const numHours = 7; // from 06:00 to 13:00 today

  for (let i = 0; i <= numHours * 4; i++) { // every 15 minutes
    const timeOffsetMs = (startHour * 60 + i * 15) * 60 * 1000;
    const readingTime = new Date(baseToday.getTime() + timeOffsetMs);
    const hour = readingTime.getHours() + readingTime.getMinutes() / 60;

    // F1 profile
    let f1Kw = 15;
    let f1State = 'IDLE';
    let f1Temp = 500;
    let f1Pf = 0.96;
    let f1Heat = null;

    if (hour >= 6.5 && hour < 7.5) {
      f1Kw = 590; f1State = 'MELTING'; f1Temp = 1430; f1Heat = 'H-101'; f1Pf = 0.95;
    } else if (hour >= 7.5 && hour < 7.75) {
      f1Kw = 100; f1State = 'HOLDING'; f1Temp = 1480; f1Heat = 'H-101'; f1Pf = 0.95;
    } else if (hour >= 10.25 && hour < 11.25) {
      f1Kw = 585; f1State = 'MELTING'; f1Temp = 1440; f1Heat = 'H-103'; f1Pf = 0.96;
    } else if (hour >= 11.75) {
      f1Kw = 582; f1State = 'MELTING'; f1Temp = 1420; f1Heat = 'H-104'; f1Pf = 0.95;
    }

    readings.push({
      furnaceId: 'F1',
      timestamp: readingTime,
      powerKw: f1Kw,
      powerFactor: f1Pf,
      apparentPowerKva: calculateKva(f1Kw, f1Pf),
      temperatureC: f1Temp,
      energyAccumulatedKwh: Number((i * 35).toFixed(1)),
      state: f1State,
      heatId: f1Heat,
      tariffRate: hour < 10 ? 9.0 : 7.5,
      tariffType: hour < 10 ? 'PEAK' : 'NORMAL'
    });

    // F2 profile
    let f2Kw = 15;
    let f2State = 'IDLE';
    let f2Temp = 420;
    let f2Pf = 0.97;
    let f2Heat = null;

    if (hour >= 8.0 && hour < 9.0) {
      f2Kw = 595; f2State = 'MELTING'; f2Temp = 1450; f2Heat = 'H-102'; f2Pf = 0.94;
    } else if (hour >= 9.0 && hour < 9.8) {
      f2Kw = 105; f2State = 'HOLDING'; f2Temp = 1485; f2Heat = 'H-102'; f2Pf = 0.93;
    } else if (hour >= 11.0 && hour < 12.0) {
      f2Kw = 588; f2State = 'MELTING'; f2Temp = 1460; f2Heat = 'H-105'; f2Pf = 0.92;
    } else if (hour >= 12.0) {
      f2Kw = 102; f2State = 'HOLDING'; f2Temp = 1490; f2Heat = 'H-105'; f2Pf = 0.88; // low PF event
    }

    readings.push({
      furnaceId: 'F2',
      timestamp: readingTime,
      powerKw: f2Kw,
      powerFactor: f2Pf,
      apparentPowerKva: calculateKva(f2Kw, f2Pf),
      temperatureC: f2Temp,
      energyAccumulatedKwh: Number((i * 38).toFixed(1)),
      state: f2State,
      heatId: f2Heat,
      tariffRate: hour < 10 ? 9.0 : 7.5,
      tariffType: hour < 10 ? 'PEAK' : 'NORMAL'
    });
  }

  await EnergyReading.insertMany(readings);

  console.log('[SEED] Generating Demo Schedule (Current vs Optimized)...');
  const demoHeats = [
    { heatId: 'H1', pourTime: '10:30', quantityTonnes: 1.0, meltDurationMinutes: 60, preferredFurnace: 'F1' },
    { heatId: 'H2', pourTime: '12:00', quantityTonnes: 1.0, meltDurationMinutes: 60, preferredFurnace: 'F2' },
    { heatId: 'H3', pourTime: '13:30', quantityTonnes: 1.0, meltDurationMinutes: 60, preferredFurnace: 'F1' },
    { heatId: 'H4', pourTime: '15:00', quantityTonnes: 1.0, meltDurationMinutes: 60, preferredFurnace: 'F2' }
  ];

  const scheduleComparison = generateOptimizedSchedule(demoHeats, {
    furnaces: [
      { furnaceId: 'F1', name: 'Furnace F1', meltingPowerKw: 600, holdingPowerKw: 100 },
      { furnaceId: 'F2', name: 'Furnace F2', meltingPowerKw: 600, holdingPowerKw: 100 }
    ],
    tariffSettings
  });

  await Schedule.create({
    planType: 'CURRENT',
    items: scheduleComparison.current.items,
    summary: scheduleComparison.current.summary,
    notes: 'Unstaggered morning startup schedule with simultaneous melt draw.'
  });

  await Schedule.create({
    planType: 'OPTIMIZED',
    items: scheduleComparison.optimized.items,
    summary: scheduleComparison.optimized.summary,
    potentialSavingsVsCurrent: scheduleComparison.optimized.potentialSavingsVsCurrent,
    notes: 'METALLO optimized schedule: staggered melts, back-calculated start times, minimized holding and tariff peak avoidance.'
  });

  console.log('[SEED] Generating explainable Alerts...');
  const alertsData = [
    {
      alertId: 'ALT-1001',
      type: 'WARNING',
      category: 'HOLDING',
      furnaceId: 'F2',
      heatId: 'H-105',
      title: 'Excessive Holding Duration on Furnace F2',
      message: 'Heat H-105 has been holding for 47 minutes (threshold: 30 minutes). Avoidable holding energy: ~28.3 kWh.',
      observedValue: '47 min',
      thresholdValue: '30 min',
      explainableAction: 'Expedite mould preparation on Line 2 or lower bath power to standby setpoint. Excessive holding increases thermal radiation losses without metallurgical value.',
      timestamp: new Date(baseToday.getTime() + 12.75 * 3600 * 1000),
      acknowledged: false,
      resolved: false
    },
    {
      alertId: 'ALT-1002',
      type: 'WARNING',
      category: 'POWER_FACTOR',
      furnaceId: 'F2',
      heatId: 'H-105',
      title: 'Power Factor Below Target on Furnace F2',
      message: 'Observed power factor is 0.88, below the configured HT contract threshold of 0.95. Apparent load is 116 kVA.',
      observedValue: '0.88 PF',
      thresholdValue: '0.95 PF',
      explainableAction: 'Inspect the furnace capacitor bank and automatic power factor correction (APFC) steps. Low PF incurs DISCOM surcharge penalties and unnecessarily consumes transformer kVA capacity.',
      timestamp: new Date(baseToday.getTime() + 12.5 * 3600 * 1000),
      acknowledged: false,
      resolved: false
    },
    {
      alertId: 'ALT-1003',
      type: 'CRITICAL',
      category: 'DEMAND',
      furnaceId: null,
      heatId: null,
      title: 'Demand Spike Approaching Contract Sanction',
      message: 'Peak simultaneous power draw touched 1,195 kW at 08:45 during overlapping melt cycles of F1 and F2, exceeding 1,100 kW warning threshold.',
      observedValue: '1,195 kW',
      thresholdValue: '1,100 kW',
      explainableAction: 'Stagger melt start times by at least 45 minutes to prevent simultaneous full-power heating cycles. Utilize the METALLO Schedule Optimizer to automate this.',
      timestamp: new Date(baseToday.getTime() + 8.75 * 3600 * 1000),
      acknowledged: true,
      resolved: false
    },
    {
      alertId: 'ALT-1004',
      type: 'INFO',
      category: 'TARIFF',
      furnaceId: 'F1',
      heatId: 'H-101',
      title: 'Melting Operation Scheduled During Peak Tariff Window',
      message: 'Heat H-101 melt cycle occurred between 06:30 and 07:30 within the morning Peak Tariff period (₹9.0/kWh).',
      observedValue: 'Peak Band (₹9/kWh)',
      thresholdValue: 'Normal Band (₹7.5/kWh)',
      explainableAction: 'Where pour commitments allow, shift melt cycles to after 10:00 to capitalize on standard or off-peak utility tariffs.',
      timestamp: new Date(baseToday.getTime() + 7.0 * 3600 * 1000),
      acknowledged: true,
      resolved: true
    }
  ];

  for (const a of alertsData) {
    await Alert.create(a);
  }

  console.log('[SEED] Initializing Simulation State...');
  await SimulationState.create({
    isRunning: false,
    speedMultiplier: 1,
    stepCount: 0,
    simulatedTime: new Date(),
    lastTickAt: new Date(),
    activeScenario: 'STANDARD_CYCLE'
  });

  saveEmbeddedStore();
  console.log('[SEED] Database seeding complete! All models populated with realistic foundry data.');
}

// Allow direct execution
if (process.argv[1]?.endsWith('seedData.js')) {
  seedDatabase().then(() => {
    console.log('[SEED] Done.');
    process.exit(0);
  }).catch(err => {
    console.error('[SEED] Error:', err);
    process.exit(1);
  });
}
