import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CloudCommanderModule } from './cloudcommander/cloudcommander.module';
import { PlayerModule } from './player/player.module';

import configuration from './config/config';


@Module({
  imports: [
    CloudCommanderModule, 
    PlayerModule, 
    ConfigModule.forRoot({
      load: [configuration],
    }),
    ServeStaticModule.forRoot({
      rootPath: __dirname + "/VlcWeb"
    }),
  ],
  controllers: [ ],
  providers: [ ],
})
export class AppModule { }
