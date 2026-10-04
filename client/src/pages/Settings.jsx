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
    if (onSaveSettings) {
      await onSaveSettings({
        foundry: foundryForm,
        tariffSettings: tariffForm
      });
    }
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCsvTextSubmit = async () => {
    setCsvErrors(null);
    setCsvUploadSuccess(false);
    try {
      if (onUploadCsvText) {
        const res = await onUploadCsvText(csvText);
        if (res.success) {
          setCsvUploadSuccess(true);
          setCsvText('');
        } else {
          setCsvErrors(res.errors || [res.error]);
        }
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
      if (onUploadCsvFile) {
        const res = await onUploadCsvFile(file);
        if (res.success) {
          setCsvUploadSuccess(true);
        } else {
          setCsvErrors(res.errors || [res.error]);
        }
      }
    } catch (err) {
      setCsvErrors([err.message]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-[#2a2d42] pb-4">
        <div>
          <div className="text-[11px] font-mono tracking-widest text-[#7c78e8] uppercase mb-1">
            CALCULATION ENGINE SETTINGS & INGESTION
          </div>
          <h1 className="text-2xl font-mono font-bold tracking-tight text-[#f5f5f7]">
            Plant Configuration & Telemetry Upload
          </h1>
          <p className="mt-1 text-xs text-[#9da1b5]">
            Configure foundry electrical sanctions, time-of-day tariffs, and upload historical batch telemetry.
          </p>
        </div>

        {saveSuccess && (
          <div className="px-4 py-2 rounded-[14px] bg-[#72c69a]/15 text-[#72c69a] border border-[#72c69a]/30 text-xs font-mono font-bold flex items-center gap-2 shadow-[2px_2px_6px_rgba(20,21,42,0.45)]">
            <CheckCircle2 size={15} />
            <span>Configuration saved — Dynamic calculations refreshed!</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 text-xs font-mono p-1 bg-[#1e2030] rounded-[18px] shadow-[inset_2px_2px_5px_rgba(20,21,42,0.45),inset_-2px_-2px_5px_rgba(42,45,66,0.30)] w-fit border border-[#2e324a]">
        <button
          onClick={() => setActiveTab('parameters')}
          className={`px-4 py-2 rounded-[14px] font-bold transition-all ${
            activeTab === 'parameters'
              ? 'bg-[#25283a] text-[#7c78e8] shadow-[3px_3px_6px_rgba(20,21,42,0.45),-3px_-3px_6px_rgba(42,45,66,0.35)]'
              : 'text-[#9da1b5] hover:text-[#f5f5f7]'
          }`}
        >
          Foundry Thresholds & Constraints
        </button>

        <button
          onClick={() => setActiveTab('tariffs')}
          className={`px-4 py-2 rounded-[14px] font-bold transition-all ${
            activeTab === 'tariffs'
              ? 'bg-[#25283a] text-[#7c78e8] shadow-[3px_3px_6px_rgba(20,21,42,0.45),-3px_-3px_6px_rgba(42,45,66,0.35)]'
              : 'text-[#9da1b5] hover:text-[#f5f5f7]'
          }`}
        >
          DISCOM Time-of-Day Tariffs
        </button>

        <button
          onClick={() => setActiveTab('csv')}
          className={`px-4 py-2 rounded-[14px] font-bold transition-all ${
            activeTab === 'csv'
              ? 'bg-[#25283a] text-[#7c78e8] shadow-[3px_3px_6px_rgba(20,21,42,0.45),-3px_-3px_6px_rgba(42,45,66,0.35)]'
              : 'text-[#9da1b5] hover:text-[#f5f5f7]'
          }`}
        >
          CSV Telemetry & Heat Upload
        </button>
      </div>

      {/* Tab 1: Plant Parameters Form */}
      {activeTab === 'parameters' && (
        <form onSubmit={handleSettingsSubmit} className="space-y-6 max-w-3xl">
          <div className="bg-[#25283a] border border-[#2e324a] rounded-[24px] p-6 shadow-[6px_6px_14px_rgba(20,21,42,0.45),-6px_-6px_14px_rgba(42,45,66,0.35)] space-y-4 font-mono text-xs">
            <h3 className="text-sm font-bold text-[#f5f5f7] uppercase tracking-wider mb-2">
              Foundry Sanctions & Operating Thresholds
            </h3>

            <div>
              <label className="text-[#9da1b5] block mb-1.5 font-semibold">Foundry Plant Name</label>
              <input
                type="text"
                value={foundryForm.name || ''}
                onChange={(e) => setFoundryForm({ ...foundryForm, name: e.target.value })}
                className="w-full nm-inset border border-[#2e324a] px-3.5 py-2.5 rounded-[12px] text-[#f5f5f7] outline-none focus:border-[#7c78e8]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[#9da1b5] block mb-1.5 font-semibold">Contract Demand Sanction (kW)</label>
                <input
                  type="number"
                  value={foundryForm.contractDemandKw || 1400}
                  onChange={(e) => setFoundryForm({ ...foundryForm, contractDemandKw: Number(e.target.value) })}
                  className="w-full nm-inset border border-[#2e324a] px-3.5 py-2.5 rounded-[12px] text-[#f5f5f7] outline-none focus:border-[#7c78e8]"
                />
                <span className="text-[10px] text-[#9da1b5] mt-1 block">Maximum permissible grid draw</span>
              </div>

              <div>
                <label className="text-[#9da1b5] block mb-1.5 font-semibold">Demand Warning Threshold (kW)</label>
                <input
                  type="number"
                  value={foundryForm.demandThresholdKw || 1100}
                  onChange={(e) => setFoundryForm({ ...foundryForm, demandThresholdKw: Number(e.target.value) })}
                  className="w-full nm-inset border border-[#2e324a] px-3.5 py-2.5 rounded-[12px] text-[#f5f5f7] outline-none focus:border-[#7c78e8]"
                />
                <span className="text-[10px] text-[#9da1b5] mt-1 block">Triggers CRITICAL demand alarm</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[#9da1b5] block mb-1.5 font-semibold">Target Power Factor (PF)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.8"
                  max="1.0"
                  value={foundryForm.powerFactorThreshold || 0.95}
                  onChange={(e) => setFoundryForm({ ...foundryForm, powerFactorThreshold: Number(e.target.value) })}
                  className="w-full nm-inset border border-[#2e324a] px-3.5 py-2.5 rounded-[12px] text-[#f5f5f7] outline-none focus:border-[#7c78e8]"
                />
              </div>

              <div>
                <label className="text-[#9da1b5] block mb-1.5 font-semibold">Holding Threshold (min)</label>
                <input
                  type="number"
                  value={foundryForm.holdingThresholdMinutes || 30}
                  onChange={(e) => setFoundryForm({ ...foundryForm, holdingThresholdMinutes: Number(e.target.value) })}
                  className="w-full nm-inset border border-[#2e324a] px-3.5 py-2.5 rounded-[12px] text-[#f5f5f7] outline-none focus:border-[#7c78e8]"
                />
              </div>

              <div>
                <label className="text-[#9da1b5] block mb-1.5 font-semibold">Scheduler Buffer (min)</label>
                <input
                  type="number"
                  value={foundryForm.safetyBufferMinutes || 15}
                  onChange={(e) => setFoundryForm({ ...foundryForm, safetyBufferMinutes: Number(e.target.value) })}
                  className="w-full nm-inset border border-[#2e324a] px-3.5 py-2.5 rounded-[12px] text-[#f5f5f7] outline-none focus:border-[#7c78e8]"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="nm-btn flex items-center gap-2 px-5 py-2.5 rounded-[16px] bg-[#7c78e8] hover:bg-[#918df2] text-[#f5f5f7] font-mono font-bold text-xs transition shadow-[4px_4px_10px_rgba(20,21,42,0.45)]"
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
          <div className="bg-[#25283a] border border-[#2e324a] rounded-[24px] p-6 shadow-[6px_6px_14px_rgba(20,21,42,0.45),-6px_-6px_14px_rgba(42,45,66,0.35)] space-y-4 font-mono text-xs">
            <h3 className="text-sm font-bold text-[#f5f5f7] uppercase tracking-wider mb-2">
              DISCOM Commercial Electricity Tariffs
            </h3>

            <div>
              <label className="text-[#9da1b5] block mb-1.5 font-semibold">Utility / DISCOM Tariff Schedule</label>
              <input
                type="text"
                value={tariffForm.discomName || ''}
                onChange={(e) => setTariffForm({ ...tariffForm, discomName: e.target.value })}
                className="w-full nm-inset border border-[#2e324a] px-3.5 py-2.5 rounded-[12px] text-[#f5f5f7] outline-none focus:border-[#7c78e8]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[#9da1b5] block mb-1.5 font-semibold">Peak Rate (₹/kWh)</label>
                <input
                  type="number"
                  step="0.1"
                  value={tariffForm.peakRatePerKwh || 9.5}
                  onChange={(e) => setTariffForm({ ...tariffForm, peakRatePerKwh: Number(e.target.value) })}
                  className="w-full nm-inset border border-[#2e324a] px-3.5 py-2.5 rounded-[12px] text-[#f5f5f7] outline-none focus:border-[#7c78e8]"
                />
              </div>

              <div>
                <label className="text-[#9da1b5] block mb-1.5 font-semibold">Normal Rate (₹/kWh)</label>
                <input
                  type="number"
                  step="0.1"
                  value={tariffForm.normalRatePerKwh || 7.5}
                  onChange={(e) => setTariffForm({ ...tariffForm, normalRatePerKwh: Number(e.target.value) })}
                  className="w-full nm-inset border border-[#2e324a] px-3.5 py-2.5 rounded-[12px] text-[#f5f5f7] outline-none focus:border-[#7c78e8]"
                />
              </div>

              <div>
                <label className="text-[#9da1b5] block mb-1.5 font-semibold">Off-Peak Rate (₹/kWh)</label>
                <input
                  type="number"
                  step="0.1"
                  value={tariffForm.offPeakRatePerKwh || 6.0}
                  onChange={(e) => setTariffForm({ ...tariffForm, offPeakRatePerKwh: Number(e.target.value) })}
                  className="w-full nm-inset border border-[#2e324a] px-3.5 py-2.5 rounded-[12px] text-[#f5f5f7] outline-none focus:border-[#7c78e8]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[#9da1b5] block mb-1.5 font-semibold">Morning Peak Hours (Start - End)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={tariffForm.peakStartHour || 6}
                    onChange={(e) => setTariffForm({ ...tariffForm, peakStartHour: Number(e.target.value) })}
                    className="w-20 nm-inset border border-[#2e324a] px-2 py-1.5 rounded-[10px] text-[#f5f5f7] text-center outline-none"
                  />
                  <span className="text-[#9da1b5]">to</span>
                  <input
                    type="number"
                    value={tariffForm.peakEndHour || 10}
                    onChange={(e) => setTariffForm({ ...tariffForm, peakEndHour: Number(e.target.value) })}
                    className="w-20 nm-inset border border-[#2e324a] px-2 py-1.5 rounded-[10px] text-[#f5f5f7] text-center outline-none"
                  />
                  <span className="text-[#9da1b5]">hrs</span>
                </div>
              </div>

              <div>
                <label className="text-[#9da1b5] block mb-1.5 font-semibold">Apparent Demand Charge (₹/kVA/month)</label>
                <input
                  type="number"
                  value={tariffForm.demandChargePerKva || 350}
                  onChange={(e) => setTariffForm({ ...tariffForm, demandChargePerKva: Number(e.target.value) })}
                  className="w-full nm-inset border border-[#2e324a] px-3.5 py-2.5 rounded-[12px] text-[#f5f5f7] outline-none focus:border-[#7c78e8]"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="nm-btn flex items-center gap-2 px-5 py-2.5 rounded-[16px] bg-[#7c78e8] hover:bg-[#918df2] text-[#f5f5f7] font-mono font-bold text-xs transition shadow-[4px_4px_10px_rgba(20,21,42,0.45)]"
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
          <div className="bg-[#25283a] border border-[#2e324a] rounded-[24px] p-6 shadow-[6px_6px_14px_rgba(20,21,42,0.45),-6px_-6px_14px_rgba(42,45,66,0.35)] space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#f5f5f7] uppercase tracking-wider">
                  CSV Telemetry & Heat Ingestion
                </h3>
                <p className="text-[#9da1b5] text-xs mt-0.5">
                  Upload batch heat logs or paste raw telemetry CSV rows.
                </p>
              </div>

              <a
                href="/api/data/template"
                download="metallo_heats_template.csv"
                className="nm-btn flex items-center gap-1.5 px-3.5 py-2 rounded-[14px] text-[#c5c9dc] border border-[#2e324a] hover:text-[#f5f5f7] transition"
              >
                <Download size={13} />
                <span>Download Template CSV</span>
              </a>
            </div>

            {csvUploadSuccess && (
              <div className="p-3.5 bg-[#72c69a]/15 border border-[#72c69a]/30 text-[#72c69a] rounded-[14px] flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>CSV imported successfully! Heats and dynamic SEC calculations have been updated.</span>
              </div>
            )}

            {csvErrors && (
              <div className="p-3.5 bg-[#d87878]/15 border border-[#d87878]/30 text-[#d87878] rounded-[14px] space-y-1">
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
            <div className="nm-inset p-4 rounded-[16px] border border-[#2e324a]">
              <label className="block text-[#f5f5f7] mb-2 font-bold">Option A: Upload File (.csv)</label>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="block w-full text-xs text-[#9da1b5] file:mr-4 file:py-2 file:px-4 file:rounded-[10px] file:border-0 file:text-xs file:font-bold file:bg-[#25283a] file:text-[#7c78e8] hover:file:bg-[#202234] cursor-pointer"
              />
            </div>

            {/* Paste Raw CSV Option */}
            <div className="nm-inset p-4 rounded-[16px] border border-[#2e324a]">
              <label className="block text-[#f5f5f7] mb-2 font-bold">Option B: Paste Raw CSV Text</label>
              <textarea
                rows={5}
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                placeholder="heatId,furnaceId,productionTonnes,grade,meltingMinutes,holdingMinutes,totalEnergyKwh,averagePf&#10;H-114,F1,1.0,Grey Iron FG260,60,10,605,0.95"
                className="w-full bg-[#1e2030] border border-[#2e324a] p-3 rounded-[12px] text-[#f5f5f7] font-mono text-xs outline-none focus:border-[#7c78e8]"
              />
              <div className="flex justify-end mt-2.5">
                <button
                  type="button"
                  onClick={handleCsvTextSubmit}
                  disabled={!csvText.trim()}
                  className="nm-btn px-4 py-2 rounded-[14px] bg-[#7c78e8] hover:bg-[#918df2] text-[#f5f5f7] font-bold text-xs transition disabled:opacity-40"
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
