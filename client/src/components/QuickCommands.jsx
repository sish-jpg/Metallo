import React, { useState } from 'react';
import { Plus, Zap, Flame, Download, CheckCircle2 } from 'lucide-react';

export default function QuickCommands({ onCommand }) {
  const [activeFeedback, setActiveFeedback] = useState(null);

  const handleAction = (id, label) => {
    setActiveFeedback(label);
    if (onCommand) onCommand(id);
    setTimeout(() => setActiveFeedback(null), 2000);
  };

  const commands = [
    {
      id: 'log-heat',
      label: 'Log Heat Cycle',
      icon: Plus,
      color: 'text-[#7c78e8]'
    },
    {
      id: 'peak-shave',
      label: 'Peak Shave Mode',
      icon: Zap,
      color: 'text-[#d8aa55]'
    },
    {
      id: 'tapping-sequence',
      label: 'Tapping Sequence',
      icon: Flame,
      color: 'text-[#ff7a1a]'
    },
    {
      id: 'export-telemetry',
      label: 'Export Telemetry',
      icon: Download,
      color: 'text-[#72c69a]'
    }
  ];

  return (
    <div className="my-8">
      <div className="flex items-center justify-between mb-4">
        <div className="text-[11px] font-bold tracking-[0.2em] text-[#9da1b5] uppercase">
          Quick Commands
        </div>
        {activeFeedback && (
          <div className="text-xs font-semibold text-[#72c69a] flex items-center gap-1.5 animate-fadeIn">
            <CheckCircle2 size={13} />
            <span>Activated: {activeFeedback}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {commands.map((cmd) => {
          const Icon = cmd.icon;
          return (
            <button
              key={cmd.id}
              onClick={() => handleAction(cmd.id, cmd.label)}
              className="nm-btn px-4 py-3.5 flex items-center justify-center gap-2.5 text-xs font-semibold text-[#f5f5f7] hover:text-[#7c78e8]"
            >
              <Icon size={16} className={cmd.color} />
              <span>{cmd.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
