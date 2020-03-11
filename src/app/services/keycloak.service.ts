import { Injectable } from '@angular/core';
import * as jwt_decode from 'jwt-decode';
import {BehaviorSubject, Observable} from 'rxjs';
import KeyCloak from 'keycloak-js';
import { KeycloakLoginOptions } from 'keycloak-js';
import {AppConfigService} from './appconfig.service';
import {compileNgModule} from '@angular/compiler';

declare var Keycloak: any;


@Injectable({
  providedIn: 'root'
})
export class KeycloakService {

  private keycloakAuth: any;

  constructor(private configService: AppConfigService) {

  }

  init(): Promise<any> {
    return new Promise((resolve, reject) => {
      const config = this.configService.settings;
      const keycloakConfig = {
        realm : config.realm,
        url: config.url,
        clientId: config.clientId,
        credentials: {
          secret: config.secret,
          'ssl-required': config.sslRequired,
          'public-client': config.publicClient
        }
      };
      this.keycloakAuth = new Keycloak(keycloakConfig);
      const kcLogin = this.keycloakAuth.login;
      this.keycloakAuth.login = (options?: KeycloakLoginOptions) => {
        options.idpHint = 'bcsc';
        return kcLogin(options);
      };

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

  getToken() {
    return sessionStorage.getItem('KC_TOKEN');
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
