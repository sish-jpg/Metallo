import mongoose from 'mongoose';
import { createUnifiedModel } from '../config/db.js';

const furnaceSchema = new mongoose.Schema({
  furnaceId: { type: String, required: true, unique: true }, // "F1", "F2", etc.
  name: { type: String, required: true },
  type: { type: String, default: 'Induction furnace' },
  capacityTonnes: { type: Number, required: true, default: 1.0 },
  meltingPowerKw: { type: Number, required: true, default: 600 },
  holdingPowerKw: { type: Number, required: true, default: 100 },
  idlePowerKw: { type: Number, default: 15 },
  status: {
    type: String,
    enum: ['OFF', 'IDLE', 'MELTING', 'HOLDING', 'READY', 'POURING'],
    default: 'IDLE'
  },
  currentPowerKw: { type: Number, default: 0 },
  temperatureC: { type: Number, default: 25 },
  currentPf: { type: Number, default: 0.96 },
  currentKva: { type: Number, default: 0 },
  currentHeatId: { type: String, default: null },
  todayEnergyKwh: { type: Number, default: 0 },
  todayProductionTonnes: { type: Number, default: 0 },
  currentHoldingMinutes: { type: Number, default: 0 },
  baselineSecKwhPerTonne: { type: Number, default: 580 },
  normalMeltingMinKw: { type: Number, default: 550 },
  normalMeltingMaxKw: { type: Number, default: 630 },
  insulationCondition: { type: String, default: 'GOOD' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Furnace = createUnifiedModel('Furnace', furnaceSchema);
