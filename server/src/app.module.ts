import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CloudCommanderModule } from './cloudcommander/cloudcommander.module';
import { PlayerModule } from './player/player.module';

import configuration from './config/config';


@Module({
  imports: [
    CloudCommanderModule, 
    PlayerModule, 
    ConfigModule.forRoot({
      load: [configuration],
    }) 
  ],
  controllers: [ ],
  providers: [ ],
})
export class AppModule { }
