import { Injectable } from '@angular/core';
import * as jwt_decode from 'jwt-decode';
import { default as config } from "./keycloak-config.json";
import {BehaviorSubject, Observable} from 'rxjs';
// import KeyCloak from 'keycloak-js'

declare var Keycloak: any;

export function KeyCloakFactory(keycloakService: KeycloakService) {
  return () => {
    keycloakService.init();
  };
}

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {

  private keycloakAuth: any;
  private tokenInfo: BehaviorSubject<string>;

  constructor() {
    this.tokenInfo= new BehaviorSubject<string>('');
  }

  init(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.keycloakAuth = new Keycloak(config);
      this.keycloakAuth.init({token: sessionStorage.getItem('KC_TOKEN'), onLoad: 'check-sso'})
        .success(() => {
          sessionStorage.setItem('KC_TOKEN' , this.keycloakAuth.token);
          if (this.keycloakAuth.token) {
            this.tokenInfo.next(this.keycloakAuth.token);
            this.initUser();
          }
          resolve();
        })
        .error(() => {
          reject();
        });
    });
  }

  getToken(): string {
    return this.keycloakAuth.token;
  }
  getUserName(): string {
    return this.keycloakAuth.user;
  }

  login(): void {
    this.keycloakAuth.login({idpHint: 'bcsc'})
  }

  getTokenSubs(): Observable<string> {
    return this.tokenInfo.asObservable();
  }

  initUser(): void {
    if (sessionStorage.getItem('KC_TOKEN')) {
      const decoded = jwt_decode(sessionStorage.getItem('KC_TOKEN'));
      console.log('this.parsedToken ,' + JSON.stringify(decoded));
    }
  }

  getDecodedToken(): any {
    console.log(sessionStorage.getItem('KC_TOKEN'))
    return sessionStorage.getItem('KC_TOKEN') ?
      jwt_decode(sessionStorage.getItem('KC_TOKEN')) :
      {
        'firstname': null,
        'lastname': null
      }
  }

}
