import { Router } from 'express';
import multer from 'multer';

import { getOverview } from '../controllers/overviewController.js';
import { getAllFurnaces, getFurnaceById, updateFurnace, createFurnace } from '../controllers/furnaceController.js';
import { getAllHeats, getHeatById, createHeat } from '../controllers/heatController.js';
import { getEnergyAnalytics, getPowerFactorAnalytics } from '../controllers/energyController.js';
import { getCurrentSchedule, optimizeSchedule } from '../controllers/scheduleController.js';
import { getAllAlerts, updateAlertStatus } from '../controllers/alertController.js';
import { getSettings, updateSettings, handleCsvUpload, getCsvTemplate } from '../controllers/settingsController.js';
import { getSimulationStatus, startSim, stopSim, resetSim, stepSim } from '../controllers/simulationController.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Overview
router.get('/overview', getOverview);

// Furnaces
router.get('/furnaces', getAllFurnaces);
router.post('/furnaces', createFurnace);
router.get('/furnaces/:id', getFurnaceById);
router.put('/furnaces/:id', updateFurnace);

// Heats
router.get('/heats', getAllHeats);
router.post('/heats', createHeat);
router.get('/heats/:id', getHeatById);

// Energy & Power Factor
router.get('/energy', getEnergyAnalytics);
router.get('/energy/trends', getEnergyAnalytics);
router.get('/energy/power-factor', getPowerFactorAnalytics);

// Alerts
router.get('/alerts', getAllAlerts);
router.patch('/alerts/:id', updateAlertStatus);

// Scheduling
router.get('/schedule/current', getCurrentSchedule);
router.post('/schedule/optimize', optimizeSchedule);

// Settings
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

// Data upload & templates
router.post('/data/upload', upload.single('file'), handleCsvUpload);
router.get('/data/template', getCsvTemplate);

// Simulation
router.get('/simulation/status', getSimulationStatus);
router.post('/simulation/start', startSim);
router.post('/simulation/stop', stopSim);
router.post('/simulation/reset', resetSim);
router.post('/simulation/step', stepSim);

export default router;
