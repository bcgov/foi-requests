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

  getTopRoutes(): Observable<FoiRoute[]> {
    return of(data.routeTree);
  }

  getMinistries(): Observable<any[]> {
    return of(data.referenceData.ministries);
  }

  getCurrentState(): FoiRequest {
    const foi = sessionStorage.getItem('foi-request');
    const foiReq: FoiRequest = foi ? JSON.parse(foi) : {};
    foiReq.lastRoute = foiReq.lastRoute || '/';
    foiReq.requestData = foiReq.requestData || {};
    return foiReq;
  }

  setCurrentState(foiReq: FoiRequest) {
    sessionStorage.setItem('foi-request', JSON.stringify(foiReq));
  }

  submitRequest(foiRequest: FoiRequest): Observable<any> {
    return this.apiClient.postFunction('submitFoiRequest', foiRequest);
  }
}
