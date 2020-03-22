import { Injectable, OnInit } from '@angular/core'
import { Observable, timer, forkJoin } from 'rxjs';
import { map, concatMap } from 'rxjs/operators';

import { ApiService } from '../../generated/player-api/services'
import { StrictHttpResponse } from '../../generated/player-api/strict-http-response'

import { PlaylistFolder } from '../../model/PlayListFolder';
import { PlayerInfo } from '../../model/PlayerInfo';
import { Track } from '../../model/Track';


@Injectable()
export class FullPlayerService implements OnInit {

  constructor( private client: ApiService ) { }

  ngOnInit(): void {
   
  }

  getStatusStream(): Observable<PlayerInfo> {
    return timer(0, 5 * 1000).pipe(
        concatMap( i => this.getStatus() )
    );
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
    this.client.playerControllerAction( { body: { action: "set", volume: v, track: null, seekTo: null, loop: null }} )
        .subscribe( resp => {
          console.log("setVolume( " + v + " ) => ", resp );
        });
  }

  seekTo( timeSec: number ): void {
    this.client.playerControllerAction( { body: { action: "set", volume: null, track: null, seekTo: timeSec, loop: null }} )
        .subscribe( resp => {
          console.log("seekTo( " + timeSec + " ) => ", resp );
        });
  } 

  changeTrack( t: Track ): void {
    this.client.playerControllerAction( { body: { action: "set", volume: null, track: t.id, seekTo: null, loop: null }} )
        .subscribe( resp => {
          console.log("changeTrack( " + t.id + " ) => ", resp );
        });
  }

  setLoop( l: boolean ): void {
    this.client.playerControllerAction( { body: { action: "set", volume: null, track: null, seekTo: null, loop: l }} )
        .subscribe( resp => {
          console.log("setLoop( " + l + " ) => ", resp );
        });
  }

    
  private doSimpleAction( action: "play" | "pause" | "resume" | "stop" ) {
    this.client.playerControllerAction( { body: { action: action }} )
        .subscribe( resp => {
          console.log( action + "() => ", resp );
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
  
}
