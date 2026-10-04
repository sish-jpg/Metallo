export const mockOverviewData = {
  "success": true,
  "foundry": {
    "name": "METALLO Demo Foundry Cluster",
    "location": "Coimbatore Industrial Area, TN, India",
    "demandThresholdKw": 1050,
    "contractDemandKw": 1400,
    "holdingThresholdMinutes": 30,
    "powerFactorThreshold": 0.95
  },
  "kpis": {
    "todayProductionTonnes": 6,
    "todayEnergyKwh": 3073.1,
    "todayAverageSec": 512.2,
    "currentDemandKw": 642,
    "currentDemandKva": 675.7,
    "plantPowerFactor": 0.95,
    "estimatedCostToday": 34528.5,
    "potentialSavingsToday": 270,
    "activeAlertsCount": 5,
    "criticalAlertsCount": 1
  },
  "furnaces": [
    {
      "furnaceId": "F1",
      "name": "Furnace F1 — Medium Frequency Induction",
      "status": "MELTING",
      "currentPowerKw": 582,
      "temperatureC": 1420,
      "currentPf": 0.95,
      "currentKva": 613,
      "currentHeatId": "H-104",
      "currentHoldingMinutes": 8,
      "todayEnergyKwh": 1501.2,
      "todayProductionTonnes": 2,
      "secKwhPerTonne": 750.6,
      "hasHoldingWarning": false,
      "hasPfWarning": false
    },
    {
      "furnaceId": "F2",
      "name": "Furnace F2 — Medium Frequency Induction",
      "status": "IDLE",
      "currentPowerKw": 15,
      "temperatureC": 450,
      "currentPf": 0.98,
      "currentKva": 15.3,
      "currentHeatId": null,
      "currentHoldingMinutes": 0,
      "todayEnergyKwh": 1571.9,
      "todayProductionTonnes": 2,
      "secKwhPerTonne": 786,
      "hasHoldingWarning": false,
      "hasPfWarning": false
    }
  ],
  "recentAlerts": [
    {
      "_id": "metallo_1f3nae439mutgvfkj",
      "alertId": "ALT-1001",
      "type": "WARNING",
      "category": "HOLDING",
      "furnaceId": "F2",
      "heatId": "H-105",
      "title": "Excessive Holding Duration on Furnace F2",
      "message": "Heat H-105 has been holding for 47 minutes (threshold: 30 minutes). Avoidable holding energy: ~28.3 kWh.",
      "observedValue": "47 min",
      "thresholdValue": "30 min",
      "explainableAction": "Expedite mould preparation on Line 2 or lower bath power to standby setpoint. Excessive holding increases thermal radiation losses without metallurgical value.",
      "timestamp": "2026-10-04T07:15:00.000Z",
      "acknowledged": true,
      "resolved": false,
      "createdAt": "2026-10-04T06:55:39.667Z",
      "updatedAt": "2026-10-04T07:10:23.117Z"
    },
    {
      "_id": "metallo_6275329owmutgvfkj",
      "alertId": "ALT-1002",
      "type": "WARNING",
      "category": "POWER_FACTOR",
      "furnaceId": "F2",
      "heatId": "H-105",
      "title": "Power Factor Below Target on Furnace F2",
      "message": "Power factor 0.94 is below the target threshold of 0.95. Apparent load is 657 kVA.",
      "observedValue": "0.94",
      "thresholdValue": "0.95 PF",
      "explainableAction": "Inspect the furnace capacitor bank and automatic power factor correction (APFC) steps. Low PF incurs DISCOM surcharge penalties and unnecessarily consumes transformer kVA capacity.",
      "timestamp": "2026-10-04T09:46:29.328Z",
      "acknowledged": false,
      "resolved": false,
      "createdAt": "2026-10-04T06:55:39.667Z",
      "updatedAt": "2026-10-04T09:46:29.328Z"
    },
    {
      "_id": "metallo_h44ma4vjomutgvfkk",
      "alertId": "ALT-1003",
      "type": "CRITICAL",
      "category": "DEMAND",
      "furnaceId": null,
      "heatId": null,
      "title": "Demand Spike Approaching Contract Sanction",
      "message": "Current plant active demand is 1240 kW, surpassing warning threshold of 1050 kW.",
      "observedValue": "1240 kW (1332.8 kVA)",
      "thresholdValue": "1,100 kW",
      "explainableAction": "Stagger melt start times by at least 45 minutes to prevent simultaneous full-power heating cycles. Utilize the METALLO Schedule Optimizer to automate this.",
      "timestamp": "2026-10-04T09:46:22.921Z",
      "acknowledged": true,
      "resolved": false,
      "createdAt": "2026-10-04T06:55:39.668Z",
      "updatedAt": "2026-10-04T09:46:22.921Z"
    }
  ],
  "recentHeats": [
    {
      "_id": "metallo_5tzqpbdmtmutgvfka",
      "heatId": "H-101",
      "furnaceId": "F1",
      "productionTonnes": 1,
      "grade": "Grey Iron FG260",
      "status": "COMPLETED",
      "meltStartTime": "2026-10-04T01:00:00.000Z",
      "meltEndTime": "2026-10-04T02:00:00.000Z",
      "plannedPourTime": "2026-10-04T02:15:00.000Z",
      "actualPourTime": "2026-10-04T02:15:00.000Z",
      "meltingDurationMinutes": 60,
      "holdingDurationMinutes": 15,
      "meltingEnergyKwh": 585,
      "holdingEnergyKwh": 25,
      "totalEnergyKwh": 610,
      "secKwhPerTonne": 610,
      "averagePf": 0.95,
      "excessHoldingMinutes": 0,
      "excessHoldingEnergyKwh": 0,
      "excessHoldingCost": 0,
      "hasHoldingWarning": false,
      "hasSecWarning": false,
      "notes": "Clean morning melt, standard operation",
      "tariffBreakdown": {
        "peakKwh": 725,
        "normalKwh": 0,
        "offPeakKwh": 0,
        "peakCost": 6525,
        "normalCost": 0,
        "offPeakCost": 0,
        "totalCost": 6525
      },
      "createdAt": "2026-10-04T06:55:39.658Z",
      "updatedAt": "2026-10-04T06:55:39.658Z"
    },
    {
      "_id": "metallo_02ie1ameemutgvfkb",
      "heatId": "H-102",
      "furnaceId": "F2",
      "productionTonnes": 1,
      "grade": "Grey Iron FG260",
      "status": "COMPLETED",
      "meltStartTime": "2026-10-04T02:30:00.000Z",
      "meltEndTime": "2026-10-04T03:30:00.000Z",
      "plannedPourTime": "2026-10-04T03:45:00.000Z",
      "actualPourTime": "2026-10-04T04:18:00.000Z",
      "meltingDurationMinutes": 60,
      "holdingDurationMinutes": 48,
      "meltingEnergyKwh": 590,
      "holdingEnergyKwh": 80,
      "totalEnergyKwh": 670,
      "secKwhPerTonne": 670,
      "averagePf": 0.93,
      "excessHoldingMinutes": 18,
      "excessHoldingEnergyKwh": 30,
      "excessHoldingCost": 270,
      "hasHoldingWarning": true,
      "hasSecWarning": true,
      "notes": "Moulding line crane breakdown forced 48 min holding. Elevated SEC to 670 kWh/t.",
      "tariffBreakdown": {
        "peakKwh": 1044,
        "normalKwh": 0,
        "offPeakKwh": 0,
        "peakCost": 9396,
        "normalCost": 0,
        "offPeakCost": 0,
        "totalCost": 9396
      },
      "createdAt": "2026-10-04T06:55:39.659Z",
      "updatedAt": "2026-10-04T06:55:39.659Z"
    },
    {
      "_id": "metallo_yekvfuugpmutgvfkb",
      "heatId": "H-103",
      "furnaceId": "F1",
      "productionTonnes": 1,
      "grade": "Grey Iron FG200",
      "status": "COMPLETED",
      "meltStartTime": "2026-10-04T04:45:00.000Z",
      "meltEndTime": "2026-10-04T05:45:00.000Z",
      "plannedPourTime": "2026-10-04T06:00:00.000Z",
      "actualPourTime": "2026-10-04T05:57:00.000Z",
      "meltingDurationMinutes": 60,
      "holdingDurationMinutes": 12,
      "meltingEnergyKwh": 578,
      "holdingEnergyKwh": 20,
      "totalEnergyKwh": 598,
      "secKwhPerTonne": 598,
      "averagePf": 0.96,
      "excessHoldingMinutes": 0,
      "excessHoldingEnergyKwh": 0,
      "excessHoldingCost": 0,
      "hasHoldingWarning": false,
      "hasSecWarning": false,
      "notes": "Optimal tap-to-tap timing post-peak window",
      "tariffBreakdown": {
        "peakKwh": 0,
        "normalKwh": 696,
        "offPeakKwh": 0,
        "peakCost": 0,
        "normalCost": 5220,
        "offPeakCost": 0,
        "totalCost": 5220
      },
      "createdAt": "2026-10-04T06:55:39.659Z",
      "updatedAt": "2026-10-04T06:55:39.659Z"
    },
    {
      "_id": "metallo_rnbcinnflmutgvfkc",
      "heatId": "H-104",
      "furnaceId": "F1",
      "productionTonnes": 1,
      "grade": "Grey Iron FG260",
      "status": "MELTING",
      "meltStartTime": "2026-10-04T06:15:00.000Z",
      "meltEndTime": null,
      "plannedPourTime": "2026-10-04T07:30:00.000Z",
      "actualPourTime": null,
      "meltingDurationMinutes": 60,
      "holdingDurationMinutes": 0,
      "meltingEnergyKwh": 380,
      "holdingEnergyKwh": 0,
      "totalEnergyKwh": 380,
      "secKwhPerTonne": 380,
      "averagePf": 0.95,
      "excessHoldingMinutes": 0,
      "excessHoldingEnergyKwh": 0,
      "excessHoldingCost": 0,
      "hasHoldingWarning": false,
      "hasSecWarning": false,
      "notes": "Active melt in progress (current power: 582 kW, temp: 1420°C)",
      "tariffBreakdown": {
        "peakKwh": 0,
        "normalKwh": 580,
        "offPeakKwh": 0,
        "peakCost": 0,
        "normalCost": 4350,
        "offPeakCost": 0,
        "totalCost": 4350
      },
      "createdAt": "2026-10-04T06:55:39.660Z",
      "updatedAt": "2026-10-04T06:55:39.660Z"
    },
    {
      "_id": "metallo_8qq292jnbmutgvfkc",
      "heatId": "H-105",
      "furnaceId": "F2",
      "productionTonnes": 1,
      "grade": "Grey Iron FG260",
      "status": "HOLDING",
      "meltStartTime": "2026-10-04T05:30:00.000Z",
      "meltEndTime": "2026-10-04T06:30:00.000Z",
      "plannedPourTime": "2026-10-04T06:45:00.000Z",
      "actualPourTime": null,
      "meltingDurationMinutes": 60,
      "holdingDurationMinutes": 47,
      "meltingEnergyKwh": 595,
      "holdingEnergyKwh": 78.3,
      "totalEnergyKwh": 673.3,
      "secKwhPerTonne": 673.3,
      "averagePf": 0.88,
      "excessHoldingMinutes": 17,
      "excessHoldingEnergyKwh": 28.33,
      "excessHoldingCost": 212.47,
      "hasHoldingWarning": true,
      "hasSecWarning": true,
      "notes": "Actively holding past recommended 30 min threshold. High avoidable energy cost.",
      "tariffBreakdown": {
        "peakKwh": 0,
        "normalKwh": 1034.3,
        "offPeakKwh": 0,
        "peakCost": 0,
        "normalCost": 7757.5,
        "offPeakCost": 0,
        "totalCost": 7757.5
      },
      "createdAt": "2026-10-04T06:55:39.660Z",
      "updatedAt": "2026-10-04T06:55:39.661Z"
    }
  ],
  "demandTrend": [
    {
      "time": "01:00 pm",
      "powerKw": 582,
      "furnaceId": "F1",
      "state": "MELTING"
    },
    {
      "time": "01:00 pm",
      "powerKw": 102,
      "furnaceId": "F2",
      "state": "HOLDING"
    },
    {
      "time": "12:38 pm",
      "powerKw": 588,
      "furnaceId": "F1",
      "state": "MELTING"
    },
    {
      "time": "12:38 pm",
      "powerKw": 15,
      "furnaceId": "F2",
      "state": "IDLE"
    },
    {
      "time": "01:07 pm",
      "powerKw": 588,
      "furnaceId": "F1",
      "state": "MELTING"
    },
    {
      "time": "01:07 pm",
      "powerKw": 15,
      "furnaceId": "F2",
      "state": "IDLE"
    },
    {
      "time": "01:09 pm",
      "powerKw": 602,
      "furnaceId": "F1",
      "state": "MELTING"
    },
    {
      "time": "01:09 pm",
      "powerKw": 18,
      "furnaceId": "F2",
      "state": "IDLE"
    },
    {
      "time": "01:09 pm",
      "powerKw": 615,
      "furnaceId": "F1",
      "state": "MELTING"
    },
    {
      "time": "01:09 pm",
      "powerKw": 575,
      "furnaceId": "F2",
      "state": "MELTING"
    },
    {
      "time": "03:16 pm",
      "powerKw": 588,
      "furnaceId": "F1",
      "state": "MELTING"
    },
    {
      "time": "03:16 pm",
      "powerKw": 15,
      "furnaceId": "F2",
      "state": "IDLE"
    },
    {
      "time": "03:16 pm",
      "powerKw": 602,
      "furnaceId": "F1",
      "state": "MELTING"
    },
    {
      "time": "03:16 pm",
      "powerKw": 18,
      "furnaceId": "F2",
      "state": "IDLE"
    },
    {
      "time": "03:16 pm",
      "powerKw": 615,
      "furnaceId": "F1",
      "state": "MELTING"
    },
    {
      "time": "03:16 pm",
      "powerKw": 575,
      "furnaceId": "F2",
      "state": "MELTING"
    },
    {
      "time": "03:16 pm",
      "powerKw": 610,
      "furnaceId": "F1",
      "state": "MELTING"
    },
    {
      "time": "03:16 pm",
      "powerKw": 585,
      "furnaceId": "F2",
      "state": "MELTING"
    },
    {
      "time": "03:16 pm",
      "powerKw": 102,
      "furnaceId": "F1",
      "state": "HOLDING"
    },
    {
      "time": "03:16 pm",
      "powerKw": 590,
      "furnaceId": "F2",
      "state": "MELTING"
    },
    {
      "time": "03:16 pm",
      "powerKw": 98,
      "furnaceId": "F1",
      "state": "HOLDING"
    },
    {
      "time": "03:16 pm",
      "powerKw": 605,
      "furnaceId": "F2",
      "state": "MELTING"
    },
    {
      "time": "03:16 pm",
      "powerKw": 104,
      "furnaceId": "F1",
      "state": "HOLDING"
    },
    {
      "time": "03:16 pm",
      "powerKw": 618,
      "furnaceId": "F2",
      "state": "MELTING"
    }
  ]
};

export const mockFurnacesData = {
  "success": true,
  "furnaces": [
    {
      "_id": "metallo_2x9bpj1vpmutgvfk8",
      "furnaceId": "F1",
      "name": "Furnace F1 — Medium Frequency Induction",
      "type": "Induction furnace",
      "capacityTonnes": 1,
      "meltingPowerKw": 600,
      "holdingPowerKw": 100,
      "idlePowerKw": 15,
      "status": "MELTING",
      "currentPowerKw": 582,
      "temperatureC": 1420,
      "currentPf": 0.95,
      "currentKva": 613,
      "currentHeatId": "H-104",
      "todayEnergyKwh": 1501.2,
      "todayProductionTonnes": 2,
      "currentHoldingMinutes": 8,
      "baselineSecKwhPerTonne": 580,
      "normalMeltingMinKw": 550,
      "normalMeltingMaxKw": 630,
      "insulationCondition": "GOOD",
      "createdAt": "2026-10-04T06:55:39.656Z",
      "updatedAt": "2026-10-04T09:46:31.179Z",
      "calculatedSec": 750.6,
      "currentHeat": {
        "_id": "metallo_rnbcinnflmutgvfkc",
        "heatId": "H-104",
        "furnaceId": "F1",
        "productionTonnes": 1,
        "grade": "Grey Iron FG260",
        "status": "MELTING",
        "meltStartTime": "2026-10-04T06:15:00.000Z",
        "meltEndTime": null,
        "plannedPourTime": "2026-10-04T07:30:00.000Z",
        "actualPourTime": null,
        "meltingDurationMinutes": 60,
        "holdingDurationMinutes": 0,
        "meltingEnergyKwh": 380,
        "holdingEnergyKwh": 0,
        "totalEnergyKwh": 380,
        "secKwhPerTonne": 380,
        "averagePf": 0.95,
        "excessHoldingMinutes": 0,
        "excessHoldingEnergyKwh": 0,
        "excessHoldingCost": 0,
        "hasHoldingWarning": false,
        "hasSecWarning": false,
        "notes": "Active melt in progress (current power: 582 kW, temp: 1420°C)",
        "tariffBreakdown": {
          "peakKwh": 0,
          "normalKwh": 580,
          "offPeakKwh": 0,
          "peakCost": 0,
          "normalCost": 4350,
          "offPeakCost": 0,
          "totalCost": 4350
        },
        "createdAt": "2026-10-04T06:55:39.660Z",
        "updatedAt": "2026-10-04T06:55:39.660Z"
      },
      "activeAlertsCount": 2,
      "anomalies": []
    },
    {
      "_id": "metallo_zm6bmo3wqmutgvfk9",
      "furnaceId": "F2",
      "name": "Furnace F2 — Medium Frequency Induction",
      "type": "Induction furnace",
      "capacityTonnes": 1,
      "meltingPowerKw": 600,
      "holdingPowerKw": 100,
      "idlePowerKw": 15,
      "status": "IDLE",
      "currentPowerKw": 15,
      "temperatureC": 450,
      "currentPf": 0.98,
      "currentKva": 15.3,
      "currentHeatId": null,
      "todayEnergyKwh": 1571.9,
      "todayProductionTonnes": 2,
      "currentHoldingMinutes": 0,
      "baselineSecKwhPerTonne": 580,
      "normalMeltingMinKw": 550,
      "normalMeltingMaxKw": 630,
      "insulationCondition": "INSPECT_SOON",
      "createdAt": "2026-10-04T06:55:39.657Z",
      "updatedAt": "2026-10-04T09:46:31.181Z",
      "calculatedSec": 786,
      "currentHeat": null,
      "activeAlertsCount": 2,
      "anomalies": [
        {
          "type": "WARNING",
          "category": "POWER_FACTOR",
          "furnaceId": "F2",
          "title": "Sub-Optimal Power Factor (0.88) on F2",
          "message": "Power factor 0.88 is below the target threshold of 0.95. Apparent load is 116 kVA.",
          "observedValue": "0.88",
          "thresholdValue": "0.95",
          "explainableAction": "Inspect harmonic filter banks and tuning capacitors."
        }
      ]
    }
  ]
};

export const mockFurnaceF1Data = {
  "success": true,
  "furnace": {
    "_id": "metallo_2x9bpj1vpmutgvfk8",
    "furnaceId": "F1",
    "name": "Furnace F1 — Medium Frequency Induction",
    "type": "Induction furnace",
    "capacityTonnes": 1,
    "meltingPowerKw": 600,
    "holdingPowerKw": 100,
    "idlePowerKw": 15,
    "status": "MELTING",
    "currentPowerKw": 582,
    "temperatureC": 1420,
    "currentPf": 0.95,
    "currentKva": 613,
    "currentHeatId": "H-104",
    "todayEnergyKwh": 1501.2,
    "todayProductionTonnes": 2,
    "currentHoldingMinutes": 8,
    "baselineSecKwhPerTonne": 580,
    "normalMeltingMinKw": 550,
    "normalMeltingMaxKw": 630,
    "insulationCondition": "GOOD",
    "createdAt": "2026-10-04T06:55:39.656Z",
    "updatedAt": "2026-10-04T09:46:31.179Z",
    "calculatedSec": 750.6,
    "currentHeat": {
      "_id": "metallo_rnbcinnflmutgvfkc",
      "heatId": "H-104",
      "furnaceId": "F1",
      "productionTonnes": 1,
      "grade": "Grey Iron FG260",
      "status": "MELTING",
      "meltStartTime": "2026-10-04T06:15:00.000Z",
      "meltEndTime": null,
      "plannedPourTime": "2026-10-04T07:30:00.000Z",
      "actualPourTime": null,
      "meltingDurationMinutes": 60,
      "holdingDurationMinutes": 0,
      "meltingEnergyKwh": 380,
      "holdingEnergyKwh": 0,
      "totalEnergyKwh": 380,
      "secKwhPerTonne": 380,
      "averagePf": 0.95,
      "excessHoldingMinutes": 0,
      "excessHoldingEnergyKwh": 0,
      "excessHoldingCost": 0,
      "hasHoldingWarning": false,
      "hasSecWarning": false,
      "notes": "Active melt in progress (current power: 582 kW, temp: 1420°C)",
      "tariffBreakdown": {
        "peakKwh": 0,
        "normalKwh": 580,
        "offPeakKwh": 0,
        "peakCost": 0,
        "normalCost": 4350,
        "offPeakCost": 0,
        "totalCost": 4350
      },
      "createdAt": "2026-10-04T06:55:39.660Z",
      "updatedAt": "2026-10-04T06:55:39.660Z"
    },
    "trends": [
      {
        "time": "08:30 am",
        "powerKw": 15,
        "temperatureC": 500,
        "powerFactor": 0.96,
        "apparentPowerKva": 15.6,
        "state": "IDLE"
      },
      {
        "time": "08:45 am",
        "powerKw": 15,
        "temperatureC": 500,
        "powerFactor": 0.96,
        "apparentPowerKva": 15.6,
        "state": "IDLE"
      },
      {
        "time": "09:00 am",
        "powerKw": 15,
        "temperatureC": 500,
        "powerFactor": 0.96,
        "apparentPowerKva": 15.6,
        "state": "IDLE"
      },
      {
        "time": "09:15 am",
        "powerKw": 15,
        "temperatureC": 500,
        "powerFactor": 0.96,
        "apparentPowerKva": 15.6,
        "state": "IDLE"
      },
      {
        "time": "09:30 am",
        "powerKw": 15,
        "temperatureC": 500,
        "powerFactor": 0.96,
        "apparentPowerKva": 15.6,
        "state": "IDLE"
      },
      {
        "time": "09:45 am",
        "powerKw": 15,
        "temperatureC": 500,
        "powerFactor": 0.96,
        "apparentPowerKva": 15.6,
        "state": "IDLE"
      },
      {
        "time": "10:00 am",
        "powerKw": 15,
        "temperatureC": 500,
        "powerFactor": 0.96,
        "apparentPowerKva": 15.6,
        "state": "IDLE"
      },
      {
        "time": "10:15 am",
        "powerKw": 585,
        "temperatureC": 1440,
        "powerFactor": 0.96,
        "apparentPowerKva": 609.4,
        "state": "MELTING"
      },
      {
        "time": "10:30 am",
        "powerKw": 585,
        "temperatureC": 1440,
        "powerFactor": 0.96,
        "apparentPowerKva": 609.4,
        "state": "MELTING"
      },
      {
        "time": "10:45 am",
        "powerKw": 585,
        "temperatureC": 1440,
        "powerFactor": 0.96,
        "apparentPowerKva": 609.4,
        "state": "MELTING"
      },
      {
        "time": "11:00 am",
        "powerKw": 585,
        "temperatureC": 1440,
        "powerFactor": 0.96,
        "apparentPowerKva": 609.4,
        "state": "MELTING"
      },
      {
        "time": "11:15 am",
        "powerKw": 15,
        "temperatureC": 500,
        "powerFactor": 0.96,
        "apparentPowerKva": 15.6,
        "state": "IDLE"
      },
      {
        "time": "11:30 am",
        "powerKw": 15,
        "temperatureC": 500,
        "powerFactor": 0.96,
        "apparentPowerKva": 15.6,
        "state": "IDLE"
      },
      {
        "time": "11:45 am",
        "powerKw": 582,
        "temperatureC": 1420,
        "powerFactor": 0.95,
        "apparentPowerKva": 612.6,
        "state": "MELTING"
      },
      {
        "time": "12:00 pm",
        "powerKw": 582,
        "temperatureC": 1420,
        "powerFactor": 0.95,
        "apparentPowerKva": 612.6,
        "state": "MELTING"
      },
      {
        "time": "12:15 pm",
        "powerKw": 582,
        "temperatureC": 1420,
        "powerFactor": 0.95,
        "apparentPowerKva": 612.6,
        "state": "MELTING"
      },
      {
        "time": "12:30 pm",
        "powerKw": 582,
        "temperatureC": 1420,
        "powerFactor": 0.95,
        "apparentPowerKva": 612.6,
        "state": "MELTING"
      },
      {
        "time": "12:45 pm",
        "powerKw": 582,
        "temperatureC": 1420,
        "powerFactor": 0.95,
        "apparentPowerKva": 612.6,
        "state": "MELTING"
      },
      {
        "time": "01:00 pm",
        "powerKw": 582,
        "temperatureC": 1420,
        "powerFactor": 0.95,
        "apparentPowerKva": 612.6,
        "state": "MELTING"
      },
      {
        "time": "12:38 pm",
        "powerKw": 588,
        "temperatureC": 1380,
        "powerFactor": 0.95,
        "apparentPowerKva": 618.9,
        "state": "MELTING"
      },
      {
        "time": "01:07 pm",
        "powerKw": 588,
        "temperatureC": 1380,
        "powerFactor": 0.95,
        "apparentPowerKva": 618.9,
        "state": "MELTING"
      },
      {
        "time": "01:09 pm",
        "powerKw": 602,
        "temperatureC": 1440,
        "powerFactor": 0.94,
        "apparentPowerKva": 640.4,
        "state": "MELTING"
      },
      {
        "time": "01:09 pm",
        "powerKw": 615,
        "temperatureC": 1495,
        "powerFactor": 0.94,
        "apparentPowerKva": 654.3,
        "state": "MELTING"
      },
      {
        "time": "03:16 pm",
        "powerKw": 588,
        "temperatureC": 1380,
        "powerFactor": 0.95,
        "apparentPowerKva": 618.9,
        "state": "MELTING"
      },
      {
        "time": "03:16 pm",
        "powerKw": 602,
        "temperatureC": 1440,
        "powerFactor": 0.94,
        "apparentPowerKva": 640.4,
        "state": "MELTING"
      },
      {
        "time": "03:16 pm",
        "powerKw": 615,
        "temperatureC": 1495,
        "powerFactor": 0.94,
        "apparentPowerKva": 654.3,
        "state": "MELTING"
      },
      {
        "time": "03:16 pm",
        "powerKw": 610,
        "temperatureC": 1520,
        "powerFactor": 0.94,
        "apparentPowerKva": 648.9,
        "state": "MELTING"
      },
      {
        "time": "03:16 pm",
        "powerKw": 102,
        "temperatureC": 1515,
        "powerFactor": 0.95,
        "apparentPowerKva": 107.4,
        "state": "HOLDING"
      },
      {
        "time": "03:16 pm",
        "powerKw": 98,
        "temperatureC": 1510,
        "powerFactor": 0.95,
        "apparentPowerKva": 103.2,
        "state": "HOLDING"
      },
      {
        "time": "03:16 pm",
        "powerKw": 104,
        "temperatureC": 1505,
        "powerFactor": 0.95,
        "apparentPowerKva": 109.5,
        "state": "HOLDING"
      }
    ],
    "associatedHeats": [
      {
        "_id": "metallo_5tzqpbdmtmutgvfka",
        "heatId": "H-101",
        "furnaceId": "F1",
        "productionTonnes": 1,
        "grade": "Grey Iron FG260",
        "status": "COMPLETED",
        "meltStartTime": "2026-10-04T01:00:00.000Z",
        "meltEndTime": "2026-10-04T02:00:00.000Z",
        "plannedPourTime": "2026-10-04T02:15:00.000Z",
        "actualPourTime": "2026-10-04T02:15:00.000Z",
        "meltingDurationMinutes": 60,
        "holdingDurationMinutes": 15,
        "meltingEnergyKwh": 585,
        "holdingEnergyKwh": 25,
        "totalEnergyKwh": 610,
        "secKwhPerTonne": 610,
        "averagePf": 0.95,
        "excessHoldingMinutes": 0,
        "excessHoldingEnergyKwh": 0,
        "excessHoldingCost": 0,
        "hasHoldingWarning": false,
        "hasSecWarning": false,
        "notes": "Clean morning melt, standard operation",
        "tariffBreakdown": {
          "peakKwh": 725,
          "normalKwh": 0,
          "offPeakKwh": 0,
          "peakCost": 6525,
          "normalCost": 0,
          "offPeakCost": 0,
          "totalCost": 6525
        },
        "createdAt": "2026-10-04T06:55:39.658Z",
        "updatedAt": "2026-10-04T06:55:39.658Z"
      },
      {
        "_id": "metallo_yekvfuugpmutgvfkb",
        "heatId": "H-103",
        "furnaceId": "F1",
        "productionTonnes": 1,
        "grade": "Grey Iron FG200",
        "status": "COMPLETED",
        "meltStartTime": "2026-10-04T04:45:00.000Z",
        "meltEndTime": "2026-10-04T05:45:00.000Z",
        "plannedPourTime": "2026-10-04T06:00:00.000Z",
        "actualPourTime": "2026-10-04T05:57:00.000Z",
        "meltingDurationMinutes": 60,
        "holdingDurationMinutes": 12,
        "meltingEnergyKwh": 578,
        "holdingEnergyKwh": 20,
        "totalEnergyKwh": 598,
        "secKwhPerTonne": 598,
        "averagePf": 0.96,
        "excessHoldingMinutes": 0,
        "excessHoldingEnergyKwh": 0,
        "excessHoldingCost": 0,
        "hasHoldingWarning": false,
        "hasSecWarning": false,
        "notes": "Optimal tap-to-tap timing post-peak window",
        "tariffBreakdown": {
          "peakKwh": 0,
          "normalKwh": 696,
          "offPeakKwh": 0,
          "peakCost": 0,
          "normalCost": 5220,
          "offPeakCost": 0,
          "totalCost": 5220
        },
        "createdAt": "2026-10-04T06:55:39.659Z",
        "updatedAt": "2026-10-04T06:55:39.659Z"
      },
      {
        "_id": "metallo_rnbcinnflmutgvfkc",
        "heatId": "H-104",
        "furnaceId": "F1",
        "productionTonnes": 1,
        "grade": "Grey Iron FG260",
        "status": "MELTING",
        "meltStartTime": "2026-10-04T06:15:00.000Z",
        "meltEndTime": null,
        "plannedPourTime": "2026-10-04T07:30:00.000Z",
        "actualPourTime": null,
        "meltingDurationMinutes": 60,
        "holdingDurationMinutes": 0,
        "meltingEnergyKwh": 380,
        "holdingEnergyKwh": 0,
        "totalEnergyKwh": 380,
        "secKwhPerTonne": 380,
        "averagePf": 0.95,
        "excessHoldingMinutes": 0,
        "excessHoldingEnergyKwh": 0,
        "excessHoldingCost": 0,
        "hasHoldingWarning": false,
        "hasSecWarning": false,
        "notes": "Active melt in progress (current power: 582 kW, temp: 1420°C)",
        "tariffBreakdown": {
          "peakKwh": 0,
          "normalKwh": 580,
          "offPeakKwh": 0,
          "peakCost": 0,
          "normalCost": 4350,
          "offPeakCost": 0,
          "totalCost": 4350
        },
        "createdAt": "2026-10-04T06:55:39.660Z",
        "updatedAt": "2026-10-04T06:55:39.660Z"
      },
      {
        "_id": "metallo_37atbm3w9mutgvfkd",
        "heatId": "H-106",
        "furnaceId": "F1",
        "productionTonnes": 1,
        "grade": "Grey Iron FG260",
        "status": "PLANNED",
        "meltStartTime": "2026-10-04T08:00:00.000Z",
        "meltEndTime": "2026-10-04T09:00:00.000Z",
        "plannedPourTime": "2026-10-04T09:15:00.000Z",
        "actualPourTime": null,
        "meltingDurationMinutes": 60,
        "holdingDurationMinutes": 15,
        "meltingEnergyKwh": 580,
        "holdingEnergyKwh": 25,
        "totalEnergyKwh": 605,
        "secKwhPerTonne": 605,
        "averagePf": 0.95,
        "excessHoldingMinutes": 0,
        "excessHoldingEnergyKwh": 0,
        "excessHoldingCost": 0,
        "hasHoldingWarning": false,
        "hasSecWarning": false,
        "notes": "Scheduled afternoon heat",
        "tariffBreakdown": {
          "peakKwh": 0,
          "normalKwh": 725,
          "offPeakKwh": 0,
          "peakCost": 0,
          "normalCost": 5437.5,
          "offPeakCost": 0,
          "totalCost": 5437.5
        },
        "createdAt": "2026-10-04T06:55:39.661Z",
        "updatedAt": "2026-10-04T06:55:39.661Z"
      },
      {
        "_id": "metallo_3yc4bgchvmutgyoyk",
        "heatId": "H-TEST-1",
        "furnaceId": "F1",
        "productionTonnes": 1,
        "grade": "Grey Iron",
        "status": "COMPLETED",
        "meltingDurationMinutes": 60,
        "holdingDurationMinutes": 10,
        "meltingEnergyKwh": 578.3,
        "holdingEnergyKwh": 16.7,
        "totalEnergyKwh": 595,
        "secKwhPerTonne": 595,
        "averagePf": 0.95,
        "tariffBreakdown": {
          "normalKwh": 595,
          "normalCost": 4462.5,
          "totalCost": 4462.5
        },
        "excessHoldingMinutes": 0,
        "excessHoldingEnergyKwh": 0,
        "excessHoldingCost": 0,
        "hasHoldingWarning": false,
        "hasSecWarning": false,
        "notes": "Imported via CSV Data Upload",
        "createdAt": "2026-10-04T06:58:11.804Z",
        "updatedAt": "2026-10-04T06:58:11.804Z"
      },
      {
        "_id": "metallo_8e0dpmg3hmuthfab9",
        "heatId": "H-120",
        "furnaceId": "F1",
        "productionTonnes": 1,
        "grade": "Grey Iron FG260",
        "status": "COMPLETED",
        "meltingDurationMinutes": 60,
        "holdingDurationMinutes": 10,
        "meltingEnergyKwh": 583.3,
        "holdingEnergyKwh": 16.7,
        "totalEnergyKwh": 600,
        "secKwhPerTonne": 600,
        "averagePf": 0.96,
        "tariffBreakdown": {
          "normalKwh": 600,
          "normalCost": 4500,
          "totalCost": 4500
        },
        "excessHoldingMinutes": 0,
        "excessHoldingEnergyKwh": 0,
        "excessHoldingCost": 0,
        "hasHoldingWarning": false,
        "hasSecWarning": false,
        "notes": "Imported via CSV Data Upload",
        "createdAt": "2026-10-04T07:11:05.973Z",
        "updatedAt": "2026-10-04T07:11:05.973Z"
      }
    ],
    "activeAlerts": [
      {
        "_id": "metallo_ij68e7ujnmutig5in",
        "alertId": "ALT-MUTIG5IN2Q9P",
        "type": "WARNING",
        "category": "POWER_FACTOR",
        "furnaceId": "F1",
        "title": "Sub-Optimal Power Factor (0.94) on F1",
        "message": "Power factor 0.94 is below the target threshold of 0.95. Apparent load is 649 kVA.",
        "observedValue": "0.94",
        "thresholdValue": "0.95",
        "explainableAction": "Inspect harmonic filter banks and tuning capacitors. Poor PF increases reactive kVA demand and triggers utility surcharge penalties under HT billing schedules.",
        "timestamp": "2026-10-04T09:46:22.914Z",
        "acknowledged": false,
        "resolved": false,
        "createdAt": "2026-10-04T07:39:46.031Z",
        "updatedAt": "2026-10-04T09:46:22.915Z"
      },
      {
        "_id": "metallo_pe2zmkpv3mutmz3gd",
        "alertId": "ALT-MUTMZ3GCRM4F",
        "type": "WARNING",
        "category": "HOLDING",
        "furnaceId": "F1",
        "heatId": "H-104",
        "title": "Excessive Holding Duration on F1",
        "message": "Holding duration has reached 45 min (threshold: 30 min). Estimated avoidable holding energy: 25.0 kWh.",
        "observedValue": "45 min",
        "thresholdValue": "30 min",
        "explainableAction": "Expedite moulding line preparation or lower bath temperature to standby setpoint. Holding is pure thermal waste that contributes nothing to metallurgical transformation.",
        "timestamp": "2026-10-04T09:46:29.319Z",
        "acknowledged": false,
        "resolved": false,
        "createdAt": "2026-10-04T09:46:28.285Z",
        "updatedAt": "2026-10-04T09:46:29.319Z"
      }
    ],
    "anomalies": []
  }
};

export const mockFurnaceF2Data = {
  "success": true,
  "furnace": {
    "_id": "metallo_zm6bmo3wqmutgvfk9",
    "furnaceId": "F2",
    "name": "Furnace F2 — Medium Frequency Induction",
    "type": "Induction furnace",
    "capacityTonnes": 1,
    "meltingPowerKw": 600,
    "holdingPowerKw": 100,
    "idlePowerKw": 15,
    "status": "IDLE",
    "currentPowerKw": 15,
    "temperatureC": 450,
    "currentPf": 0.98,
    "currentKva": 15.3,
    "currentHeatId": null,
    "todayEnergyKwh": 1571.9,
    "todayProductionTonnes": 2,
    "currentHoldingMinutes": 0,
    "baselineSecKwhPerTonne": 580,
    "normalMeltingMinKw": 550,
    "normalMeltingMaxKw": 630,
    "insulationCondition": "INSPECT_SOON",
    "createdAt": "2026-10-04T06:55:39.657Z",
    "updatedAt": "2026-10-04T09:46:31.181Z",
    "calculatedSec": 786,
    "currentHeat": null,
    "trends": [
      {
        "time": "08:30 am",
        "powerKw": 595,
        "temperatureC": 1450,
        "powerFactor": 0.94,
        "apparentPowerKva": 633,
        "state": "MELTING"
      },
      {
        "time": "08:45 am",
        "powerKw": 595,
        "temperatureC": 1450,
        "powerFactor": 0.94,
        "apparentPowerKva": 633,
        "state": "MELTING"
      },
      {
        "time": "09:00 am",
        "powerKw": 105,
        "temperatureC": 1485,
        "powerFactor": 0.93,
        "apparentPowerKva": 112.9,
        "state": "HOLDING"
      },
      {
        "time": "09:15 am",
        "powerKw": 105,
        "temperatureC": 1485,
        "powerFactor": 0.93,
        "apparentPowerKva": 112.9,
        "state": "HOLDING"
      },
      {
        "time": "09:30 am",
        "powerKw": 105,
        "temperatureC": 1485,
        "powerFactor": 0.93,
        "apparentPowerKva": 112.9,
        "state": "HOLDING"
      },
      {
        "time": "09:45 am",
        "powerKw": 105,
        "temperatureC": 1485,
        "powerFactor": 0.93,
        "apparentPowerKva": 112.9,
        "state": "HOLDING"
      },
      {
        "time": "10:00 am",
        "powerKw": 15,
        "temperatureC": 420,
        "powerFactor": 0.97,
        "apparentPowerKva": 15.5,
        "state": "IDLE"
      },
      {
        "time": "10:15 am",
        "powerKw": 15,
        "temperatureC": 420,
        "powerFactor": 0.97,
        "apparentPowerKva": 15.5,
        "state": "IDLE"
      },
      {
        "time": "10:30 am",
        "powerKw": 15,
        "temperatureC": 420,
        "powerFactor": 0.97,
        "apparentPowerKva": 15.5,
        "state": "IDLE"
      },
      {
        "time": "10:45 am",
        "powerKw": 15,
        "temperatureC": 420,
        "powerFactor": 0.97,
        "apparentPowerKva": 15.5,
        "state": "IDLE"
      },
      {
        "time": "11:00 am",
        "powerKw": 588,
        "temperatureC": 1460,
        "powerFactor": 0.92,
        "apparentPowerKva": 639.1,
        "state": "MELTING"
      },
      {
        "time": "11:15 am",
        "powerKw": 588,
        "temperatureC": 1460,
        "powerFactor": 0.92,
        "apparentPowerKva": 639.1,
        "state": "MELTING"
      },
      {
        "time": "11:30 am",
        "powerKw": 588,
        "temperatureC": 1460,
        "powerFactor": 0.92,
        "apparentPowerKva": 639.1,
        "state": "MELTING"
      },
      {
        "time": "11:45 am",
        "powerKw": 588,
        "temperatureC": 1460,
        "powerFactor": 0.92,
        "apparentPowerKva": 639.1,
        "state": "MELTING"
      },
      {
        "time": "12:00 pm",
        "powerKw": 102,
        "temperatureC": 1490,
        "powerFactor": 0.88,
        "apparentPowerKva": 115.9,
        "state": "HOLDING"
      },
      {
        "time": "12:15 pm",
        "powerKw": 102,
        "temperatureC": 1490,
        "powerFactor": 0.88,
        "apparentPowerKva": 115.9,
        "state": "HOLDING"
      },
      {
        "time": "12:30 pm",
        "powerKw": 102,
        "temperatureC": 1490,
        "powerFactor": 0.88,
        "apparentPowerKva": 115.9,
        "state": "HOLDING"
      },
      {
        "time": "12:45 pm",
        "powerKw": 102,
        "temperatureC": 1490,
        "powerFactor": 0.88,
        "apparentPowerKva": 115.9,
        "state": "HOLDING"
      },
      {
        "time": "01:00 pm",
        "powerKw": 102,
        "temperatureC": 1490,
        "powerFactor": 0.88,
        "apparentPowerKva": 115.9,
        "state": "HOLDING"
      },
      {
        "time": "12:38 pm",
        "powerKw": 15,
        "temperatureC": 450,
        "powerFactor": 0.98,
        "apparentPowerKva": 15.3,
        "state": "IDLE"
      },
      {
        "time": "01:07 pm",
        "powerKw": 15,
        "temperatureC": 450,
        "powerFactor": 0.98,
        "apparentPowerKva": 15.3,
        "state": "IDLE"
      },
      {
        "time": "01:09 pm",
        "powerKw": 18,
        "temperatureC": 460,
        "powerFactor": 0.97,
        "apparentPowerKva": 18.6,
        "state": "IDLE"
      },
      {
        "time": "01:09 pm",
        "powerKw": 575,
        "temperatureC": 1100,
        "powerFactor": 0.93,
        "apparentPowerKva": 618.3,
        "state": "MELTING"
      },
      {
        "time": "03:16 pm",
        "powerKw": 15,
        "temperatureC": 450,
        "powerFactor": 0.98,
        "apparentPowerKva": 15.3,
        "state": "IDLE"
      },
      {
        "time": "03:16 pm",
        "powerKw": 18,
        "temperatureC": 460,
        "powerFactor": 0.97,
        "apparentPowerKva": 18.6,
        "state": "IDLE"
      },
      {
        "time": "03:16 pm",
        "powerKw": 575,
        "temperatureC": 1100,
        "powerFactor": 0.93,
        "apparentPowerKva": 618.3,
        "state": "MELTING"
      },
      {
        "time": "03:16 pm",
        "powerKw": 585,
        "temperatureC": 1220,
        "powerFactor": 0.92,
        "apparentPowerKva": 635.9,
        "state": "MELTING"
      },
      {
        "time": "03:16 pm",
        "powerKw": 590,
        "temperatureC": 1340,
        "powerFactor": 0.88,
        "apparentPowerKva": 670.5,
        "state": "MELTING"
      },
      {
        "time": "03:16 pm",
        "powerKw": 605,
        "temperatureC": 1420,
        "powerFactor": 0.89,
        "apparentPowerKva": 679.8,
        "state": "MELTING"
      },
      {
        "time": "03:16 pm",
        "powerKw": 618,
        "temperatureC": 1490,
        "powerFactor": 0.94,
        "apparentPowerKva": 657.4,
        "state": "MELTING"
      }
    ],
    "associatedHeats": [
      {
        "_id": "metallo_02ie1ameemutgvfkb",
        "heatId": "H-102",
        "furnaceId": "F2",
        "productionTonnes": 1,
        "grade": "Grey Iron FG260",
        "status": "COMPLETED",
        "meltStartTime": "2026-10-04T02:30:00.000Z",
        "meltEndTime": "2026-10-04T03:30:00.000Z",
        "plannedPourTime": "2026-10-04T03:45:00.000Z",
        "actualPourTime": "2026-10-04T04:18:00.000Z",
        "meltingDurationMinutes": 60,
        "holdingDurationMinutes": 48,
        "meltingEnergyKwh": 590,
        "holdingEnergyKwh": 80,
        "totalEnergyKwh": 670,
        "secKwhPerTonne": 670,
        "averagePf": 0.93,
        "excessHoldingMinutes": 18,
        "excessHoldingEnergyKwh": 30,
        "excessHoldingCost": 270,
        "hasHoldingWarning": true,
        "hasSecWarning": true,
        "notes": "Moulding line crane breakdown forced 48 min holding. Elevated SEC to 670 kWh/t.",
        "tariffBreakdown": {
          "peakKwh": 1044,
          "normalKwh": 0,
          "offPeakKwh": 0,
          "peakCost": 9396,
          "normalCost": 0,
          "offPeakCost": 0,
          "totalCost": 9396
        },
        "createdAt": "2026-10-04T06:55:39.659Z",
        "updatedAt": "2026-10-04T06:55:39.659Z"
      },
      {
        "_id": "metallo_8qq292jnbmutgvfkc",
        "heatId": "H-105",
        "furnaceId": "F2",
        "productionTonnes": 1,
        "grade": "Grey Iron FG260",
        "status": "HOLDING",
        "meltStartTime": "2026-10-04T05:30:00.000Z",
        "meltEndTime": "2026-10-04T06:30:00.000Z",
        "plannedPourTime": "2026-10-04T06:45:00.000Z",
        "actualPourTime": null,
        "meltingDurationMinutes": 60,
        "holdingDurationMinutes": 47,
        "meltingEnergyKwh": 595,
        "holdingEnergyKwh": 78.3,
        "totalEnergyKwh": 673.3,
        "secKwhPerTonne": 673.3,
        "averagePf": 0.88,
        "excessHoldingMinutes": 17,
        "excessHoldingEnergyKwh": 28.33,
        "excessHoldingCost": 212.47,
        "hasHoldingWarning": true,
        "hasSecWarning": true,
        "notes": "Actively holding past recommended 30 min threshold. High avoidable energy cost.",
        "tariffBreakdown": {
          "peakKwh": 0,
          "normalKwh": 1034.3,
          "offPeakKwh": 0,
          "peakCost": 0,
          "normalCost": 7757.5,
          "offPeakCost": 0,
          "totalCost": 7757.5
        },
        "createdAt": "2026-10-04T06:55:39.660Z",
        "updatedAt": "2026-10-04T06:55:39.661Z"
      },
      {
        "_id": "metallo_e8cvsecnjmutgvfke",
        "heatId": "H-107",
        "furnaceId": "F2",
        "productionTonnes": 1,
        "grade": "Grey Iron FG260",
        "status": "PLANNED",
        "meltStartTime": "2026-10-04T09:15:00.000Z",
        "meltEndTime": "2026-10-04T10:15:00.000Z",
        "plannedPourTime": "2026-10-04T10:30:00.000Z",
        "actualPourTime": null,
        "meltingDurationMinutes": 60,
        "holdingDurationMinutes": 15,
        "meltingEnergyKwh": 580,
        "holdingEnergyKwh": 25,
        "totalEnergyKwh": 605,
        "secKwhPerTonne": 605,
        "averagePf": 0.95,
        "excessHoldingMinutes": 0,
        "excessHoldingEnergyKwh": 0,
        "excessHoldingCost": 0,
        "hasHoldingWarning": false,
        "hasSecWarning": false,
        "notes": "Scheduled afternoon heat",
        "tariffBreakdown": {
          "peakKwh": 0,
          "normalKwh": 725,
          "offPeakKwh": 0,
          "peakCost": 0,
          "normalCost": 5437.5,
          "offPeakCost": 0,
          "totalCost": 5437.5
        },
        "createdAt": "2026-10-04T06:55:39.662Z",
        "updatedAt": "2026-10-04T06:55:39.662Z"
      },
      {
        "_id": "metallo_mb06jt239muthfaba",
        "heatId": "H-121",
        "furnaceId": "F2",
        "productionTonnes": 1,
        "grade": "Grey Iron FG260",
        "status": "COMPLETED",
        "meltingDurationMinutes": 58,
        "holdingDurationMinutes": 8,
        "meltingEnergyKwh": 576.7,
        "holdingEnergyKwh": 13.3,
        "totalEnergyKwh": 590,
        "secKwhPerTonne": 590,
        "averagePf": 0.95,
        "tariffBreakdown": {
          "normalKwh": 590,
          "normalCost": 4425,
          "totalCost": 4425
        },
        "excessHoldingMinutes": 0,
        "excessHoldingEnergyKwh": 0,
        "excessHoldingCost": 0,
        "hasHoldingWarning": false,
        "hasSecWarning": false,
        "notes": "Imported via CSV Data Upload",
        "createdAt": "2026-10-04T07:11:05.974Z",
        "updatedAt": "2026-10-04T07:11:05.974Z"
      }
    ],
    "activeAlerts": [
      {
        "_id": "metallo_1f3nae439mutgvfkj",
        "alertId": "ALT-1001",
        "type": "WARNING",
        "category": "HOLDING",
        "furnaceId": "F2",
        "heatId": "H-105",
        "title": "Excessive Holding Duration on Furnace F2",
        "message": "Heat H-105 has been holding for 47 minutes (threshold: 30 minutes). Avoidable holding energy: ~28.3 kWh.",
        "observedValue": "47 min",
        "thresholdValue": "30 min",
        "explainableAction": "Expedite mould preparation on Line 2 or lower bath power to standby setpoint. Excessive holding increases thermal radiation losses without metallurgical value.",
        "timestamp": "2026-10-04T07:15:00.000Z",
        "acknowledged": true,
        "resolved": false,
        "createdAt": "2026-10-04T06:55:39.667Z",
        "updatedAt": "2026-10-04T07:10:23.117Z"
      },
      {
        "_id": "metallo_6275329owmutgvfkj",
        "alertId": "ALT-1002",
        "type": "WARNING",
        "category": "POWER_FACTOR",
        "furnaceId": "F2",
        "heatId": "H-105",
        "title": "Power Factor Below Target on Furnace F2",
        "message": "Power factor 0.94 is below the target threshold of 0.95. Apparent load is 657 kVA.",
        "observedValue": "0.94",
        "thresholdValue": "0.95 PF",
        "explainableAction": "Inspect the furnace capacitor bank and automatic power factor correction (APFC) steps. Low PF incurs DISCOM surcharge penalties and unnecessarily consumes transformer kVA capacity.",
        "timestamp": "2026-10-04T09:46:29.328Z",
        "acknowledged": false,
        "resolved": false,
        "createdAt": "2026-10-04T06:55:39.667Z",
        "updatedAt": "2026-10-04T09:46:29.328Z"
      }
    ],
    "anomalies": [
      {
        "type": "WARNING",
        "category": "POWER_FACTOR",
        "furnaceId": "F2",
        "title": "Sub-Optimal Power Factor (0.88) on F2",
        "message": "Power factor 0.88 is below the target threshold of 0.95.",
        "observedValue": "0.88",
        "thresholdValue": "0.95",
        "explainableAction": "Inspect harmonic filter banks and tuning capacitors."
      }
    ]
  }
};

export const mockHeatsData = {
  "success": true,
  "count": 10,
  "heats": [
    {
      "_id": "metallo_5tzqpbdmtmutgvfka",
      "heatId": "H-101",
      "furnaceId": "F1",
      "productionTonnes": 1,
      "grade": "Grey Iron FG260",
      "status": "COMPLETED",
      "meltStartTime": "2026-10-04T01:00:00.000Z",
      "meltEndTime": "2026-10-04T02:00:00.000Z",
      "plannedPourTime": "2026-10-04T02:15:00.000Z",
      "actualPourTime": "2026-10-04T02:15:00.000Z",
      "meltingDurationMinutes": 60,
      "holdingDurationMinutes": 15,
      "meltingEnergyKwh": 585,
      "holdingEnergyKwh": 25,
      "totalEnergyKwh": 610,
      "secKwhPerTonne": 610,
      "averagePf": 0.95,
      "excessHoldingMinutes": 0,
      "excessHoldingEnergyKwh": 0,
      "excessHoldingCost": 0,
      "hasHoldingWarning": false,
      "hasSecWarning": false,
      "notes": "Clean morning melt, standard operation",
      "tariffBreakdown": {
        "peakKwh": 725,
        "normalKwh": 0,
        "offPeakKwh": 0,
        "peakCost": 6525,
        "normalCost": 0,
        "offPeakCost": 0,
        "totalCost": 6525
      },
      "createdAt": "2026-10-04T06:55:39.658Z",
      "updatedAt": "2026-10-04T06:55:39.658Z"
    },
    {
      "_id": "metallo_02ie1ameemutgvfkb",
      "heatId": "H-102",
      "furnaceId": "F2",
      "productionTonnes": 1,
      "grade": "Grey Iron FG260",
      "status": "COMPLETED",
      "meltStartTime": "2026-10-04T02:30:00.000Z",
      "meltEndTime": "2026-10-04T03:30:00.000Z",
      "plannedPourTime": "2026-10-04T03:45:00.000Z",
      "actualPourTime": "2026-10-04T04:18:00.000Z",
      "meltingDurationMinutes": 60,
      "holdingDurationMinutes": 48,
      "meltingEnergyKwh": 590,
      "holdingEnergyKwh": 80,
      "totalEnergyKwh": 670,
      "secKwhPerTonne": 670,
      "averagePf": 0.93,
      "excessHoldingMinutes": 18,
      "excessHoldingEnergyKwh": 30,
      "excessHoldingCost": 270,
      "hasHoldingWarning": true,
      "hasSecWarning": true,
      "notes": "Moulding line crane breakdown forced 48 min holding. Elevated SEC to 670 kWh/t.",
      "tariffBreakdown": {
        "peakKwh": 1044,
        "normalKwh": 0,
        "offPeakKwh": 0,
        "peakCost": 9396,
        "normalCost": 0,
        "offPeakCost": 0,
        "totalCost": 9396
      },
      "createdAt": "2026-10-04T06:55:39.659Z",
      "updatedAt": "2026-10-04T06:55:39.659Z"
    },
    {
      "_id": "metallo_yekvfuugpmutgvfkb",
      "heatId": "H-103",
      "furnaceId": "F1",
      "productionTonnes": 1,
      "grade": "Grey Iron FG200",
      "status": "COMPLETED",
      "meltStartTime": "2026-10-04T04:45:00.000Z",
      "meltEndTime": "2026-10-04T05:45:00.000Z",
      "plannedPourTime": "2026-10-04T06:00:00.000Z",
      "actualPourTime": "2026-10-04T05:57:00.000Z",
      "meltingDurationMinutes": 60,
      "holdingDurationMinutes": 12,
      "meltingEnergyKwh": 578,
      "holdingEnergyKwh": 20,
      "totalEnergyKwh": 598,
      "secKwhPerTonne": 598,
      "averagePf": 0.96,
      "excessHoldingMinutes": 0,
      "excessHoldingEnergyKwh": 0,
      "excessHoldingCost": 0,
      "hasHoldingWarning": false,
      "hasSecWarning": false,
      "notes": "Optimal tap-to-tap timing post-peak window",
      "tariffBreakdown": {
        "peakKwh": 0,
        "normalKwh": 696,
        "offPeakKwh": 0,
        "peakCost": 0,
        "normalCost": 5220,
        "offPeakCost": 0,
        "totalCost": 5220
      },
      "createdAt": "2026-10-04T06:55:39.659Z",
      "updatedAt": "2026-10-04T06:55:39.659Z"
    },
    {
      "_id": "metallo_rnbcinnflmutgvfkc",
      "heatId": "H-104",
      "furnaceId": "F1",
      "productionTonnes": 1,
      "grade": "Grey Iron FG260",
      "status": "MELTING",
      "meltStartTime": "2026-10-04T06:15:00.000Z",
      "meltEndTime": null,
      "plannedPourTime": "2026-10-04T07:30:00.000Z",
      "actualPourTime": null,
      "meltingDurationMinutes": 60,
      "holdingDurationMinutes": 0,
      "meltingEnergyKwh": 380,
      "holdingEnergyKwh": 0,
      "totalEnergyKwh": 380,
      "secKwhPerTonne": 380,
      "averagePf": 0.95,
      "excessHoldingMinutes": 0,
      "excessHoldingEnergyKwh": 0,
      "excessHoldingCost": 0,
      "hasHoldingWarning": false,
      "hasSecWarning": false,
      "notes": "Active melt in progress (current power: 582 kW, temp: 1420°C)",
      "tariffBreakdown": {
        "peakKwh": 0,
        "normalKwh": 580,
        "offPeakKwh": 0,
        "peakCost": 0,
        "normalCost": 4350,
        "offPeakCost": 0,
        "totalCost": 4350
      },
      "createdAt": "2026-10-04T06:55:39.660Z",
      "updatedAt": "2026-10-04T06:55:39.660Z"
    },
    {
      "_id": "metallo_8qq292jnbmutgvfkc",
      "heatId": "H-105",
      "furnaceId": "F2",
      "productionTonnes": 1,
      "grade": "Grey Iron FG260",
      "status": "HOLDING",
      "meltStartTime": "2026-10-04T05:30:00.000Z",
      "meltEndTime": "2026-10-04T06:30:00.000Z",
      "plannedPourTime": "2026-10-04T06:45:00.000Z",
      "actualPourTime": null,
      "meltingDurationMinutes": 60,
      "holdingDurationMinutes": 47,
      "meltingEnergyKwh": 595,
      "holdingEnergyKwh": 78.3,
      "totalEnergyKwh": 673.3,
      "secKwhPerTonne": 673.3,
      "averagePf": 0.88,
      "excessHoldingMinutes": 17,
      "excessHoldingEnergyKwh": 28.33,
      "excessHoldingCost": 212.47,
      "hasHoldingWarning": true,
      "hasSecWarning": true,
      "notes": "Actively holding past recommended 30 min threshold. High avoidable energy cost.",
      "tariffBreakdown": {
        "peakKwh": 0,
        "normalKwh": 1034.3,
        "offPeakKwh": 0,
        "peakCost": 0,
        "normalCost": 7757.5,
        "offPeakCost": 0,
        "totalCost": 7757.5
      },
      "createdAt": "2026-10-04T06:55:39.660Z",
      "updatedAt": "2026-10-04T06:55:39.661Z"
    },
    {
      "_id": "metallo_37atbm3w9mutgvfkd",
      "heatId": "H-106",
      "furnaceId": "F1",
      "productionTonnes": 1,
      "grade": "Grey Iron FG260",
      "status": "PLANNED",
      "meltStartTime": "2026-10-04T08:00:00.000Z",
      "meltEndTime": "2026-10-04T09:00:00.000Z",
      "plannedPourTime": "2026-10-04T09:15:00.000Z",
      "actualPourTime": null,
      "meltingDurationMinutes": 60,
      "holdingDurationMinutes": 15,
      "meltingEnergyKwh": 580,
      "holdingEnergyKwh": 25,
      "totalEnergyKwh": 605,
      "secKwhPerTonne": 605,
      "averagePf": 0.95,
      "excessHoldingMinutes": 0,
      "excessHoldingEnergyKwh": 0,
      "excessHoldingCost": 0,
      "hasHoldingWarning": false,
      "hasSecWarning": false,
      "notes": "Scheduled afternoon heat",
      "tariffBreakdown": {
        "peakKwh": 0,
        "normalKwh": 725,
        "offPeakKwh": 0,
        "peakCost": 0,
        "normalCost": 5437.5,
        "offPeakCost": 0,
        "totalCost": 5437.5
      },
      "createdAt": "2026-10-04T06:55:39.661Z",
      "updatedAt": "2026-10-04T06:55:39.661Z"
    },
    {
      "_id": "metallo_e8cvsecnjmutgvfke",
      "heatId": "H-107",
      "furnaceId": "F2",
      "productionTonnes": 1,
      "grade": "Grey Iron FG260",
      "status": "PLANNED",
      "meltStartTime": "2026-10-04T09:15:00.000Z",
      "meltEndTime": "2026-10-04T10:15:00.000Z",
      "plannedPourTime": "2026-10-04T10:30:00.000Z",
      "actualPourTime": null,
      "meltingDurationMinutes": 60,
      "holdingDurationMinutes": 15,
      "meltingEnergyKwh": 580,
      "holdingEnergyKwh": 25,
      "totalEnergyKwh": 605,
      "secKwhPerTonne": 605,
      "averagePf": 0.95,
      "excessHoldingMinutes": 0,
      "excessHoldingEnergyKwh": 0,
      "excessHoldingCost": 0,
      "hasHoldingWarning": false,
      "hasSecWarning": false,
      "notes": "Scheduled afternoon heat",
      "tariffBreakdown": {
        "peakKwh": 0,
        "normalKwh": 725,
        "offPeakKwh": 0,
        "peakCost": 0,
        "normalCost": 5437.5,
        "offPeakCost": 0,
        "totalCost": 5437.5
      },
      "createdAt": "2026-10-04T06:55:39.662Z",
      "updatedAt": "2026-10-04T06:55:39.662Z"
    },
    {
      "_id": "metallo_3yc4bgchvmutgyoyk",
      "heatId": "H-TEST-1",
      "furnaceId": "F1",
      "productionTonnes": 1,
      "grade": "Grey Iron",
      "status": "COMPLETED",
      "meltingDurationMinutes": 60,
      "holdingDurationMinutes": 10,
      "meltingEnergyKwh": 578.3,
      "holdingEnergyKwh": 16.7,
      "totalEnergyKwh": 595,
      "secKwhPerTonne": 595,
      "averagePf": 0.95,
      "tariffBreakdown": {
        "normalKwh": 595,
        "normalCost": 4462.5,
        "totalCost": 4462.5
      },
      "excessHoldingMinutes": 0,
      "excessHoldingEnergyKwh": 0,
      "excessHoldingCost": 0,
      "hasHoldingWarning": false,
      "hasSecWarning": false,
      "notes": "Imported via CSV Data Upload",
      "createdAt": "2026-10-04T06:58:11.804Z",
      "updatedAt": "2026-10-04T06:58:11.804Z"
    },
    {
      "_id": "metallo_8e0dpmg3hmuthfab9",
      "heatId": "H-120",
      "furnaceId": "F1",
      "productionTonnes": 1,
      "grade": "Grey Iron FG260",
      "status": "COMPLETED",
      "meltingDurationMinutes": 60,
      "holdingDurationMinutes": 10,
      "meltingEnergyKwh": 583.3,
      "holdingEnergyKwh": 16.7,
      "totalEnergyKwh": 600,
      "secKwhPerTonne": 600,
      "averagePf": 0.96,
      "tariffBreakdown": {
        "normalKwh": 600,
        "normalCost": 4500,
        "totalCost": 4500
      },
      "excessHoldingMinutes": 0,
      "excessHoldingEnergyKwh": 0,
      "excessHoldingCost": 0,
      "hasHoldingWarning": false,
      "hasSecWarning": false,
      "notes": "Imported via CSV Data Upload",
      "createdAt": "2026-10-04T07:11:05.973Z",
      "updatedAt": "2026-10-04T07:11:05.973Z"
    },
    {
      "_id": "metallo_mb06jt239muthfaba",
      "heatId": "H-121",
      "furnaceId": "F2",
      "productionTonnes": 1,
      "grade": "Grey Iron FG260",
      "status": "COMPLETED",
      "meltingDurationMinutes": 58,
      "holdingDurationMinutes": 8,
      "meltingEnergyKwh": 576.7,
      "holdingEnergyKwh": 13.3,
      "totalEnergyKwh": 590,
      "secKwhPerTonne": 590,
      "averagePf": 0.95,
      "tariffBreakdown": {
        "normalKwh": 590,
        "normalCost": 4425,
        "totalCost": 4425
      },
      "excessHoldingMinutes": 0,
      "excessHoldingEnergyKwh": 0,
      "excessHoldingCost": 0,
      "hasHoldingWarning": false,
      "hasSecWarning": false,
      "notes": "Imported via CSV Data Upload",
      "createdAt": "2026-10-04T07:11:05.974Z",
      "updatedAt": "2026-10-04T07:11:05.974Z"
    }
  ]
};

export const mockEnergyData = {
  "success": true,
  "tariffSettings": {
    "_id": "metallo_x72wwfmjtmutgvfk5",
    "discomName": "State Electricity Distribution Corp (HT-III-A)",
    "currencySymbol": "₹",
    "peakRatePerKwh": 9.5,
    "peakStartHour": 6,
    "peakEndHour": 10,
    "peakEveningStartHour": 18,
    "peakEveningEndHour": 22,
    "normalRatePerKwh": 7.5,
    "offPeakRatePerKwh": 6,
    "offPeakStartHour": 22,
    "offPeakEndHour": 6,
    "demandChargePerKva": 350,
    "pfPenaltyThreshold": 0.95,
    "kwhPenaltyPerLowPf": 0.02,
    "notes": "Industrial HT connection with time-of-day two-part tariff structure.",
    "createdAt": "2026-10-04T06:55:39.653Z",
    "updatedAt": "2026-10-04T07:10:45.182Z"
  },
  "summary": {
    "totalEnergyKwh": 8594.3,
    "totalCost": 67995.25,
    "peakEnergyKwh": 1769,
    "normalEnergyKwh": 6825.3,
    "offPeakEnergyKwh": 0,
    "peakCost": 16805.5,
    "normalCost": 51189.75,
    "offPeakCost": 0
  },
  "furnaceDistribution": [
    {
      "furnaceId": "F1",
      "name": "Furnace F1 — Medium Frequency Induction",
      "totalEnergyKwh": 3388,
      "totalProductionTonnes": 6,
      "averageSec": 564.7,
      "percentageOfTotal": 39.4
    },
    {
      "furnaceId": "F2",
      "name": "Furnace F2 — Medium Frequency Induction",
      "totalEnergyKwh": 2538.3,
      "totalProductionTonnes": 4,
      "averageSec": 634.6,
      "percentageOfTotal": 29.5
    }
  ],
  "secTrend": [
    {
      "heatId": "H-101",
      "furnaceId": "F1",
      "secKwhPerTonne": 610,
      "benchmarkSec": 580,
      "holdingMinutes": 15,
      "productionTonnes": 1
    },
    {
      "heatId": "H-102",
      "furnaceId": "F2",
      "secKwhPerTonne": 670,
      "benchmarkSec": 580,
      "holdingMinutes": 48,
      "productionTonnes": 1
    },
    {
      "heatId": "H-103",
      "furnaceId": "F1",
      "secKwhPerTonne": 598,
      "benchmarkSec": 580,
      "holdingMinutes": 12,
      "productionTonnes": 1
    },
    {
      "heatId": "H-104",
      "furnaceId": "F1",
      "secKwhPerTonne": 380,
      "benchmarkSec": 580,
      "holdingMinutes": 0,
      "productionTonnes": 1
    },
    {
      "heatId": "H-105",
      "furnaceId": "F2",
      "secKwhPerTonne": 673.3,
      "benchmarkSec": 580,
      "holdingMinutes": 47,
      "productionTonnes": 1
    },
    {
      "heatId": "H-106",
      "furnaceId": "F1",
      "secKwhPerTonne": 605,
      "benchmarkSec": 580,
      "holdingMinutes": 15,
      "productionTonnes": 1
    },
    {
      "heatId": "H-107",
      "furnaceId": "F2",
      "secKwhPerTonne": 605,
      "benchmarkSec": 580,
      "holdingMinutes": 15,
      "productionTonnes": 1
    },
    {
      "heatId": "H-TEST-1",
      "furnaceId": "F1",
      "secKwhPerTonne": 595,
      "benchmarkSec": 580,
      "holdingMinutes": 10,
      "productionTonnes": 1
    },
    {
      "heatId": "H-120",
      "furnaceId": "F1",
      "secKwhPerTonne": 600,
      "benchmarkSec": 580,
      "holdingMinutes": 10,
      "productionTonnes": 1
    },
    {
      "heatId": "H-121",
      "furnaceId": "F2",
      "secKwhPerTonne": 590,
      "benchmarkSec": 580,
      "holdingMinutes": 8,
      "productionTonnes": 1
    }
  ],
  "telemetryTrends": [
    {
      "timestamp": "2026-10-04T06:45:00.000Z",
      "time": "12:15 pm",
      "furnaceId": "F1",
      "powerKw": 582,
      "powerFactor": 0.95,
      "apparentPowerKva": 612.6,
      "tariffRate": 7.5,
      "tariffType": "NORMAL"
    },
    {
      "timestamp": "2026-10-04T06:45:00.000Z",
      "time": "12:15 pm",
      "furnaceId": "F2",
      "powerKw": 102,
      "powerFactor": 0.88,
      "apparentPowerKva": 115.9,
      "tariffRate": 7.5,
      "tariffType": "NORMAL"
    },
    {
      "timestamp": "2026-10-04T07:00:00.000Z",
      "time": "12:30 pm",
      "furnaceId": "F1",
      "powerKw": 582,
      "powerFactor": 0.95,
      "apparentPowerKva": 612.6,
      "tariffRate": 7.5,
      "tariffType": "NORMAL"
    },
    {
      "timestamp": "2026-10-04T07:00:00.000Z",
      "time": "12:30 pm",
      "furnaceId": "F2",
      "powerKw": 102,
      "powerFactor": 0.88,
      "apparentPowerKva": 115.9,
      "tariffRate": 7.5,
      "tariffType": "NORMAL"
    },
    {
      "timestamp": "2026-10-04T07:15:00.000Z",
      "time": "12:45 pm",
      "furnaceId": "F1",
      "powerKw": 582,
      "powerFactor": 0.95,
      "apparentPowerKva": 612.6,
      "tariffRate": 7.5,
      "tariffType": "NORMAL"
    },
    {
      "timestamp": "2026-10-04T07:15:00.000Z",
      "time": "12:45 pm",
      "furnaceId": "F2",
      "powerKw": 102,
      "powerFactor": 0.88,
      "apparentPowerKva": 115.9,
      "tariffRate": 7.5,
      "tariffType": "NORMAL"
    },
    {
      "timestamp": "2026-10-04T07:30:00.000Z",
      "time": "01:00 pm",
      "furnaceId": "F1",
      "powerKw": 582,
      "powerFactor": 0.95,
      "apparentPowerKva": 612.6,
      "tariffRate": 7.5,
      "tariffType": "NORMAL"
    },
    {
      "timestamp": "2026-10-04T07:30:00.000Z",
      "time": "01:00 pm",
      "furnaceId": "F2",
      "powerKw": 102,
      "powerFactor": 0.88,
      "apparentPowerKva": 115.9,
      "tariffRate": 7.5,
      "tariffType": "NORMAL"
    },
    {
      "timestamp": "2026-10-04T07:08:10.612Z",
      "time": "12:38 pm",
      "furnaceId": "F1",
      "powerKw": 588,
      "powerFactor": 0.95,
      "apparentPowerKva": 618.9,
      "tariffRate": 7.5,
      "tariffType": "NORMAL"
    },
    {
      "timestamp": "2026-10-04T07:08:10.612Z",
      "time": "12:38 pm",
      "furnaceId": "F2",
      "powerKw": 15,
      "powerFactor": 0.98,
      "apparentPowerKva": 15.3,
      "tariffRate": 7.5,
      "tariffType": "NORMAL"
    },
    {
      "timestamp": "2026-10-04T07:37:53.381Z",
      "time": "01:07 pm",
      "furnaceId": "F1",
      "powerKw": 588,
      "powerFactor": 0.95,
      "apparentPowerKva": 618.9,
      "tariffRate": 7.5,
      "tariffType": "NORMAL"
    },
    {
      "timestamp": "2026-10-04T07:37:53.381Z",
      "time": "01:07 pm",
      "furnaceId": "F2",
      "powerKw": 15,
      "powerFactor": 0.98,
      "apparentPowerKva": 15.3,
      "tariffRate": 7.5,
      "tariffType": "NORMAL"
    },
    {
      "timestamp": "2026-10-04T07:39:46.028Z",
      "time": "01:09 pm",
      "furnaceId": "F1",
      "powerKw": 602,
      "powerFactor": 0.94,
      "apparentPowerKva": 640.4,
      "tariffRate": 7.5,
      "tariffType": "NORMAL"
    },
    {
      "timestamp": "2026-10-04T07:39:46.028Z",
      "time": "01:09 pm",
      "furnaceId": "F2",
      "powerKw": 18,
      "powerFactor": 0.97,
      "apparentPowerKva": 18.6,
      "tariffRate": 7.5,
      "tariffType": "NORMAL"
    },
    {
      "timestamp": "2026-10-04T07:39:49.030Z",
      "time": "01:09 pm",
      "furnaceId": "F1",
      "powerKw": 615,
      "powerFactor": 0.94,
      "apparentPowerKva": 654.3,
      "tariffRate": 7.5,
      "tariffType": "NORMAL"
    },
    {
      "timestamp": "2026-10-04T07:39:49.030Z",
      "time": "01:09 pm",
      "furnaceId": "F2",
      "powerKw": 575,
      "powerFactor": 0.93,
      "apparentPowerKva": 618.3,
      "tariffRate": 7.5,
      "tariffType": "NORMAL"
    },
    {
      "timestamp": "2026-10-04T09:46:12.420Z",
      "time": "03:16 pm",
      "furnaceId": "F1",
      "powerKw": 588,
      "powerFactor": 0.95,
      "apparentPowerKva": 618.9,
      "tariffRate": 7.5,
      "tariffType": "NORMAL"
    },
    {
      "timestamp": "2026-10-04T09:46:12.420Z",
      "time": "03:16 pm",
      "furnaceId": "F2",
      "powerKw": 15,
      "powerFactor": 0.98,
      "apparentPowerKva": 15.3,
      "tariffRate": 7.5,
      "tariffType": "NORMAL"
    },
    {
      "timestamp": "2026-10-04T09:46:15.419Z",
      "time": "03:16 pm",
      "furnaceId": "F1",
      "powerKw": 602,
      "powerFactor": 0.94,
      "apparentPowerKva": 640.4,
      "tariffRate": 7.5,
      "tariffType": "NORMAL"
    },
    {
      "timestamp": "2026-10-04T09:46:15.419Z",
      "time": "03:16 pm",
      "furnaceId": "F2",
      "powerKw": 18,
      "powerFactor": 0.97,
      "apparentPowerKva": 18.6,
      "tariffRate": 7.5,
      "tariffType": "NORMAL"
    },
    {
      "timestamp": "2026-10-04T09:46:20.449Z",
      "time": "03:16 pm",
      "furnaceId": "F1",
      "powerKw": 615,
      "powerFactor": 0.94,
      "apparentPowerKva": 654.3,
      "tariffRate": 7.5,
      "tariffType": "NORMAL"
    },
    {
      "timestamp": "2026-10-04T09:46:20.449Z",
      "time": "03:16 pm",
      "furnaceId": "F2",
      "powerKw": 575,
      "powerFactor": 0.93,
      "apparentPowerKva": 618.3,
      "tariffRate": 7.5,
      "tariffType": "NORMAL"
    },
    {
      "timestamp": "2026-10-04T09:46:22.911Z",
      "time": "03:16 pm",
      "furnaceId": "F1",
      "powerKw": 610,
      "powerFactor": 0.94,
      "apparentPowerKva": 648.9,
      "tariffRate": 7.5,
      "tariffType": "NORMAL"
    },
    {
      "timestamp": "2026-10-04T09:46:22.911Z",
      "time": "03:16 pm",
      "furnaceId": "F2",
      "powerKw": 585,
      "powerFactor": 0.92,
      "apparentPowerKva": 635.9,
      "tariffRate": 7.5,
      "tariffType": "NORMAL"
    },
    {
      "timestamp": "2026-10-04T09:46:24.399Z",
      "time": "03:16 pm",
      "furnaceId": "F1",
      "powerKw": 102,
      "powerFactor": 0.95,
      "apparentPowerKva": 107.4,
      "tariffRate": 7.5,
      "tariffType": "NORMAL"
    },
    {
      "timestamp": "2026-10-04T09:46:24.399Z",
      "time": "03:16 pm",
      "furnaceId": "F2",
      "powerKw": 590,
      "powerFactor": 0.88,
      "apparentPowerKva": 670.5,
      "tariffRate": 7.5,
      "tariffType": "NORMAL"
    },
    {
      "timestamp": "2026-10-04T09:46:28.278Z",
      "time": "03:16 pm",
      "furnaceId": "F1",
      "powerKw": 98,
      "powerFactor": 0.95,
      "apparentPowerKva": 103.2,
      "tariffRate": 7.5,
      "tariffType": "NORMAL"
    },
    {
      "timestamp": "2026-10-04T09:46:28.278Z",
      "time": "03:16 pm",
      "furnaceId": "F2",
      "powerKw": 605,
      "powerFactor": 0.89,
      "apparentPowerKva": 679.8,
      "tariffRate": 7.5,
      "tariffType": "NORMAL"
    },
    {
      "timestamp": "2026-10-04T09:46:29.311Z",
      "time": "03:16 pm",
      "furnaceId": "F1",
      "powerKw": 104,
      "powerFactor": 0.95,
      "apparentPowerKva": 109.5,
      "tariffRate": 7.5,
      "tariffType": "NORMAL"
    },
    {
      "timestamp": "2026-10-04T09:46:29.311Z",
      "time": "03:16 pm",
      "furnaceId": "F2",
      "powerKw": 618,
      "powerFactor": 0.94,
      "apparentPowerKva": 657.4,
      "tariffRate": 7.5,
      "tariffType": "NORMAL"
    }
  ]
};

export const mockPfData = {
  "success": true,
  "plantPf": 0.95,
  "targetPf": 0.95,
  "demandImpact": {
    "currentKva": 628.4,
    "targetKva": 628.4,
    "excessKva": 0,
    "monthlyCostImpact": 0,
    "isCompliant": true
  },
  "furnaces": [
    {
      "furnaceId": "F1",
      "name": "Furnace F1 — Medium Frequency Induction",
      "currentPf": 0.95,
      "currentPowerKw": 582,
      "currentKva": 613,
      "isBelowTarget": false,
      "furnaceDemandImpact": {
        "currentKva": 612.6,
        "targetKva": 612.6,
        "excessKva": 0,
        "monthlyCostImpact": 0,
        "isCompliant": true
      }
    },
    {
      "furnaceId": "F2",
      "name": "Furnace F2 — Medium Frequency Induction",
      "currentPf": 0.98,
      "currentPowerKw": 15,
      "currentKva": 15.3,
      "isBelowTarget": false,
      "furnaceDemandImpact": {
        "currentKva": 15.3,
        "targetKva": 15.8,
        "excessKva": 0,
        "monthlyCostImpact": 0,
        "isCompliant": true
      }
    }
  ],
  "lowPfEvents": [
    {
      "timestamp": "2026-10-04T07:39:49.030Z",
      "furnaceId": "F1",
      "powerKw": 615,
      "powerFactor": 0.94,
      "apparentPowerKva": 654.3,
      "state": "MELTING"
    },
    {
      "timestamp": "2026-10-04T07:39:49.030Z",
      "furnaceId": "F2",
      "powerKw": 575,
      "powerFactor": 0.93,
      "apparentPowerKva": 618.3,
      "state": "MELTING"
    },
    {
      "timestamp": "2026-10-04T09:46:15.419Z",
      "furnaceId": "F1",
      "powerKw": 602,
      "powerFactor": 0.94,
      "apparentPowerKva": 640.4,
      "state": "MELTING"
    },
    {
      "timestamp": "2026-10-04T09:46:20.449Z",
      "furnaceId": "F1",
      "powerKw": 615,
      "powerFactor": 0.94,
      "apparentPowerKva": 654.3,
      "state": "MELTING"
    },
    {
      "timestamp": "2026-10-04T09:46:20.449Z",
      "furnaceId": "F2",
      "powerKw": 575,
      "powerFactor": 0.93,
      "apparentPowerKva": 618.3,
      "state": "MELTING"
    },
    {
      "timestamp": "2026-10-04T09:46:22.911Z",
      "furnaceId": "F1",
      "powerKw": 610,
      "powerFactor": 0.94,
      "apparentPowerKva": 648.9,
      "state": "MELTING"
    },
    {
      "timestamp": "2026-10-04T09:46:22.911Z",
      "furnaceId": "F2",
      "powerKw": 585,
      "powerFactor": 0.92,
      "apparentPowerKva": 635.9,
      "state": "MELTING"
    },
    {
      "timestamp": "2026-10-04T09:46:24.399Z",
      "furnaceId": "F2",
      "powerKw": 590,
      "powerFactor": 0.88,
      "apparentPowerKva": 670.5,
      "state": "MELTING"
    },
    {
      "timestamp": "2026-10-04T09:46:28.278Z",
      "furnaceId": "F2",
      "powerKw": 605,
      "powerFactor": 0.89,
      "apparentPowerKva": 679.8,
      "state": "MELTING"
    },
    {
      "timestamp": "2026-10-04T09:46:29.311Z",
      "furnaceId": "F2",
      "powerKw": 618,
      "powerFactor": 0.94,
      "apparentPowerKva": 657.4,
      "state": "MELTING"
    }
  ],
  "pfTimeline": [
    {
      "time": "01:00 pm",
      "furnaceId": "F1",
      "powerKw": 582,
      "apparentPowerKva": 612.6,
      "powerFactor": 0.95,
      "targetPf": 0.95
    },
    {
      "time": "01:00 pm",
      "furnaceId": "F2",
      "powerKw": 102,
      "apparentPowerKva": 115.9,
      "powerFactor": 0.88,
      "targetPf": 0.95
    },
    {
      "time": "12:38 pm",
      "furnaceId": "F1",
      "powerKw": 588,
      "apparentPowerKva": 618.9,
      "powerFactor": 0.95,
      "targetPf": 0.95
    },
    {
      "time": "12:38 pm",
      "furnaceId": "F2",
      "powerKw": 15,
      "apparentPowerKva": 15.3,
      "powerFactor": 0.98,
      "targetPf": 0.95
    },
    {
      "time": "01:07 pm",
      "furnaceId": "F1",
      "powerKw": 588,
      "apparentPowerKva": 618.9,
      "powerFactor": 0.95,
      "targetPf": 0.95
    },
    {
      "time": "01:07 pm",
      "furnaceId": "F2",
      "powerKw": 15,
      "apparentPowerKva": 15.3,
      "powerFactor": 0.98,
      "targetPf": 0.95
    },
    {
      "time": "01:09 pm",
      "furnaceId": "F1",
      "powerKw": 602,
      "apparentPowerKva": 640.4,
      "powerFactor": 0.94,
      "targetPf": 0.95
    },
    {
      "time": "01:09 pm",
      "furnaceId": "F2",
      "powerKw": 18,
      "apparentPowerKva": 18.6,
      "powerFactor": 0.97,
      "targetPf": 0.95
    },
    {
      "time": "01:09 pm",
      "furnaceId": "F1",
      "powerKw": 615,
      "apparentPowerKva": 654.3,
      "powerFactor": 0.94,
      "targetPf": 0.95
    },
    {
      "time": "01:09 pm",
      "furnaceId": "F2",
      "powerKw": 575,
      "apparentPowerKva": 618.3,
      "powerFactor": 0.93,
      "targetPf": 0.95
    },
    {
      "time": "03:16 pm",
      "furnaceId": "F1",
      "powerKw": 588,
      "apparentPowerKva": 618.9,
      "powerFactor": 0.95,
      "targetPf": 0.95
    },
    {
      "time": "03:16 pm",
      "furnaceId": "F2",
      "powerKw": 15,
      "apparentPowerKva": 15.3,
      "powerFactor": 0.98,
      "targetPf": 0.95
    },
    {
      "time": "03:16 pm",
      "furnaceId": "F1",
      "powerKw": 602,
      "apparentPowerKva": 640.4,
      "powerFactor": 0.94,
      "targetPf": 0.95
    },
    {
      "time": "03:16 pm",
      "furnaceId": "F2",
      "powerKw": 18,
      "apparentPowerKva": 18.6,
      "powerFactor": 0.97,
      "targetPf": 0.95
    },
    {
      "time": "03:16 pm",
      "furnaceId": "F1",
      "powerKw": 615,
      "apparentPowerKva": 654.3,
      "powerFactor": 0.94,
      "targetPf": 0.95
    },
    {
      "time": "03:16 pm",
      "furnaceId": "F2",
      "powerKw": 575,
      "apparentPowerKva": 618.3,
      "powerFactor": 0.93,
      "targetPf": 0.95
    },
    {
      "time": "03:16 pm",
      "furnaceId": "F1",
      "powerKw": 610,
      "apparentPowerKva": 648.9,
      "powerFactor": 0.94,
      "targetPf": 0.95
    },
    {
      "time": "03:16 pm",
      "furnaceId": "F2",
      "powerKw": 585,
      "apparentPowerKva": 635.9,
      "powerFactor": 0.92,
      "targetPf": 0.95
    },
    {
      "time": "03:16 pm",
      "furnaceId": "F1",
      "powerKw": 102,
      "apparentPowerKva": 107.4,
      "powerFactor": 0.95,
      "targetPf": 0.95
    },
    {
      "time": "03:16 pm",
      "furnaceId": "F2",
      "powerKw": 590,
      "apparentPowerKva": 670.5,
      "powerFactor": 0.88,
      "targetPf": 0.95
    },
    {
      "time": "03:16 pm",
      "furnaceId": "F1",
      "powerKw": 98,
      "apparentPowerKva": 103.2,
      "powerFactor": 0.95,
      "targetPf": 0.95
    },
    {
      "time": "03:16 pm",
      "furnaceId": "F2",
      "powerKw": 605,
      "apparentPowerKva": 679.8,
      "powerFactor": 0.89,
      "targetPf": 0.95
    },
    {
      "time": "03:16 pm",
      "furnaceId": "F1",
      "powerKw": 104,
      "apparentPowerKva": 109.5,
      "powerFactor": 0.95,
      "targetPf": 0.95
    },
    {
      "time": "03:16 pm",
      "furnaceId": "F2",
      "powerKw": 618,
      "apparentPowerKva": 657.4,
      "powerFactor": 0.94,
      "targetPf": 0.95
    }
  ]
};

export const mockScheduleData = {
  "success": true,
  "current": {
    "_id": "metallo_0p2tpz6g7muthcjzn",
    "planType": "CURRENT",
    "items": [
      {
        "heatId": "H1",
        "furnaceId": "F1",
        "quantityTonnes": 1,
        "plannedStart": "2026-10-04T03:00:00.000Z",
        "plannedEnd": "2026-10-04T04:00:00.000Z",
        "plannedPourTime": "2026-10-04T05:00:00.000Z",
        "meltDurationMinutes": 60,
        "holdingMinutes": 60,
        "tariffPeriod": "PEAK",
        "estimatedEnergyKwh": 700,
        "estimatedCost": 6225,
        "avoidableHoldingCost": 624.98,
        "peakOverlapMinutes": 60,
        "status": "CURRENT"
      },
      {
        "heatId": "H2",
        "furnaceId": "F2",
        "quantityTonnes": 1,
        "plannedStart": "2026-10-04T03:00:00.000Z",
        "plannedEnd": "2026-10-04T04:00:00.000Z",
        "plannedPourTime": "2026-10-04T06:30:00.000Z",
        "meltDurationMinutes": 60,
        "holdingMinutes": 150,
        "tariffPeriod": "PEAK",
        "estimatedEnergyKwh": 850,
        "estimatedCost": 7350,
        "avoidableHoldingCost": 1749.98,
        "peakOverlapMinutes": 60,
        "status": "CURRENT"
      },
      {
        "heatId": "H3",
        "furnaceId": "F1",
        "quantityTonnes": 1,
        "plannedStart": "2026-10-04T05:30:00.000Z",
        "plannedEnd": "2026-10-04T06:30:00.000Z",
        "plannedPourTime": "2026-10-04T08:00:00.000Z",
        "meltDurationMinutes": 60,
        "holdingMinutes": 90,
        "tariffPeriod": "NORMAL",
        "estimatedEnergyKwh": 750,
        "estimatedCost": 5625,
        "avoidableHoldingCost": 999.98,
        "peakOverlapMinutes": 0,
        "status": "CURRENT"
      },
      {
        "heatId": "H4",
        "furnaceId": "F2",
        "quantityTonnes": 1,
        "plannedStart": "2026-10-04T07:00:00.000Z",
        "plannedEnd": "2026-10-04T08:00:00.000Z",
        "plannedPourTime": "2026-10-04T09:30:00.000Z",
        "meltDurationMinutes": 60,
        "holdingMinutes": 90,
        "tariffPeriod": "NORMAL",
        "estimatedEnergyKwh": 750,
        "estimatedCost": 5625,
        "avoidableHoldingCost": 999.98,
        "peakOverlapMinutes": 0,
        "status": "CURRENT"
      }
    ],
    "summary": {
      "totalEnergyKwh": 3050,
      "averageSec": 762.5,
      "totalCost": 24825,
      "peakDemandKw": 1200,
      "totalHoldingMinutes": 390,
      "excessHoldingMinutes": 270,
      "unavoidablePeakCount": 2
    },
    "createdAt": "2026-10-04T07:08:58.547Z",
    "updatedAt": "2026-10-04T07:08:58.547Z"
  },
  "optimized": {
    "_id": "metallo_h9u2au0idmuthcjzo",
    "planType": "OPTIMIZED",
    "items": [
      {
        "heatId": "H1",
        "furnaceId": "F1",
        "quantityTonnes": 1,
        "plannedStart": "2026-10-04T03:50:00.000Z",
        "plannedEnd": "2026-10-04T04:50:00.000Z",
        "plannedPourTime": "2026-10-04T05:00:00.000Z",
        "meltDurationMinutes": 60,
        "holdingMinutes": 10,
        "tariffPeriod": "PEAK",
        "estimatedEnergyKwh": 616.7,
        "estimatedCost": 5225,
        "avoidableHoldingCost": 0,
        "peakOverlapMinutes": 40,
        "status": "PEAK_UNAVOIDABLE"
      },
      {
        "heatId": "H2",
        "furnaceId": "F2",
        "quantityTonnes": 1,
        "plannedStart": "2026-10-04T05:20:00.000Z",
        "plannedEnd": "2026-10-04T06:20:00.000Z",
        "plannedPourTime": "2026-10-04T06:30:00.000Z",
        "meltDurationMinutes": 60,
        "holdingMinutes": 10,
        "tariffPeriod": "NORMAL",
        "estimatedEnergyKwh": 616.7,
        "estimatedCost": 4625,
        "avoidableHoldingCost": 0,
        "peakOverlapMinutes": 0,
        "status": "OPTIMIZED"
      },
      {
        "heatId": "H3",
        "furnaceId": "F1",
        "quantityTonnes": 1,
        "plannedStart": "2026-10-04T06:50:00.000Z",
        "plannedEnd": "2026-10-04T07:50:00.000Z",
        "plannedPourTime": "2026-10-04T08:00:00.000Z",
        "meltDurationMinutes": 60,
        "holdingMinutes": 10,
        "tariffPeriod": "NORMAL",
        "estimatedEnergyKwh": 616.7,
        "estimatedCost": 4625,
        "avoidableHoldingCost": 0,
        "peakOverlapMinutes": 0,
        "status": "OPTIMIZED"
      },
      {
        "heatId": "H4",
        "furnaceId": "F2",
        "quantityTonnes": 1,
        "plannedStart": "2026-10-04T08:20:00.000Z",
        "plannedEnd": "2026-10-04T09:20:00.000Z",
        "plannedPourTime": "2026-10-04T09:30:00.000Z",
        "meltDurationMinutes": 60,
        "holdingMinutes": 10,
        "tariffPeriod": "NORMAL",
        "estimatedEnergyKwh": 616.7,
        "estimatedCost": 4625,
        "avoidableHoldingCost": 0,
        "peakOverlapMinutes": 0,
        "status": "OPTIMIZED"
      }
    ],
    "summary": {
      "totalEnergyKwh": 2466.8,
      "averageSec": 616.7,
      "totalCost": 19100,
      "peakDemandKw": 600,
      "totalHoldingMinutes": 40,
      "excessHoldingMinutes": 0,
      "unavoidablePeakCount": 1
    },
    "potentialSavingsVsCurrent": {
      "energyKwh": 583.2,
      "cost": 5725,
      "secReduction": 145.8,
      "peakDemandKwReduction": 600,
      "holdingMinutesSaved": 350
    },
    "createdAt": "2026-10-04T07:08:58.548Z",
    "updatedAt": "2026-10-04T07:08:58.548Z"
  }
};

export const mockAlertsData = {
  "success": true,
  "counts": {
    "total": 6,
    "critical": 1,
    "warning": 4,
    "info": 0,
    "unresolved": 5
  },
  "alerts": [
    {
      "_id": "metallo_1f3nae439mutgvfkj",
      "alertId": "ALT-1001",
      "type": "WARNING",
      "category": "HOLDING",
      "furnaceId": "F2",
      "heatId": "H-105",
      "title": "Excessive Holding Duration on Furnace F2",
      "message": "Heat H-105 has been holding for 47 minutes (threshold: 30 minutes). Avoidable holding energy: ~28.3 kWh.",
      "observedValue": "47 min",
      "thresholdValue": "30 min",
      "explainableAction": "Expedite mould preparation on Line 2 or lower bath power to standby setpoint. Excessive holding increases thermal radiation losses without metallurgical value.",
      "timestamp": "2026-10-04T07:15:00.000Z",
      "acknowledged": true,
      "resolved": false,
      "createdAt": "2026-10-04T06:55:39.667Z",
      "updatedAt": "2026-10-04T07:10:23.117Z"
    },
    {
      "_id": "metallo_6275329owmutgvfkj",
      "alertId": "ALT-1002",
      "type": "WARNING",
      "category": "POWER_FACTOR",
      "furnaceId": "F2",
      "heatId": "H-105",
      "title": "Power Factor Below Target on Furnace F2",
      "message": "Power factor 0.94 is below the target threshold of 0.95. Apparent load is 657 kVA.",
      "observedValue": "0.94",
      "thresholdValue": "0.95 PF",
      "explainableAction": "Inspect the furnace capacitor bank and automatic power factor correction (APFC) steps. Low PF incurs DISCOM surcharge penalties and unnecessarily consumes transformer kVA capacity.",
      "timestamp": "2026-10-04T09:46:29.328Z",
      "acknowledged": false,
      "resolved": false,
      "createdAt": "2026-10-04T06:55:39.667Z",
      "updatedAt": "2026-10-04T09:46:29.328Z"
    },
    {
      "_id": "metallo_h44ma4vjomutgvfkk",
      "alertId": "ALT-1003",
      "type": "CRITICAL",
      "category": "DEMAND",
      "furnaceId": null,
      "heatId": null,
      "title": "Demand Spike Approaching Contract Sanction",
      "message": "Current plant active demand is 1240 kW, surpassing warning threshold of 1050 kW.",
      "observedValue": "1240 kW (1332.8 kVA)",
      "thresholdValue": "1,100 kW",
      "explainableAction": "Stagger melt start times by at least 45 minutes to prevent simultaneous full-power heating cycles. Utilize the METALLO Schedule Optimizer to automate this.",
      "timestamp": "2026-10-04T09:46:22.921Z",
      "acknowledged": true,
      "resolved": false,
      "createdAt": "2026-10-04T06:55:39.668Z",
      "updatedAt": "2026-10-04T09:46:22.921Z"
    },
    {
      "_id": "metallo_p9o7o4h2ymutgvfkl",
      "alertId": "ALT-1004",
      "type": "INFO",
      "category": "TARIFF",
      "furnaceId": "F1",
      "heatId": "H-101",
      "title": "Melting Operation Scheduled During Peak Tariff Window",
      "message": "Heat H-101 melt cycle occurred between 06:30 and 07:30 within the morning Peak Tariff period (₹9.0/kWh).",
      "observedValue": "Peak Band (₹9/kWh)",
      "thresholdValue": "Normal Band (₹7.5/kWh)",
      "explainableAction": "Where pour commitments allow, shift melt cycles to after 10:00 to capitalize on standard or off-peak utility tariffs.",
      "timestamp": "2026-10-04T01:30:00.000Z",
      "acknowledged": true,
      "resolved": true,
      "createdAt": "2026-10-04T06:55:39.669Z",
      "updatedAt": "2026-10-04T06:55:39.669Z"
    },
    {
      "_id": "metallo_ij68e7ujnmutig5in",
      "alertId": "ALT-MUTIG5IN2Q9P",
      "type": "WARNING",
      "category": "POWER_FACTOR",
      "furnaceId": "F1",
      "title": "Sub-Optimal Power Factor (0.94) on F1",
      "message": "Power factor 0.94 is below the target threshold of 0.95. Apparent load is 649 kVA.",
      "observedValue": "0.94",
      "thresholdValue": "0.95",
      "explainableAction": "Inspect harmonic filter banks and tuning capacitors. Poor PF increases reactive kVA demand and triggers utility surcharge penalties under HT billing schedules.",
      "timestamp": "2026-10-04T09:46:22.914Z",
      "acknowledged": false,
      "resolved": false,
      "createdAt": "2026-10-04T07:39:46.031Z",
      "updatedAt": "2026-10-04T09:46:22.915Z"
    },
    {
      "_id": "metallo_pe2zmkpv3mutmz3gd",
      "alertId": "ALT-MUTMZ3GCRM4F",
      "type": "WARNING",
      "category": "HOLDING",
      "furnaceId": "F1",
      "heatId": "H-104",
      "title": "Excessive Holding Duration on F1",
      "message": "Holding duration has reached 45 min (threshold: 30 min). Estimated avoidable holding energy: 25.0 kWh.",
      "observedValue": "45 min",
      "thresholdValue": "30 min",
      "explainableAction": "Expedite moulding line preparation or lower bath temperature to standby setpoint. Holding is pure thermal waste that contributes nothing to metallurgical transformation.",
      "timestamp": "2026-10-04T09:46:29.319Z",
      "acknowledged": false,
      "resolved": false,
      "createdAt": "2026-10-04T09:46:28.285Z",
      "updatedAt": "2026-10-04T09:46:29.319Z"
    }
  ]
};

export const mockSettingsData = {
  "success": true,
  "foundry": {
    "_id": "metallo_ruwd6lh68mutgvfk8",
    "name": "METALLO Demo Foundry Cluster",
    "location": "Coimbatore Industrial Area, TN, India",
    "contactEmail": "operations@metallofoundry.com",
    "totalInstalledCapacity": 2,
    "contractDemandKw": 1400,
    "demandThresholdKw": 1050,
    "powerFactorThreshold": 0.95,
    "holdingThresholdMinutes": 30,
    "safetyBufferMinutes": 15,
    "operatingHoursPerDay": 16,
    "createdAt": "2026-10-04T06:55:39.656Z",
    "updatedAt": "2026-10-04T07:10:45.181Z"
  },
  "tariffSettings": {
    "_id": "metallo_x72wwfmjtmutgvfk5",
    "discomName": "State Electricity Distribution Corp (HT-III-A)",
    "currencySymbol": "₹",
    "peakRatePerKwh": 9.5,
    "peakStartHour": 6,
    "peakEndHour": 10,
    "peakEveningStartHour": 18,
    "peakEveningEndHour": 22,
    "normalRatePerKwh": 7.5,
    "offPeakRatePerKwh": 6,
    "offPeakStartHour": 22,
    "offPeakEndHour": 6,
    "demandChargePerKva": 350,
    "pfPenaltyThreshold": 0.95,
    "kwhPenaltyPerLowPf": 0.02,
    "notes": "Industrial HT connection with time-of-day two-part tariff structure.",
    "createdAt": "2026-10-04T06:55:39.653Z",
    "updatedAt": "2026-10-04T07:10:45.182Z"
  },
  "furnaces": [
    {
      "_id": "metallo_2x9bpj1vpmutgvfk8",
      "furnaceId": "F1",
      "name": "Furnace F1 — Medium Frequency Induction",
      "type": "Induction furnace",
      "capacityTonnes": 1,
      "meltingPowerKw": 600,
      "holdingPowerKw": 100,
      "idlePowerKw": 15,
      "status": "MELTING",
      "currentPowerKw": 582,
      "temperatureC": 1420,
      "currentPf": 0.95,
      "currentKva": 613,
      "currentHeatId": "H-104",
      "todayEnergyKwh": 1501.2,
      "todayProductionTonnes": 2,
      "currentHoldingMinutes": 8,
      "baselineSecKwhPerTonne": 580,
      "normalMeltingMinKw": 550,
      "normalMeltingMaxKw": 630,
      "insulationCondition": "GOOD",
      "createdAt": "2026-10-04T06:55:39.656Z",
      "updatedAt": "2026-10-04T09:46:31.179Z"
    },
    {
      "_id": "metallo_zm6bmo3wqmutgvfk9",
      "furnaceId": "F2",
      "name": "Furnace F2 — Medium Frequency Induction",
      "type": "Induction furnace",
      "capacityTonnes": 1,
      "meltingPowerKw": 600,
      "holdingPowerKw": 100,
      "idlePowerKw": 15,
      "status": "IDLE",
      "currentPowerKw": 15,
      "temperatureC": 450,
      "currentPf": 0.98,
      "currentKva": 15.3,
      "currentHeatId": null,
      "todayEnergyKwh": 1571.9,
      "todayProductionTonnes": 2,
      "currentHoldingMinutes": 0,
      "baselineSecKwhPerTonne": 580,
      "normalMeltingMinKw": 550,
      "normalMeltingMaxKw": 630,
      "insulationCondition": "INSPECT_SOON",
      "createdAt": "2026-10-04T06:55:39.657Z",
      "updatedAt": "2026-10-04T09:46:31.181Z"
    }
  ]
};
