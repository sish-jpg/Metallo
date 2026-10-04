import { Foundry } from '../models/Foundry.js';
import { Furnace } from '../models/Furnace.js';
import { Heat } from '../models/Heat.js';
import { Alert } from '../models/Alert.js';
import { EnergyReading } from '../models/EnergyReading.js';
import { calculateSEC, calculatePF, calculateKva } from '../services/energyCalculator.js';

export async function getOverview(req, res) {
  try {
    const foundry = await Foundry.findOne() || {};
    const furnaces = await Furnace.find().exec();
    const heats = await Heat.find().sort({ meltStartTime: -1 }).limit(10).exec();
    const activeAlerts = await Alert.find({ resolved: false }).sort({ timestamp: -1 }).exec();

    // Calculate aggregated metrics dynamically
    const completedHeats = heats.filter(h => h.status === 'COMPLETED');
    const todayTonnes = Number(completedHeats.reduce((acc, h) => acc + (h.productionTonnes || 0), 0).toFixed(1)) || 4.0;
    const todayEnergyKwh = Number(furnaces.reduce((acc, f) => acc + (f.todayEnergyKwh || 0), 0).toFixed(1));
    const todaySec = calculateSEC(todayEnergyKwh, todayTonnes);

    // Active plant demand
    const auxKw = 45; // baseline auxiliary load
    const activeFurnacesKw = furnaces.reduce((acc, f) => acc + (f.currentPowerKw || 0), 0);
    const currentDemandKw = activeFurnacesKw + (activeFurnacesKw > 0 ? auxKw : 5);

    // Plant-level PF
    const totalKva = furnaces.reduce((acc, f) => acc + (f.currentKva || calculateKva(f.currentPowerKw, f.currentPf)), 0) + (auxKw / 0.95);
    const plantPf = calculatePF(currentDemandKw, totalKva);

    // Cost aggregation
    const estimatedCostToday = Number(completedHeats.reduce((acc, h) => acc + (h.tariffBreakdown?.totalCost || 0), 0).toFixed(2));
    const potentialSavingsToday = Number(completedHeats.reduce((acc, h) => acc + (h.excessHoldingCost || 0), 0).toFixed(2));

    // Get latest 16 telemetry readings for minimalist activity sparklines
    const recentReadings = await EnergyReading.find().sort({ timestamp: -1 }).limit(24).exec();
    const demandTrend = recentReadings.reverse().map(r => ({
      time: new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      powerKw: r.powerKw,
      furnaceId: r.furnaceId,
      state: r.state
    }));

    return res.json({
      success: true,
      foundry: {
        name: foundry.name || 'METALLO Demo Foundry',
        location: foundry.location || 'Coimbatore, India',
        demandThresholdKw: foundry.demandThresholdKw || 1100,
        contractDemandKw: foundry.contractDemandKw || 1400,
        holdingThresholdMinutes: foundry.holdingThresholdMinutes || 30,
        powerFactorThreshold: foundry.powerFactorThreshold || 0.95
      },
      kpis: {
        todayProductionTonnes: todayTonnes,
        todayEnergyKwh,
        todayAverageSec: todaySec,
        currentDemandKw,
        currentDemandKva: Number(totalKva.toFixed(1)),
        plantPowerFactor: plantPf,
        estimatedCostToday,
        potentialSavingsToday,
        activeAlertsCount: activeAlerts.length,
        criticalAlertsCount: activeAlerts.filter(a => a.type === 'CRITICAL').length
      },
      furnaces: furnaces.map(f => ({
        furnaceId: f.furnaceId,
        name: f.name,
        status: f.status,
        currentPowerKw: f.currentPowerKw,
        temperatureC: f.temperatureC,
        currentPf: f.currentPf,
        currentKva: f.currentKva,
        currentHeatId: f.currentHeatId,
        currentHoldingMinutes: f.currentHoldingMinutes,
        todayEnergyKwh: f.todayEnergyKwh,
        todayProductionTonnes: f.todayProductionTonnes,
        secKwhPerTonne: calculateSEC(f.todayEnergyKwh, f.todayProductionTonnes || 1),
        hasHoldingWarning: f.status === 'HOLDING' && f.currentHoldingMinutes > (foundry.holdingThresholdMinutes || 30),
        hasPfWarning: f.currentPf < (foundry.powerFactorThreshold || 0.95)
      })),
      recentAlerts: activeAlerts.slice(0, 3),
      recentHeats: heats.slice(0, 5),
      demandTrend
    });
  } catch (err) {
    console.error('[CONTROLLER] getOverview error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
