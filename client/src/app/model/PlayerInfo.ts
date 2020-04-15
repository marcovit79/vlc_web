import { Track } from "./Track";

  
export class PlayerInfo {
  status: 'stopped' |	'playing' | 'paused';
  loop: boolean;
  random: boolean;
  repeat: boolean;
  volume: number;
  currentPlaylist?: string;
  tracks: Track[];
  currentTrack?: Track;
  currentTrackTime: number;
  vlcConnected: boolean
}