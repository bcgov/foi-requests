import { Injectable } from "@angular/core";
import { default as data } from "./data.json";
import { Observable, of } from "rxjs";
import { FoiRoute } from "../models/FoiRoute.js";
import { FoiRequest } from "../models/FoiRequest.js";
import { TransomApiClientService } from "../transom-api-client.service.js";
import { FormGroup } from "@angular/forms";

@Injectable({
  providedIn: "root"
})
export class DataService {
  foiRoutes: FoiRoute[];
  childFileKey: string = "childFileAttachment";
  personFileKey: string = "personFileAttachment";

  constructor(private apiClient: TransomApiClientService) {
    this.foiRoutes = this.flattenRoutes(data.routeTree);
    // console.table(this.foiRoutes, ['back', 'route', 'forward' ]);
  }

  getRoute(routeUrl: string): FoiRoute {
    // Remove any query parameters and (possibly) a leading slash.
    const path = (routeUrl || "/").split("?")[0].replace(/^\/+/g, "");
    return this.foiRoutes.find(r => r.route === path);
  }

  getMinistries(): Observable<any[]> {
    return of(data.referenceData.ministries);
  }

  capitalize(str) {
    if (typeof str !== "string") {
      return "";
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  getTopics(topicKey: string): Array<any> {
    return data.referenceData[topicKey] || [];
  }

  /**
   * Dynamically build a topic Key based on truthy keys in the Object provided.
   * Valid keys in about include: 'yourself', 'another'
   *
   * @param about
   */
  getTopicsObj(about: Object): Array<any> {
    const topics = [];
    for (let key in about) {
      if (key !== "child" && about[key]) {
        topics.push(this.capitalize(key));
      }
    }
    topics
      .sort()
      .reverse()
      .unshift("topic");
    const topicKey = topics.join("");
    return this.getTopics(topicKey);
  }

  loadState(stateKey: string): FoiRequest {
    const foi: string = sessionStorage.getItem(stateKey);
    const state = foi ? JSON.parse(foi) : {};
    state.requestData = state.requestData || {};
    return state;
  }

  getCurrentState(...dataKeys: string[]): FoiRequest {
    const state = this.loadState("foi-request");
    // Ensure that each entry in dataKeys exists before returning.
    if (dataKeys) {
      for (let key of dataKeys) {
        state.requestData[key] = state.requestData[key] || {};
      }
    }
    return state;
  }

  saveState(stateKey: string, state: FoiRequest) {
    // console.log(stateKey, state);
    sessionStorage.setItem(stateKey, JSON.stringify(state));
  }

  setCurrentState(foi: FoiRequest, key?: string, foiForm?: FormGroup): FoiRequest {
    if (key && foiForm) {
      // Clear the current node and populate it with values from the FormGroup.
      foi.requestData[key] = {};
      Object.keys(foiForm.value).map(k => (foi.requestData[key][k] = foiForm.value[k]));
    }
    this.saveState("foi-request", foi);
    return foi;
  }

  setChildFileAttachment(f: File): Observable<boolean> {
    return new Observable(observer => {
      const reader: FileReader = new FileReader();
      reader.onload = () => {
        sessionStorage.setItem(this.childFileKey, reader.result.toString());
        observer.next(true);
        observer.complete();
      };
      reader.readAsDataURL(f);
    });
  }

  removeChildFileAttachment() {
    sessionStorage.removeItem(this.childFileKey);
  }

  setPersonFileAttachment(f: File): Observable<boolean> {
    return new Observable(observer => {
      const reader: FileReader = new FileReader();
      reader.onload = () => {
        sessionStorage.setItem(this.personFileKey, reader.result.toString());
        observer.next(true);
        observer.complete();
      };
      reader.readAsDataURL(f);
    });
  }

  removePersonFileAttachment() {
    sessionStorage.removeItem(this.personFileKey);
  }

  private b64toBlob(b64Data, contentType, sliceSize?): Blob {
    contentType = contentType || "";
    sliceSize = sliceSize || 512;

    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  /**
   * Load a file from session storage using a given key.
   *
   * @param storageKey - Load a file using the provided key
   * @param filename - Apply the provided file name to the File object
   */
  getFileFrom(storageKey: string, filename: string): File {
    const base64 = sessionStorage[storageKey];
    if (!base64) {
      return null;
    }
    const base64Parts = base64.split(",");
    const fileFormat = base64Parts[0].split(";")[1];
    const fileContent = base64Parts[1];
    const b = this.b64toBlob(fileContent, fileFormat);
    const file = new File([b], filename);
    return file;
  }

  /**
   * Submit the completed FOI request data structure, and any files
   * from session storage, to the REST API that will generate and
   * send the request as email.
   *
   * @param authToken
   * @param nonce
   * @param foiRequest - A structure containing the complete request
   */
  submitRequest(authToken: string, nonce: string, foiRequest: FoiRequest): Observable<any> {
    this.apiClient.setHeader("Authorization", "Bearer " + authToken);
    this.apiClient.setHeader("captcha-nonce", nonce);
    foiRequest.attachments = [];

    if (foiRequest.requestData.childInformation) {
      const filename = foiRequest.requestData.childInformation.proofOfGuardianship;
      const childFile = this.getFileFrom(this.childFileKey, filename);
      if (childFile) {
        foiRequest.attachments.push(childFile);
      }
    }
    if (foiRequest.requestData.anotherInformation) {
      const filename = foiRequest.requestData.anotherInformation.proofOfAuthorization;
      const personFile = this.getFileFrom(this.personFileKey, filename);
      if (personFile) {
        foiRequest.attachments.push(personFile);
      }
    }

    return this.apiClient.postFoiRequest(foiRequest);
  }

  /**
   * Create a flattened copy of the routes defined in data.json.
   * This makes it simpler to derermine what are the
   * next (forward) and previous (back) routes for each.
   *
   * @param routes - Recursive flattening of the route data.
   * @param parent - The route that owns the choices to be flattened.
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
          this.flattenRoutes(choiceObj.routes, rt.route).map(r => flatRoutes.push(r));
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
