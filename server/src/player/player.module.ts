import { Module, HttpModule } from '@nestjs/common';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [ ConfigModule ],
  controllers: [ PlayerController ],
  providers: [ PlayerService ],
})
export class PlayerModule { }
