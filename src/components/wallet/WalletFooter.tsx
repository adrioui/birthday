import { useState, useCallback } from 'react';
import { RedeemConfirmModal } from './RedeemConfirmModal';
import { RedeemSuccessModal } from './RedeemSuccessModal';
import { useCharms } from '../../context/CharmContext';
import { REDEEM_THRESHOLD } from '../../config';

interface WalletFooterProps {
  totalPoints: number;
  collectedCount: number;
  maxCount: number;
}

export function WalletFooter({ totalPoints, collectedCount, maxCount }: WalletFooterProps) {
  const { isRedeemed, setRedeemed } = useCharms();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleRedeem = useCallback(() => {
    if (totalPoints >= REDEEM_THRESHOLD) {
      setShowConfirmModal(true);
    }
  }, [totalPoints]);

  const handleConfirmRedeem = () => {
    setRedeemed(true);
    setShowSuccessModal(true);
  };

  const handleCloseConfirm = () => {
    setShowConfirmModal(false);
  };

  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
  };

  return (
    <div className="relative z-50 w-full px-4 pb-6 pt-4 sm:px-6 sm:pb-8 bg-gradient-to-t from-periwinkle-dark via-periwinkle-light/80 to-transparent">
      <div className="flex justify-between items-end mb-4 px-2">
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-widest text-deep-black/60 mb-1">
            Collection
          </p>
          <p className="font-pixel text-xl text-deep-black">
            {collectedCount}/{maxCount}
          </p>
        </div>
      </div>

      <button
        onClick={handleRedeem}
        className="group relative w-full overflow-hidden rounded-xl bg-deep-black text-white border-2 border-white/50 sticker-shadow-hard h-16 flex items-center justify-center transition-all hover:-translate-y-1 hover:shadow-hard-lime active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={totalPoints < REDEEM_THRESHOLD || isRedeemed}
        aria-label="Redeem gift"
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-10" />

        <div className="flex items-center gap-3 relative z-10">
          <span className="material-symbols-outlined text-lime animate-pulse">
            {isRedeemed ? 'check_circle' : 'redeem'}
          </span>
          <span className="text-white text-xl font-bold font-display uppercase tracking-wider">
            {isRedeemed ? 'Redeemed!' : 'Redeem Gift'}
          </span>
        </div>
      </button>

      {totalPoints < REDEEM_THRESHOLD && !isRedeemed && (
        <p className="text-center text-deep-black/60 text-[10px] font-bold mt-2 font-display uppercase tracking-widest">
          Collect {REDEEM_THRESHOLD - totalPoints} more points to redeem
        </p>
      )}

      <RedeemConfirmModal
        isOpen={showConfirmModal}
        totalPoints={totalPoints}
        onConfirm={handleConfirmRedeem}
        onCancel={handleCloseConfirm}
      />

      <RedeemSuccessModal isOpen={showSuccessModal} onClose={handleCloseSuccess} />

      <p className="text-center text-deep-black/50 text-[10px] font-bold mt-3 font-display uppercase tracking-widest">
        Tap a charm to reveal power
      </p>
    </div>
  );
}
