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
  constructor(private apiClient: TransomApiClientService) {
    console.log('here from json: ', data);
  }

  getRoutes(): Observable<FoiRoute[]> {
    return of(data.routeTree);
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
}
