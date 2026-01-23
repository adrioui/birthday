interface FloatingChromeTextProps {
  text: string;
  position: { top?: string; right?: string; bottom?: string; left?: string };
  rotation?: number;
  size?: 'text-6xl' | 'text-7xl' | 'text-8xl' | 'text-9xl';
  showPlate?: boolean;
}

export function FloatingChromeText({
  text,
  position,
  rotation = 0,
  size = 'text-8xl',
  showPlate = false,
}: FloatingChromeTextProps) {
  const content = <h1 className={`chrome-text transform ${size} font-black italic`}>{text}</h1>;

  return (
    <div
      className="pointer-events-none absolute select-none"
      style={{
        ...position,
        transform: `rotate(${rotation}deg)`,
      }}
      aria-hidden="true"
    >
      {showPlate ? (
        <div className="text-bg-plate inline-block px-4 py-2 rounded-xl">{content}</div>
      ) : (
        content
      )}
    </div>
  );
}
