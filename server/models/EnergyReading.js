import mongoose from 'mongoose';
import { createUnifiedModel } from '../config/db.js';

const energyReadingSchema = new mongoose.Schema({
  furnaceId: { type: String, required: true },
  timestamp: { type: Date, required: true, default: Date.now },
  powerKw: { type: Number, required: true },
  powerFactor: { type: Number, required: true, default: 0.95 },
  apparentPowerKva: { type: Number, required: true },
  temperatureC: { type: Number, default: 25 },
  energyAccumulatedKwh: { type: Number, default: 0 },
  state: { type: String, default: 'IDLE' },
  heatId: { type: String, default: null },
  tariffRate: { type: Number, default: 7.5 },
  tariffType: { type: String, enum: ['PEAK', 'NORMAL', 'OFF_PEAK'], default: 'NORMAL' },
  createdAt: { type: Date, default: Date.now }
});

export const EnergyReading = createUnifiedModel('EnergyReading', energyReadingSchema);
