import mongoose from 'mongoose';
import { createUnifiedModel } from '../config/db.js';

const foundrySchema = new mongoose.Schema({
  name: { type: String, required: true, default: 'METALLO Demo Foundry' },
  location: { type: String, default: 'Coimbatore Foundry Cluster, India' },
  contactEmail: { type: String, default: 'plant.manager@metallofoundry.com' },
  totalInstalledCapacity: { type: Number, default: 2.0 }, // tonnes
  contractDemandKw: { type: Number, default: 1400 },
  demandThresholdKw: { type: Number, default: 1100 },
  powerFactorThreshold: { type: Number, default: 0.95 },
  holdingThresholdMinutes: { type: Number, default: 30 },
  safetyBufferMinutes: { type: Number, default: 15 },
  operatingHoursPerDay: { type: Number, default: 16 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Foundry = createUnifiedModel('Foundry', foundrySchema);
