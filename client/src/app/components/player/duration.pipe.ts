import { Pipe, PipeTransform } from '@angular/core';


@Pipe({name: 'duration'})
export class DurationPipe implements PipeTransform {
  
  transform(value: number ): string {
    let seconds = value % 60;
    let minutes = Math.floor( value / 60 ) % 60;
    let hours = Math.floor( value / ( 60 * 60) );

    let str = ( '0' + minutes).slice( -2) + ":" + ( '0' + seconds).slice( -2);
    if ( hours == 0 ) {
        str =  str + " min";
    }
    else {
        str = hours + ":" + str + " h"
    }

    return str;
  }
}