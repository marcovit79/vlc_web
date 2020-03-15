import { Injectable } from '@nestjs/common';
import { VLC, Playlist, Status, BrowseElement, PlaylistLeaf } from './vlc-http-client';
import { ConfigService } from '@nestjs/config';


/*export interface PlayerInfoOld {
  status: Status,
  playlist: Playlist
}*/

export interface Track {
  id: number,
  duration: number,
  name: string
}

export interface PlayerInfo {
  status: 'stopped' |	'playing' | 'paused',
  loop: boolean,
  random: boolean,
  repeat: boolean,
  volume: number,
  currentPlaylist?: string,
  tracks: Track[],
  currentTrack?: Track,
  currentTrackTime: number,
}


@Injectable()
export class PlayerService {
  
  private player: VLC;
  private playlistPath: string;

  constructor(private readonly configService: ConfigService) {
    this.player = new VLC({
      host: this.configService.get<string>('vlc.hopst'),
      port: this.configService.get<number>('vlc.port'),
      username: '',
      password: this.configService.get<string>('vlc.password'),
      autoUpdate: true,
      // how many times per seconds (in ms) node-vlc-http will update the status of VLC, default 1000/30 ~ 33ms (30fps)
      tickLengthMs: 10000,
      // checks that browse, status and playlist have changed since the last update of one of its elements,
      // if it the case fire browsechange, statuschange or playlistchange event. default true.
      changeEvents: true
    });

    var playlistsPath = this.configService.get<string>('fs.root');
    if( ! playlistsPath.endsWith('/') ) {
      playlistsPath += '/'
    }

    playlistsPath += this.configService.get<string>('fs.playlists');
    if( ! playlistsPath.endsWith('/') ) {
      playlistsPath += '/'
    }

    this.playlistPath = playlistsPath;
  }

  public async getAllInformations(): Promise<PlayerInfo> {
    let [ vlcStatus, vlcPlaylistTree] = await this.player.updateAll();

    let playerInfo: PlayerInfo = {
      status: vlcStatus.state,
      loop: vlcStatus.loop,
      random: vlcStatus.random,
      repeat: vlcStatus.repeat,
      volume: vlcStatus.volume,
      currentPlaylist: null,
      tracks: [],
      currentTrack: null,
      currentTrackTime: vlcStatus.time,
    }

    var vlcTracks = this.getTrackNodesFromVlcPlaylistTree( vlcPlaylistTree );
    if( vlcTracks && vlcTracks.length > 0 ) {

      playerInfo.tracks = vlcTracks.map( el => ({
        id: parseInt( el.id ),
        duration: el.duration,
        name: el.name
      }))

      playerInfo.currentPlaylist = this.extractPlaylistName( vlcTracks[0].uri );
    }
    
    const currentTrackId = vlcStatus.currentplid;
    const currentTrack = playerInfo.tracks.find( el => el.id === currentTrackId );
    playerInfo.currentTrack = currentTrack;

    return playerInfo;
  }

  private getTrackNodesFromVlcPlaylistTree( vlcPlaylistTree: Playlist): PlaylistLeaf[] {
    var tracks: PlaylistLeaf[] = null;

    if( vlcPlaylistTree.children ) {
      const tracksParentCandidates = vlcPlaylistTree.children.filter( el => el.name === 'Playlist')
      if( tracksParentCandidates && tracksParentCandidates.length > 0 ) {
        const tracksParent = tracksParentCandidates[0];

        if( tracksParent && tracksParent.children ) {
          tracks = tracksParent.children
        }
      } 
    }

    return tracks;
  }

  private extractPlaylistName( uri: string ): string {
    const steps = uri.split('/');
    const playlistName = steps[ steps.length - 2 ];
    return playlistName;
  }

  public async listPlayLists(): Promise<string[]> {
    let elements = await this.browse( );

    let playlists = elements.filter( el => el.type === 'dir' && el.name != '..' );

    return playlists.map( el => el.name );
  }

  public async getTracksNames( playlistName: string): Promise<string[]> {

    let traks = await this.getTraks( playlistName );
    return traks.map( el => el.name );
  }

  public async getTraks( playlistName: string): Promise<BrowseElement[]> {
    
    let elements = await this.browse( playlistName );
    let traks = elements.filter( el => el.type === 'file' )
    return traks;
  }

  private async browse( playlist?: string ): Promise<BrowseElement[]> {
    let path = this.playlistPath + ( playlist ? playlist : '' );
    let browsed = await this.player.browse( path );
    return browsed.element;
  }


  public async setPlaylist( playListName: string ): Promise<boolean> {
    this.stop();
    this.player.playlistEmpty();
    
    let traks = await this.getTraks( playListName );
    
    traks.forEach( t => {
      this.player.addToQueue( t.path );
    })

    return true;
  }

  public async start(): Promise<string> {
    let pl = await this.player.updatePlaylist();

    let firstTrak: PlaylistLeaf = null;
    // - cerca ricorsivamente nell'albero della playlist VLC e ...
    let stack: Playlist[] = [ pl ];
    while( stack.length ) {
      let el = stack.pop();
      
      if( el.type === 'node' ) {
        let children_copy = [ ... el.children ]; // - Mi serve perché reverse lavora in loco
        children_copy.reverse().forEach( c => stack.push( c ) );
      }

      // ... quando trovo la prima foglia ...
      if( el.type === 'leaf' ) {
        // ... la fa suonare a VLC.
        firstTrak = el as PlaylistLeaf;
      }

       // - Interrompo la ricerca tanto ho fatto ciò che mi serviva.
       if( firstTrak != null ) {
         break;
       }
    }

    if( firstTrak != null ) {
      this.player.play( parseInt( firstTrak.id ) );
    }
    
    return firstTrak?.name;
  }

  public stop(): void {
    this.player.stop();
  }

  public pause(): void {
    this.player.forcePause();
  }

  public resume(): void {
    this.player.resume();
  }

  public setTrack(track: number) {
    this.player.play( track );
  }

  public setVolume(volume: number) {
    this.player.setVolume( volume );
  }

  public seekTo( timeSec: number) {
    this.player.seek( timeSec );
  }


}
