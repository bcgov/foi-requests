import { Injectable } from '@angular/core';
import * as jwt_decode from 'jwt-decode';
import { default as config } from './keycloak-config.json';
import { KeycloakLoginOptions } from 'keycloak-js';

declare var Keycloak: any;


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
        options.idpHint = 'bcsc';
        return kcLogin(options);
      };

      this.keycloakAuth.init({token: sessionStorage.getItem('KC_TOKEN'), onLoad: 'login-required'})
        .success(() => {
          this.startRefreshTokenTimer(this.keycloakAuth);
          sessionStorage.setItem('KC_TOKEN' , this.keycloakAuth.token);
          sessionStorage.setItem('KC_REFRESH' , this.keycloakAuth.refreshToken);
          resolve();
        })
        .error(() => {
          reject();
        });
    });
  }

  startRefreshTokenTimer(kc) {
    const expiresIn = (kc.tokenParsed.exp - (new Date().getTime() / 1000) + kc.timeSkew) * 1000;
    setTimeout(() => this.refreshToken(), expiresIn);
  }

  refreshToken() {
    if (!this.keycloakAuth) {
      this.keycloakAuth = new Keycloak(config);
      this.keycloakAuth.init(
        {
          token: sessionStorage.getItem('KC_TOKEN'),
          refreshToken: sessionStorage.getItem('KC_REFRESH')
        }
      ).success(() => {
        this.updateToken();
      });
    } else {
      this.updateToken();
    }
  }
  updateToken() {
    this.keycloakAuth.updateToken(-1).success(() => {
      this.startRefreshTokenTimer(this.keycloakAuth);
      sessionStorage.setItem('KC_TOKEN' , this.keycloakAuth.token);
      sessionStorage.setItem('KC_REFRESH' , this.keycloakAuth.refreshToken);
    }).error(() => {
      console.error('Failed to refresh the token, or the session has expired');
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
        email: ''
      };
  }

  isAuthenticated(): boolean{
    const token = this.getDecodedToken();
    return token !== undefined && token.sub !== undefined;
  }

  logout() {
    if (this.isAuthenticated()) {
      if (!this.keycloakAuth) {
        this.keycloakAuth = new Keycloak(config);
        this.keycloakAuth.init({token: sessionStorage.getItem('KC_TOKEN'), onLoad: 'check-sso'})
        .success(authenticated => {
          if (authenticated) {
            this.logoutUser();
          }
        });
      } else {
        this.logoutUser();
      }
    }
  }

  logoutUser() {
    const redirectUrl = window.location.origin + '/general/submit-complete';
    this.keycloakAuth.logout({ redirectUri: redirectUrl });
  }
}
