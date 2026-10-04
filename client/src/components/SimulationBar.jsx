import React, { useState } from 'react';
import { Play, Square, RotateCcw, Activity, FastForward } from 'lucide-react';

export default function SimulationBar({
  isRunning,
  stepCount = 0,
  onStart,
  onStop,
  onReset,
  onStep
}) {
  const [loading, setLoading] = useState(false);

  const handleAction = async (fn) => {
    try {
      setLoading(true);
      await fn();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="nm-raised-container px-5 py-3 mb-6 flex flex-wrap items-center justify-between gap-4 text-xs">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isRunning ? 'bg-[#72c69a] dot-pulse' : 'bg-[#9da1b5]'
            }`}
          />
          <span className="font-mono uppercase tracking-wider text-[#f5f5f7] font-bold flex items-center gap-1.5 text-[11px]">
            <Activity size={14} className={isRunning ? 'text-[#72c69a]' : 'text-[#9da1b5]'} />
            {isRunning ? 'TELEMETRY: LIVE' : 'TELEMETRY: STANDBY'}
          </span>
        </div>

        <span className="hidden sm:inline-block text-[rgba(42,45,66,0.8)]">|</span>

        <span className="hidden md:inline-flex items-center gap-1.5 text-[#9da1b5] text-xs">
          Cycle Step: <span className="font-mono font-bold text-[#f5f5f7]">{stepCount}</span>
        </span>

        <span className="hidden lg:inline-flex nm-badge text-[10px] text-[#9da1b5]">
          Edge Telemetry Emulator
        </span>
      </div>

      <div className="flex items-center gap-2.5">
        {!isRunning ? (
          <button
            onClick={() => handleAction(onStart)}
            disabled={loading}
            className="nm-btn px-3.5 py-1.5 text-xs font-bold text-[#72c69a] flex items-center gap-1.5"
          >
            <Play size={13} fill="currentColor" />
            <span>START STREAM</span>
          </button>
        ) : (
          <button
            onClick={() => handleAction(onStop)}
            disabled={loading}
            className="nm-btn px-3.5 py-1.5 text-xs font-bold text-[#d8aa55] flex items-center gap-1.5"
          >
            <Square size={13} fill="currentColor" />
            <span>PAUSE STREAM</span>
          </button>
        )}

        <button
          onClick={() => handleAction(onStep)}
          disabled={isRunning || loading}
          title="Step single simulation cycle"
          className="nm-btn px-2.5 py-1.5 text-xs font-bold text-[#c5c9dc] flex items-center gap-1 disabled:opacity-40"
        >
          <FastForward size={13} />
          <span className="hidden sm:inline">Step</span>
        </button>

        <button
          onClick={() => handleAction(onReset)}
          disabled={loading}
          title="Reset simulation to initial baseline"
          className="nm-btn px-2.5 py-1.5 text-xs font-bold text-[#c5c9dc] flex items-center gap-1 disabled:opacity-40"
        >
          <RotateCcw size={13} />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>
    </div>
  );
}
