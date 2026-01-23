export type StorageKey = keyof typeof STORAGE_KEYS;

export const STORAGE_KEYS = {
  CHARMS: 'birthday-os-charms',
  BONUS_POINTS: 'birthday-os-bonus-points',
  REDEEMED: 'birthday-redeemed',
  AWARDED_BONUSES: 'birthday-os-awarded-bonuses',
  SESSION_PROGRESS: 'birthday-session-progress',
  AUDIO_MUTED: 'birthday-os-audio-muted',
  EASTER_EGGS: 'birthday-os-easter-eggs',
  LAST_CAPTURED_PHOTO: 'last-captured-photo',
} as const;
