import { type ReactNode } from 'react';

export type CardBackgroundVariant = 'sms' | 'wallet' | 'phone' | 'camcorder' | 'cake' | 'default';

export interface CardBackgroundProps {
  children: ReactNode;
  variant?: CardBackgroundVariant;
  className?: string;
}

const gradientVariants: Record<CardBackgroundVariant, string> = {
  sms: 'bg-gradient-to-br from-periwinkle-light via-periwinkle to-periwinkle-dark',
  wallet: 'bg-gradient-to-br from-[#dce8ff] via-[#abc1ff] to-[#8c9eff]',
  phone: 'bg-gradient-to-br from-gray-200 via-gray-100 to-gray-300',
  camcorder: 'bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50',
  cake: 'bg-gradient-to-br from-orange-50 via-red-50 to-pink-50',
  default: 'bg-gradient-to-br from-white via-gray-50 to-gray-100',
};

export function CardBackground({
  children,
  variant = 'default',
  className = '',
  ...props
}: CardBackgroundProps & Record<string, unknown>) {
  const gradientClass = gradientVariants[variant];

  return (
    <div
      className={`relative border-[4px] border-deep-black sticker-shadow-hard ${className}`}
      {...props}
    >
      {/* Gradient base layer */}
      <div className={`absolute inset-0 ${gradientClass}`} />

      {/* Paper texture overlay */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: "url('/textures/paper-grain.png')",
          backgroundSize: '200px 200px',
        }}
        aria-hidden="true"
      />

      {/* Content layer */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
