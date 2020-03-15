import { Controller, Get, Post, Body, Param, Header } from '@nestjs/common';
import { PlayerService, PlayerInfo } from './player.service';
import { ApiProperty, ApiExtraModels, ApiBody, getSchemaPath } from '@nestjs/swagger';


export class PlaylistRefDto {
  @ApiProperty()
  playlist_name: string
}

export class BaseActionDto {
  @ApiProperty()
  action: string
}

export class NoargsActionDto extends BaseActionDto {
  @ApiProperty({ enum: ['play', 'pause', 'resume', 'stop']})
  action: 'play' | 'pause' | 'resume' | 'stop'
}

export class SetActionDto extends BaseActionDto {
  @ApiProperty({ enum: ['set']})
  action: 'set'

  @ApiProperty()
  track: number

  @ApiProperty()
  volume: number

  @ApiProperty()
  seekTo: number
}


@Controller('api/player')
export class PlayerController {
  
  constructor(private readonly svc: PlayerService) { }

  @Get()
  getStatus(): Promise<PlayerInfo> {
    return this.svc.getAllInformations();
  }

  @Get('/playlists')
  listPlaylists(): Promise<string[]> {
    return this.svc.listPlayLists();
  }

  @Get('/playlists/:playlist')
  getPlaylistContent( @Param('playlist') playlistName: string ): Promise<string[]> {
    return this.svc.getTracksNames( playlistName );
  }


  @Post()
  play( @Body() params: PlaylistRefDto ): void {
    this.svc.setPlaylist(  params.playlist_name );
  }

  @Post('do')
  @ApiBody({
    schema: {
      oneOf: [
        { $ref: getSchemaPath( NoargsActionDto ) },
        { $ref: getSchemaPath( SetActionDto) },
      ]
    }
  })
  @ApiExtraModels(NoargsActionDto, SetActionDto)
  action<T extends BaseActionDto>( @Body() params: T ): void {
    console.log(params)
    if( params.action === 'play' ) {
      this.svc.start();
    }
    else if( params.action === 'pause' ) {
      this.svc.pause();
    }
    else if( params.action === 'resume' ) {
      this.svc.resume();
    }
    else if( params.action === 'stop' ) {
      this.svc.stop();
    }
    else if( params.action === 'set' ) {
      let p: SetActionDto = params as unknown as SetActionDto;
      if( p.volume != null ) {
        this.svc.setVolume( p.volume );
      }
      if( p.track != null ) {
        this.svc.setTrack( p.track );
      }
      if( p.seekTo != null ) {
        this.svc.seekTo( p.seekTo );
      }
    }

    // migliorare il dto dell'azione per passare parametri e avere l'azione set che possa settare traccia e volume
  }

}
