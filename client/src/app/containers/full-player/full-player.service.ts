import { Injectable, OnInit } from '@angular/core'
import { Observable, timer, forkJoin, merge, of } from 'rxjs';
import { map, concatMap, delay } from 'rxjs/operators';

import { ApiService } from '../../generated/player-api/services'
import { StrictHttpResponse } from '../../generated/player-api/strict-http-response'

import { PlaylistFolder } from '../../model/PlayListFolder';
import { PlayerInfo } from '../../model/PlayerInfo';
import { Track } from '../../model/Track';
import { SetActionDto } from 'src/app/generated/player-api/models';


@Injectable()
export class FullPlayerService {

  constructor( private client: ApiService ) { }

  getStatusStream(): Observable<PlayerInfo> {
    const statusUpdateClock = merge( 
        timer(0, 1 * 1000),
        this.newActionsAuditObservable().pipe(delay( 100 ))
      );
    
    return statusUpdateClock.pipe(
        concatMap( i => this.doComputeNewStatusTick(i))
    );
  }

  private lastStatus: PlayerInfo = null;
  
  private doComputeNewStatusTick( i: number | string ): Observable<PlayerInfo> {
    
    const fullupdate = this.needFullUpdate( i );

    let result: Observable<PlayerInfo>;
    if( fullupdate || this.lastStatus == null ) {
      result = this.getStatus();
    }
    else { 
      // - If playing ...
      if( this.lastStatus.status === 'playing' ) {
        // ... update time only
        let newStatus = { ... this.lastStatus };
        newStatus.currentTrackTime += 1;
        result = of( newStatus );
      }
      // - If stopped or paused ...
      else {
        // ... nothing to update
        result = of( this.lastStatus );
      }
    }

    // - Memorize last status
    result = result.pipe( map( s => { this.lastStatus = s; return s; }));
    return result;
  }

  private needFullUpdate( i: number | string ): boolean {
    let fullupdate: boolean;

    if( this.lastStatus != null && typeof i === 'number' ) {
      fullupdate = ( i % 60 === 0);

      if( ! fullupdate ) {
        if( this.lastStatus.status === 'playing' ) { // - ensure full-update at the end of the track
          if( this.lastStatus.currentTrack.duration - this.lastStatus.currentTrackTime < 2 ) {
            fullupdate = true;
          }
        }
      }
    }
    else { // - full-update after actions
      fullupdate = true;
    }
    return fullupdate;
  }


  getPlaylistFolders(): Observable<PlaylistFolder[]> {
      return timer(0, 60 * 1000).pipe(
          concatMap( i => this.collectFolders() )
      )
  }

  playFolder( name: string ) {
    this.client.playerControllerPlay({ body: { playlist_name: name} })
        .subscribe( resp => {
            console.log("playFolder ( name:", name, " ) => ", resp );
        });
  }

  play(): void {
    this.doSimpleAction( "play" );
  }

  stop(): void {
    this.doSimpleAction( "stop" );
  }

  pause(): void {
    this.doSimpleAction( "pause" );
  }

  resume(): void {
    this.doSimpleAction( "resume" );
  }


  setVolume( v: number): void {
    this.doSetAction( "setVolume", { volume: v });
  }

  seekTo( timeSec: number ): void {
    this.doSetAction( "seekTo", { seekTo: timeSec });
  } 

  changeTrack( t: Track ): void {
    this.doSetAction( "changeTrack", { track: t.id });
  }

  setLoop( l: boolean ): void {
    this.doSetAction( "setLoop", { loop: l });
  }

    
  private doSimpleAction( action: "play" | "pause" | "resume" | "stop" ) {
    this.client.playerControllerAction( { body: { action: action }} )
        .subscribe( resp => {
          this.actionFiredInternalAudit( action );
          console.log( action + "() => ", resp );
        });
  }

  private doSetAction( name: string, notNullParams: Partial<SetActionDto> ) {
    let params: SetActionDto = { action: "set", volume: null, track: null, seekTo: null, loop: null };
    for( let k in notNullParams ) {
      params[k] = notNullParams[k];
    }
    this.client.playerControllerAction( { body: params } )
        .subscribe( resp => {
          this.actionFiredInternalAudit( name );
          console.log( name + "( " + JSON.stringify( notNullParams ) + " ) => ", resp );
        });
  }

  private getStatus(): Observable<PlayerInfo> {
      return this.client.playerControllerGetStatus$Response().pipe(
          map( (resp) => {
              if( resp.status != 200 ) {
                console.trace("ERROR getStatus", resp );
              }
              let status = JSON.parse( resp.body as unknown as string )  as PlayerInfo;
              return status;
          })
      );
  }

  private collectFolders(): Observable<any> {
      return this.fromGenerated2StringArray( this.client.playerControllerListPlaylists$Response() )
          .pipe(
              concatMap( playlistsFoldersNames => {
              
                  let allFoldersObservables = playlistsFoldersNames.map( (folderName: string) => {
                      
                      return this.fromGenerated2StringArray( 
                              this.client.playerControllerGetPlaylistContent$Response({ playlist: folderName }) 
                          )
                          .pipe(
                              map( ( folderContent: string[] ) => {
                                  let plf: PlaylistFolder =  new PlaylistFolder();
                                  plf.name = folderName;
                                  plf.files = folderContent;
                                  return plf;
                              })
                          ); 
                  })

                  return forkJoin( allFoldersObservables );
              }
          )
      );
  } 

  private fromGenerated2StringArray( svcCall: Observable<StrictHttpResponse<void>> ): Observable<string[]> {
      
      return svcCall.pipe(
          map( resp => { 
            if( resp.status != 200 ) {
              console.trace( "ERROR", resp);
            }
            let result = JSON.parse( resp.body as unknown as string ) as string[];
            return result; 
          })
      );
  }


  private newActionsAuditObservable(): Observable<string> {
      
    let observable = Observable.create(observer => {
      
      this.actionObservers.push( observer );
      
      return () => {
        const index = this.actionObservers.indexOf( observer );
        if (index > -1) {
          this.actionObservers.splice(index, 1);
        }
      }
    });

    return observable;
  }

  private actionFiredInternalAudit( actionName: string ) {
    this.actionObservers.forEach( o => {
      o.next( actionName );
    })
  }

  private actionObservers: any[] = [];
  
}
