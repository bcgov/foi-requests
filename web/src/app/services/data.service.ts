import { Injectable } from '@angular/core';
import { default as data } from './data.json';
import { Observable, of } from 'rxjs';
import { FoiRoute } from '../models/FoiRoute';
import { FoiRequest, BlobFile } from '../models/FoiRequest';
import { TransomApiClientService } from '../transom-api-client.service';
import { FormGroup } from '@angular/forms';
import { FeeRequestDetails } from '../models/FeeRequestDetails';
import { CreateTransactionRequest, UpdateTransactionRequest } from '../models/Transaction';

@Injectable({
  providedIn: "root",
})
export class DataService {
  foiRoutes: FoiRoute[];
  childFileKey = 'childFileAttachment';
  personFileKey = 'personFileAttachment';
  childFileName = 'Intake - Proof of Guardianship';
  personFileName = 'Intake - Signed Consent';

  constructor(private apiClient: TransomApiClientService) {
    this.foiRoutes = this.flattenRoutes(data.routeTree);
    
  }

  getRoute(routeUrl: string): FoiRoute {
    // Remove any query parameters and (possibly) a leading slash.
    const path = (routeUrl || "/").split("?")[0].replace(/^\/+/g, "");
    return this.foiRoutes.find((r) => {
      if (r.pattern) {
        return path.match(r.pattern) !== null;
      }
      return path === r.route;
    });
  }

 
  sortgreater(a:any,b:any) :number{

      return ((b.name > a.name) ? -1 : 0)
  }

  getMinistries(): Observable<any[]> {
    let _ministrylistsorted = data.referenceData.ministries.sort((a,b) => (a.name > b.name) ? 1 : this.sortgreater(a,b))
    return of(_ministrylistsorted);
  }

  getYouthinCareChild(): Observable<any[]> {
    return of(data.referenceData.youthincarechild);
  }

  getYouthinCareParent(): Observable<any[]> {
    return of(data.referenceData.youthincareparent);
  }

  getAdoptionData(): Observable<any[]> {
    return of(data.referenceData.adoption);
  }

  getFosterParent(): Observable<any[]> {
    return of(data.referenceData.fosterparent);
  }

  getChildInProtectionChild(): Observable<any[]> {
    return of(data.referenceData.childprotectionchild);
  }

  getChildInProtectionParent(): Observable<any[]> {
    return of(data.referenceData.childprotectionparent);
  }

  getYourselfTopics(): Observable<any[]> {
    return of(data.referenceData.topicYourself);
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

  getAdditionalOptions(): Observable<any[]> {
    return of(data.referenceData.additionaloptions);
  }

  getDelayFactors(): Array<string> {
    return data.referenceData.delayfactors;
  }

  /**
   * Dynamically build a topic Key based on truthy keys in the Object provided.
   * Valid keys in about include: 'yourself', 'another'
   *
   * @param about
   */
  getTopicsObj(about: Object): Array<any> {
    const topics = [];
    for (const key in about) {
      if (key !== "child" && about[key]) {
        topics.push(this.capitalize(key));
      }
    }
    topics.sort().reverse().unshift("topic");
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
      for (const key of dataKeys) {
        state.requestData[key] = state.requestData[key] || {};
      }
    }
    return state;
  }

  saveState(stateKey: string, state: FoiRequest) {
    
    sessionStorage.setItem(stateKey, JSON.stringify(state));
  }

  setCurrentState(foi: FoiRequest, key?: string, foiForm?: FormGroup): FoiRequest {
    if (key && foiForm) {
      // Clear the current node and populate it with values from the FormGroup.
      foi.requestData[key] = {};
      Object.keys(foiForm.value).forEach((k) => {
        foi.requestData[key][k] = foiForm.value[k];
      });
    }
    this.saveState("foi-request", foi);
    return foi;
  }

  setChildFileAttachment(f: File): Observable<boolean> {
    return new Observable((observer) => {
      const reader: FileReader = new FileReader();
      reader.onload = () => {
        try {
          sessionStorage.setItem(this.childFileKey, reader.result.toString());
          observer.next(true);
        } catch (err) {
          observer.error(this.getStorageErrorText(err));
        }
        observer.complete();
      };
      reader.readAsDataURL(f);
    });
  }

  saveAuthToken(value: string): void {
    sessionStorage.setItem("authToken", value);
  }

  getAuthToken(): string {
    return sessionStorage.getItem("authToken");
  }

  removeAuthToken(): void {
    sessionStorage.removeItem("authToken");
  }

  getShowBanner() {
    return sessionStorage.getItem("showBanner");
  }
  saveShowBanner() {
    sessionStorage.setItem("showBanner", "true");
  }

  removeShowBanner() {
    sessionStorage.removeItem("showBanner");
  }

  getShowEmailAlert() {
    return sessionStorage.getItem("showEmailAlert");
  }

  saveShowEmailAlert() {
    sessionStorage.setItem("showEmailAlert", "true");
  }

  removeShowEmailAlert() {
    sessionStorage.removeItem("showEmailAlert");
  }

  removeChildFileAttachment() {
    sessionStorage.removeItem(this.childFileKey);
  }

  getStorageErrorText(err: any) {
    let result = "Error saving your file, try submitting a smaller file";
    if (err && err.name && err.name === "QuotaExceededError") {
      result = "File(s) too large, try submitting smaller files";
    }
    return result;
  }

  setPersonFileAttachment(f: File): Observable<boolean> {
    return new Observable((observer) => {
      const reader: FileReader = new FileReader();
      reader.onload = () => {
        try {
          sessionStorage.setItem(this.personFileKey, reader.result.toString());
          observer.next(true);
        } catch (err) {
          observer.error(this.getStorageErrorText(err));
        }
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
   * @param storageKey - Load a file as Blob using the provided key
   */
  getBlobFrom(storageKey: string) {
    const base64 = sessionStorage[storageKey];
    if (!base64) {
      return null;
    }
    const base64Parts = base64.split(",");
    const fileFormat = base64Parts[0].split(";")[1];
    const fileContent = base64Parts[1];
    const blob = this.b64toBlob(fileContent, fileFormat);
    return blob;
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
  submitRequest(authToken: string, nonce: string, foiRequest: FoiRequest, sendEmailOnly?: boolean): Observable<any> {
    this.apiClient.setHeader("Authorization", "Bearer " + authToken);
    if (nonce) {
      
      this.apiClient.setHeader("captcha-nonce", nonce);
    }

    // Let header like application/json be removed to allow multipart/form-data to be automatically set
    if (this.apiClient.getHeader("Content-Type")) {
      this.apiClient.removeHeader("Content-Type");
    }

    foiRequest.attachments = [];

    if (foiRequest.requestData.childInformation) {
      const filename = this.renameAttachment(foiRequest.requestData.childInformation.proofOfGuardianship, this.childFileName);
      const childFile = this.getBlobFrom(this.childFileKey);
      if (childFile) {
        const blobFile: BlobFile = {
          file: childFile,
          filename,
        };
        foiRequest.attachments.push(blobFile);
      }
    }
    if (foiRequest.requestData.anotherInformation) {
      const filename = this.renameAttachment(foiRequest.requestData.anotherInformation.proofOfAuthorization, this.personFileName);
      const personFile = this.getBlobFrom(this.personFileKey);
      if (personFile) {
        const blobFile: BlobFile = {
          file: personFile,
          filename,
        };
        foiRequest.attachments.push(blobFile);
      }
    }
    

    return this.apiClient.postFoiRequest(foiRequest, sendEmailOnly);
  }

  /**
   * Fetches the fee details according to the fee code and the quantity of the fee units.
   * A selected ministry could be a fee unit and the number of selected ministries could be the quantity.
   *
   * @param feeCode
   * @param date
   * @param details - The details that would affect the calculation of the quantity of fee units e.g. ministries selected
   */
  getFeeDetails(feeCode: String, details?: FeeRequestDetails): Observable<any> {
    const quantity = details ? this.calculateUnitFeeQuantity(details) : 1;

    /*
    uncomment to test page
    return of({fee: 10})
    */

    return this.apiClient.getFeeDetails(feeCode, quantity);
  }

  createTransaction(transactionRequest: CreateTransactionRequest) {
    this.apiClient.setHeader("Content-Type", "application/json");

    return this.apiClient.createTransaction(transactionRequest);
  }

  updateTransaction(updateTransactionRequest: UpdateTransactionRequest) {
    this.apiClient.setHeader("Content-Type", "application/json");

    return this.apiClient.updateTransaction(updateTransactionRequest);
  }

  generateReceipt(generateReceiptRequest) {
    this.apiClient.setHeader("Content-Type", "application/json");

    return this.apiClient.generateReceipt(generateReceiptRequest);
  }

  /**
   * Calculates the quantity of fee units.
   * e.g. total fee amount could be fee * number of public bodies selected (fee units)
   *
   * @param details - The details that would affect the calculation of the quantity of fee units e.g. ministries selected
   */
  calculateUnitFeeQuantity(details: FeeRequestDetails): Number {
    if (!details.selectedMinistry) {
      return null;
    }

    if (details.selectedMinistry.length < 2) {
      return 1;
    }

    // Map to public body then store in Set to get unique ones selected
    const publicBodySet = new Set(details.selectedMinistry.map((ministry) => ministry["publicBody"]));

    return publicBodySet.size;
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
        Object.keys(rt.choices).map((choice) => {
          const choiceObj = rt.choices[choice];
          this.flattenRoutes(choiceObj.routes, rt.route).map((r) => flatRoutes.push(r));
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

  renameAttachment(filename: string, newFileName: string) {
    const extension = filename.lastIndexOf('.') === -1 ? '' : filename.substring(filename.lastIndexOf('.') + 1);
    return `${newFileName}.${extension}`;
  }
}
