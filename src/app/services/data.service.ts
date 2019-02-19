import { Injectable } from '@angular/core';
import { default as data } from './data.json';
import { Observable, of } from 'rxjs';
import { FoiRoute } from '../models/FoiRoute.js';
import { FoiRequest } from '../models/FoiRequest.js';
import { TransomApiClientService } from '../transom-api-client.service.js';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  foiRoutes: FoiRoute[];
  constructor(private apiClient: TransomApiClientService) {
    console.log('here from json: ', data);
    this.foiRoutes = this.flattenRoutes(data.routeTree);  
  }

  getRoute(routeUrl: String): FoiRoute {
    // Remove any query parameters and the leading slash.
    const path = (routeUrl || '/').split('?')[0].substring(1);
    return this.foiRoutes.find(r => r.route === path);
  }

  getMinistries(): Observable<any[]> {
    return of(data.referenceData.ministries);
  }

  getCurrentState(): FoiRequest {
    const foi = sessionStorage.getItem('foi-request');
    const state: FoiRequest = foi ? JSON.parse(foi) : {};
    // state.lastRoute = state.lastRoute || '/';
    state.requestData = state.requestData || {};
    return state;
  }

  setCurrentState(foi: FoiRequest) {
    sessionStorage.setItem('foi-request', JSON.stringify(foi));
  }

  submitRequest(foiRequest: FoiRequest): Observable<any> {
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
