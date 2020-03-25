import { Input, Component, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

import { PlayerInfo } from '../../model/PlayerInfo';
import { Track } from '../../model/Track';


@Component({
    selector: 'vlc-player',
    styleUrls: ['vlc-player.component.scss'],
    templateUrl: 'vlc-player.component.html'
})
export class VlcPlayerComponent {
  
    @Input()
    fullStatus: PlayerInfo;

    @Output()
    play: EventEmitter<void> = new EventEmitter();

    @Output()
    stop: EventEmitter<void> = new EventEmitter();

    @Output()
    pause: EventEmitter<void> = new EventEmitter();
    
    @Output()
    resume: EventEmitter<void> = new EventEmitter();

    @Output()
    volume: EventEmitter<number> = new EventEmitter();

    @Output()
    seekTo: EventEmitter<number> = new EventEmitter();

    @Output()
    track: EventEmitter<Track> = new EventEmitter();

    @Output()
    loop: EventEmitter<boolean> = new EventEmitter();
    
    isCurrentTrack( track: Track ) {
      return (
            this.fullStatus != null 
          && 
            this.fullStatus.currentTrack
          && 
            track
          &&
            this.fullStatus.currentTrack.id === track.id
      );
    }

    isPlayDisabled() {
      return ! this.hasTracks() || this.fullStatus.status === 'playing';
    }

    playClicked() {
      if( this.fullStatus.status === 'paused' ) {
        this.resume.emit();
      }
      else {
        this.play.emit();
      }
    }

    isStopDisabled() {
      return this.fullStatus == null || this.fullStatus.status === 'stopped';
    }

    stopClicked() {
      this.stop.emit();
    }

    isPauseDisabled() {
      return this.fullStatus == null || this.fullStatus.status === 'paused' || this.fullStatus.status === 'stopped' ;
    }
    
    pauseClicked() {
      this.pause.emit();
    }

    isPreviousTrackDisabled() {
      return this.isStopDisabled();
    }
    
    previousTrackClicked() {
      const currentTrackTime = this.fullStatus.currentTrackTime;
      const currentTrackIndex = this.currentTrackIndex();

      let trackToStartIndex = (currentTrackTime > 10) ? currentTrackIndex : currentTrackIndex - 1 ;
      let trackToStart = this.fullStatus.tracks[ trackToStartIndex ];
      this.goToTrack( trackToStart );
    }
    
    isNextTrackDisabled(){
      const hasTracks = this.hasTracks();

      let disabled: boolean;

      if( hasTracks ) {
        
        if( this.hasCurrentTrack() ) {
          let lastTrack = this.fullStatus.tracks[ this.fullStatus.tracks.length - 1 ];
          let alreadyLast = this.fullStatus.currentTrack.id === lastTrack.id;
          disabled = alreadyLast;
        }
        else {
          // - ha tracce ma nessuna corrente quindi posso far partire la prima
          disabled = false;
        }
      }
      else {
        disabled = true;
      }

      return disabled;
    }

    nextTrackClicked() {

      if( this.hasCurrentTrack() ) {
        const currentTrackIndex = this.currentTrackIndex();
      
        const nextTrack = this.fullStatus.tracks[ currentTrackIndex + 1 ];
        this.goToTrack( nextTrack );
      }
      else {
        this.playClicked();
      }
    }



    volumeChanged( volume: number ): void {
      this.volume.emit( volume );
    }

    positionChanged( position: number): void {
      this.seekTo.emit( position );
    }

    goToTrack( track: Track ): void {
      this.track.emit( track );
    }

    loopNewValue( value: boolean ) {
      this.loop.emit( value );
    }


    private hasTracks(): boolean {
      return this.fullStatus && this.fullStatus.tracks && this.fullStatus.tracks.length > 0;
    }

    private hasCurrentTrack(): boolean {
      return this.fullStatus && this.fullStatus.currentTrack != null; 
    }

    private currentTrackIndex(): number {
      const currentTrackIndex = this.fullStatus.tracks.findIndex( 
        (t) => t.id === this.fullStatus.currentTrack.id 
      );
      return currentTrackIndex;
    }

}
  