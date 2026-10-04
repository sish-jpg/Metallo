import mongoose from 'mongoose';
import { createUnifiedModel } from '../config/db.js';

const scheduleItemSchema = new mongoose.Schema({
  heatId: { type: String, required: true },
  furnaceId: { type: String, required: true },
  quantityTonnes: { type: Number, default: 1.0 },
  plannedStart: { type: Date, required: true },
  plannedEnd: { type: Date, required: true },
  plannedPourTime: { type: Date, required: true },
  meltDurationMinutes: { type: Number, default: 60 },
  holdingMinutes: { type: Number, default: 0 },
  tariffPeriod: { type: String, default: 'NORMAL' }, // PEAK, NORMAL, OFF_PEAK, MIXED
  estimatedEnergyKwh: { type: Number, default: 0 },
  estimatedCost: { type: Number, default: 0 },
  avoidableHoldingCost: { type: Number, default: 0 },
  peakOverlapMinutes: { type: Number, default: 0 },
  status: { type: String, default: 'SCHEDULED' }
});

const scheduleSchema = new mongoose.Schema({
  planType: { type: String, enum: ['CURRENT', 'OPTIMIZED'], required: true },
  date: { type: Date, default: Date.now },
  items: [scheduleItemSchema],
  summary: {
    totalEnergyKwh: { type: Number, default: 0 },
    averageSec: { type: Number, default: 0 },
    totalCost: { type: Number, default: 0 },
    peakDemandKw: { type: Number, default: 0 },
    totalHoldingMinutes: { type: Number, default: 0 },
    excessHoldingMinutes: { type: Number, default: 0 },
    unavoidablePeakCount: { type: Number, default: 0 }
  },
  potentialSavingsVsCurrent: {
    energyKwh: { type: Number, default: 0 },
    cost: { type: Number, default: 0 },
    secReduction: { type: Number, default: 0 },
    peakDemandKwReduction: { type: Number, default: 0 }
  },
  notes: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now }
});

export const Schedule = createUnifiedModel('Schedule', scheduleSchema);
