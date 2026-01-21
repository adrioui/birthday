import { useState } from 'react'
import { CharmCard } from '../components/wallet'
import { PLACEHOLDER_CHARMS } from '../types/charm'

export function CharmCardTestScreen() {
  const [flippedCharmId, setFlippedCharmId] = useState<string | null>(null)

  const handleFlip = (charmId: string | null) => {
    setFlippedCharmId(charmId)
  }

  const isFlipped = (id: string) => flippedCharmId === id

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="w-full max-w-6xl">
        <h1 className="text-3xl font-bold mb-4 text-center text-deep-black">CharmCard Flip Verification - FR-010</h1>
        <p className="text-center text-gray-600 mb-8">
          Testing charm card flip interaction with two-face structure and GSAP animation
        </p>

        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {PLACEHOLDER_CHARMS.map((charm) => (
              <div key={charm.id} className="w-full">
                <CharmCard
                  charm={charm}
                  isFlipped={isFlipped(charm.id)}
                  onFlip={handleFlip}
                />
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded text-sm">
            <h3 className="font-bold mb-3 text-deep-black">Manual Verification Checklist:</h3>

            <div className="mb-4">
              <h4 className="font-semibold text-deep-black mb-2">Phase 1 - Two-Face Structure:</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1" />
                  <span>Card displays front face with icon and title</span>
                </li>
                <li className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1" />
                  <span>Front face has neo-brutalist styling with border-[3px] border-lime</span>
                </li>
                <li className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1" />
                  <span>sticker-shadow-hard class is applied to both faces</span>
                </li>
                <li className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1" />
                  <span>Front face shows "TAP TO REVEAL" text</span>
                </li>
              </ul>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-deep-black mb-2">Phase 2 - GSAP Flip Animation:</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1" />
                  <span>Tapping a card triggers smooth 3D flip animation</span>
                </li>
                <li className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1" />
                  <span>Back face becomes visible, front face is hidden</span>
                </li>
                <li className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1" />
                  <span>Back face shows "PWR: [charm power]" text in pixel font</span>
                </li>
                <li className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1" />
                  <span>Tapping the flipped card flips it back</span>
                </li>
                <li className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1" />
                  <span>Tapping a different card flips back the first, then flips the new one</span>
                </li>
                <li className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1" />
                  <span>Animation duration feels natural (~0.6s)</span>
                </li>
                <li className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1" />
                  <span>Rapid clicking doesn't break animation state</span>
                </li>
              </ul>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-deep-black mb-2">Phase 3 - Polish & Accessibility:</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1" />
                  <span>Hover effect lifts card slightly on desktop</span>
                </li>
                <li className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1" />
                  <span>Keyboard navigation works (Tab to focus, Enter/Space to flip)</span>
                </li>
                <li className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1" />
                  <span>Focus ring is visible when using keyboard</span>
                </li>
                <li className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1" />
                  <span>Touch interaction works smoothly on mobile</span>
                </li>
                <li className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1" />
                  <span>`charm_viewed` telemetry event appears in console on flip</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-lime/10 border border-lime rounded text-sm">
            <p className="font-bold text-deep-black mb-2">Testing Notes:</p>
            <ul className="list-disc list-inside space-y-1 ml-4 text-deep-black">
              <li>Open browser console to monitor telemetry events</li>
              <li>Test flip animation by clicking cards</li>
              <li>Test keyboard navigation (Tab + Enter/Space)</li>
              <li>Rapid-click cards to verify animation protection</li>
              <li>Test on mobile device or devtools mobile emulation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
