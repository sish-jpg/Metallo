import React, { useState } from 'react';
import {
  Bell,
  ShieldAlert,
  AlertTriangle,
  Info,
  CheckCircle2,
  Clock,
  Check,
  Filter
} from 'lucide-react';
import { formatTime, formatDateTime } from '../utils/formatters';

export default function Alerts({ alertsData, onAcknowledge, onResolve }) {
  const [selectedType, setSelectedType] = useState('ALL');
  const [showResolved, setShowResolved] = useState(false);

  if (!alertsData) {
    return (
      <div className="p-8 text-center text-industrial-400 font-mono text-sm">
        Loading foundry alerts...
      </div>
    );
  }

  const { counts = {}, alerts = [] } = alertsData;

  const filtered = alerts.filter((a) => {
    if (!showResolved && a.resolved) return false;
    if (selectedType !== 'ALL' && a.type !== selectedType) return false;
    return true;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-industrial-800 pb-4">
        <div>
          <div className="text-[11px] font-mono tracking-widest text-industrial-400 uppercase">
            OPERATIONAL EXPLAINABLE ADVISORY
          </div>
          <h1 className="text-2xl font-mono font-bold tracking-tight text-white mt-0.5">
            Active Industrial Alerts
          </h1>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="px-3 py-1 rounded bg-red-500/20 text-red-400 border border-red-500/40 font-bold">
            {counts.critical || 0} Critical
          </span>
          <span className="px-3 py-1 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold">
            {counts.warning || 0} Warning
          </span>
          <span className="px-3 py-1 rounded bg-blue-500/20 text-blue-400 border border-blue-500/40 font-bold">
            {counts.info || 0} Info
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-industrial-900 border border-industrial-800 p-3.5 rounded text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="text-industrial-400 flex items-center gap-1">
            <Filter size={13} />
            <span>Filter Type:</span>
          </span>
          <div className="flex items-center gap-1 bg-industrial-950 p-1 rounded border border-industrial-800">
            {['ALL', 'CRITICAL', 'WARNING', 'INFO'].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-3 py-1 rounded text-xs font-semibold transition ${
                  selectedType === t
                    ? 'bg-industrial-800 text-white shadow-sm'
                    : 'text-industrial-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-1.5 text-industrial-300 cursor-pointer ml-3">
            <input
              type="checkbox"
              checked={showResolved}
              onChange={(e) => setShowResolved(e.target.checked)}
              className="rounded bg-industrial-950 border-industrial-700 text-metallo-orange focus:ring-0"
            />
            <span>Include Resolved Alerts</span>
          </label>
        </div>

        <div className="text-industrial-400">
          Showing <span className="text-white font-bold">{filtered.length}</span> alerts
        </div>
      </div>

      {/* Alert Cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-industrial-900 border border-industrial-800 rounded p-12 text-center text-industrial-500 font-mono text-xs">
            No alerts matching current filter parameters.
          </div>
        ) : (
          filtered.map((alert) => {
            const isCritical = alert.type === 'CRITICAL';
            const isWarning = alert.type === 'WARNING';

            const badgeTheme = isCritical
              ? 'bg-red-500/20 text-red-400 border-red-500/40'
              : isWarning
              ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
              : 'bg-blue-500/20 text-blue-400 border-blue-500/40';

            return (
              <div
                key={alert.alertId}
                className={`bg-industrial-900 border rounded p-4 font-mono text-xs space-y-3 transition ${
                  alert.resolved
                    ? 'opacity-60 border-industrial-800/60'
                    : isCritical
                    ? 'border-red-500/50 bg-red-950/10'
                    : isWarning
                    ? 'border-amber-500/40'
                    : 'border-industrial-800'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${badgeTheme}`}>
                      {alert.type}
                    </span>
                    <span className="text-industrial-400 uppercase text-[11px]">
                      {alert.category}
                    </span>
                    {alert.furnaceId && (
                      <span className="px-2 py-0.5 rounded bg-industrial-800 text-white font-bold">
                        {alert.furnaceId}
                      </span>
                    )}
                    {alert.heatId && (
                      <span className="text-industrial-400 text-[11px]">
                        Heat: <span className="text-industrial-200">{alert.heatId}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-industrial-400 text-[11px]">
                    <span>{formatDateTime(alert.timestamp)}</span>
                    {alert.acknowledged && !alert.resolved && (
                      <span className="text-industrial-300">Acknowledged</span>
                    )}
                    {alert.resolved && (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 size={12} /> Resolved
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-bold text-white mb-1">{alert.title}</div>
                  <p className="text-industrial-300 leading-relaxed">{alert.message}</p>
                </div>

                {/* Values Matrix */}
                {(alert.observedValue || alert.thresholdValue) && (
                  <div className="flex flex-wrap gap-4 text-[11px] bg-industrial-950 p-2.5 rounded border border-industrial-800/80">
                    <div>
                      <span className="text-industrial-500">Observed Value: </span>
                      <span className="text-white font-bold">{alert.observedValue}</span>
                    </div>
                    <div>
                      <span className="text-industrial-500">Configured Threshold: </span>
                      <span className="text-industrial-300 font-semibold">{alert.thresholdValue}</span>
                    </div>
                  </div>
                )}

                {/* Explainable Operator Action */}
                <div className="bg-industrial-950 p-3 rounded border border-industrial-800 text-industrial-300 flex items-start gap-2">
                  <ShieldAlert size={15} className="text-metallo-orange shrink-0 mt-0.5" />
                  <div>
                    <span className="text-metallo-orange font-semibold">Recommended Inspection / Action: </span>
                    <span className="text-industrial-200">{alert.explainableAction}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                {!alert.resolved && (
                  <div className="flex justify-end gap-2 pt-1">
                    {!alert.acknowledged && (
                      <button
                        onClick={() => onAcknowledge(alert.alertId)}
                        className="px-3 py-1.5 rounded bg-industrial-800 hover:bg-industrial-700 text-industrial-200 text-xs transition"
                      >
                        Acknowledge
                      </button>
                    )}
                    <button
                      onClick={() => onResolve(alert.alertId)}
                      className="px-3 py-1.5 rounded bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs transition flex items-center gap-1"
                    >
                      <Check size={13} />
                      <span>Mark Resolved</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
