import { useEffect, useCallback, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCamera } from '../hooks/useCamera';
import { useCapture } from '../hooks/useCapture';
import { useAudio } from '../hooks/useAudio';
import { useCharms } from '../context/CharmContext';
import { useProgress } from '../context/useProgress';
import { PLACEHOLDER_CHARMS } from '../types/charm';
import { ViewfinderOverlay } from '../components/camcorder/ViewfinderOverlay';
import { CameraFallback } from '../components/camcorder/CameraFallback';
import { SnapButton, FlashOverlay, CaptureConfirmation } from '../components/camcorder';
import { trackEvent } from '../lib/telemetry';

export function CamcorderScreen() {
  const navigate = useNavigate();
  const { videoRef, state, error, startCamera } = useCamera({ facingMode: 'user' });
  const { captureFrame, isCapturing } = useCapture();
  const { playShutterSound } = useAudio();
  const { addCharm, addBonusPoints } = useCharms();
  const { completeMilestone } = useProgress();
  const [showFlash, setShowFlash] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [capturedImageUrl, setCapturedImageUrl] = useState<string | null>(null);

  useEffect(() => {
    startCamera();
  }, [startCamera]);

  const handleSnap = useCallback(() => {
    if (isCapturing || showFlash) return;

    setShowFlash(true);
    playShutterSound();

    const result = captureFrame(videoRef.current);

    if (result) {
      setCapturedImageUrl(result.dataUrl);
      localStorage.setItem('last-captured-photo', result.dataUrl);
      trackEvent('snap_taken');
      completeMilestone('photo-snapped');
      addBonusPoints(25, 'snap-capture');

      const charm = PLACEHOLDER_CHARMS.find((c) => c.id === 'digi-pet');
      if (charm) {
        addCharm(charm);
      }
    }
  }, [
    isCapturing,
    showFlash,
    playShutterSound,
    captureFrame,
    videoRef,
    addCharm,
    addBonusPoints,
    completeMilestone,
  ]);

  const handleFlashComplete = useCallback(() => {
    setShowFlash(false);
    if (capturedImageUrl) {
      setShowConfirmation(true);
    }
  }, [capturedImageUrl]);

  const handleConfirmationDismiss = useCallback(() => {
    setShowConfirmation(false);
    setCapturedImageUrl(null);
  }, []);

  const isLoading = state === 'idle' || state === 'requesting';
  const hasError = state === 'denied' || state === 'error';

  return (
    <div className="relative flex min-h-dvh flex-col bg-deep-black overflow-hidden">
      <div className="relative z-50 flex items-center justify-between px-6 py-8">
        <button
          className="modal-btn-focus flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/40 text-white hover:bg-white/40 transition-colors"
          aria-label="Go back"
        >
          <ArrowBackIcon className="w-5 h-5" />
        </button>
        <div className="text-bg-plate-dark px-4 py-1 rounded-full border border-white/20">
          <span className="text-white text-xs font-bold uppercase tracking-widest">
            Filter: Y2K CAM
          </span>
        </div>
        <button
          className="modal-btn-focus flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/40 text-white hover:bg-white/40 transition-colors"
          aria-label="Settings"
        >
          <SettingsIcon className="w-5 h-5" />
        </button>
      </div>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-md mx-auto px-4 py-2">
        <div className="relative w-full aspect-[4/5] bg-[#1a1a1a] rounded-2xl shadow-2xl overflow-hidden border-[6px] border-[#2a2a2a]">
          <div
            className="absolute inset-0 z-10 pointer-events-none rounded-xl"
            style={{ boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)' }}
          />

          <div className="relative w-full h-full overflow-hidden bg-black">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-deep-black z-30">
                <div className="text-center">
                  <div className="text-bg-plate-dark inline-block px-6 py-3 rounded-xl">
                    <div className="font-pixel text-xl text-lime animate-pulse">
                      INITIALIZING CAMERA...
                    </div>
                  </div>
                </div>
              </div>
            )}

            {hasError && (
              <CameraFallback
                reason={state === 'denied' ? 'denied' : 'error'}
                errorMessage={error || undefined}
              />
            )}

            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover scale-x-[-1] filter contrast-125 saturate-150 brightness-90"
              style={{
                filter: 'contrast(1.25) saturate(1.5) sepia(0.3) brightness(0.9)',
              }}
            />

            <div
              className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
              }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 z-0 pointer-events-none" />

            {state === 'active' && <ViewfinderOverlay isRecording />}
          </div>
        </div>
      </main>

      <div className="relative z-50 w-full p-6 pb-12 bg-gradient-to-t from-periwinkle-dark/90 via-periwinkle-dark/50 to-transparent flex flex-col items-center justify-center gap-6">
        <div className="flex items-center justify-center gap-8 w-full">
          <button
            onClick={() => capturedImageUrl && navigate({ to: '/memory-snapshot' })}
            disabled={!capturedImageUrl}
            className="modal-btn-focus text-deep-black opacity-60 hover:opacity-100 hover:rotate-12 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Share memory"
          >
            <ShareIcon className="w-8 h-8" />
          </button>

          <SnapButton
            onClick={handleSnap}
            disabled={state !== 'active' || isCapturing || showFlash}
          />

          <button
            className="modal-btn-focus text-deep-black opacity-60 hover:opacity-100 hover:-rotate-12 transition-all"
            aria-label="Switch camera"
          >
            <SwitchCameraIcon className="w-8 h-8" />
          </button>
        </div>
      </div>

      <FlashOverlay trigger={showFlash} onComplete={handleFlashComplete} />

      {showConfirmation && capturedImageUrl && (
        <CaptureConfirmation imageUrl={capturedImageUrl} onDismiss={handleConfirmationDismiss} />
      )}
    </div>
  );
}

function ArrowBackIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
    </svg>
  );
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
    </svg>
  );
}

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
    </svg>
  );
}

function SwitchCameraIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M9 12c0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3-3 1.34-3 3zm5.5-9l-1.41 1.41L15.17 6H4c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-3.17l-2.09-2.09L14.5 3zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
    </svg>
  );
}
