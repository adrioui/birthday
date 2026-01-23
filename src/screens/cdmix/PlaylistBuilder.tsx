import type { Track } from '../../types/track';
import { formatDuration } from '../../data/tracks';

interface PlaylistBuilderProps {
  tracks: Track[];
  onRemoveTrack: (id: string) => void;
}

export function PlaylistBuilder({ tracks, onRemoveTrack }: PlaylistBuilderProps) {
  const totalDuration = tracks.reduce((sum, track) => sum + track.duration, 0);
  const isEmpty = tracks.length === 0;

  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold text-deep-black">YOUR MIX ({tracks.length}/8)</h3>
        {!isEmpty && (
          <span className="font-mono text-sm text-deep-black/70">
            {formatDuration(totalDuration)}
          </span>
        )}
      </div>

      {isEmpty ? (
        <div className="rounded-lg border-2 border-dashed border-deep-black/20 bg-white/30 p-8 text-center">
          <p className="text-lg font-bold text-deep-black/50">PLAYLIST.TXT is empty</p>
          <p className="text-sm text-deep-black/40">Pick some songs from the list below</p>
        </div>
      ) : (
        <div className="space-y-2">
          {tracks.map((track, index) => (
            <div
              key={track.id}
              data-testid={`playlist-track-${track.id}`}
              className="flex items-center justify-between rounded-lg bg-white/80 p-3 transition-all hover:bg-white"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-lime text-sm font-black text-deep-black">
                  {index + 1}
                </span>
                <div>
                  <div className="font-bold text-deep-black">{track.title}</div>
                  <div className="text-xs text-deep-black/60">{track.artist}</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-mono text-sm text-deep-black/70">
                  {formatDuration(track.duration)}
                </span>
                <button
                  data-testid={`remove-track-${track.id}`}
                  onClick={() => onRemoveTrack(track.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-hot-pink text-white transition-all hover:scale-110 hover:bg-pink-600"
                  aria-label={`Remove ${track.title}`}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
