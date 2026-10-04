import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import SimulationBar from './components/SimulationBar';
import Overview from './pages/Overview';
import Furnaces from './pages/Furnaces';
import FurnaceDetail from './pages/FurnaceDetail';
import HeatAnalytics from './pages/HeatAnalytics';
import ScheduleOptimizer from './pages/ScheduleOptimizer';
import EnergyCost from './pages/EnergyCost';
import PowerFactor from './pages/PowerFactor';
import Alerts from './pages/Alerts';
import Settings from './pages/Settings';
import { api } from './api/client';

export default function App() {
  const [currentTab, setCurrentTab] = useState('overview');
  const [selectedFurnaceId, setSelectedFurnaceId] = useState('F1');
  const [loading, setLoading] = useState(true);

  // Core Data States
  const [overviewData, setOverviewData] = useState(null);
  const [furnaces, setFurnaces] = useState([]);
  const [selectedFurnaceData, setSelectedFurnaceData] = useState(null);
  const [heats, setHeats] = useState([]);
  const [schedules, setSchedules] = useState({ current: null, optimized: null });
  const [energyData, setEnergyData] = useState(null);
  const [pfData, setPfData] = useState(null);
  const [alertsData, setAlertsData] = useState({ counts: {}, alerts: [] });
  const [settingsData, setSettingsData] = useState(null);

  // Simulation State
  const [simState, setSimState] = useState({
    isRunning: false,
    stepCount: 0
  });

  // Load all foundational data
  const loadAllData = useCallback(async () => {
    try {
      const [
        overviewRes,
        furnacesRes,
        heatsRes,
        schedRes,
        energyRes,
        pfRes,
        alertsRes,
        settingsRes,
        simRes
      ] = await Promise.all([
        api.getOverview().catch(() => null),
        api.getFurnaces().catch(() => null),
        api.getHeats().catch(() => null),
        api.getCurrentSchedule().catch(() => null),
        api.getEnergy().catch(() => null),
        api.getPowerFactor().catch(() => null),
        api.getAlerts().catch(() => null),
        api.getSettings().catch(() => null),
        api.getSimulationStatus().catch(() => null)
      ]);

      if (overviewRes?.success) setOverviewData(overviewRes);
      if (furnacesRes?.success) setFurnaces(furnacesRes.furnaces);
      if (heatsRes?.success) setHeats(heatsRes.heats);
      if (schedRes?.success) setSchedules({ current: schedRes.current, optimized: schedRes.optimized });
      if (energyRes?.success) setEnergyData(energyRes);
      if (pfRes?.success) setPfData(pfRes);
      if (alertsRes?.success) setAlertsData(alertsRes);
      if (settingsRes?.success) setSettingsData(settingsRes);
      if (simRes?.success) setSimState({ isRunning: simRes.isRunning, stepCount: simRes.stepCount });
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Load specific furnace detail when navigating to it
  useEffect(() => {
    if (currentTab === 'furnace-detail' && selectedFurnaceId) {
      api.getFurnace(selectedFurnaceId)
        .then((res) => {
          if (res?.success) setSelectedFurnaceData(res.furnace);
        })
        .catch(console.error);
    }
  }, [currentTab, selectedFurnaceId]);

  // Polling loop for simulation telemetry updates
  useEffect(() => {
    let interval = null;
    if (simState.isRunning) {
      interval = setInterval(() => {
        loadAllData();
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [simState.isRunning, loadAllData]);

  // Simulation controls
  const handleStartSim = async () => {
    const res = await api.startSimulation(3000);
    setSimState(prev => ({ ...prev, isRunning: true }));
    loadAllData();
  };

  const handleStopSim = async () => {
    await api.stopSimulation();
    setSimState(prev => ({ ...prev, isRunning: false }));
    loadAllData();
  };

  const handleResetSim = async () => {
    await api.resetSimulation();
    setSimState({ isRunning: false, stepCount: 0 });
    loadAllData();
  };

  const handleStepSim = async () => {
    await api.stepSimulation();
    loadAllData();
  };

  // Alert actions
  const handleAcknowledgeAlert = async (id) => {
    await api.acknowledgeAlert(id);
    loadAllData();
  };

  const handleResolveAlert = async (id) => {
    await api.resolveAlert(id);
    loadAllData();
  };

  // Add Furnace
  const handleAddFurnace = async (data) => {
    await api.createFurnace(data);
    loadAllData();
  };

  // Create Heat
  const handleCreateHeat = async (data) => {
    await api.createHeat(data);
    loadAllData();
  };

  // Optimize Schedule
  const handleOptimizeSchedule = async (params) => {
    const res = await api.optimizeSchedule(params);
    if (res?.success) {
      setSchedules({ current: res.current, optimized: res.optimized });
      loadAllData();
    }
  };

  // Settings
  const handleSaveSettings = async (data) => {
    await api.updateSettings(data);
    loadAllData();
  };

  // Navigation handlers
  const handleSelectFurnace = (furnaceId) => {
    setSelectedFurnaceId(furnaceId);
    setCurrentTab('furnace-detail');
  };

  const handleSelectHeat = (heatId) => {
    setCurrentTab('heats');
  };

  return (
    <Layout
      currentTab={currentTab}
      onTabChange={setCurrentTab}
      activeAlertsCount={alertsData.counts?.unresolved || 0}
      criticalAlertsCount={alertsData.counts?.critical || 0}
      isSimRunning={simState.isRunning}
      foundryName={overviewData?.foundry?.name}
    >
      {/* Simulation Engine Controls Bar */}
      <SimulationBar
        isRunning={simState.isRunning}
        stepCount={simState.stepCount}
        onStart={handleStartSim}
        onStop={handleStopSim}
        onReset={handleResetSim}
        onStep={handleStepSim}
      />

      {/* Pages View Rendering */}
      {currentTab === 'overview' && (
        <Overview
          data={overviewData}
          onNavigate={setCurrentTab}
          onSelectFurnace={handleSelectFurnace}
          onSelectHeat={handleSelectHeat}
        />
      )}

      {currentTab === 'furnaces' && (
        <Furnaces
          furnaces={furnaces}
          onSelectFurnace={handleSelectFurnace}
          onAddFurnace={handleAddFurnace}
        />
      )}

      {currentTab === 'furnace-detail' && (
        <FurnaceDetail
          furnace={selectedFurnaceData}
          onBack={() => setCurrentTab('furnaces')}
          onSelectHeat={handleSelectHeat}
        />
      )}

      {currentTab === 'heats' && (
        <HeatAnalytics
          heats={heats}
          furnaces={furnaces}
          onCreateHeat={handleCreateHeat}
        />
      )}

      {currentTab === 'schedule' && (
        <ScheduleOptimizer
          currentSchedule={schedules.current}
          optimizedSchedule={schedules.optimized}
          onOptimize={handleOptimizeSchedule}
        />
      )}

      {currentTab === 'energy' && (
        <EnergyCost
          energyData={energyData}
        />
      )}

      {currentTab === 'pf' && (
        <PowerFactor
          pfData={pfData}
        />
      )}

      {currentTab === 'alerts' && (
        <Alerts
          alertsData={alertsData}
          onAcknowledge={handleAcknowledgeAlert}
          onResolve={handleResolveAlert}
        />
      )}

      {currentTab === 'settings' && (
        <Settings
          settingsData={settingsData}
          onSaveSettings={handleSaveSettings}
          onUploadCsvText={api.uploadCsvText}
          onUploadCsvFile={api.uploadCsvFile}
        />
      )}
    </Layout>
  );
}
