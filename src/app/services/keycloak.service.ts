import { Injectable } from '@angular/core';
import * as jwt_decode from 'jwt-decode';
import { default as config } from "./keycloak-config.json";
import {BehaviorSubject, Observable} from 'rxjs';
import KeyCloak from 'keycloak-js'
import { KeycloakLoginOptions } from 'keycloak-js'

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

  init(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.keycloakAuth = new Keycloak(config);
      const kcLogin = this.keycloakAuth.login;
      this.keycloakAuth.login = (options?: KeycloakLoginOptions) => {
        options.idpHint = 'bcsc'
        return kcLogin(options)
      }

      this.keycloakAuth.init({token: sessionStorage.getItem('KC_TOKEN'), onLoad: 'login-required'})
        .success(() => {
          sessionStorage.setItem('KC_TOKEN' , this.keycloakAuth.token);
          resolve();
        })
        .error(() => {
          reject();
        });
    });
  }


  getDecodedToken(): any {
    return sessionStorage.getItem('KC_TOKEN') ?
      jwt_decode(sessionStorage.getItem('KC_TOKEN')) :
      {
        firstName: '',
        lastName: '',
        email: '',
        birthDate: ''
      };
  }

}
