import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

export default function Tooltip({ text, term, children }) {
  const [visible, setVisible] = useState(false);

  return (
    <span
      className="relative inline-flex items-center gap-1 cursor-help"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children ? children : (
        <span className="text-industrial-400 hover:text-industrial-200">
          <HelpCircle size={14} />
        </span>
      )}
      {visible && (
        <div
          role="tooltip"
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-[#25283a] border border-[#2e324a] text-[#c5c9dc] text-xs rounded-[14px] shadow-[6px_6px_14px_rgba(20,21,42,0.6)] pointer-events-none"
        >
          {term && <div className="font-semibold text-[#7c78e8] mb-1">{term}</div>}
          <div className="leading-relaxed">{text}</div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#25283a]" />
        </div>
      )}
    </span>
  );
}
