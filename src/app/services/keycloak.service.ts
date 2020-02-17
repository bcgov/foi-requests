import { Injectable } from '@angular/core';
import * as jwt_decode from 'jwt-decode';
import { default as config } from "./keycloak-config.json";
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

  constructor() { }

  init(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.keycloakAuth = new Keycloak(config);
      this.keycloakAuth.init({token: sessionStorage.getItem('KC_TOKEN'), onLoad: 'check-sso'})
        .success(() => {
          sessionStorage.setItem('KC_TOKEN' , this.keycloakAuth.token);
          if (this.keycloakAuth.token) {
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
