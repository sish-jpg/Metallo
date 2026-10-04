/**
 * METALLO Core Energy Calculation Service
 * Implements deterministic physics & electrical engineering formulas:
 * - SEC (Specific Energy Consumption)
 * - Power Factor & Apparent Power (kVA)
 * - Holding Energy & avoidable excess holding costs
 * - Time-Of-Day Tariff cost aggregation
 * - Maximum Demand monitoring
 */

/**
 * Calculate Specific Energy Consumption (SEC)
 * SEC = Total Energy Consumed (kWh) / Production Quantity (tonnes)
 * @param {number} totalEnergyKwh 
 * @param {number} productionTonnes 
 * @returns {number} SEC in kWh/tonne
 */
export function calculateSEC(totalEnergyKwh, productionTonnes) {
  if (!productionTonnes || productionTonnes <= 0) return 0;
  return Number((totalEnergyKwh / productionTonnes).toFixed(1));
}

/**
 * Calculate Apparent Power (kVA) from Real Power (kW) and Power Factor (PF)
 * kVA = kW / PF
 * @param {number} powerKw 
 * @param {number} powerFactor 
 * @returns {number} Apparent power in kVA
 */
export function calculateKva(powerKw, powerFactor) {
  const pf = Math.max(0.1, Math.min(1.0, powerFactor || 0.95));
  if (!powerKw || powerKw <= 0) return 0;
  return Number((powerKw / pf).toFixed(1));
}

/**
 * Calculate Power Factor (PF) from Real Power (kW) and Apparent Power (kVA)
 * PF = kW / kVA
 * @param {number} powerKw 
 * @param {number} apparentPowerKva 
 * @returns {number} Power factor (0.0 to 1.0)
 */
export function calculatePF(powerKw, apparentPowerKva) {
  if (!apparentPowerKva || apparentPowerKva <= 0) return 1.0;
  if (!powerKw || powerKw <= 0) return 1.0;
  const pf = powerKw / apparentPowerKva;
  return Number(Math.min(1.0, Math.max(0.0, pf)).toFixed(3));
}

/**
 * Calculate Holding Energy Consumed
 * Holding Energy (kWh) = Holding Power (kW) × (Holding Duration (minutes) / 60)
 * @param {number} holdingPowerKw 
 * @param {number} holdingDurationMinutes 
 * @returns {number} kWh
 */
export function calculateHoldingEnergy(holdingPowerKw, holdingDurationMinutes) {
  if (!holdingPowerKw || holdingPowerKw <= 0 || !holdingDurationMinutes || holdingDurationMinutes <= 0) {
    return 0;
  }
  return Number((holdingPowerKw * (holdingDurationMinutes / 60)).toFixed(2));
}

/**
 * Calculate Excess Holding analysis based on configured threshold
 * @param {number} holdingPowerKw 
 * @param {number} actualHoldingMinutes 
 * @param {number} thresholdMinutes 
 * @param {number} applicableTariffRate 
 */
export function analyzeExcessHolding(holdingPowerKw, actualHoldingMinutes, thresholdMinutes = 30, applicableTariffRate = 7.5) {
  const excessMinutes = Math.max(0, actualHoldingMinutes - thresholdMinutes);
  const excessEnergyKwh = calculateHoldingEnergy(holdingPowerKw, excessMinutes);
  const excessCost = Number((excessEnergyKwh * applicableTariffRate).toFixed(2));
  const isExcessive = actualHoldingMinutes > thresholdMinutes;

  return {
    isExcessive,
    actualHoldingMinutes,
    thresholdMinutes,
    excessMinutes,
    excessEnergyKwh,
    excessCost
  };
}

/**
 * Determine Tariff Type and Rate for a given Date/Time
 * @param {Date|string} timestamp 
 * @param {Object} tariffSettings 
 * @returns {{ type: 'PEAK'|'NORMAL'|'OFF_PEAK', rate: number, label: string }}
 */
export function getTariffForTimestamp(timestamp, tariffSettings) {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  const hour = date.getHours() + date.getMinutes() / 60;

  const peakStart = tariffSettings?.peakStartHour ?? 6;
  const peakEnd = tariffSettings?.peakEndHour ?? 10;
  const peakEveStart = tariffSettings?.peakEveningStartHour ?? 18;
  const peakEveEnd = tariffSettings?.peakEveningEndHour ?? 22;

  const offPeakStart = tariffSettings?.offPeakStartHour ?? 22;
  const offPeakEnd = tariffSettings?.offPeakEndHour ?? 6;

  const peakRate = tariffSettings?.peakRatePerKwh ?? 9.0;
  const normalRate = tariffSettings?.normalRatePerKwh ?? 7.5;
  const offPeakRate = tariffSettings?.offPeakRatePerKwh ?? 6.0;

  // Peak intervals: 06:00 - 10:00 or 18:00 - 22:00
  if ((hour >= peakStart && hour < peakEnd) || (hour >= peakEveStart && hour < peakEveEnd)) {
    return { type: 'PEAK', rate: peakRate, label: `Peak Rate (${tariffSettings?.currencySymbol || '₹'}${peakRate}/kWh)` };
  }

  // Off-peak intervals: >= 22:00 or < 06:00
  if (hour >= offPeakStart || hour < offPeakEnd) {
    return { type: 'OFF_PEAK', rate: offPeakRate, label: `Off-Peak Rate (${tariffSettings?.currencySymbol || '₹'}${offPeakRate}/kWh)` };
  }

  return { type: 'NORMAL', rate: normalRate, label: `Normal Rate (${tariffSettings?.currencySymbol || '₹'}${normalRate}/kWh)` };
}

/**
 * Calculate energy and cost breakdown across time-of-day tariff bands for a time interval
 * @param {Date|string} startTime 
 * @param {Date|string} endTime 
 * @param {number} averagePowerKw 
 * @param {Object} tariffSettings 
 */
export function calculateIntervalEnergyAndCost(startTime, endTime, averagePowerKw, tariffSettings) {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  const durationMs = Math.max(0, end - start);
  const durationHours = durationMs / (1000 * 60 * 60);

  if (durationHours <= 0 || averagePowerKw <= 0) {
    return {
      totalEnergyKwh: 0,
      totalCost: 0,
      breakdown: { peakKwh: 0, normalKwh: 0, offPeakKwh: 0, peakCost: 0, normalCost: 0, offPeakCost: 0 },
      primaryTariff: 'NORMAL'
    };
  }

  // Sample in 5-minute increments for accurate time-of-day integration
  const stepMinutes = 5;
  const stepMs = stepMinutes * 60 * 1000;
  let currentMs = start;

  let peakKwh = 0;
  let normalKwh = 0;
  let offPeakKwh = 0;

  const peakRate = tariffSettings?.peakRatePerKwh ?? 9.0;
  const normalRate = tariffSettings?.normalRatePerKwh ?? 7.5;
  const offPeakRate = tariffSettings?.offPeakRatePerKwh ?? 6.0;

  while (currentMs < end) {
    const nextMs = Math.min(end, currentMs + stepMs);
    const sliceHours = (nextMs - currentMs) / (1000 * 60 * 60);
    const sliceKwh = averagePowerKw * sliceHours;

    const tariff = getTariffForTimestamp(new Date(currentMs), tariffSettings);
    if (tariff.type === 'PEAK') {
      peakKwh += sliceKwh;
    } else if (tariff.type === 'OFF_PEAK') {
      offPeakKwh += sliceKwh;
    } else {
      normalKwh += sliceKwh;
    }

    currentMs = nextMs;
  }

  const peakCost = peakKwh * peakRate;
  const normalCost = normalKwh * normalRate;
  const offPeakCost = offPeakKwh * offPeakRate;
  const totalEnergyKwh = peakKwh + normalKwh + offPeakKwh;
  const totalCost = peakCost + normalCost + offPeakCost;

  let primaryTariff = 'NORMAL';
  if (peakKwh > normalKwh && peakKwh > offPeakKwh) primaryTariff = 'PEAK';
  else if (offPeakKwh > normalKwh && offPeakKwh > peakKwh) primaryTariff = 'OFF_PEAK';
  else if (peakKwh > 0 && normalKwh > 0) primaryTariff = 'MIXED';

  return {
    totalEnergyKwh: Number(totalEnergyKwh.toFixed(1)),
    totalCost: Number(totalCost.toFixed(2)),
    breakdown: {
      peakKwh: Number(peakKwh.toFixed(1)),
      normalKwh: Number(normalKwh.toFixed(1)),
      offPeakKwh: Number(offPeakKwh.toFixed(1)),
      peakCost: Number(peakCost.toFixed(2)),
      normalCost: Number(normalCost.toFixed(2)),
      offPeakCost: Number(offPeakCost.toFixed(2))
    },
    primaryTariff
  };
}

/**
 * Calculate power factor penalty and kVA demand impact
 * Lower PF -> higher kVA -> higher demand charges
 */
export function calculatePfDemandImpact(kW, currentPf, targetPf = 0.95, demandChargePerKva = 350) {
  const actualKva = calculateKva(kW, currentPf);
  const targetKva = calculateKva(kW, targetPf);
  const excessKva = Math.max(0, actualKva - targetKva);
  const monthlyDemandImpact = Number((excessKva * demandChargePerKva).toFixed(2));

  return {
    actualKva,
    targetKva,
    excessKva: Number(excessKva.toFixed(1)),
    monthlyDemandImpact,
    isSuboptimal: currentPf < targetPf
  };
}
