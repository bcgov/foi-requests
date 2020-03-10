import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  constructor(private httpClient: HttpClient) { }

  private envUrl = '/api/v1/configs';
  private configSettings: any = null;

  get settings() {
    return this.configSettings;
  }

  public load(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpClient.get(this.envUrl).subscribe((response: any) => {
        this.configSettings = response;
        resolve(true);
      });
    });
  }
}
