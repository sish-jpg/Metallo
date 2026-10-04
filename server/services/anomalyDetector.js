/**
 * METALLO Explainable Anomaly Detection Engine
 * Strictly rules-based and physics-based: NO black-box machine learning.
 * Every anomaly is tied to an engineering explanation and clear inspection points.
 */

/**
 * Check for furnace electrical/thermal operating anomalies
 * @param {Object} furnace 
 * @param {Object} foundryConfig 
 * @returns {Array<Object>} List of detected anomalies with explainable actions
 */
export function detectFurnaceAnomalies(furnace, foundryConfig = {}) {
  const anomalies = [];
  const status = furnace.status;
  const power = furnace.currentPowerKw;
  const pf = furnace.currentPf;
  const minNormalMelting = furnace.normalMeltingMinKw || 550;
  const maxNormalMelting = furnace.normalMeltingMaxKw || 630;
  const holdingPower = furnace.holdingPowerKw || 100;
  const pfThreshold = foundryConfig.powerFactorThreshold || 0.95;

  // 1. Abnormal Melting Power Behavior
  if (status === 'MELTING') {
    if (power > maxNormalMelting) {
      anomalies.push({
        type: 'WARNING',
        category: 'ANOMALY',
        furnaceId: furnace.furnaceId,
        title: `Abnormal High Melting Power on ${furnace.name || furnace.furnaceId}`,
        message: `${furnace.furnaceId} is consuming ${power} kW, significantly higher than normal operating band (${minNormalMelting}–${maxNormalMelting} kW).`,
        observedValue: `${power} kW`,
        thresholdValue: `${maxNormalMelting} kW`,
        explainableAction: 'Inspect coil insulation resistance, earth-leakage relay, and capacitor bank bank balance. Excessive power draw often signals dielectric degradation or altered charge resistivity.'
      });
    } else if (power < minNormalMelting && power > 200) {
      anomalies.push({
        type: 'WARNING',
        category: 'ANOMALY',
        furnaceId: furnace.furnaceId,
        title: `Low Melting Power Inefficiency on ${furnace.name || furnace.furnaceId}`,
        message: `${furnace.furnaceId} is operating at only ${power} kW during melting mode, prolonging tap-to-tap time and increasing standby thermal losses.`,
        observedValue: `${power} kW`,
        thresholdValue: `${minNormalMelting} kW`,
        explainableAction: 'Check inverter thyristor gating, water cooling jacket temperatures, and DC bus voltage. Under-power melting drastically inflates SEC due to extended thermal dissipation.'
      });
    }
  }

  // 2. Power Factor Below Threshold
  if (pf < pfThreshold && power > 50) {
    anomalies.push({
      type: 'WARNING',
      category: 'POWER_FACTOR',
      furnaceId: furnace.furnaceId,
      title: `Sub-Optimal Power Factor (${pf.toFixed(2)}) on ${furnace.furnaceId}`,
      message: `Power factor ${pf.toFixed(2)} is below the target threshold of ${pfThreshold}. Apparent load is ${(power / pf).toFixed(0)} kVA.`,
      observedValue: pf.toFixed(2),
      thresholdValue: pfThreshold.toFixed(2),
      explainableAction: 'Inspect harmonic filter banks and tuning capacitors. Poor PF increases reactive kVA demand and triggers utility surcharge penalties under HT billing schedules.'
    });
  }

  // 3. Excessive Holding Duration
  const holdingLimit = foundryConfig.holdingThresholdMinutes || 30;
  if (status === 'HOLDING' && furnace.currentHoldingMinutes > holdingLimit) {
    const avoidableKwh = (holdingPower * ((furnace.currentHoldingMinutes - holdingLimit) / 60)).toFixed(1);
    anomalies.push({
      type: 'WARNING',
      category: 'HOLDING',
      furnaceId: furnace.furnaceId,
      heatId: furnace.currentHeatId,
      title: `Excessive Holding Duration on ${furnace.furnaceId}`,
      message: `Holding duration has reached ${furnace.currentHoldingMinutes} min (threshold: ${holdingLimit} min). Estimated avoidable holding energy: ${avoidableKwh} kWh.`,
      observedValue: `${furnace.currentHoldingMinutes} min`,
      thresholdValue: `${holdingLimit} min`,
      explainableAction: 'Expedite moulding line preparation or lower bath temperature to standby setpoint. Holding is pure thermal waste that contributes nothing to metallurgical transformation.'
    });
  }

  return anomalies;
}

/**
 * Check Plant Total Demand against Contract/Threshold
 * @param {number} totalDemandKw 
 * @param {number} totalDemandKva 
 * @param {Object} foundryConfig 
 * @returns {Object|null}
 */
export function checkPlantDemandThreshold(totalDemandKw, totalDemandKva, foundryConfig = {}) {
  const threshold = foundryConfig.demandThresholdKw || 1100;
  const contract = foundryConfig.contractDemandKw || 1400;

  if (totalDemandKw >= contract) {
    return {
      type: 'CRITICAL',
      category: 'DEMAND',
      title: 'Contract Demand Breached',
      message: `Total foundry demand has reached ${totalDemandKw} kW, exceeding the contract sanction of ${contract} kW. Severe penalty tariffs apply.`,
      observedValue: `${totalDemandKw} kW (${totalDemandKva} kVA)`,
      thresholdValue: `${contract} kW`,
      explainableAction: 'Immediately stagger furnace melts or shed auxiliary compressor/induction loads to prevent peak demand ratchet penalty on monthly bill.'
    };
  }

  if (totalDemandKw >= threshold) {
    return {
      type: 'CRITICAL',
      category: 'DEMAND',
      title: 'Demand Exceeded Safe Operating Threshold',
      message: `Current plant active demand is ${totalDemandKw} kW, surpassing warning threshold of ${threshold} kW.`,
      observedValue: `${totalDemandKw} kW (${totalDemandKva} kVA)`,
      thresholdValue: `${threshold} kW`,
      explainableAction: 'Coordinate melting schedule to prevent overlapping melt cycles between Furnace F1 and F2. Utilize METALLO Schedule Optimizer to stagger operations.'
    };
  }

  return null;
}

/**
 * Check Heat SEC for Abnormal Consumption
 * @param {Object} heat 
 * @param {number} baselineSec 
 * @returns {Object|null}
 */
export function checkHeatSecAnomaly(heat, baselineSec = 580) {
  const allowedMargin = 0.15; // 15% above baseline
  const secThreshold = Math.round(baselineSec * (1 + allowedMargin)); // e.g. ~667 kWh/t

  if (heat.secKwhPerTonne > secThreshold && heat.productionTonnes > 0) {
    return {
      type: 'WARNING',
      category: 'ANOMALY',
      furnaceId: heat.furnaceId,
      heatId: heat.heatId,
      title: `High Specific Energy Consumption (${heat.secKwhPerTonne} kWh/t) on ${heat.heatId}`,
      message: `Heat ${heat.heatId} consumed ${heat.secKwhPerTonne} kWh/t compared to benchmark of ${baselineSec} kWh/t (+${Math.round(((heat.secKwhPerTonne - baselineSec) / baselineSec) * 100)}%).`,
      observedValue: `${heat.secKwhPerTonne} kWh/t`,
      thresholdValue: `${secThreshold} kWh/t`,
      explainableAction: 'Analyze timeline: verify if prolonged holding or lid-open radiation losses caused high energy consumption. Check charge scrap density and rusty scrap proportion.'
    };
  }
  return null;
}
