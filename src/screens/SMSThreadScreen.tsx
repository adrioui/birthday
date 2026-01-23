import { useState } from 'react';
import { SMSHeader } from '../components/sms/SMSHeader';
import { MessageBubble } from '../components/sms/MessageBubble';
import { SMSInputBar } from '../components/sms/SMSInputBar';
import { HeartStickers } from '../components/sms/HeartStickers';
import { GiftCardModal } from '../components/sms/GiftCardModal';
import { CardBackground } from '../components/CardBackground';
import { smsMessages } from '../data/messages';
import { trackEvent } from '../lib/telemetry';
import { useProgress } from '../context/useProgress';

export function SMSThreadScreen() {
  const [isGiftCardUnlocked, setIsGiftCardUnlocked] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const { completeMilestone } = useProgress();

  const handleGiftCardClick = () => {
    if (!isGiftCardUnlocked) {
      setIsGiftCardUnlocked(true);
      trackEvent('gift_revealed');
      completeMilestone('gift-revealed');
    }
    setShowGiftModal(true);
  };

  const handleCloseModal = () => {
    setShowGiftModal(false);
  };

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center px-6 py-8 pb-0">
      {/* Floating Chrome Letters */}
      <div className="pointer-events-none absolute left-4 top-[8%] z-0 animate-bounce select-none">
        <div className="text-bg-plate inline-block px-4 py-2 rounded-xl -rotate-12">
          <h1 className="chrome-text transform text-8xl font-black italic opacity-90">H</h1>
        </div>
      </div>
      <div
        className="pointer-events-none absolute right-4 top-[15%] z-0 select-none"
        style={{ animation: 'bounce 3.2s infinite' }}
      >
        <div className="text-bg-plate inline-block px-4 py-2 rounded-xl rotate-6">
          <h1 className="chrome-text transform text-8xl font-black italic opacity-90">B</h1>
        </div>
      </div>

      {/* Heart Stickers */}
      <HeartStickers />

      {/* Main SMS Container */}
      <CardBackground
        variant="sms"
        className="relative z-10 flex w-full max-w-md flex-col rounded-xl overflow-hidden h-[550px]"
      >
        <SMSHeader />

        {/* Messages Area */}
        <div className="flex-1 bg-gray-50 p-4 space-y-5 overflow-y-auto relative font-pixel text-lg no-scrollbar">
          {/* Grid pattern background */}
          <div
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{
              backgroundImage:
                'url(\'data:image/svg+xml,%3Csvg width="20" height="20" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="20" height="20" fill="none" stroke="%23888" stroke-width="0.5"/%3E%3C/svg%3E\')',
            }}
          />

          {/* Date stamp */}
          <div className="text-center">
            <span className="bg-gray-200 text-gray-600 text-[10px] px-2 py-1 rounded-full font-display font-bold uppercase tracking-wider">
              Today 11:59 PM
            </span>
          </div>

          {/* Messages */}
          {smsMessages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onGiftCardClick={message.hasGiftCard ? handleGiftCardClick : undefined}
              isGiftCardUnlocked={isGiftCardUnlocked}
            />
          ))}
        </div>
      </CardBackground>

      {/* Input Bar */}
      <div className="w-full mt-auto">
        <SMSInputBar />
      </div>

      {/* Gift Card Modal */}
      {showGiftModal && <GiftCardModal onClose={handleCloseModal} />}
    </div>
  );
}
