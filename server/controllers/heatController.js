import { Heat } from '../models/Heat.js';
import { TariffSettings } from '../models/TariffSettings.js';
import { Furnace } from '../models/Furnace.js';
import { calculateSEC, calculateHoldingEnergy, analyzeExcessHolding, calculateIntervalEnergyAndCost } from '../services/energyCalculator.js';
import { checkHeatSecAnomaly } from '../services/anomalyDetector.js';

export async function getAllHeats(req, res) {
  try {
    const { furnaceId, status } = req.query;
    const query = {};
    if (furnaceId) query.furnaceId = furnaceId.toUpperCase();
    if (status) query.status = status.toUpperCase();

    const heats = await Heat.find(query).sort({ meltStartTime: -1 }).exec();
    return res.json({ success: true, count: heats.length, heats });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function getHeatById(req, res) {
  try {
    const { id } = req.params;
    const heat = await Heat.findOne({ $or: [{ heatId: id }, { _id: id }] });
    if (!heat) {
      return res.status(404).json({ success: false, error: `Heat "${id}" not found.` });
    }

    const furnace = await Furnace.findOne({ furnaceId: heat.furnaceId }) || {};
    const holdingAnalysis = analyzeExcessHolding(
      furnace.holdingPowerKw || 100,
      heat.holdingDurationMinutes || 0,
      30,
      heat.tariffBreakdown?.normalCost ? (heat.tariffBreakdown.totalCost / (heat.totalEnergyKwh || 1)) : 7.5
    );

    const secAnomaly = checkHeatSecAnomaly(heat, furnace.baselineSecKwhPerTonne || 580);

    return res.json({
      success: true,
      heat: {
        ...heat,
        holdingAnalysis,
        secAnomaly
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function createHeat(req, res) {
  try {
    const {
      heatId,
      furnaceId,
      productionTonnes,
      grade,
      meltingDurationMinutes,
      holdingDurationMinutes,
      totalEnergyKwh,
      averagePf,
      notes
    } = req.body;

    if (!heatId || !furnaceId || !productionTonnes) {
      return res.status(400).json({ success: false, error: 'heatId, furnaceId, and productionTonnes are required' });
    }

    const tariffSettings = await TariffSettings.findOne() || {};
    const furnace = await Furnace.findOne({ furnaceId: furnaceId.toUpperCase() }) || {};

    const tonnes = Number(productionTonnes);
    const energy = Number(totalEnergyKwh) || (tonnes * 600);
    const holdMins = Number(holdingDurationMinutes) || 0;
    const meltMins = Number(meltingDurationMinutes) || 60;
    const pf = Number(averagePf) || 0.95;

    const sec = calculateSEC(energy, tonnes);
    const holdingEnergy = calculateHoldingEnergy(furnace.holdingPowerKw || 100, holdMins);
    const meltingEnergy = Math.max(0, energy - holdingEnergy);

    const holdingAnalysis = analyzeExcessHolding(
      furnace.holdingPowerKw || 100,
      holdMins,
      30,
      tariffSettings.normalRatePerKwh || 7.5
    );

    const cost = Number((energy * (tariffSettings.normalRatePerKwh || 7.5)).toFixed(2));

    const newHeat = await Heat.create({
      heatId: heatId.toUpperCase(),
      furnaceId: furnaceId.toUpperCase(),
      productionTonnes: tonnes,
      grade: grade || 'Grey Iron FG260',
      status: 'COMPLETED',
      meltStartTime: new Date(Date.now() - (meltMins + holdMins) * 60 * 1000),
      meltEndTime: new Date(Date.now() - holdMins * 60 * 1000),
      actualPourTime: new Date(),
      meltingDurationMinutes: meltMins,
      holdingDurationMinutes: holdMins,
      meltingEnergyKwh: Number(meltingEnergy.toFixed(1)),
      holdingEnergyKwh: Number(holdingEnergy.toFixed(1)),
      totalEnergyKwh: Number(energy.toFixed(1)),
      secKwhPerTonne: sec,
      averagePf: pf,
      tariffBreakdown: {
        normalKwh: energy,
        normalCost: cost,
        totalCost: cost
      },
      excessHoldingMinutes: holdingAnalysis.excessMinutes,
      excessHoldingEnergyKwh: holdingAnalysis.excessEnergyKwh,
      excessHoldingCost: holdingAnalysis.excessCost,
      hasHoldingWarning: holdingAnalysis.isExcessive,
      hasSecWarning: sec > 660,
      notes: notes || 'Manually logged heat'
    });

    return res.status(201).json({ success: true, heat: newHeat });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
