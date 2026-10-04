import { EnergyReading } from '../models/EnergyReading.js';
import { Furnace } from '../models/Furnace.js';
import { Heat } from '../models/Heat.js';
import { TariffSettings } from '../models/TariffSettings.js';
import { calculatePfDemandImpact, calculateSEC, calculateKva } from '../services/energyCalculator.js';

export async function getEnergyAnalytics(req, res) {
  try {
    const tariffSettings = await TariffSettings.findOne() || {};
    const furnaces = await Furnace.find().exec();
    const heats = await Heat.find().sort({ meltStartTime: 1 }).exec();
    const readings = await EnergyReading.find().sort({ timestamp: 1 }).exec();

    // 1. Tariff-wise Energy and Cost distribution
    let peakEnergyKwh = 0;
    let normalEnergyKwh = 0;
    let offPeakEnergyKwh = 0;

    heats.forEach(h => {
      peakEnergyKwh += h.tariffBreakdown?.peakKwh || 0;
      normalEnergyKwh += h.tariffBreakdown?.normalKwh || (h.totalEnergyKwh || 0);
      offPeakEnergyKwh += h.tariffBreakdown?.offPeakKwh || 0;
    });

    const peakRate = tariffSettings.peakRatePerKwh || 9.0;
    const normalRate = tariffSettings.normalRatePerKwh || 7.5;
    const offPeakRate = tariffSettings.offPeakRatePerKwh || 6.0;

    const peakCost = Number((peakEnergyKwh * peakRate).toFixed(2));
    const normalCost = Number((normalEnergyKwh * normalRate).toFixed(2));
    const offPeakCost = Number((offPeakEnergyKwh * offPeakRate).toFixed(2));
    const totalCost = Number((peakCost + normalCost + offPeakCost).toFixed(2));
    const totalEnergyKwh = Number((peakEnergyKwh + normalEnergyKwh + offPeakEnergyKwh).toFixed(1));

    // 2. Energy & Production by Furnace
    const furnaceDistribution = furnaces.map(f => {
      const furnaceHeats = heats.filter(h => h.furnaceId === f.furnaceId);
      const totalKwh = Number(furnaceHeats.reduce((acc, h) => acc + (h.totalEnergyKwh || 0), 0).toFixed(1));
      const totalTonnes = Number(furnaceHeats.reduce((acc, h) => acc + (h.productionTonnes || 0), 0).toFixed(1));
      const sec = calculateSEC(totalKwh, totalTonnes || 1);
      return {
        furnaceId: f.furnaceId,
        name: f.name,
        totalEnergyKwh: totalKwh || f.todayEnergyKwh,
        totalProductionTonnes: totalTonnes || f.todayProductionTonnes,
        averageSec: sec,
        percentageOfTotal: totalEnergyKwh > 0 ? Number(((totalKwh / totalEnergyKwh) * 100).toFixed(1)) : 50
      };
    });

    // 3. SEC trend across heats
    const secTrend = heats.map(h => ({
      heatId: h.heatId,
      furnaceId: h.furnaceId,
      secKwhPerTonne: h.secKwhPerTonne,
      benchmarkSec: 580,
      holdingMinutes: h.holdingDurationMinutes,
      productionTonnes: h.productionTonnes
    }));

    // 4. Power & PF timeseries trend
    const telemetryTrends = readings.slice(-30).map(r => ({
      timestamp: r.timestamp,
      time: new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      furnaceId: r.furnaceId,
      powerKw: r.powerKw,
      powerFactor: r.powerFactor,
      apparentPowerKva: r.apparentPowerKva,
      tariffRate: r.tariffRate,
      tariffType: r.tariffType
    }));

    return res.json({
      success: true,
      tariffSettings,
      summary: {
        totalEnergyKwh,
        totalCost,
        peakEnergyKwh: Number(peakEnergyKwh.toFixed(1)),
        normalEnergyKwh: Number(normalEnergyKwh.toFixed(1)),
        offPeakEnergyKwh: Number(offPeakEnergyKwh.toFixed(1)),
        peakCost,
        normalCost,
        offPeakCost
      },
      furnaceDistribution,
      secTrend,
      telemetryTrends
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function getPowerFactorAnalytics(req, res) {
  try {
    const tariffSettings = await TariffSettings.findOne() || {};
    const furnaces = await Furnace.find().exec();
    const readings = await EnergyReading.find().sort({ timestamp: 1 }).exec();

    // Plant aggregate active and apparent power
    const activeFurnacesKw = furnaces.reduce((acc, f) => acc + (f.currentPowerKw || 0), 0);
    const activeFurnacesKva = furnaces.reduce((acc, f) => acc + (f.currentKva || calculateKva(f.currentPowerKw, f.currentPf)), 0);
    const plantPf = activeFurnacesKva > 0 ? Number((activeFurnacesKw / activeFurnacesKva).toFixed(3)) : 0.96;

    // Power factor demand impact analysis
    const demandImpact = calculatePfDemandImpact(
      activeFurnacesKw || 600,
      plantPf,
      tariffSettings.pfPenaltyThreshold || 0.95,
      tariffSettings.demandChargePerKva || 350
    );

    // Filter low-PF occurrences
    const lowPfEvents = readings.filter(r => r.powerFactor < (tariffSettings.pfPenaltyThreshold || 0.95)).slice(-10);

    // Timeline for kW vs kVA vs PF
    const pfTimeline = readings.slice(-24).map(r => ({
      time: new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      furnaceId: r.furnaceId,
      powerKw: r.powerKw,
      apparentPowerKva: r.apparentPowerKva,
      powerFactor: r.powerFactor,
      targetPf: tariffSettings.pfPenaltyThreshold || 0.95
    }));

    return res.json({
      success: true,
      plantPf,
      targetPf: tariffSettings.pfPenaltyThreshold || 0.95,
      demandImpact,
      furnaces: furnaces.map(f => ({
        furnaceId: f.furnaceId,
        name: f.name,
        currentPf: f.currentPf,
        currentPowerKw: f.currentPowerKw,
        currentKva: f.currentKva,
        isBelowTarget: f.currentPf < (tariffSettings.pfPenaltyThreshold || 0.95),
        furnaceDemandImpact: calculatePfDemandImpact(f.currentPowerKw, f.currentPf, 0.95, 350)
      })),
      lowPfEvents: lowPfEvents.map(e => ({
        timestamp: e.timestamp,
        furnaceId: e.furnaceId,
        powerKw: e.powerKw,
        powerFactor: e.powerFactor,
        apparentPowerKva: e.apparentPowerKva,
        state: e.state
      })),
      pfTimeline
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
