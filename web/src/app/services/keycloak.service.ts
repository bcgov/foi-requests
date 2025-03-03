import { Injectable } from '@angular/core';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import {  KeycloakLoginOptions } from 'keycloak-js';
import Keycloak from 'keycloak-js';
import {AppConfigService} from './app-config.service';

//declare var Keycloak: any;

// Define a custom interface extending JwtPayload
interface CustomJwtPayload extends JwtPayload {
  email: string;
  lastName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {

  private keycloakAuth: any;
  private keycloakConfig: any;

  constructor(private configService: AppConfigService) {

  }

  init(): Promise<any> {
    return new Promise((resolve, reject) => {
      const config = this.configService.settings;
      this.keycloakConfig = {
        realm : config.realm,
        url: config.url,      
        clientId: config.clientId,
        credentials: {
          //secret: config.secret,
          'ssl-required': config.sslRequired,
          'public-client': config.publicClient
        }
      };
      this.keycloakAuth = new Keycloak(this.keycloakConfig);
      const kcLogin = this.keycloakAuth.login;
      this.keycloakAuth.login = (options?: KeycloakLoginOptions) => {
        options.idpHint = 'bcsc';      
        return kcLogin(options);
      };
      
      this.keycloakAuth.init({
        token: sessionStorage.getItem('KC_TOKEN'), 
        onLoad: 'login-required',
        pkceMethod: 'S256',        // Ensures PKCE is used
        checkLoginIframe: false    // Prevents iframe-based login checks
      })
      .then(() => {
        if (this.keycloakAuth.token) {
          const decodedToken =jwtDecode<CustomJwtPayload>(this.keycloakAuth.token);
          
          if (decodedToken.email) {
            this.startRefreshTokenTimer(this.keycloakAuth);
            sessionStorage.setItem('KC_TOKEN', this.keycloakAuth.token);
            sessionStorage.setItem('KC_REFRESH', this.keycloakAuth.refreshToken);
            resolve(true);
          } else {
            resolve(false);
          }
        }
      })
      .catch(() => {
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

      this.keycloakAuth = new Keycloak(this.keycloakConfig);
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
      jwtDecode(sessionStorage.getItem('KC_TOKEN')) :
      {
        firstName: '',
        lastName: '',
        email: ''
      };
  }

  isAuthenticated(): boolean {
    const token = this.getDecodedToken();
    return token !== undefined && token.sub !== undefined;
  }

  logout() {
    if (this.isAuthenticated()) {
      if (!this.keycloakAuth) {
        this.keycloakAuth = new Keycloak(this.keycloakConfig);
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
    const redirectUrl = window.location.origin + '/personal/submit-complete';
    this.keycloakAuth.logout({ postLogoutRedirectUri: redirectUrl });
  }
}
