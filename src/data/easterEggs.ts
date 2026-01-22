export type EasterEggId = 'brand-logo' | 'heart-charm' | 'chrome-b';

export interface EasterEgg {
  id: EasterEggId;
  title: string;
  message: string;
  icon: string;
}

export const EASTER_EGGS: Record<EasterEggId, EasterEgg> = {
  'brand-logo': {
    id: 'brand-logo',
    title: 'Secret Branding',
    message: 'You found the hidden logo! 📱✨',
    icon: '📱',
  },
  'heart-charm': {
    id: 'heart-charm',
    title: 'Heartstrings Pulled',
    message: 'You have a way with hearts! 💖',
    icon: '💖',
  },
  'chrome-b': {
    id: 'chrome-b',
    title: 'Big Birthday Energy',
    message: 'Maximum vibes detected! 🎉',
    icon: '🎉',
  },
};
