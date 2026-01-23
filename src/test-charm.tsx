import { useState } from 'react';
import { CharmCard } from './components/wallet/CharmCard';
import { PLACEHOLDER_CHARMS } from './types';

export default function TestCharm() {
  const [flippedCharmId, setFlippedCharmId] = useState<string | null>(null);

  const handleFlip = (charmId: string | null) => {
    setFlippedCharmId(charmId);
  };

  const isFlipped = (id: string) => flippedCharmId === id;

  return (
    <div className="p-10 flex flex-col items-center justify-center min-h-screen bg-gray-100 gap-8">
      <h1 className="text-2xl font-bold">CharmCard Flip Test</h1>
      <div className="w-48">
        <CharmCard
          charm={PLACEHOLDER_CHARMS[0]}
          isFlipped={isFlipped(PLACEHOLDER_CHARMS[0].id)}
          onFlip={handleFlip}
        />
      </div>
    </div>
  );
}
