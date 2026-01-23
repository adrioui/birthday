import { type ReactNode } from 'react';

export type ScreenBackgroundVariant = 'wallet' | 'default';

interface ScreenBackgroundProps {
  children: ReactNode;
  variant?: ScreenBackgroundVariant;
  className?: string;
}

const gradientVariants: Record<ScreenBackgroundVariant, string> = {
  wallet: 'bg-gradient-to-br from-[#dce8ff] via-[#abc1ff] to-[#8c9eff]',
  default: 'bg-gradient-to-br from-[#dce8ff] via-[#abc1ff] to-[#8c9eff]',
};

export function ScreenBackground({
  children,
  variant = 'default',
  className = '',
}: ScreenBackgroundProps) {
  return (
    <div className={`flex min-h-dvh flex-col relative overflow-hidden ${className}`}>
      {/* Gradient base */}
      <div className={`absolute inset-0 ${gradientVariants[variant]} z-0`} />

      {/* Paper texture overlay */}
      <div
        className="absolute inset-0 opacity-30 mix-blend-overlay z-0 pointer-events-none"
        style={{
          backgroundImage: "url('/textures/paper-grain.png')",
          backgroundSize: '200px 200px',
        }}
        aria-hidden="true"
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)',
          backgroundSize: '40px 40px',
        }}
        aria-hidden="true"
      />

      {/* Content */}
      {children}
    </div>
  );
}
