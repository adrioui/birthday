import { useRef, useState, useEffect } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactElement;
  show?: boolean;
}

export function Tooltip({ content, children, show: controlledShow }: TooltipProps) {
  const [internalShow, setInternalShow] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const childRef = useRef<HTMLDivElement>(null);

  const show = controlledShow ?? internalShow;

  useEffect(() => {
    if (childRef.current && show) {
      const rect = childRef.current.getBoundingClientRect();
      setPosition({
        top: rect.top - 40,
        left: rect.left + rect.width / 2,
      });
    }
  }, [show]);

  const handleMouseEnter = () => setInternalShow(true);
  const handleMouseLeave = () => setInternalShow(false);

  return (
    <div
      className="relative inline-block"
      ref={childRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {show && (
        <div
          className="fixed z-[200] px-3 py-1.5 bg-deep-black text-white text-xs font-bold font-display uppercase tracking-wider rounded-md shadow-hard-pink-sm whitespace-nowrap"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
            transform: 'translateX(-50%)',
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
}
