import React, { useState, useEffect } from 'react';

/**
 * Animated counter that smoothly increments from 0 to target value
 */
export default function AnimatedCounter({
  target,
  duration = 1200,
  decimals = 0,
  prefix = '',
  suffix = ''
}) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const startValue = 0;
    const targetValue = typeof target === 'number' ? target : parseFloat(target) || 0;

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easedProgress = easeOutCubic(progress);
      const val = startValue + (targetValue - startValue) * easedProgress;

      setCurrent(val);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCurrent(targetValue);
      }
    };

    const animFrame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animFrame);
  }, [target, duration]);

  const formatted = decimals > 0 
    ? current.toFixed(decimals) 
    : Math.round(current).toLocaleString();

  return <span>{prefix}{formatted}{suffix}</span>;
}
