import { useCharms } from '../context/CharmContext'
import { MAX_CHARMS } from '../types/charm'
import { CharmCard } from '../components/wallet/CharmCard'
import { WalletHeader } from '../components/wallet/WalletHeader'
import { WalletFooter } from '../components/wallet/WalletFooter'
import { WalletEmptyState } from '../components/wallet/WalletEmptyState'
import { useCharmFlip } from '../hooks/useCharmFlip'

export function WalletScreen() {
  const { charms, totalPoints } = useCharms()
  const { handleFlip, isFlipped } = useCharmFlip()
  const hasCharms = charms.length > 0

  return (
    <div className="flex min-h-dvh flex-col">
      <WalletHeader />

      <main className="relative z-10 flex-1 flex flex-col w-full max-w-md mx-auto px-4 py-2">
        <div className="relative w-full h-28 mb-4 flex items-center justify-center">
          <h2 className="chrome-text text-5xl sm:text-6xl font-black italic transform -rotate-2 text-center leading-tight">
            CHARM<br />COLLECTION
          </h2>
          <span className="absolute top-2 right-8 text-3xl text-white animate-bounce">✦</span>
          <span className="absolute bottom-2 left-8 text-2xl text-lime animate-pulse">✦</span>
        </div>

        {hasCharms ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 flex-1">
            {charms.map((charm) => (
              <CharmCard
                key={charm.id}
                charm={charm}
                isFlipped={isFlipped(charm.id)}
                onFlip={handleFlip}
              />
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
  )
}
