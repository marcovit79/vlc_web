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
      return this.fullStatus == null || this.fullStatus.status === 'playing';
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

}
  