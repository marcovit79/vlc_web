import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatGridListModule } from '@angular/material/grid-list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';

import { HttpClientModule } from '@angular/common/http';
import { ApiModule } from './generated/player-api/api.module';


import { ClickStopPropagation } from './directives/clieck-stop-propagation';

import { AppComponent } from './app.component';
import { PlaylistsFolderComponent } from './components/playlists/playlists-folder.component';
import { VlcPlayerComponent } from './components/player/vlc-player.component';
import { DurationPipe } from './components/player/duration.pipe';
import { FullPlayerComponent } from './containers/full-player/full-player.component';
import { FullPlayerService } from './containers/full-player/full-player.service';


@NgModule({
  declarations: [
    AppComponent,
    PlaylistsFolderComponent,
    VlcPlayerComponent,
    FullPlayerComponent,

    DurationPipe,

    ClickStopPropagation
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,

    MatGridListModule,
    MatExpansionModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule,
    MatSliderModule,
    MatFormFieldModule,

    ApiModule
  ],
  providers: [ FullPlayerService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
