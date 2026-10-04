import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, Clock, DollarSign, TrendingDown } from 'lucide-react';

export default function AiRecommendationCard() {
  const [applied, setApplied] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="nm-card-static p-6 lg:p-7 relative overflow-hidden">
      <div 
        className="absolute -right-16 -top-16 w-64 h-64 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(124, 120, 232, 0.12) 0%, transparent 70%)'
        }}
      />

      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="nm-icon-box w-12 h-12 shrink-0 bg-[rgba(124,120,232,0.12)] text-[#7c78e8]">
            <Sparkles size={22} className="float-bob" />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="nm-badge text-[#7c78e8] font-bold">
                <Sparkles size={11} />
                METALLO AI OPTIMIZER
              </span>
              <span className="text-[11px] text-[#9da1b5]">
                Confidence: 94.8%
              </span>
            </div>

            <h4 className="text-base font-bold text-[#f5f5f7]">
              Shift Furnace F2 Tap Sequence to 18:45 (Off-Peak Transition)
            </h4>

            <p className="text-xs sm:text-sm text-[#9da1b5] max-w-2xl leading-relaxed">
              Delaying the final 400 kW superheating cycle by 22 minutes avoids coincident peak demand charges during the Evening Peak Tariff window, while keeping pouring temperature within metallurgical tolerance (1,485°C ± 10°C).
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#72c69a] bg-[rgba(114,198,154,0.12)] px-2.5 py-1 rounded-lg">
                <DollarSign size={13} />
                <span>Save ₹3,450 Demand Penalty</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#7c78e8] bg-[rgba(124,120,232,0.12)] px-2.5 py-1 rounded-lg">
                <TrendingDown size={13} />
                <span>-28 kWh/t Energy Intensity</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#9da1b5]">
                <Clock size={13} />
                <span>Zero Production Delay</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center sm:self-center gap-3 shrink-0">
          {applied ? (
            <div className="nm-badge px-4 py-2 text-[#72c69a] font-bold flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>Optimized Schedule Active</span>
            </div>
          ) : (
            <>
              <button
                onClick={() => setDismissed(true)}
                className="nm-btn px-4 py-2.5 text-xs font-bold text-[#9da1b5] hover:text-[#f5f5f7]"
              >
                Dismiss
              </button>

              <button
                onClick={() => setApplied(true)}
                className="nm-btn px-5 py-2.5 text-xs font-bold text-[#7c78e8] hover:text-[#918df2] flex items-center gap-2 group"
                style={{
                  background: 'linear-gradient(135deg, rgba(124, 120, 232, 0.08), rgba(124, 120, 232, 0.18))'
                }}
              >
                <span>Apply Optimization</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
