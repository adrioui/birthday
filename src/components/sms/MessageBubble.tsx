import type { Message } from '../../data/messages'
import { GiftCardAttachment } from './GiftCardAttachment'

interface MessageBubbleProps {
  message: Message
  onGiftCardClick?: () => void
  isGiftCardUnlocked?: boolean
}

export function MessageBubble({ message, onGiftCardClick, isGiftCardUnlocked }: MessageBubbleProps) {
  const isBestie = message.sender === 'bestie'

  return (
    <div className={`flex flex-col ${isBestie ? 'items-start' : 'items-end self-end ml-auto'} max-w-[85%] group`}>
      <div
        className={`
          border-2 border-deep-black p-3 rounded-2xl
          ${isBestie ? 'bg-lime rounded-tl-none' : 'bg-periwinkle-dark rounded-tr-none'}
          shadow-[2px_2px_0px_rgba(0,0,0,0.1)]
          transition-transform hover:scale-[1.02]
        `}
      >
        <p className="font-pixel text-lg text-deep-black leading-tight">
          {message.text}
        </p>

        {message.hasGiftCard && (
          <GiftCardAttachment
            onClick={onGiftCardClick}
            isUnlocked={isGiftCardUnlocked}
          />
        )}
      </div>

      {message.timestamp && (
        <span className="text-[10px] text-gray-400 font-display font-bold mt-1 uppercase tracking-wide">
          {message.timestamp}
        </span>
      )}
    </div>
  )
}
