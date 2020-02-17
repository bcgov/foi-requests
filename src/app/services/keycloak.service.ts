import { Injectable } from '@angular/core';
import * as jwt_decode from 'jwt-decode';

declare var Keycloak: any;
let jwtDecode = require('jwt-decode');

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {

  private keycloakAuth: any;

  constructor() { }

  init(): Promise<any> {
    return new Promise((resolve, reject) => {

      const keycloakConfig = {
        realm: 'fcf0kpqr',
        url: 'https://sso-dev.pathfinder.gov.bc.ca/auth' ,
        clientId: 'sbc-auth-web',
        credentials: {
          secret: 'aeb2b9bc-672b-4574-8bc8-e76e853c37cb',
          'ssl-required': 'external',
          'public-client': true
        },
      };
      if (this.keycloakAuth && this.keycloakAuth.token) {

      }
      this.keycloakAuth = new Keycloak(keycloakConfig);
      this.keycloakAuth.init({token: sessionStorage.getItem('KC_TOKEN')})
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
    this.keycloakAuth.login({idpHint: 'bcsc' })
      .success(() => {
        console.log('successs' + this.keycloakAuth.token);
      })
      .error(() => {
        console.log('error');
      });

  }

  getFirstName() {
    console.log('sessionStorage.getItem(\'KC_TOKEN\')',sessionStorage.getItem('KC_TOKEN'), !sessionStorage.getItem('KC_TOKEN'))
    if (!sessionStorage.getItem('KC_TOKEN')) {
      console.log('helo')
      const decoded = jwt_decode(sessionStorage.getItem('KC_TOKEN'));
      return decoded.lastname;
    } else {
      return '';
    }
  }

  initUser(): void {
    if (sessionStorage.getItem('KC_TOKEN')) {
    const decoded = jwt_decode(sessionStorage.getItem('KC_TOKEN'));
    console.log('this.parsedToken.lastname,' + decoded.lastname);
    }

  }
}
