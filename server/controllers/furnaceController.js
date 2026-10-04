import { Furnace } from '../models/Furnace.js';
import { Heat } from '../models/Heat.js';
import { EnergyReading } from '../models/EnergyReading.js';
import { Alert } from '../models/Alert.js';
import { Foundry } from '../models/Foundry.js';
import { calculateSEC, calculateKva, calculatePF } from '../services/energyCalculator.js';
import { detectFurnaceAnomalies } from '../services/anomalyDetector.js';

export async function getAllFurnaces(req, res) {
  try {
    const furnaces = await Furnace.find().exec();
    const foundry = await Foundry.findOne() || {};

    const enriched = await Promise.all(furnaces.map(async (f) => {
      const activeAlerts = await Alert.find({ furnaceId: f.furnaceId, resolved: false }).exec();
      const currentHeat = f.currentHeatId ? await Heat.findOne({ heatId: f.currentHeatId }) : null;
      const sec = calculateSEC(f.todayEnergyKwh, f.todayProductionTonnes || 1);

      return {
        ...f,
        calculatedSec: sec,
        currentHeat,
        activeAlertsCount: activeAlerts.length,
        anomalies: detectFurnaceAnomalies(f, foundry)
      };
    }));

    return res.json({ success: true, furnaces: enriched });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function getFurnaceById(req, res) {
  try {
    const { id } = req.params;
    const furnace = await Furnace.findOne({ $or: [{ furnaceId: id }, { _id: id }] });
    if (!furnace) {
      return res.status(404).json({ success: false, error: `Furnace "${id}" not found.` });
    }

    const foundry = await Foundry.findOne() || {};
    const heats = await Heat.find({ furnaceId: furnace.furnaceId }).sort({ meltStartTime: -1 }).limit(10).exec();
    const activeAlerts = await Alert.find({ furnaceId: furnace.furnaceId, resolved: false }).sort({ timestamp: -1 }).exec();

    // Get telemetry timeseries readings for this furnace
    const telemetry = await EnergyReading.find({ furnaceId: furnace.furnaceId })
      .sort({ timestamp: -1 })
      .limit(30)
      .exec();

    const trends = telemetry.reverse().map(r => ({
      time: new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      powerKw: r.powerKw,
      temperatureC: r.temperatureC,
      powerFactor: r.powerFactor,
      apparentPowerKva: r.apparentPowerKva,
      state: r.state
    }));

    const currentHeat = furnace.currentHeatId ? await Heat.findOne({ heatId: furnace.currentHeatId }) : null;
    const sec = calculateSEC(furnace.todayEnergyKwh, furnace.todayProductionTonnes || 1);
    const anomalies = detectFurnaceAnomalies(furnace, foundry);

    return res.json({
      success: true,
      furnace: {
        ...furnace,
        calculatedSec: sec,
        currentHeat,
        trends,
        associatedHeats: heats,
        activeAlerts,
        anomalies
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function updateFurnace(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;
    const furnace = await Furnace.findOne({ $or: [{ furnaceId: id }, { _id: id }] });
    if (!furnace) {
      return res.status(404).json({ success: false, error: 'Furnace not found' });
    }

    const allowed = ['name', 'capacityTonnes', 'meltingPowerKw', 'holdingPowerKw', 'idlePowerKw', 'baselineSecKwhPerTonne', 'normalMeltingMinKw', 'normalMeltingMaxKw', 'status'];
    const filtered = {};
    for (const k of allowed) {
      if (updates[k] !== undefined) filtered[k] = updates[k];
    }

    const updated = await Furnace.findByIdAndUpdate(furnace._id, filtered, { new: true });
    return res.json({ success: true, furnace: updated });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function createFurnace(req, res) {
  try {
    const { furnaceId, name, capacityTonnes, meltingPowerKw, holdingPowerKw, idlePowerKw } = req.body;
    if (!furnaceId || !name) {
      return res.status(400).json({ success: false, error: 'furnaceId and name are required' });
    }

    const existing = await Furnace.findOne({ furnaceId: furnaceId.toUpperCase() });
    if (existing) {
      return res.status(400).json({ success: false, error: `Furnace with ID "${furnaceId}" already exists.` });
    }

    const newFurnace = await Furnace.create({
      furnaceId: furnaceId.toUpperCase(),
      name,
      capacityTonnes: Number(capacityTonnes) || 1.0,
      meltingPowerKw: Number(meltingPowerKw) || 600,
      holdingPowerKw: Number(holdingPowerKw) || 100,
      idlePowerKw: Number(idlePowerKw) || 15,
      status: 'IDLE',
      currentPowerKw: 0,
      temperatureC: 25,
      currentPf: 0.95,
      currentKva: 0
    });

    return res.status(201).json({ success: true, furnace: newFurnace });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
