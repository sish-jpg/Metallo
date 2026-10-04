/**
 * METALLO CSV Ingestion and Strict Validation Service
 * Validates foundry telemetry and heat records with row-level error reporting
 */

import { Heat } from '../models/Heat.js';
import { EnergyReading } from '../models/EnergyReading.js';
import { Furnace } from '../models/Furnace.js';
import { TariffSettings } from '../models/TariffSettings.js';
import { calculateSEC, calculateHoldingEnergy, calculateKva, getTariffForTimestamp } from './energyCalculator.js';

/**
 * Validate and import Heat records from CSV rows
 * @param {Array<Object>} rows 
 */
export async function validateAndImportHeatsCsv(rows) {
  const errors = [];
  const validHeats = [];
  const tariffSettings = await TariffSettings.findOne() || {};

  if (!rows || rows.length === 0) {
    return { success: false, errors: ['CSV file is empty or headers could not be parsed.'], importedCount: 0 };
  }

  // Required header fields for heats CSV
  const requiredHeaders = ['heatId', 'furnaceId', 'productionTonnes', 'totalEnergyKwh'];
  const firstRowKeys = Object.keys(rows[0] || {});
  const missingHeaders = requiredHeaders.filter(h => !firstRowKeys.some(k => k.trim().toLowerCase() === h.toLowerCase()));

  if (missingHeaders.length > 0) {
    return {
      success: false,
      errors: [`Missing required header columns: ${missingHeaders.join(', ')}. Expected: heatId, furnaceId, productionTonnes, totalEnergyKwh, [meltingMinutes, holdingMinutes, averagePf, grade]`],
      importedCount: 0
    };
  }

  rows.forEach((row, index) => {
    const rowNum = index + 2; // +1 for 0-index, +1 for header row
    const heatId = row.heatId || row.HeatId || row.HEAT_ID;
    const furnaceId = row.furnaceId || row.FurnaceId || row.FURNACE_ID;
    const tonnesStr = row.productionTonnes || row.ProductionTonnes || row.tonnes;
    const energyStr = row.totalEnergyKwh || row.TotalEnergyKwh || row.energyKwh;
    const meltMinsStr = row.meltingMinutes || row.meltingDurationMinutes || '60';
    const holdMinsStr = row.holdingMinutes || row.holdingDurationMinutes || '10';
    const pfStr = row.averagePf || row.powerFactor || '0.95';
    const grade = row.grade || 'Grey Iron FG260';

    if (!heatId || String(heatId).trim() === '') {
      errors.push(`Row ${rowNum}: heatId cannot be blank.`);
      return;
    }

    if (!furnaceId || String(furnaceId).trim() === '') {
      errors.push(`Row ${rowNum}: furnaceId cannot be blank.`);
      return;
    }

    const tonnes = parseFloat(tonnesStr);
    if (isNaN(tonnes) || tonnes <= 0) {
      errors.push(`Row ${rowNum}: productionTonnes must be a positive number (found "${tonnesStr}").`);
      return;
    }

    const energy = parseFloat(energyStr);
    if (isNaN(energy) || energy <= 0) {
      errors.push(`Row ${rowNum}: totalEnergyKwh must be a positive number (found "${energyStr}").`);
      return;
    }

    const meltMins = parseFloat(meltMinsStr) || 60;
    const holdMins = parseFloat(holdMinsStr) || 0;
    const pf = parseFloat(pfStr);

    if (pf < 0.1 || pf > 1.0) {
      errors.push(`Row ${rowNum}: averagePf must be between 0.1 and 1.0 (found "${pfStr}").`);
      return;
    }

    // Dynamic SEC calculation
    const sec = calculateSEC(energy, tonnes);
    const holdingEnergy = calculateHoldingEnergy(100, holdMins);
    const meltingEnergy = Math.max(0, energy - holdingEnergy);

    // Dynamic Tariff cost
    const normalRate = tariffSettings.normalRatePerKwh || 7.5;
    const totalCost = Number((energy * normalRate).toFixed(2));
    const excessHolding = Math.max(0, holdMins - 30);
    const excessCost = Number((calculateHoldingEnergy(100, excessHolding) * normalRate).toFixed(2));

    validHeats.push({
      heatId: String(heatId).trim().toUpperCase(),
      furnaceId: String(furnaceId).trim().toUpperCase(),
      productionTonnes: tonnes,
      grade: String(grade).trim(),
      status: 'COMPLETED',
      meltingDurationMinutes: meltMins,
      holdingDurationMinutes: holdMins,
      meltingEnergyKwh: Number(meltingEnergy.toFixed(1)),
      holdingEnergyKwh: Number(holdingEnergy.toFixed(1)),
      totalEnergyKwh: Number(energy.toFixed(1)),
      secKwhPerTonne: sec,
      averagePf: pf,
      tariffBreakdown: {
        normalKwh: energy,
        normalCost: totalCost,
        totalCost: totalCost
      },
      excessHoldingMinutes: excessHolding,
      excessHoldingEnergyKwh: Number(calculateHoldingEnergy(100, excessHolding).toFixed(1)),
      excessHoldingCost: excessCost,
      hasHoldingWarning: excessHolding > 0,
      hasSecWarning: sec > 660,
      notes: 'Imported via CSV Data Upload'
    });
  });

  if (errors.length > 0 && validHeats.length === 0) {
    return { success: false, errors, importedCount: 0 };
  }

  // Insert or update heats
  for (const h of validHeats) {
    await Heat.updateOne({ heatId: h.heatId }, { $set: h }, { upsert: true });
  }

  return {
    success: true,
    importedCount: validHeats.length,
    warningErrors: errors.length > 0 ? errors : null
  };
}

/**
 * Generate sample CSV template string
 */
export function getSampleCsvTemplate() {
  return `heatId,furnaceId,productionTonnes,grade,meltingMinutes,holdingMinutes,totalEnergyKwh,averagePf
H-108,F1,1.0,Grey Iron FG260,62,12,610,0.96
H-109,F2,1.0,Grey Iron FG200,58,8,590,0.95
H-110,F1,1.2,SG Iron 500/7,70,38,760,0.94
H-111,F2,1.0,Grey Iron FG260,65,45,680,0.92
`;
}
