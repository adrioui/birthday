interface GiftCardAttachmentProps {
  onClick?: () => void
  isUnlocked?: boolean
}

export function GiftCardAttachment({ onClick, isUnlocked }: GiftCardAttachmentProps) {
  return (
    <button
      onClick={onClick}
      className="mt-2 w-full bg-white border-2 border-deep-black/20 rounded-lg p-2 flex items-center gap-3 hover:bg-gray-50 transition-colors cursor-pointer"
      aria-label="Open gift card"
    >
      <div className="bg-pink-100 p-2 rounded border border-pink-200">
        <GiftIcon className="w-5 h-5 text-pink-500" />
      </div>
      <div className="flex flex-col items-start">
        <span className="text-xs font-display font-bold uppercase text-gray-800">
          Gift Card
        </span>
        <span className="text-[10px] font-display text-gray-500">
          {isUnlocked ? 'Tap to view again' : 'Tap to view'}
        </span>
      </div>
    </button>
  )
}

function GiftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
    </svg>
  )
}
