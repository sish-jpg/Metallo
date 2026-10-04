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
      <div className="p-8 text-center text-[#9da1b5] font-mono text-sm">
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
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-[#2a2d42] pb-4">
        <div>
          <div className="text-[11px] font-mono tracking-widest text-[#7c78e8] uppercase mb-1">
            OPERATIONAL EXPLAINABLE ADVISORY
          </div>
          <h1 className="text-2xl font-mono font-bold tracking-tight text-[#f5f5f7]">
            Active Industrial Alerts
          </h1>
          <p className="mt-1 text-xs text-[#9da1b5]">
            Engineering explainability engine: clear root-cause telemetry and actionable physical inspection points.
          </p>
        </div>

        <div className="flex items-center gap-2.5 text-xs font-mono">
          <span className="nm-badge bg-[#d87878]/15 text-[#d87878] border border-[#d87878]/30 font-bold px-3 py-1">
            {counts.critical || 0} Critical
          </span>
          <span className="nm-badge bg-[#d8aa55]/15 text-[#d8aa55] border border-[#d8aa55]/30 font-bold px-3 py-1">
            {counts.warning || 0} Warning
          </span>
          <span className="nm-badge bg-[#7c78e8]/15 text-[#7c78e8] border border-[#7c78e8]/30 font-bold px-3 py-1">
            {counts.info || 0} Info
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#25283a] border border-[#2e324a] p-4 rounded-[20px] shadow-[4px_4px_10px_rgba(20,21,42,0.45),-4px_-4px_10px_rgba(42,45,66,0.35)] text-xs font-mono">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-[#9da1b5] flex items-center gap-1.5">
            <Filter size={13} className="text-[#7c78e8]" />
            <span>Filter Type:</span>
          </span>

          <div className="flex items-center gap-1 bg-[#1e2030] p-1 rounded-[14px] border border-[#2e324a] shadow-[inset_2px_2px_4px_rgba(20,21,42,0.45)]">
            {['ALL', 'CRITICAL', 'WARNING', 'INFO'].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-3 py-1 rounded-[10px] text-xs font-bold transition-all ${
                  selectedType === t
                    ? 'bg-[#25283a] text-[#7c78e8] shadow-[2px_2px_5px_rgba(20,21,42,0.45)]'
                    : 'text-[#9da1b5] hover:text-[#f5f5f7]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 text-[#c5c9dc] cursor-pointer ml-1">
            <input
              type="checkbox"
              checked={showResolved}
              onChange={(e) => setShowResolved(e.target.checked)}
              className="rounded bg-[#1e2030] border-[#2e324a] text-[#7c78e8] focus:ring-0"
            />
            <span>Include Resolved Alerts</span>
          </label>
        </div>

        <div className="text-[#9da1b5]">
          Displaying <span className="text-[#f5f5f7] font-bold">{filtered.length}</span> alerts
        </div>
      </div>

      {/* Alert Cards */}
      <div className="space-y-3.5">
        {filtered.length === 0 ? (
          <div className="bg-[#25283a] border border-[#2e324a] rounded-[24px] p-12 text-center text-[#9da1b5] font-mono text-xs shadow-[4px_4px_10px_rgba(20,21,42,0.45)]">
            No alerts matching current filter parameters. Foundry running smoothly.
          </div>
        ) : (
          filtered.map((alert) => {
            const isCritical = alert.type === 'CRITICAL';
            const isWarning = alert.type === 'WARNING';

            const badgeTheme = isCritical
              ? 'bg-[#d87878]/15 text-[#d87878] border-[#d87878]/30'
              : isWarning
              ? 'bg-[#d8aa55]/15 text-[#d8aa55] border-[#d8aa55]/30'
              : 'bg-[#7c78e8]/15 text-[#7c78e8] border-[#7c78e8]/30';

            return (
              <div
                key={alert.alertId || alert._id}
                className={`bg-[#25283a] border rounded-[22px] p-5 font-mono text-xs space-y-3.5 shadow-[4px_4px_10px_rgba(20,21,42,0.45),-4px_-4px_10px_rgba(42,45,66,0.35)] transition-all ${
                  alert.resolved
                    ? 'opacity-60 border-[#2e324a]'
                    : isCritical
                    ? 'border-[#d87878]/50 hover:border-[#d87878]'
                    : isWarning
                    ? 'border-[#d8aa55]/40 hover:border-[#d8aa55]'
                    : 'border-[#2e324a] hover:border-[#7c78e8]/50'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-[8px] text-[11px] font-bold border ${badgeTheme}`}>
                      {alert.type}
                    </span>
                    <span className="text-[#9da1b5] uppercase text-[11px] font-semibold">
                      {alert.category}
                    </span>
                    {alert.furnaceId && (
                      <span className="px-2 py-0.5 rounded-[8px] bg-[#1e2030] border border-[#2e324a] text-[#7c78e8] font-bold">
                        {alert.furnaceId}
                      </span>
                    )}
                    {alert.heatId && (
                      <span className="text-[#9da1b5] text-[11px]">
                        Heat: <span className="text-[#f5f5f7] font-semibold">{alert.heatId}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-[#9da1b5] text-[11px]">
                    <span>{formatDateTime(alert.timestamp)}</span>
                    {alert.acknowledged && !alert.resolved && (
                      <span className="text-[#d8aa55] font-semibold">Acknowledged</span>
                    )}
                    {alert.resolved && (
                      <span className="text-[#72c69a] font-semibold flex items-center gap-1">
                        <CheckCircle2 size={13} /> Resolved
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-base font-bold text-[#f5f5f7] mb-1">{alert.title}</div>
                  <p className="text-xs text-[#9da1b5] leading-relaxed">{alert.message}</p>
                </div>

                {/* Values Matrix */}
                {(alert.observedValue || alert.thresholdValue) && (
                  <div className="flex flex-wrap gap-4 text-[11px] nm-inset p-3 rounded-[14px] border border-[#2e324a]">
                    <div>
                      <span className="text-[#9da1b5]">Observed Value: </span>
                      <span className="text-[#f5f5f7] font-bold">{alert.observedValue}</span>
                    </div>
                    <div>
                      <span className="text-[#9da1b5]">Configured Threshold: </span>
                      <span className="text-[#c5c9dc] font-semibold">{alert.thresholdValue}</span>
                    </div>
                  </div>
                )}

                {/* Explainable Operator Action */}
                <div className="nm-inset p-3.5 rounded-[14px] border border-[#2e324a] text-xs flex items-start gap-2.5">
                  <ShieldAlert size={15} className="text-[#7c78e8] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#7c78e8] font-bold">Recommended Inspection / Action: </span>
                    <span className="text-[#c5c9dc] leading-relaxed">{alert.explainableAction}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                {!alert.resolved && (
                  <div className="flex justify-end gap-2.5 pt-1">
                    {!alert.acknowledged && (
                      <button
                        onClick={() => onAcknowledge(alert.alertId)}
                        className="nm-btn px-3.5 py-1.5 rounded-[12px] text-[#c5c9dc] hover:text-[#f5f5f7] text-xs transition"
                      >
                        Acknowledge
                      </button>
                    )}
                    <button
                      onClick={() => onResolve(alert.alertId)}
                      className="nm-btn px-4 py-1.5 rounded-[12px] bg-[#72c69a]/20 border border-[#72c69a]/40 text-[#72c69a] hover:bg-[#72c69a]/30 font-bold text-xs transition flex items-center gap-1.5"
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
