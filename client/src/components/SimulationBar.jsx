import React, { useState } from 'react';
import { Play, Square, RotateCcw, Activity, FastForward } from 'lucide-react';

export default function SimulationBar({
  isRunning,
  stepCount = 0,
  onStart,
  onStop,
  onReset,
  onStep,
  speedMs = 3000,
  onSpeedChange
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
    <div className="bg-industrial-900/90 border-b border-industrial-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isRunning ? 'bg-metallo-orange shadow-glow-orange animate-ping' : 'bg-industrial-600'
            }`}
          />
          <span className="font-mono uppercase tracking-wider text-industrial-300 font-semibold flex items-center gap-1.5">
            <Activity size={14} className={isRunning ? 'text-metallo-orange' : 'text-industrial-500'} />
            {isRunning ? 'TELEMETRY STREAM: LIVE' : 'TELEMETRY STREAM: IDLE'}
          </span>
        </div>

        <span className="hidden sm:inline-block text-industrial-600">|</span>

        <span className="hidden md:inline-flex items-center gap-1 text-industrial-400">
          Cycle Step: <span className="font-mono text-industrial-200">{stepCount}</span>
        </span>

        <span className="hidden lg:inline-flex px-2 py-0.5 rounded bg-industrial-800/80 border border-industrial-700 text-[11px] text-industrial-300">
          PROTOTYPE MODE: Simulated Telemetry (Future: Native Modbus/OPC-UA)
        </span>
      </div>

      <div className="flex items-center gap-2">
        {!isRunning ? (
          <button
            onClick={() => handleAction(onStart)}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-metallo-orange hover:bg-metallo-orange-glow text-white font-medium transition shadow-subtle active:scale-95 disabled:opacity-50"
          >
            <Play size={13} fill="currentColor" />
            <span>START SIMULATION</span>
          </button>
        ) : (
          <button
            onClick={() => handleAction(onStop)}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-industrial-700 hover:bg-industrial-600 text-industrial-100 font-medium transition border border-industrial-600 active:scale-95 disabled:opacity-50"
          >
            <Square size={13} fill="currentColor" />
            <span>PAUSE SIMULATION</span>
          </button>
        )}

        <button
          onClick={() => handleAction(onStep)}
          disabled={isRunning || loading}
          title="Step single simulation cycle"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-industrial-800 hover:bg-industrial-700 text-industrial-300 hover:text-industrial-100 transition border border-industrial-700 disabled:opacity-40"
        >
          <FastForward size={13} />
          <span className="hidden sm:inline">Step</span>
        </button>

        <button
          onClick={() => handleAction(onReset)}
          disabled={loading}
          title="Reset simulation to initial baseline"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-industrial-800 hover:bg-industrial-700 text-industrial-300 hover:text-industrial-100 transition border border-industrial-700 active:scale-95 disabled:opacity-50"
        >
          <RotateCcw size={13} />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>
    </div>
  );
}
