/**
 * METALLO Industrial Telemetry Simulation Engine
 * Simulates realistic electrical and thermodynamic operations of induction furnaces:
 * - State machine: MELTING -> HOLDING -> POURING -> IDLE -> OFF
 * - Deterministic, physics-respecting power, temperature, PF, and kVA
 * - Dynamic timeseries generation and automatic alert triggers
 */

import { Furnace } from '../models/Furnace.js';
import { EnergyReading } from '../models/EnergyReading.js';
import { TariffSettings } from '../models/TariffSettings.js';
import { Foundry } from '../models/Foundry.js';
import { SimulationState } from '../models/SimulationState.js';
import { calculateKva, getTariffForTimestamp } from './energyCalculator.js';
import { detectFurnaceAnomalies, checkPlantDemandThreshold } from './anomalyDetector.js';
import { createAlertIfNotExists } from './alertService.js';

let simulationInterval = null;
let currentTickIndex = 0;

// Pre-defined telemetry cycle sequence (deterministic for reliable demos)
// 12 steps covering 1 full industrial transition cycle
const SIMULATION_CYCLE = [
  // Step 0-3: F1 Melting, F2 Idle/Warmup
  {
    F1: { status: 'MELTING', powerKw: 588, tempC: 1380, pf: 0.95, heatId: 'H-104', holdingMins: 0 },
    F2: { status: 'IDLE', powerKw: 15, tempC: 450, pf: 0.98, heatId: null, holdingMins: 0 }
  },
  {
    F1: { status: 'MELTING', powerKw: 602, tempC: 1440, pf: 0.94, heatId: 'H-104', holdingMins: 0 },
    F2: { status: 'IDLE', powerKw: 18, tempC: 460, pf: 0.97, heatId: null, holdingMins: 0 }
  },
  {
    F1: { status: 'MELTING', powerKw: 615, tempC: 1495, pf: 0.94, heatId: 'H-104', holdingMins: 0 },
    F2: { status: 'MELTING', powerKw: 575, tempC: 1100, pf: 0.93, heatId: 'H-105', holdingMins: 0 }
  },
  // Step 3: Simultaneous peak draw -> triggers Demand alert! (610 + 580 = 1190 kW > 1100 kW threshold)
  {
    F1: { status: 'MELTING', powerKw: 610, tempC: 1520, pf: 0.94, heatId: 'H-104', holdingMins: 0 },
    F2: { status: 'MELTING', powerKw: 585, tempC: 1220, pf: 0.92, heatId: 'H-105', holdingMins: 0 }
  },
  // Step 4-6: F1 enters HOLDING (mould not ready yet), F2 continues melting with low PF event
  {
    F1: { status: 'HOLDING', powerKw: 102, tempC: 1515, pf: 0.95, heatId: 'H-104', holdingMins: 18 },
    F2: { status: 'MELTING', powerKw: 590, tempC: 1340, pf: 0.88, heatId: 'H-105', holdingMins: 0 } // Low PF alert trigger!
  },
  {
    F1: { status: 'HOLDING', powerKw: 98, tempC: 1510, pf: 0.95, heatId: 'H-104', holdingMins: 34 }, // Excessive holding > 30m alert trigger!
    F2: { status: 'MELTING', powerKw: 605, tempC: 1420, pf: 0.89, heatId: 'H-105', holdingMins: 0 }
  },
  {
    F1: { status: 'HOLDING', powerKw: 104, tempC: 1505, pf: 0.95, heatId: 'H-104', holdingMins: 45 }, // Serious holding waste!
    F2: { status: 'MELTING', powerKw: 618, tempC: 1490, pf: 0.94, heatId: 'H-105', holdingMins: 0 }
  },
  // Step 7: F1 Pouring, F2 enters Holding
  {
    F1: { status: 'POURING', powerKw: 25, tempC: 1475, pf: 0.96, heatId: 'H-104', holdingMins: 48 },
    F2: { status: 'HOLDING', powerKw: 95, tempC: 1505, pf: 0.95, heatId: 'H-105', holdingMins: 6 }
  },
  // Step 8: F1 Ready / New charge, F2 Pouring
  {
    F1: { status: 'READY', powerKw: 0, tempC: 800, pf: 1.0, heatId: null, holdingMins: 0 },
    F2: { status: 'POURING', powerKw: 22, tempC: 1470, pf: 0.96, heatId: 'H-105', holdingMins: 12 }
  },
  // Step 9-11: Normal staggered operation
  {
    F1: { status: 'MELTING', powerKw: 592, tempC: 1250, pf: 0.96, heatId: 'H-106', holdingMins: 0 },
    F2: { status: 'IDLE', powerKw: 15, tempC: 500, pf: 0.98, heatId: null, holdingMins: 0 }
  },
  {
    F1: { status: 'MELTING', powerKw: 605, tempC: 1390, pf: 0.95, heatId: 'H-106', holdingMins: 0 },
    F2: { status: 'IDLE', powerKw: 14, tempC: 480, pf: 0.98, heatId: null, holdingMins: 0 }
  },
  {
    F1: { status: 'HOLDING', powerKw: 96, tempC: 1510, pf: 0.96, heatId: 'H-106', holdingMins: 10 },
    F2: { status: 'MELTING', powerKw: 580, tempC: 1180, pf: 0.95, heatId: 'H-107', holdingMins: 0 }
  }
];

export async function tickSimulation() {
  try {
    const cyclePoint = SIMULATION_CYCLE[currentTickIndex % SIMULATION_CYCLE.length];
    currentTickIndex++;

    const tariffSettings = await TariffSettings.findOne() || {};
    const foundry = await Foundry.findOne() || {};
    const now = new Date();
    const tariffInfo = getTariffForTimestamp(now, tariffSettings);

    const furnaces = await Furnace.find().exec();
    let totalPlantKw = 45; // baseline auxiliary plant load (cooling tower, compressor, lighting)
    let totalPlantKva = 48;

    for (const f of furnaces) {
      const targetState = cyclePoint[f.furnaceId] || {
        status: f.status,
        powerKw: f.currentPowerKw,
        tempC: f.temperatureC,
        pf: f.currentPf,
        heatId: f.currentHeatId,
        holdingMins: f.currentHoldingMinutes
      };

      const kva = calculateKva(targetState.powerKw, targetState.pf);
      totalPlantKw += targetState.powerKw;
      totalPlantKva += kva;

      // Energy accumulated during this tick interval (approx 15 seconds real-time equivalent to 3 min foundry time)
      const simulatedHours = 0.05; // 3 minutes
      const deltaKwh = Number((targetState.powerKw * simulatedHours).toFixed(2));
      const newTotalEnergy = Number(((f.todayEnergyKwh || 0) + deltaKwh).toFixed(1));

      // Update furnace document
      await Furnace.updateOne(
        { furnaceId: f.furnaceId },
        {
          $set: {
            status: targetState.status,
            currentPowerKw: targetState.powerKw,
            temperatureC: targetState.tempC,
            currentPf: targetState.pf,
            currentKva: kva,
            currentHeatId: targetState.heatId,
            currentHoldingMinutes: targetState.holdingMins,
            todayEnergyKwh: newTotalEnergy,
            updatedAt: now
          }
        }
      );

      // Create timeseries reading
      await EnergyReading.create({
        furnaceId: f.furnaceId,
        timestamp: now,
        powerKw: targetState.powerKw,
        powerFactor: targetState.pf,
        apparentPowerKva: kva,
        temperatureC: targetState.tempC,
        energyAccumulatedKwh: newTotalEnergy,
        state: targetState.status,
        heatId: targetState.heatId,
        tariffRate: tariffInfo.rate,
        tariffType: tariffInfo.type
      });

      // Check anomalies on furnace
      const updatedFurnace = {
        ...f,
        status: targetState.status,
        currentPowerKw: targetState.powerKw,
        currentPf: targetState.pf,
        currentHoldingMinutes: targetState.holdingMins,
        currentHeatId: targetState.heatId
      };
      const furnaceAnomalies = detectFurnaceAnomalies(updatedFurnace, foundry);
      for (const anom of furnaceAnomalies) {
        await createAlertIfNotExists(anom);
      }
    }

    // Check plant-level total demand
    const demandAnomaly = checkPlantDemandThreshold(totalPlantKw, totalPlantKva, foundry);
    if (demandAnomaly) {
      await createAlertIfNotExists(demandAnomaly);
    }

    // Update simulation state document
    await SimulationState.updateOne(
      {},
      {
        $set: {
          stepCount: currentTickIndex,
          simulatedTime: now,
          lastTickAt: now,
          updatedAt: now
        }
      },
      { upsert: true }
    );
  } catch (err) {
    console.error('[SIMULATION] Tick error:', err.message);
  }
}

export async function startSimulation(tickMs = 3000) {
  if (simulationInterval) {
    clearInterval(simulationInterval);
  }
  simulationInterval = setInterval(tickSimulation, tickMs);
  await SimulationState.updateOne({}, { $set: { isRunning: true, updatedAt: new Date() } }, { upsert: true });
  console.log(`[SIMULATION] Simulation engine started (tick: ${tickMs}ms).`);
  // Execute first tick immediately
  await tickSimulation();
  return { isRunning: true, tickMs };
}

export async function stopSimulation() {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
  }
  await SimulationState.updateOne({}, { $set: { isRunning: false, updatedAt: new Date() } }, { upsert: true });
  console.log('[SIMULATION] Simulation engine stopped.');
  return { isRunning: false };
}

export async function resetSimulation() {
  await stopSimulation();
  currentTickIndex = 0;
  // Reset furnace states back to initial baseline
  await Furnace.updateOne({ furnaceId: 'F1' }, {
    $set: {
      status: 'MELTING',
      currentPowerKw: 582,
      temperatureC: 1420,
      currentPf: 0.95,
      currentKva: 613,
      currentHoldingMinutes: 8,
      currentHeatId: 'H-104'
    }
  });
  await Furnace.updateOne({ furnaceId: 'F2' }, {
    $set: {
      status: 'IDLE',
      currentPowerKw: 15,
      temperatureC: 450,
      currentPf: 0.98,
      currentKva: 15.3,
      currentHoldingMinutes: 0,
      currentHeatId: null
    }
  });
  await SimulationState.updateOne({}, { $set: { stepCount: 0, updatedAt: new Date() } }, { upsert: true });
  console.log('[SIMULATION] Simulation state reset to baseline.');
  return { status: 'RESET', stepCount: 0 };
}

export function isSimulationRunning() {
  return simulationInterval !== null;
}
