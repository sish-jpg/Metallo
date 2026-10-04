import mongoose from 'mongoose';
import { createUnifiedModel } from '../config/db.js';

const heatSchema = new mongoose.Schema({
  heatId: { type: String, required: true, unique: true }, // "H-101"
  furnaceId: { type: String, required: true },
  productionTonnes: { type: Number, required: true, default: 1.0 },
  grade: { type: String, default: 'Grey Iron FG260' },
  status: {
    type: String,
    enum: ['PLANNED', 'MELTING', 'HOLDING', 'READY', 'COMPLETED'],
    default: 'PLANNED'
  },
  meltStartTime: { type: Date },
  meltEndTime: { type: Date },
  plannedPourTime: { type: Date },
  actualPourTime: { type: Date },
  meltingDurationMinutes: { type: Number, default: 60 },
  holdingDurationMinutes: { type: Number, default: 0 },
  meltingEnergyKwh: { type: Number, default: 0 },
  holdingEnergyKwh: { type: Number, default: 0 },
  totalEnergyKwh: { type: Number, default: 0 },
  secKwhPerTonne: { type: Number, default: 0 },
  averagePf: { type: Number, default: 0.95 },
  tariffBreakdown: {
    peakKwh: { type: Number, default: 0 },
    normalKwh: { type: Number, default: 0 },
    offPeakKwh: { type: Number, default: 0 },
    peakCost: { type: Number, default: 0 },
    normalCost: { type: Number, default: 0 },
    offPeakCost: { type: Number, default: 0 },
    totalCost: { type: Number, default: 0 }
  },
  excessHoldingMinutes: { type: Number, default: 0 },
  excessHoldingEnergyKwh: { type: Number, default: 0 },
  excessHoldingCost: { type: Number, default: 0 },
  hasHoldingWarning: { type: Boolean, default: false },
  hasSecWarning: { type: Boolean, default: false },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Heat = createUnifiedModel('Heat', heatSchema);
