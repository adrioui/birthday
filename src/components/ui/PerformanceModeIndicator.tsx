import { useReducedMotion } from '../../hooks';

export function PerformanceModeIndicator() {
  const prefersReduced = useReducedMotion();

  if (!prefersReduced) return null;

  return (
    <div
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 px-3 py-1.5 bg-slate-800/90 backdrop-blur-sm rounded-lg border border-slate-600 shadow-lg"
      role="status"
      aria-label="Performance mode active - reduced motion enabled"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#CCFF00"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        <circle cx="12" cy="12" r="4" />
      </svg>
      <span className="font-pixel text-xs text-lime uppercase tracking-wider">Perf Mode</span>
    </div>
  );
}
