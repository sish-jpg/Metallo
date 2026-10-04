import mongoose from 'mongoose';
import { createUnifiedModel } from '../config/db.js';

const tariffSettingsSchema = new mongoose.Schema({
  discomName: { type: String, default: 'Tamil Nadu TANGEDCO / Demo DISCOM' },
  currencySymbol: { type: String, default: '₹' },
  peakRatePerKwh: { type: Number, default: 9.0 },
  peakStartHour: { type: Number, default: 6 },  // 06:00
  peakEndHour: { type: Number, default: 10 },   // 10:00
  peakEveningStartHour: { type: Number, default: 18 }, // 18:00
  peakEveningEndHour: { type: Number, default: 22 },   // 22:00
  normalRatePerKwh: { type: Number, default: 7.5 },
  offPeakRatePerKwh: { type: Number, default: 6.0 },
  offPeakStartHour: { type: Number, default: 22 }, // 22:00
  offPeakEndHour: { type: Number, default: 6 },    // 06:00
  demandChargePerKva: { type: Number, default: 350 },
  pfPenaltyThreshold: { type: Number, default: 0.95 },
  kwhPenaltyPerLowPf: { type: Number, default: 0.02 }, // 2% surcharge per 0.01 drop below threshold
  notes: { type: String, default: 'Configurable industrial HT-Tariff III-A (demo rates)' },
  updatedAt: { type: Date, default: Date.now }
});

export const TariffSettings = createUnifiedModel('TariffSettings', tariffSettingsSchema);
