import { CharmCard, type Charm } from '../components/wallet'
import { useCharmFlip } from '../hooks/useCharmFlip'

const testCharm: Charm = {
  id: '1',
  name: 'Super Star',
  icon: 'star',
  power: 'Main Character Energy',
  points: 150,
}

const testCharms: Charm[] = [
  { id: '1', name: 'Super Star', icon: 'star', power: 'Main Character Energy', points: 150 },
  { id: '2', name: '8-Bit Love', icon: 'favorite', power: '+1 Extra Life', points: 100 },
  { id: '3', name: 'Digi-Pet', icon: 'pets', power: 'Always Hungry', points: 75 },
]

export function CharmCardTestScreen() {
  const { handleFlip, isFlipped } = useCharmFlip()

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-4 text-center">CharmCard Test - FR-010 Phase 2</h1>
        
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2 text-center">Phase 1: Single Card (FR-009)</h2>
          <p className="text-sm text-gray-600 mb-4 text-center">
            Testing FR-009: Single card rendering
          </p>
          <div className="bg-white p-8 rounded-lg shadow-lg flex justify-center">
            <CharmCard
              charm={testCharm}
              isFlipped={isFlipped(testCharm.id)}
              onFlip={handleFlip}
              className="w-40"
            />
          </div>
          <div className="mt-4 p-4 bg-gray-50 rounded text-sm">
            <h3 className="font-bold mb-2">Phase 1 Checklist:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Card dimensions (should be ~160px wide)</li>
              <li>Icon displays in front face (Material Symbol 'star')</li>
              <li>Title "SUPER STAR" visible</li>
              <li>"PWR: Main Character Energy" text present</li>
              <li>Lime green border (#CCFF00) visible</li>
              <li>Hard shadow (sticker-shadow-hard) visible</li>
              <li>Hover scale effect works</li>
              <li>Keyboard focus visible</li>
            </ul>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2 text-center">Phase 2: Multiple Cards with Flip Animation (FR-010)</h2>
          <p className="text-sm text-gray-600 mb-4 text-center">
            Testing FR-010 Phase 2: 3D flip animation and state management
          </p>
          <div className="bg-white p-8 rounded-lg shadow-lg flex gap-4 justify-center">
            {testCharms.map(charm => (
              <CharmCard
                key={charm.id}
                charm={charm}
                isFlipped={isFlipped(charm.id)}
                onFlip={handleFlip}
                className="w-40"
              />
            ))}
          </div>
          <div className="mt-4 p-4 bg-gray-50 rounded text-sm">
            <h3 className="font-bold mb-2">Phase 2 Manual Verification Checklist:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Tapping a card triggers smooth 3D flip animation</li>
              <li>Back face becomes visible, front face is hidden (no bleed-through)</li>
              <li>Tapping the flipped card flips it back</li>
              <li>Tapping a different card flips back the first, then flips the new one</li>
              <li>Animation duration feels natural (~0.6s)</li>
              <li>Card's rotation in layout is preserved during flip</li>
              <li>Only one card can be flipped at a time</li>
              <li>Rapid clicking doesn't cause glitches (isAnimating ref working)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
