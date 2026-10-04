import { Schedule } from '../models/Schedule.js';
import { Furnace } from '../models/Furnace.js';
import { TariffSettings } from '../models/TariffSettings.js';
import { Foundry } from '../models/Foundry.js';
import { generateOptimizedSchedule } from '../services/scheduleOptimizer.js';

export async function getCurrentSchedule(req, res) {
  try {
    const currentSchedule = await Schedule.findOne({ planType: 'CURRENT' }) || null;
    const optimizedSchedule = await Schedule.findOne({ planType: 'OPTIMIZED' }) || null;

    if (!currentSchedule || !optimizedSchedule) {
      // Generate default demo schedule if none found
      const furnaces = await Furnace.find().exec();
      const tariffSettings = await TariffSettings.findOne() || {};
      const demoHeats = [
        { heatId: 'H1', pourTime: '10:30', quantityTonnes: 1.0, meltDurationMinutes: 60, preferredFurnace: 'F1' },
        { heatId: 'H2', pourTime: '12:00', quantityTonnes: 1.0, meltDurationMinutes: 60, preferredFurnace: 'F2' },
        { heatId: 'H3', pourTime: '13:30', quantityTonnes: 1.0, meltDurationMinutes: 60, preferredFurnace: 'F1' },
        { heatId: 'H4', pourTime: '15:00', quantityTonnes: 1.0, meltDurationMinutes: 60, preferredFurnace: 'F2' }
      ];

      const result = generateOptimizedSchedule(demoHeats, { furnaces, tariffSettings });
      await Schedule.create(result.current);
      await Schedule.create(result.optimized);

      return res.json({
        success: true,
        current: result.current,
        optimized: result.optimized
      });
    }

    return res.json({
      success: true,
      current: currentSchedule,
      optimized: optimizedSchedule
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function optimizeSchedule(req, res) {
  try {
    const { heats, safetyBufferMinutes, demandThresholdKw } = req.body;

    if (!heats || !Array.isArray(heats) || heats.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide an array of heats with pourTime, quantityTonnes, and meltDurationMinutes.'
      });
    }

    const furnaces = await Furnace.find().exec();
    const tariffSettings = await TariffSettings.findOne() || {};
    const foundry = await Foundry.findOne() || {};

    const options = {
      furnaces,
      tariffSettings,
      safetyBufferMinutes: safetyBufferMinutes !== undefined ? Number(safetyBufferMinutes) : (foundry.safetyBufferMinutes || 10),
      demandThresholdKw: demandThresholdKw !== undefined ? Number(demandThresholdKw) : (foundry.demandThresholdKw || 1100),
      holdingThresholdMinutes: foundry.holdingThresholdMinutes || 30
    };

    const scheduleResult = generateOptimizedSchedule(heats, options);

    // Save or update schedules in database
    await Schedule.deleteMany({});
    const savedCurrent = await Schedule.create(scheduleResult.current);
    const savedOptimized = await Schedule.create(scheduleResult.optimized);

    return res.json({
      success: true,
      current: savedCurrent,
      optimized: savedOptimized,
      message: 'Schedule successfully optimized with peak tariff avoidance and staggered melting.'
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
