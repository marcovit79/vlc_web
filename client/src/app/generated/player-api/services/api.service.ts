/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { NoargsActionDto } from '../models/noargs-action-dto';
import { PlaylistRefDto } from '../models/playlist-ref-dto';
import { SetActionDto } from '../models/set-action-dto';

@Injectable({
  providedIn: 'root',
})
export class ApiService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation playerControllerGetStatus
   */
  static readonly PlayerControllerGetStatusPath = '/api/player';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `playerControllerGetStatus()` instead.
   *
   * This method doesn't expect any request body.
   */
  playerControllerGetStatus$Response(params?: {

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.PlayerControllerGetStatusPath, 'get');
    if (params) {


    }
    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `playerControllerGetStatus$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  playerControllerGetStatus(params?: {

  }): Observable<void> {

    return this.playerControllerGetStatus$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation playerControllerPlay
   */
  static readonly PlayerControllerPlayPath = '/api/player';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `playerControllerPlay()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  playerControllerPlay$Response(params: {
      body: PlaylistRefDto
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.PlayerControllerPlayPath, 'post');
    if (params) {


      rb.body(params.body, 'application/json');
    }
    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `playerControllerPlay$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  playerControllerPlay(params: {
      body: PlaylistRefDto
  }): Observable<void> {

    return this.playerControllerPlay$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation playerControllerListPlaylists
   */
  static readonly PlayerControllerListPlaylistsPath = '/api/player/playlists';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `playerControllerListPlaylists()` instead.
   *
   * This method doesn't expect any request body.
   */
  playerControllerListPlaylists$Response(params?: {

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.PlayerControllerListPlaylistsPath, 'get');
    if (params) {


    }
    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `playerControllerListPlaylists$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  playerControllerListPlaylists(params?: {

  }): Observable<void> {

    return this.playerControllerListPlaylists$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation playerControllerGetPlaylistContent
   */
  static readonly PlayerControllerGetPlaylistContentPath = '/api/player/playlists/{playlist}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `playerControllerGetPlaylistContent()` instead.
   *
   * This method doesn't expect any request body.
   */
  playerControllerGetPlaylistContent$Response(params: {
    playlist: string;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.PlayerControllerGetPlaylistContentPath, 'get');
    if (params) {

      rb.path('playlist', params.playlist);

    }
    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `playerControllerGetPlaylistContent$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  playerControllerGetPlaylistContent(params: {
    playlist: string;

  }): Observable<void> {

    return this.playerControllerGetPlaylistContent$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation playerControllerAction
   */
  static readonly PlayerControllerActionPath = '/api/player/do';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `playerControllerAction()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  playerControllerAction$Response(params: {
      body: NoargsActionDto | SetActionDto
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.PlayerControllerActionPath, 'post');
    if (params) {


      rb.body(params.body, 'application/json');
    }
    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `playerControllerAction$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  playerControllerAction(params: {
      body: NoargsActionDto | SetActionDto
  }): Observable<void> {

    return this.playerControllerAction$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

}
