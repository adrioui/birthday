export function SMSHeader() {
  return (
    <div className="bg-deep-black px-4 py-3 flex justify-between items-center text-lime border-b-2 border-lime">
      <div className="flex items-center gap-2">
        <div className="size-2 bg-red-500 rounded-full animate-pulse" />
        <span className="font-pixel text-xl tracking-wide uppercase">
          Bestie &lt;3
        </span>
      </div>
      <div className="flex gap-1">
        <SignalIcon className="w-4 h-4" />
        <BatteryIcon className="w-4 h-4" />
      </div>
    </div>
  )
}

function SignalIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M2 22h2V12H2v10zm4 0h2V8H6v14zm4 0h2V4h-2v18zm4 0h2V2h-2v20z"/>
    </svg>
  )
}

function BatteryIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M17 4h-3V2h-4v2H7v18h10V4zm-2 16H9V6h6v14z"/>
    </svg>
  )
}
