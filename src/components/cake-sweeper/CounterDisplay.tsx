interface CounterDisplayProps {
  value: number;
  label: string;
  labelIcon: string;
}

export function CounterDisplay({ value, label, labelIcon }: CounterDisplayProps) {
  const formatValue = (num: number): string => {
    if (num < 0) return '00';
    if (num < 10) return `0${num}`;
    if (num > 99) return '99';
    return num.toString();
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="px-3 py-1 border-t-2 border-l-2 border-black/30 border-b-2 border-r-2 border-white/50 bg-[#C3C7CB]">
        <span className="font-pixel text-xs text-[#131315]">
          {labelIcon} {label}
        </span>
      </div>
      <div className="px-4 py-2 bg-[#000000] border-t-4 border-l-4 border-white/90 border-b-4 border-r-4 border-black/30 min-w-[4rem]">
        <span className="font-mono text-2xl font-bold text-[#FF0000] tracking-wider">
          {formatValue(value)}
        </span>
      </div>
    </div>
  );
}
