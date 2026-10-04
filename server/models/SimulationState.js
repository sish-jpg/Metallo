import mongoose from 'mongoose';
import { createUnifiedModel } from '../config/db.js';

const simulationStateSchema = new mongoose.Schema({
  isRunning: { type: Boolean, default: false },
  speedMultiplier: { type: Number, default: 1 },
  stepCount: { type: Number, default: 0 },
  simulatedTime: { type: Date, default: Date.now },
  lastTickAt: { type: Date, default: Date.now },
  activeScenario: { type: String, default: 'STANDARD_CYCLE' },
  updatedAt: { type: Date, default: Date.now }
});

export const SimulationState = createUnifiedModel('SimulationState', simulationStateSchema);
