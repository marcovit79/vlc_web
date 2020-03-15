import { Input, Component, Output } from '@angular/core';
import { PlaylistFolder } from 'src/app/model/PlayListFolder';
import { EventEmitter } from '@angular/core';

@Component({
    selector: 'playlists-folder',
    styleUrls: ['playlists-folder.component.scss'],
    templateUrl: 'playlists-folder.component.html'
})
export class PlaylistsFolderComponent {
  
    @Input()
    playlists: PlaylistFolder[];

    @Output()
    selected: EventEmitter<string> = new EventEmitter();

    playlistSelected( playlist: PlaylistFolder) {
        this.selected.emit( playlist.name );
    }


    private actuallyOpenedFolderName: string;
    
    isExpanded( folder: PlaylistFolder ): boolean {
        return folder && folder.name === this.actuallyOpenedFolderName;
    }

    onFolderOpened( folder: PlaylistFolder ): void {
        if ( folder ) {
            this.actuallyOpenedFolderName = folder.name;
        }
    }

    onFolderClosed( folder: PlaylistFolder ): void {
        if ( folder ) {
            this.actuallyOpenedFolderName = null;
        }
    }

}
  