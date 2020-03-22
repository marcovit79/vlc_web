import { Component, OnInit } from '@angular/core';
import { PlaylistFolder } from 'src/app/model/PlayListFolder';
import { FullPlayerService } from './full-player.service';
import { Observable } from 'rxjs';
import { PlayerInfo } from 'src/app/model/PlayerInfo';
import { Track } from 'src/app/model/Track';


@Component({
    selector: 'full-player',
    styleUrls: ['full-player.component.scss'],
    templateUrl: 'full-player.component.html'
})
export class FullPlayerComponent implements OnInit {
  
    public playlists: PlaylistFolder[]
    private playlistsObservable: Observable<PlaylistFolder[]>

    public playerStatus: PlayerInfo;
    private playerStatusObservable: Observable<PlayerInfo>;

    constructor( private svc: FullPlayerService ) {}

    ngOnInit(): void {
        this.playlistsObservable = this.svc.getPlaylistFolders();
        this.playlistsObservable.subscribe( playlists => { this.playlists = playlists; });

        this.playerStatusObservable = this.svc.getStatusStream();
        this.playerStatusObservable.subscribe( playerStatus => { this.playerStatus = playerStatus; })
    }
    
    doPlaylistSelected( name: string) {
        this.svc.playFolder( name );
    }

    play(): void {
      console.log("Play component called");
      this.svc.play();
    }

    stop(): void {
      this.svc.stop();
    }

    pause(): void {
      this.svc.pause();
    }

    resume(): void {
      this.svc.resume();
    }

    setVolume( v: number): void {
      this.svc.setVolume( v );
    }

    changeTrack( t: Track ): void {
      this.svc.changeTrack( t );
    }

    seekTo( timeSec: number ): void {
      this.svc.seekTo( timeSec );
    }

    changeLoopActivation( l: boolean ): void {
      this.svc.setLoop( l );
    }
}
  