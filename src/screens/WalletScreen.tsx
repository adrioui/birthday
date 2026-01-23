import { useEffect } from 'react';
import { useCharms } from '../context/CharmContext';
import { useProgress } from '../context/useProgress';
import { MAX_CHARMS } from '../types/charm';
import { CharmCard } from '../components/wallet/CharmCard';
import { WalletHeader } from '../components/wallet/WalletHeader';
import { WalletFooter } from '../components/wallet/WalletFooter';
import { WalletEmptyState } from '../components/wallet/WalletEmptyState';
import { useCharmFlip } from '../hooks/useCharmFlip';

export function WalletScreen() {
  const { charms, totalPoints } = useCharms();
  const { handleFlip, isFlipped } = useCharmFlip();
  const { completeMilestone } = useProgress();
  const hasCharms = charms.length > 0;

  useEffect(() => {
    if (hasCharms) {
      completeMilestone('charm-collected');
    }
  }, [hasCharms, completeMilestone]);

  return (
    <div className="flex min-h-dvh flex-col">
      <WalletHeader />

      <main className="relative z-10 flex-1 flex flex-col w-full items-center justify-start px-6 py-8">
        <div className="relative w-full h-28 mb-4 flex items-center justify-center">
          <div className="text-bg-plate inline-block px-6 py-3 rounded-xl">
            <h2 className="chrome-text text-5xl sm:text-6xl font-black italic transform -rotate-2 text-center leading-tight">
              CHARM
              <br />
              COLLECTION
            </h2>
          </div>
          <span className="absolute top-2 right-8 text-3xl text-white animate-bounce">✦</span>
          <span className="absolute bottom-2 left-8 text-2xl text-lime animate-pulse">✦</span>
        </div>

        {hasCharms ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl w-full justify-center">
            {charms.map((charm) => (
              <div key={charm.id} className="w-full aspect-[3/4]">
                <CharmCard
                  charm={charm}
                  isFlipped={isFlipped(charm.id)}
                  onFlip={handleFlip}
                  className="w-full h-full"
                />
              </div>
            ))}
          </div>
        ) : (
          <WalletEmptyState />
        )}
      </main>

      <WalletFooter
        totalPoints={totalPoints}
        collectedCount={charms.length}
        maxCount={MAX_CHARMS}
      />
    </div>
  );
}
