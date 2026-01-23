interface StickerProps {
  position: { top?: string; right?: string; bottom?: string; left?: string };
  rotation?: number;
  children: React.ReactNode;
}

export function Sticker({ position, rotation = 0, children }: StickerProps) {
  return (
    <div
      className="sticker-shadow-hard pointer-events-none absolute"
      style={{
        ...position,
        transform: `rotate(${rotation}deg)`,
      }}
      aria-hidden="true"
    >
      {children}
    </div>
  );
}
