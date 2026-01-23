import { forwardRef } from 'react';

interface SnapButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export const SnapButton = forwardRef<HTMLButtonElement, SnapButtonProps>(function SnapButton(
  { onClick, disabled = false },
  ref
) {
  return (
    <button
      ref={ref}
      onClick={onClick}
      disabled={disabled}
      aria-label="Take a photo"
      data-testid="snap-button"
      className="snap-btn-focus relative group cursor-pointer active:scale-95 transition-transform duration-100 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <div
        className={`
            size-24 rounded-full 
            bg-gradient-to-b from-[#FF0099] to-[#be0072] 
            shadow-[0_8px_0_#83004f,0_15px_20px_rgba(0,0,0,0.3)] 
            border-4 border-white/20 
            flex items-center justify-center 
            relative overflow-hidden
            group-active:shadow-[0_2px_0_#83004f] 
            group-active:translate-y-[6px]
            group-disabled:shadow-[0_8px_0_#83004f]
            group-disabled:translate-y-0
          `}
      >
        <div className="absolute top-[-10%] left-[20%] w-[60%] h-[50%] bg-gradient-to-b from-white/60 to-transparent rounded-full blur-[2px]" />
        <div className="absolute bottom-[10%] left-[30%] w-[40%] h-[20%] bg-white/10 rounded-full blur-[4px]" />
        <span className="relative z-10 text-white font-black text-xl italic tracking-wider drop-shadow-md font-display">
          SNAP
        </span>
      </div>
    </button>
  );
});
