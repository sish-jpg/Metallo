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
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2.5 bg-industrial-900 border border-industrial-700 text-industrial-200 text-xs rounded shadow-xl pointer-events-none"
        >
          {term && <div className="font-semibold text-metallo-orange mb-0.5">{term}</div>}
          <div>{text}</div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-industrial-900" />
        </div>
      )}
    </span>
  );
}
