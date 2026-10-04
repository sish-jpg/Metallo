import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Save,
  FileSpreadsheet,
  Download,
  Upload,
  CheckCircle2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

export default function Settings({ settingsData, onSaveSettings, onUploadCsvText, onUploadCsvFile }) {
  const [activeTab, setActiveTab] = useState('parameters'); // 'parameters' | 'tariffs' | 'csv'
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [csvUploadSuccess, setCsvUploadSuccess] = useState(false);
  const [csvErrors, setCsvErrors] = useState(null);
  const [csvText, setCsvText] = useState('');

  // Form states
  const [foundryForm, setFoundryForm] = useState(settingsData?.foundry || {});
  const [tariffForm, setTariffForm] = useState(settingsData?.tariffSettings || {});

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    await onSaveSettings({
      foundry: foundryForm,
      tariffSettings: tariffForm
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCsvTextSubmit = async () => {
    setCsvErrors(null);
    setCsvUploadSuccess(false);
    try {
      const res = await onUploadCsvText(csvText);
      if (res.success) {
        setCsvUploadSuccess(true);
        setCsvText('');
      } else {
        setCsvErrors(res.errors || [res.error]);
      }
    } catch (err) {
      setCsvErrors([err.message]);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvErrors(null);
    setCsvUploadSuccess(false);
    try {
      const res = await onUploadCsvFile(file);
      if (res.success) {
        setCsvUploadSuccess(true);
      } else {
        setCsvErrors(res.errors || [res.error]);
      }
    } catch (err) {
      setCsvErrors([err.message]);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-industrial-800 pb-4">
        <div>
          <div className="text-[11px] font-mono tracking-widest text-industrial-400 uppercase">
            CALCULATION ENGINE SETTINGS & DATA INGESTION
          </div>
          <h1 className="text-2xl font-mono font-bold tracking-tight text-white mt-0.5">
            Plant Configuration & Telemetry Upload
          </h1>
        </div>

        {saveSuccess && (
          <div className="px-3 py-1.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-semibold flex items-center gap-1.5">
            <CheckCircle2 size={14} />
            <span>Settings saved — All calculations updated!</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-industrial-800 text-xs font-mono">
        <button
          onClick={() => setActiveTab('parameters')}
          className={`px-4 py-2 font-medium border-b-2 transition ${
            activeTab === 'parameters'
              ? 'border-metallo-orange text-white'
              : 'border-transparent text-industrial-400 hover:text-industrial-200'
          }`}
        >
          Foundry Thresholds & Constraints
        </button>

        <button
          onClick={() => setActiveTab('tariffs')}
          className={`px-4 py-2 font-medium border-b-2 transition ${
            activeTab === 'tariffs'
              ? 'border-metallo-orange text-white'
              : 'border-transparent text-industrial-400 hover:text-industrial-200'
          }`}
        >
          DISCOM Time-of-Day Tariffs
        </button>

        <button
          onClick={() => setActiveTab('csv')}
          className={`px-4 py-2 font-medium border-b-2 transition ${
            activeTab === 'csv'
              ? 'border-metallo-orange text-white'
              : 'border-transparent text-industrial-400 hover:text-industrial-200'
          }`}
        >
          CSV Telemetry & Heat Upload
        </button>
      </div>

      {/* Tab 1: Plant Parameters Form */}
      {activeTab === 'parameters' && (
        <form onSubmit={handleSettingsSubmit} className="space-y-6 max-w-3xl">
          <div className="bg-industrial-900 border border-industrial-800 rounded p-5 space-y-4 font-mono text-xs">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
              Foundry Sanctions & Threshold Limits
            </h3>

            <div>
              <label className="text-industrial-400 block mb-1">Foundry Plant Name</label>
              <input
                type="text"
                value={foundryForm.name || ''}
                onChange={(e) => setFoundryForm({ ...foundryForm, name: e.target.value })}
                className="w-full bg-industrial-950 border border-industrial-700 px-3 py-2 rounded text-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-industrial-400 block mb-1">Contract Demand Sanction (kW)</label>
                <input
                  type="number"
                  value={foundryForm.contractDemandKw || 1400}
                  onChange={(e) => setFoundryForm({ ...foundryForm, contractDemandKw: Number(e.target.value) })}
                  className="w-full bg-industrial-950 border border-industrial-700 px-3 py-2 rounded text-white"
                />
                <span className="text-[10px] text-industrial-500 mt-1 block">Maximum permissible active draw</span>
              </div>

              <div>
                <label className="text-industrial-400 block mb-1">Demand Alert Warning Threshold (kW)</label>
                <input
                  type="number"
                  value={foundryForm.demandThresholdKw || 1100}
                  onChange={(e) => setFoundryForm({ ...foundryForm, demandThresholdKw: Number(e.target.value) })}
                  className="w-full bg-industrial-950 border border-industrial-700 px-3 py-2 rounded text-white"
                />
                <span className="text-[10px] text-industrial-500 mt-1 block">Triggers CRITICAL demand alert</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-industrial-400 block mb-1">Target Power Factor (PF)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.8"
                  max="1.0"
                  value={foundryForm.powerFactorThreshold || 0.95}
                  onChange={(e) => setFoundryForm({ ...foundryForm, powerFactorThreshold: Number(e.target.value) })}
                  className="w-full bg-industrial-950 border border-industrial-700 px-3 py-2 rounded text-white"
                />
              </div>

              <div>
                <label className="text-industrial-400 block mb-1">Holding Threshold (min)</label>
                <input
                  type="number"
                  value={foundryForm.holdingThresholdMinutes || 30}
                  onChange={(e) => setFoundryForm({ ...foundryForm, holdingThresholdMinutes: Number(e.target.value) })}
                  className="w-full bg-industrial-950 border border-industrial-700 px-3 py-2 rounded text-white"
                />
              </div>

              <div>
                <label className="text-industrial-400 block mb-1">Scheduler Safety Buffer (min)</label>
                <input
                  type="number"
                  value={foundryForm.safetyBufferMinutes || 15}
                  onChange={(e) => setFoundryForm({ ...foundryForm, safetyBufferMinutes: Number(e.target.value) })}
                  className="w-full bg-industrial-950 border border-industrial-700 px-3 py-2 rounded text-white"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded bg-metallo-orange hover:bg-metallo-orange-glow text-white font-mono font-bold text-xs transition shadow-subtle"
            >
              <Save size={14} />
              <span>Save & Apply Settings</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Tariff Settings Form */}
      {activeTab === 'tariffs' && (
        <form onSubmit={handleSettingsSubmit} className="space-y-6 max-w-3xl">
          <div className="bg-industrial-900 border border-industrial-800 rounded p-5 space-y-4 font-mono text-xs">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
              DISCOM Commercial Electricity Tariffs
            </h3>

            <div>
              <label className="text-industrial-400 block mb-1">Utility / DISCOM Tariff Schedule</label>
              <input
                type="text"
                value={tariffForm.discomName || ''}
                onChange={(e) => setTariffForm({ ...tariffForm, discomName: e.target.value })}
                className="w-full bg-industrial-950 border border-industrial-700 px-3 py-2 rounded text-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-industrial-400 block mb-1">Peak Rate (₹/kWh)</label>
                <input
                  type="number"
                  step="0.1"
                  value={tariffForm.peakRatePerKwh || 9.0}
                  onChange={(e) => setTariffForm({ ...tariffForm, peakRatePerKwh: Number(e.target.value) })}
                  className="w-full bg-industrial-950 border border-industrial-700 px-3 py-2 rounded text-white"
                />
              </div>

              <div>
                <label className="text-industrial-400 block mb-1">Normal Rate (₹/kWh)</label>
                <input
                  type="number"
                  step="0.1"
                  value={tariffForm.normalRatePerKwh || 7.5}
                  onChange={(e) => setTariffForm({ ...tariffForm, normalRatePerKwh: Number(e.target.value) })}
                  className="w-full bg-industrial-950 border border-industrial-700 px-3 py-2 rounded text-white"
                />
              </div>

              <div>
                <label className="text-industrial-400 block mb-1">Off-Peak Rate (₹/kWh)</label>
                <input
                  type="number"
                  step="0.1"
                  value={tariffForm.offPeakRatePerKwh || 6.0}
                  onChange={(e) => setTariffForm({ ...tariffForm, offPeakRatePerKwh: Number(e.target.value) })}
                  className="w-full bg-industrial-950 border border-industrial-700 px-3 py-2 rounded text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-industrial-400 block mb-1">Morning Peak Hours (Start - End)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={tariffForm.peakStartHour || 6}
                    onChange={(e) => setTariffForm({ ...tariffForm, peakStartHour: Number(e.target.value) })}
                    className="w-20 bg-industrial-950 border border-industrial-700 px-2 py-1 rounded text-white text-center"
                  />
                  <span>to</span>
                  <input
                    type="number"
                    value={tariffForm.peakEndHour || 10}
                    onChange={(e) => setTariffForm({ ...tariffForm, peakEndHour: Number(e.target.value) })}
                    className="w-20 bg-industrial-950 border border-industrial-700 px-2 py-1 rounded text-white text-center"
                  />
                  <span>hrs</span>
                </div>
              </div>

              <div>
                <label className="text-industrial-400 block mb-1">Apparent Demand Charge (₹/kVA/month)</label>
                <input
                  type="number"
                  value={tariffForm.demandChargePerKva || 350}
                  onChange={(e) => setTariffForm({ ...tariffForm, demandChargePerKva: Number(e.target.value) })}
                  className="w-full bg-industrial-950 border border-industrial-700 px-3 py-2 rounded text-white"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded bg-metallo-orange hover:bg-metallo-orange-glow text-white font-mono font-bold text-xs transition shadow-subtle"
            >
              <Save size={14} />
              <span>Save Tariffs</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: CSV Data Upload */}
      {activeTab === 'csv' && (
        <div className="space-y-6 max-w-3xl">
          <div className="bg-industrial-900 border border-industrial-800 rounded p-5 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  CSV Telemetry & Heat Ingestion
                </h3>
                <p className="text-industrial-400 text-xs mt-0.5">
                  Upload batch heat logs or paste raw telemetry CSV rows.
                </p>
              </div>

              <a
                href="/api/data/template"
                download="metallo_heats_template.csv"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-industrial-800 hover:bg-industrial-700 text-industrial-200 border border-industrial-700 transition"
              >
                <Download size={13} />
                <span>Download Template CSV</span>
              </a>
            </div>

            {csvUploadSuccess && (
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>CSV imported successfully! Heats and dynamic SEC calculations have been updated.</span>
              </div>
            )}

            {csvErrors && (
              <div className="p-3 bg-red-500/20 border border-red-500/40 text-red-300 rounded space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangle size={15} />
                  <span>CSV Validation Failed:</span>
                </div>
                <ul className="list-disc pl-5 space-y-0.5 text-[11px]">
                  {csvErrors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* File Upload Option */}
            <div>
              <label className="block text-industrial-300 mb-1.5 font-semibold">Option A: Upload File (.csv)</label>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="block w-full text-xs text-industrial-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-industrial-800 file:text-industrial-200 hover:file:bg-industrial-700 cursor-pointer"
              />
            </div>

            {/* Paste Raw CSV Option */}
            <div className="pt-3 border-t border-industrial-800">
              <label className="block text-industrial-300 mb-1.5 font-semibold">Option B: Paste Raw CSV Text</label>
              <textarea
                rows={5}
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                placeholder="heatId,furnaceId,productionTonnes,grade,meltingMinutes,holdingMinutes,totalEnergyKwh,averagePf&#10;H-114,F1,1.0,Grey Iron FG260,60,10,605,0.95"
                className="w-full bg-industrial-950 border border-industrial-700 p-2.5 rounded text-white font-mono text-xs"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={handleCsvTextSubmit}
                  disabled={!csvText.trim()}
                  className="px-4 py-1.5 rounded bg-metallo-orange hover:bg-metallo-orange-glow text-white font-bold text-xs transition disabled:opacity-40"
                >
                  Parse & Import CSV Text
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
