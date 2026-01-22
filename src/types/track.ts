export interface Track {
  id: string
  title: string
  artist: string
  duration: number
  genre: string
  year: number
}

export interface Playlist {
  id: string
  name: string
  tracks: Track[]
  totalDuration: number
  created?: string
}

export interface BurnProgress {
  stage: 'idle' | 'reading' | 'writing' | 'finalizing' | 'complete' | 'error'
  progress: number
  currentTrack?: number
  totalTracks?: number
}
