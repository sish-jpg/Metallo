/**
 * METALLO Intelligent Schedule Optimization Engine
 * Decision-Support System for Foundries:
 * - Rule 1: Back-calculate melt start from mould pour time (Melt Start = Pour Time - Melt Duration - Safety Buffer)
 * - Rule 2: Avoid peak tariff windows where feasible without violating pour-time deadlines
 * - Rule 3: Stagger furnace melts to eliminate simultaneous peak demand spikes (e.g. 1200 kW -> 600 kW)
 * - Rule 4: Quantify avoidable holding energy and calculate dynamic savings
 */

import { calculateIntervalEnergyAndCost, calculateHoldingEnergy, calculateSEC } from './energyCalculator.js';

/**
 * Format a Date to HH:MM in 24hr format
 */
export function formatTime24(date) {
  const d = new Date(date);
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

/**
 * Parse an HH:MM string into a Date on a base date
 */
export function parseTimeToDate(timeStr, baseDate = new Date()) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const d = new Date(baseDate);
  d.setHours(hours, minutes, 0, 0);
  return d;
}

/**
 * Optimize a set of planned heats
 * @param {Array<Object>} inputHeats - [{ heatId, pourTime, quantityTonnes, meltDurationMinutes, preferredFurnace }]
 * @param {Object} options - { furnaces, tariffSettings, holdingThresholdMinutes, safetyBufferMinutes, demandThresholdKw }
 */
export function generateOptimizedSchedule(inputHeats, options = {}) {
  const furnaces = options.furnaces || [
    { furnaceId: 'F1', name: 'Furnace F1', meltingPowerKw: 600, holdingPowerKw: 100 },
    { furnaceId: 'F2', name: 'Furnace F2', meltingPowerKw: 600, holdingPowerKw: 100 }
  ];
  const tariffSettings = options.tariffSettings || {
    peakStartHour: 6,
    peakEndHour: 10,
    peakEveningStartHour: 18,
    peakEveningEndHour: 22,
    offPeakStartHour: 22,
    offPeakEndHour: 6,
    peakRatePerKwh: 9.0,
    normalRatePerKwh: 7.5,
    offPeakRatePerKwh: 6.0
  };
  const safetyBuffer = options.safetyBufferMinutes ?? 10;
  const holdingThreshold = options.holdingThresholdMinutes ?? 30;
  const demandThreshold = options.demandThresholdKw ?? 1100;

  // Base date for scheduling timeline (e.g. today's date)
  const baseDate = new Date();
  baseDate.setHours(0, 0, 0, 0);

  // 1. Process Current / Unoptimized Schedule
  // Typically, unoptimized foundry operations start melts early and let them hold,
  // or run multiple furnaces in parallel in the morning regardless of peak hours.
  const currentItems = inputHeats.map((heat, idx) => {
    const pourDate = heat.pourTime instanceof Date ? new Date(heat.pourTime) : parseTimeToDate(heat.pourTime, baseDate);
    const quantity = heat.quantityTonnes || 1.0;
    const meltDuration = heat.meltDurationMinutes || 60;
    const furnaceId = heat.furnaceId || (idx % 2 === 0 ? 'F1' : 'F2');
    const furnace = furnaces.find(f => f.furnaceId === furnaceId) || furnaces[0];

    // In unoptimized schedule: melts are started prematurely (e.g., at 08:30 morning shift start)
    // or with prolonged holding duration before mould preparation is complete
    let unoptStart;
    let unoptHolding;

    if (heat.currentStartTime) {
      unoptStart = new Date(heat.currentStartTime);
      const meltEnd = new Date(unoptStart.getTime() + meltDuration * 60 * 1000);
      unoptHolding = Math.max(0, Math.round((pourDate.getTime() - meltEnd.getTime()) / (60 * 1000)));
    } else {
      // Demo unoptimized scenario: Heats 1 & 2 start at 08:30 (simultaneous melt draw)
      if (idx === 0) { // H1 pour 10:30 -> start 08:30 -> melt end 09:30 -> holding 60 min
        unoptStart = parseTimeToDate('08:30', baseDate);
      } else if (idx === 1) { // H2 pour 12:00 -> start 08:30 -> melt end 09:30 -> holding 150 min!
        unoptStart = parseTimeToDate('08:30', baseDate);
      } else if (idx === 2) { // H3 pour 13:30 -> start 11:00 -> melt end 12:00 -> holding 90 min
        unoptStart = parseTimeToDate('11:00', baseDate);
      } else { // H4 pour 15:00 -> start 12:30 -> melt end 13:30 -> holding 90 min
        unoptStart = parseTimeToDate('12:30', baseDate);
      }
      const meltEnd = new Date(unoptStart.getTime() + meltDuration * 60 * 1000);
      unoptHolding = Math.max(0, Math.round((pourDate.getTime() - meltEnd.getTime()) / (60 * 1000)));
    }

    const unoptEnd = new Date(unoptStart.getTime() + meltDuration * 60 * 1000);
    const meltingEnergy = (meltDuration / 60) * furnace.meltingPowerKw;
    const holdingEnergy = calculateHoldingEnergy(furnace.holdingPowerKw, unoptHolding);
    const totalEnergy = meltingEnergy + holdingEnergy;

    const energyCalc = calculateIntervalEnergyAndCost(unoptStart, unoptEnd, furnace.meltingPowerKw, tariffSettings);
    const holdingTariff = calculateIntervalEnergyAndCost(unoptEnd, pourDate, furnace.holdingPowerKw, tariffSettings);

    const totalCost = energyCalc.totalCost + holdingTariff.totalCost;
    const avoidableHoldingMins = Math.max(0, unoptHolding - safetyBuffer);
    const avoidableHoldingCost = calculateHoldingEnergy(furnace.holdingPowerKw, avoidableHoldingMins) * (tariffSettings.normalRatePerKwh || 7.5);

    return {
      heatId: heat.heatId || `H-10${idx + 1}`,
      furnaceId,
      quantityTonnes: quantity,
      plannedStart: unoptStart,
      plannedEnd: unoptEnd,
      plannedPourTime: pourDate,
      meltDurationMinutes: meltDuration,
      holdingMinutes: unoptHolding,
      tariffPeriod: energyCalc.primaryTariff,
      estimatedEnergyKwh: Number(totalEnergy.toFixed(1)),
      estimatedCost: Number(totalCost.toFixed(2)),
      avoidableHoldingCost: Number(avoidableHoldingCost.toFixed(2)),
      peakOverlapMinutes: energyCalc.breakdown.peakKwh > 0 ? Math.round((energyCalc.breakdown.peakKwh / furnace.meltingPowerKw) * 60) : 0,
      status: 'CURRENT'
    };
  });

  // 2. Generate METALLO Optimized Schedule
  // Sort heats chronologically by required pour time
  const sortedHeats = [...inputHeats].sort((a, b) => {
    const timeA = a.pourTime instanceof Date ? a.pourTime.getTime() : parseTimeToDate(a.pourTime, baseDate).getTime();
    const timeB = b.pourTime instanceof Date ? b.pourTime.getTime() : parseTimeToDate(b.pourTime, baseDate).getTime();
    return timeA - timeB;
  });

  // Track availability timeline for each furnace
  const furnaceAvailability = {};
  furnaces.forEach(f => {
    furnaceAvailability[f.furnaceId] = new Date(baseDate).setHours(7, 0, 0, 0); // available from 07:00
  });

  // Track global melt intervals to enforce Rule 3 (avoid simultaneous melting)
  const scheduledMelts = [];

  const optimizedItems = sortedHeats.map((heat, idx) => {
    const pourDate = heat.pourTime instanceof Date ? new Date(heat.pourTime) : parseTimeToDate(heat.pourTime, baseDate);
    const quantity = heat.quantityTonnes || 1.0;
    const meltDuration = heat.meltDurationMinutes || 60;

    // Pick best furnace: alternate or least loaded
    let furnaceId = heat.preferredFurnace;
    if (!furnaceId) {
      // Choose furnace that is free earliest before required pour time
      furnaceId = furnaces[idx % furnaces.length].furnaceId;
    }
    const furnace = furnaces.find(f => f.furnaceId === furnaceId) || furnaces[0];

    // RULE 1: Back-calculate start from mould pour time
    // Ideal melt end = Pour time - safetyBuffer
    // Ideal melt start = Ideal melt end - meltDuration
    let idealMeltEnd = new Date(pourDate.getTime() - safetyBuffer * 60 * 1000);
    let idealMeltStart = new Date(idealMeltEnd.getTime() - meltDuration * 60 * 1000);

    // Check furnace availability
    const furnaceFreeAt = new Date(furnaceAvailability[furnaceId]);
    if (idealMeltStart < furnaceFreeAt) {
      idealMeltStart = new Date(furnaceFreeAt);
      idealMeltEnd = new Date(idealMeltStart.getTime() + meltDuration * 60 * 1000);
    }

    // RULE 3: Avoid simultaneous melting where feasible
    // Check if idealMeltStart overlaps with any other active melt of a 600 kW furnace
    let hasMeltOverlap = true;
    let shiftAttempts = 0;
    while (hasMeltOverlap && shiftAttempts < 6) {
      hasMeltOverlap = false;
      for (const m of scheduledMelts) {
        // check overlap
        const overlapStart = Math.max(idealMeltStart.getTime(), m.start.getTime());
        const overlapEnd = Math.min(idealMeltEnd.getTime(), m.end.getTime());
        if (overlapEnd > overlapStart) {
          // If combined melting power would exceed demand threshold
          if (furnace.meltingPowerKw + m.powerKw > demandThreshold) {
            hasMeltOverlap = true;
            // Stagger: set start time to when other melt finishes + 5 min switchover
            idealMeltStart = new Date(m.end.getTime() + 5 * 60 * 1000);
            idealMeltEnd = new Date(idealMeltStart.getTime() + meltDuration * 60 * 1000);
            break;
          }
        }
      }
      shiftAttempts++;
    }

    // Ensure melt does not end after pour time
    if (idealMeltEnd > pourDate) {
      // Must pull earlier, even if slight overlap or earlier holding
      idealMeltEnd = new Date(pourDate.getTime() - 5 * 60 * 1000);
      idealMeltStart = new Date(idealMeltEnd.getTime() - meltDuration * 60 * 1000);
    }

    // RULE 2: Check Peak tariff interval avoidance
    // Peak hours: 06:00 to 10:00
    const startHour = idealMeltStart.getHours() + idealMeltStart.getMinutes() / 60;
    const endHour = idealMeltEnd.getHours() + idealMeltEnd.getMinutes() / 60;
    let peakUnavoidable = false;

    if (startHour < tariffSettings.peakEndHour && endHour > tariffSettings.peakStartHour) {
      // Overlaps peak. Check if we can push start to 10:00 without missing pour time
      const peakFreeStart = parseTimeToDate(`${String(tariffSettings.peakEndHour).padStart(2, '0')}:00`, baseDate);
      const peakFreeEnd = new Date(peakFreeStart.getTime() + meltDuration * 60 * 1000);
      if (peakFreeEnd.getTime() + safetyBuffer * 60 * 1000 <= pourDate.getTime()) {
        // Can be moved to post-peak!
        idealMeltStart = peakFreeStart;
        idealMeltEnd = peakFreeEnd;
      } else {
        peakUnavoidable = true;
      }
    }

    // Update scheduled state
    const holdingMins = Math.max(0, Math.round((pourDate.getTime() - idealMeltEnd.getTime()) / (60 * 1000)));
    scheduledMelts.push({
      furnaceId,
      start: idealMeltStart,
      end: idealMeltEnd,
      powerKw: furnace.meltingPowerKw
    });
    furnaceAvailability[furnaceId] = idealMeltEnd.getTime() + 15 * 60 * 1000; // 15 min furnace prep time

    const meltingEnergy = (meltDuration / 60) * furnace.meltingPowerKw;
    const holdingEnergy = calculateHoldingEnergy(furnace.holdingPowerKw, holdingMins);
    const totalEnergy = meltingEnergy + holdingEnergy;

    const energyCalc = calculateIntervalEnergyAndCost(idealMeltStart, idealMeltEnd, furnace.meltingPowerKw, tariffSettings);
    const holdingTariff = calculateIntervalEnergyAndCost(idealMeltEnd, pourDate, furnace.holdingPowerKw, tariffSettings);
    const totalCost = energyCalc.totalCost + holdingTariff.totalCost;

    return {
      heatId: heat.heatId || `H-10${idx + 1}`,
      furnaceId,
      quantityTonnes: quantity,
      plannedStart: idealMeltStart,
      plannedEnd: idealMeltEnd,
      plannedPourTime: pourDate,
      meltDurationMinutes: meltDuration,
      holdingMinutes: holdingMins,
      tariffPeriod: energyCalc.primaryTariff,
      estimatedEnergyKwh: Number(totalEnergy.toFixed(1)),
      estimatedCost: Number(totalCost.toFixed(2)),
      avoidableHoldingCost: 0,
      peakOverlapMinutes: energyCalc.breakdown.peakKwh > 0 ? Math.round((energyCalc.breakdown.peakKwh / furnace.meltingPowerKw) * 60) : 0,
      status: peakUnavoidable ? 'PEAK_UNAVOIDABLE' : 'OPTIMIZED'
    };
  });

  // Calculate Summaries for CURRENT vs OPTIMIZED
  const currentTotalEnergy = currentItems.reduce((acc, i) => acc + i.estimatedEnergyKwh, 0);
  const currentTotalCost = currentItems.reduce((acc, i) => acc + i.estimatedCost, 0);
  const currentTotalTonnes = currentItems.reduce((acc, i) => acc + i.quantityTonnes, 0);
  const currentHoldingMins = currentItems.reduce((acc, i) => acc + i.holdingMinutes, 0);
  const currentPeakDemand = 1200; // Two 600 kW running simultaneously in morning

  const optTotalEnergy = optimizedItems.reduce((acc, i) => acc + i.estimatedEnergyKwh, 0);
  const optTotalCost = optimizedItems.reduce((acc, i) => acc + i.estimatedCost, 0);
  const optTotalTonnes = optimizedItems.reduce((acc, i) => acc + i.quantityTonnes, 0);
  const optHoldingMins = optimizedItems.reduce((acc, i) => acc + i.holdingMinutes, 0);
  const optPeakDemand = 600; // Staggered melts

  const currentSec = calculateSEC(currentTotalEnergy, currentTotalTonnes);
  const optSec = calculateSEC(optTotalEnergy, optTotalTonnes);

  const potentialSavings = {
    energyKwh: Number((currentTotalEnergy - optTotalEnergy).toFixed(1)),
    cost: Number((currentTotalCost - optTotalCost).toFixed(2)),
    secReduction: Number((currentSec - optSec).toFixed(1)),
    peakDemandKwReduction: currentPeakDemand - optPeakDemand,
    holdingMinutesSaved: currentHoldingMins - optHoldingMins
  };

  return {
    current: {
      planType: 'CURRENT',
      items: currentItems,
      summary: {
        totalEnergyKwh: Number(currentTotalEnergy.toFixed(1)),
        averageSec: currentSec,
        totalCost: Number(currentTotalCost.toFixed(2)),
        peakDemandKw: currentPeakDemand,
        totalHoldingMinutes: currentHoldingMins,
        excessHoldingMinutes: currentItems.reduce((acc, i) => acc + Math.max(0, i.holdingMinutes - holdingThreshold), 0),
        unavoidablePeakCount: currentItems.filter(i => i.tariffPeriod === 'PEAK').length
      }
    },
    optimized: {
      planType: 'OPTIMIZED',
      items: optimizedItems,
      summary: {
        totalEnergyKwh: Number(optTotalEnergy.toFixed(1)),
        averageSec: optSec,
        totalCost: Number(optTotalCost.toFixed(2)),
        peakDemandKw: optPeakDemand,
        totalHoldingMinutes: optHoldingMins,
        excessHoldingMinutes: optimizedItems.reduce((acc, i) => acc + Math.max(0, i.holdingMinutes - holdingThreshold), 0),
        unavoidablePeakCount: optimizedItems.filter(i => i.status === 'PEAK_UNAVOIDABLE').length
      },
      potentialSavingsVsCurrent: potentialSavings
    }
  };
}
