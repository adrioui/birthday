import { useState } from 'react';
import { tracks } from '../data/tracks';
import type { Track, BurnProgress } from '../types/track';
import { useProgress } from '../context/useProgress';
import { RotatingCD } from './cdmix/RotatingCD';
import { TrackSelector } from './cdmix/TrackSelector';
import { PlaylistBuilder } from './cdmix/PlaylistBuilder';
import { BurnProgressView } from './cdmix/BurnProgressView';
import { CardBackground } from '../components/CardBackground';
import { Sticker } from '../components/effects/Sticker';

export function CDMixMakerScreen() {
  const [selectedTracks, setSelectedTracks] = useState<Track[]>([]);
  const [burnProgress, setBurnProgress] = useState<BurnProgress>({
    stage: 'idle',
    progress: 0,
  });
  const { completeMilestone } = useProgress();

  const toggleTrack = (track: Track) => {
    setSelectedTracks((prev) => {
      const exists = prev.find((t) => t.id === track.id);
      if (exists) {
        return prev.filter((t) => t.id !== track.id);
      }
      if (prev.length >= 8) return prev;
      return [...prev, track];
    });
  };

  const handleRemoveTrack = (id: string) => {
    setSelectedTracks((prev) => prev.filter((t) => t.id !== id));
  };

  const startBurn = () => {
    if (selectedTracks.length === 0) return;

    setBurnProgress({
      stage: 'reading',
      progress: 0,
      currentTrack: 0,
      totalTracks: selectedTracks.length,
    });
  };

  const handleBurnComplete = () => {
    completeMilestone('cd-burned');
    setBurnProgress({ stage: 'idle', progress: 0 });
  };

  return (
    <div className="flex min-h-dvh flex-col bg-periwinkle-dark">
      <div className="flex-1 px-6 py-8">
        <div className="relative mb-8 flex items-center justify-center">
          <div className="text-bg-plate inline-block px-6 py-3 rounded-xl">
            <h1 className="chrome-text text-6xl font-black italic transform -rotate-3">CD MIX</h1>
          </div>
          <span className="absolute -top-2 -right-4 text-4xl animate-spin">💿</span>
        </div>

        <div className="relative mb-8 flex h-48 items-center justify-center">
          <RotatingCD selectedTracks={selectedTracks} isBurning={burnProgress.stage !== 'idle'} />
        </div>

        {burnProgress.stage === 'idle' ? (
          <>
            <PlaylistBuilder tracks={selectedTracks} onRemoveTrack={handleRemoveTrack} />

            <TrackSelector
              availableTracks={tracks}
              selectedTrackIds={selectedTracks.map((t) => t.id)}
              onToggleTrack={toggleTrack}
            />

            <div className="relative mt-8">
              <CardBackground variant="default" className="overflow-hidden">
                <button
                  onClick={startBurn}
                  disabled={selectedTracks.length === 0}
                  className="relative w-full py-6 text-2xl font-black text-deep-black transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider font-display"
                >
                  {selectedTracks.length === 0
                    ? 'ADD TRACKS FIRST'
                    : `BURN ${selectedTracks.length} TRACKS`}
                </button>
                <Sticker position={{ top: '-8px', right: '-10px' }} rotation={12}>
                  <span className="text-3xl">🔥</span>
                </Sticker>
                <Sticker position={{ bottom: '-10px', left: '-8px' }} rotation={-8}>
                  <span className="text-3xl">💿</span>
                </Sticker>
              </CardBackground>
            </div>
          </>
        ) : (
          <BurnProgressView progress={burnProgress} onComplete={handleBurnComplete} />
        )}
      </div>
    </div>
  );
}
