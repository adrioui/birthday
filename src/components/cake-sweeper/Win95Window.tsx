import type { ReactNode } from 'react'

interface Win95WindowProps {
  title: string
  onClose?: () => void
  children: ReactNode
  className?: string
}

export function Win95Window({ title, onClose, children, className = '' }: Win95WindowProps) {
  return (
    <div className={`bg-[#C3C7CB] border-t-4 border-l-4 border-white/90 shadow-[4px_4px_0_#000000] ${className}`}>
      <div className="bg-[#000080] border-b-2 border-white/80 border-r-2 border-black/30 px-2 py-1 flex items-center justify-between">
        <span className="font-display font-bold text-white text-sm tracking-wide shadow-black drop-shadow-md">
          {title}
        </span>
        {onClose && (
          <button
            onClick={onClose}
            className="w-5 h-5 bg-[#C3C7CB] border-t-2 border-l-2 border-white/90 border-b-2 border-r-2 border-black/30 flex items-center justify-center text-[10px] font-bold text-[#131315] hover:bg-[#C3C7CB]/80 active:border-t-2 active:border-l-2 active:border-b-2 active:border-r-2"
            aria-label="Close"
          >
            ×
          </button>
        )}
      </div>
      <div className="p-2">
        {children}
      </div>
    </div>
  )
}
