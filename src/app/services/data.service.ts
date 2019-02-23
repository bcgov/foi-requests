import { Injectable } from '@angular/core';
import { default as data } from './data.json';
import { Observable, of } from 'rxjs';
import { FoiRoute } from '../models/FoiRoute.js';
import { FoiRequest } from '../models/FoiRequest.js';
import { TransomApiClientService } from '../transom-api-client.service.js';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  foiRoutes: FoiRoute[];
  constructor(private apiClient: TransomApiClientService) {
    this.foiRoutes = this.flattenRoutes(data.routeTree);
  }

  getRoute(routeUrl: string): FoiRoute {
    // Remove any query parameters and the leading slash.
    const path = (routeUrl || '/').split('?')[0].substring(1);
    return this.foiRoutes.find(r => r.route === path);
  }

  getMinistries(): Observable<any[]> {
    return of(data.referenceData.ministries);
  }

  getCurrentState(dataKey?: string): FoiRequest {
    const foi = sessionStorage.getItem('foi-request');
    const state: FoiRequest = foi ? JSON.parse(foi) : {};
    // state.lastRoute = state.lastRoute || '/';
    state.requestData = state.requestData || {};
    // Ensure that dataKey exists before returning.
    if (dataKey) {
      state.requestData[dataKey] = state.requestData[dataKey] || {};
    }
    return state;
  }

  setCurrentState(foi: FoiRequest, key?: string, foiForm?: FormGroup): FoiRequest {
    if (key && foiForm) {
      // Clear the current node and populate it with values from the FormGroup.
      foi[key] = {};
      Object.keys(foiForm.value).map(
        k => (foi.requestData[key][k] = foiForm.value[k])
      );
    }
    sessionStorage.setItem('foi-request', JSON.stringify(foi));
    return foi;
  }

  submitRequest(authToken: string, nonce: string, foiRequest: FoiRequest): Observable<any> {
    console.log('token: ', authToken);
    this.apiClient.setHeader('Authorization', 'Bearer ' +  authToken);
    this.apiClient.setHeader('captcha-nonce', nonce);
    return this.apiClient.postFunction('submitFoiRequest', foiRequest);
  }

  /**
   *
   * @param routes Recursive flattening of the route data.
   * @param parent
   */
  flattenRoutes(routes: FoiRoute[], parent?: string) {
    const flatRoutes: FoiRoute[] = [];
    let goBackRoute: string = null;
    let previousRoute: FoiRoute = null;
    for (const rt of routes) {
      if (flatRoutes.length === 0) {
        rt.back = parent;
      } else {
        rt.back = goBackRoute;
      }
      flatRoutes.push(rt);
      if (rt.choices) {
        Object.keys(rt.choices).map(choice => {
          const choiceObj = rt.choices[choice];
          this.flattenRoutes(choiceObj.routes, rt.route).map(r =>
            flatRoutes.push(r)
          );
        });
      }
      goBackRoute = rt.route;
      if (previousRoute) {
        previousRoute.forward = rt.route;
      }
      previousRoute = rt;
    }
    return flatRoutes;
  }
}
