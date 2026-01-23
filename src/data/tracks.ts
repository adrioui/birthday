import type { Track } from '../types';

export const tracks: Track[] = [
  {
    id: '1',
    title: 'Birthday Bash (2000 Mix)',
    artist: 'DJ Cyber',
    duration: 214,
    genre: 'Eurodance',
    year: 1999,
  },
  {
    id: '2',
    title: 'Digital Dreams',
    artist: 'Pixel Perfect',
    duration: 198,
    genre: 'Trance',
    year: 2000,
  },
  {
    id: '3',
    title: "Party Like It's Y2K",
    artist: 'The Millennium Crew',
    duration: 236,
    genre: 'Pop',
    year: 1999,
  },
  {
    id: '4',
    title: 'Chrome Heart',
    artist: 'Neon Sky',
    duration: 187,
    genre: 'R&B',
    year: 2000,
  },
  {
    id: '5',
    title: 'System Reboot',
    artist: 'Glitch Mob',
    duration: 201,
    genre: 'Electronica',
    year: 2001,
  },
  {
    id: '6',
    title: 'Birthday Glow',
    artist: 'Lime Light',
    duration: 175,
    genre: 'House',
    year: 2000,
  },
  {
    id: '7',
    title: 'Starlight Serenade',
    artist: 'Periwinkle Dreams',
    duration: 223,
    genre: 'Ambient',
    year: 2001,
  },
  {
    id: '8',
    title: 'Last Dance of the Millennium',
    artist: 'Retro Wave',
    duration: 245,
    genre: 'Synthpop',
    year: 1999,
  },
];

export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
