import { SimulationState } from '../models/SimulationState.js';
import { Furnace } from '../models/Furnace.js';
import { startSimulation, stopSimulation, resetSimulation, isSimulationRunning, tickSimulation } from '../services/simulationEngine.js';

export async function getSimulationStatus(req, res) {
  try {
    const simState = await SimulationState.findOne() || {};
    const furnaces = await Furnace.find().exec();

    return res.json({
      success: true,
      isRunning: isSimulationRunning() || Boolean(simState.isRunning),
      stepCount: simState.stepCount || 0,
      activeScenario: simState.activeScenario || 'STANDARD_CYCLE',
      lastTickAt: simState.lastTickAt,
      furnaces: furnaces.map(f => ({
        furnaceId: f.furnaceId,
        status: f.status,
        powerKw: f.currentPowerKw,
        temperatureC: f.temperatureC,
        pf: f.currentPf,
        kva: f.currentKva,
        heatId: f.currentHeatId,
        holdingMinutes: f.currentHoldingMinutes
      }))
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function startSim(req, res) {
  try {
    const tickMs = Number(req.body?.tickMs) || 3000;
    const result = await startSimulation(tickMs);
    return res.json({ success: true, ...result, message: 'Simulation telemetry active.' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function stopSim(req, res) {
  try {
    const result = await stopSimulation();
    return res.json({ success: true, ...result, message: 'Simulation telemetry paused.' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function resetSim(req, res) {
  try {
    const result = await resetSimulation();
    return res.json({ success: true, ...result, message: 'Simulation reset to baseline.' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function stepSim(req, res) {
  try {
    await tickSimulation();
    const simState = await SimulationState.findOne() || {};
    return res.json({ success: true, stepCount: simState.stepCount, message: 'Executed single simulation tick.' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
