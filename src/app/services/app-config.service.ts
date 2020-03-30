import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';

export interface Config {
  realm: string;
  url: string;
  clientId: string;
  secret: string;
  sslRequired: string;
  publicClient: string;

}

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  constructor(private httpClient: HttpClient) { }

  private configUrl = '/api/v1/configs';
  private config: Config = null;

  get settings() {
    return this.config;
  }

  public load(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpClient.get<Config>(this.configUrl).pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
      ).subscribe((response: Config) => {
        this.config = response
        resolve(true);
      });
    });
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return of({}); // let the application continue
  }
}
