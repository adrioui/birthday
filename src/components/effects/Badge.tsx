interface BadgeProps {
  text: string;
  variant?: 'pink' | 'lime';
  position: { top?: string; right?: string; bottom?: string; left?: string };
  rotation?: number;
}

export function Badge({ text, variant = 'lime', position, rotation = 0 }: BadgeProps) {
  const variantClasses = {
    lime: 'bg-lime text-deep-black',
    pink: 'bg-hot-pink text-white',
  };

  return (
    <span
      className={`sticker-shadow-hard pointer-events-none absolute rounded-full px-3 py-1 font-pixel text-sm font-bold ${variantClasses[variant]}`}
      style={{
        ...position,
        transform: `rotate(${rotation}deg)`,
      }}
      aria-hidden="true"
    >
      {text}
    </span>
  );
}
