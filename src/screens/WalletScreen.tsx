import { useEffect, useState, type ReactNode } from 'react';
import { useCharms } from '../context/CharmContext';
import { useProgress } from '../context/useProgress';
import { MAX_CHARMS } from '../types/charm';
import { CharmCard } from '../components/wallet/CharmCard';
import { WalletHeader } from '../components/wallet/WalletHeader';
import { WalletFooter } from '../components/wallet/WalletFooter';
import { WalletEmptyState } from '../components/wallet/WalletEmptyState';
import { useCharmFlip } from '../hooks';
import { Sticker } from '../components/effects/Sticker';

interface TapeBitProps {
  position: { top?: string; right?: string; bottom?: string; left?: string };
  rotation?: number;
}

function TapeBit({ position, rotation = -45 }: TapeBitProps) {
  return (
    <div
      className="absolute w-8 h-4 bg-white/40 backdrop-blur-sm shadow-sm border border-white/20"
      style={{ ...position, transform: `rotate(${rotation}deg)` }}
      aria-hidden="true"
    />
  );
}

function CharmWrapper({
  children,
  position,
  rotation,
  index,
}: {
  children: ReactNode;
  position: { top: string; left?: string; right?: string };
  rotation: number;
  index: number;
}) {
  return (
    <div
      className="absolute transition-all duration-300 hover:rotate-0 hover:z-50 hover:scale-110 group cursor-pointer w-40"
      style={{ ...position, transform: `rotate(${rotation}deg)`, zIndex: 30 + index }}
    >
      {children}
    </div>
  );
}

export function WalletScreen() {
  const { charms, totalPoints } = useCharms();
  const { handleFlip, isFlipped } = useCharmFlip();
  const { completeMilestone } = useProgress();
  const hasCharms = charms.length > 0;
  const [isLoading] = useState(false);

  useEffect(() => {
    if (hasCharms) {
      completeMilestone('charm-collected');
    }
  }, [hasCharms, completeMilestone]);

  const getCharmPosition = (index: number) => {
    const positions = [
      { top: '0rem', left: '0.5rem', rotation: -6 },
      { top: '3rem', right: '0rem', rotation: 3 },
      { top: '16rem', left: '1.5rem', rotation: -3 },
      { top: '13rem', right: '-0.625rem', rotation: 12 },
      { top: '8rem', left: '6rem', rotation: 5 },
      { top: '20rem', right: '2rem', rotation: -8 },
    ];
    return positions[index % positions.length];
  };

  return (
    <div className="flex min-h-dvh flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#dce8ff] via-[#abc1ff] to-[#8c9eff] z-0" />
      <div
        className="absolute inset-0 opacity-30 mix-blend-overlay z-0 pointer-events-none"
        style={{
          backgroundImage: "url('/textures/paper-grain.png')",
          backgroundSize: '200px 200px',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 z-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[size:40px_40px]"
        aria-hidden="true"
      />
      <Sticker position={{ top: '10rem', left: '50%' }} rotation={12}>
        <span className="material-symbols-outlined text-[10rem] text-white opacity-40">bolt</span>
      </Sticker>

      <WalletHeader totalPoints={totalPoints} isLoading={isLoading} />

      <main className="relative z-10 flex-1 flex flex-col w-full items-center justify-start px-4 py-6 sm:px-6 sm:py-8">
        <div className="relative w-full h-32 mb-4 flex items-center justify-center z-20">
          <h2 className="chrome-text text-6xl font-black italic transform -rotate-2 text-center leading-[0.8]">
            CHARM
            <br />
            COLLECTION
          </h2>
          <span className="absolute top-2 right-10 text-4xl text-white animate-bounce">✦</span>
          <span className="absolute bottom-2 left-10 text-3xl text-lime animate-pulse">✦</span>
        </div>

        {hasCharms ? (
          <div className="relative flex-1 w-full mt-4 min-h-[500px]">
            {charms.map((charm, index) => {
              const { top, left, right, rotation } = getCharmPosition(index);
              const isFirst = index === 0;
              return (
                <CharmWrapper
                  key={charm.id}
                  position={{ top, left, right }}
                  rotation={rotation}
                  index={index}
                >
                  <div className="bg-white rounded-xl border-[3px] border-lime p-1.5 sticker-shadow-hard">
                    <CharmCard
                      charm={charm}
                      isFlipped={isFlipped(charm.id)}
                      onFlip={handleFlip}
                      className="w-full"
                    />
                  </div>
                  {isFirst && <TapeBit position={{ top: '-0.75rem', left: '2.5rem' }} />}
                </CharmWrapper>
              );
            })}
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
