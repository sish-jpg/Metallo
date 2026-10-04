import mongoose from 'mongoose';
import { createUnifiedModel } from '../config/db.js';

const alertSchema = new mongoose.Schema({
  alertId: { type: String, required: true, unique: true },
  type: {
    type: String,
    enum: ['CRITICAL', 'WARNING', 'INFO'],
    required: true
  },
  category: {
    type: String,
    enum: ['DEMAND', 'HOLDING', 'POWER_FACTOR', 'ANOMALY', 'TARIFF', 'SYSTEM'],
    required: true
  },
  furnaceId: { type: String, default: null },
  heatId: { type: String, default: null },
  title: { type: String, required: true },
  message: { type: String, required: true },
  observedValue: { type: String, default: '' },
  thresholdValue: { type: String, default: '' },
  explainableAction: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  acknowledged: { type: Boolean, default: false },
  resolved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const Alert = createUnifiedModel('Alert', alertSchema);
