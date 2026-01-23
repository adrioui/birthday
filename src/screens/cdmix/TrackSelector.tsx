import type { Track } from '../../types';
import { formatDuration } from '../../data/tracks';

interface TrackSelectorProps {
  availableTracks: Track[];
  selectedTrackIds: string[];
  onToggleTrack: (track: Track) => void;
}

export function TrackSelector({
  availableTracks,
  selectedTrackIds,
  onToggleTrack,
}: TrackSelectorProps) {
  return (
    <div className="mt-8">
      <h3 className="mb-4 text-xl font-bold text-deep-black">AVAILABLE TRACKS</h3>

      <div className="space-y-2">
        {availableTracks.map((track) => {
          const isSelected = selectedTrackIds.includes(track.id);

          return (
            <button
              key={track.id}
              data-testid={`track-${track.id}`}
              onClick={() => onToggleTrack(track)}
              className={`w-full border-4 border-deep-black rounded-lg p-4 text-left transition-all ${
                isSelected
                  ? 'bg-lime text-deep-black shadow-hard hover:shadow-hard-lg active:border-b-2 active:border-r-2'
                  : 'bg-white text-deep-black hover:bg-white/90 active:border-b-2 active:border-r-2'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{isSelected ? '✓' : '○'}</span>
                    <span className="font-bold">{track.title}</span>
                  </div>
                  <div className="ml-8 mt-1 text-sm opacity-70">
                    {track.artist} • {track.year} • {track.genre}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-mono">{formatDuration(track.duration)}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
