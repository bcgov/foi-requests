import { Injectable } from "@angular/core";
import { User } from "./models/user";
import { Observable, of } from "rxjs";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { map, catchError } from "rxjs/operators";
import { LocalStorageService } from "ngx-webstorage";
import { FoiRequest, BlobFile } from "./models/FoiRequest";
import { CreateTransactionRequest } from "./models/Transaction";

/**
 * Generic implementation of calls to the API. It supports making
 * CRUD style calls and calls to custom back-end functions.
 *
 * Each call response is routed through a centralized response handler
 * to facilitate error handling in the application.
 * E.g. Handling authentication errors from expired tokens can be
 *      implemented in one place.
 *
 * This API client is the authentication service for the API back-end, adding the
 * necessary headers.  It implements the canActivate interface for the route guards.
 */
@Injectable({
  providedIn: "root"
})
export class TransomApiClientService  {
  public baseUrl: string;
  public requestManagementUrl: string
  private headers: any;
  public currentUser: User;

  constructor(public http: HttpClient, private storage: LocalStorageService) {
    this.baseUrl = "/api/v1";
    this.requestManagementUrl = "/api";
    this.headers = {};
  }
  
  setHeader(key: string, value: string) {
    this.headers[key] = value;
  }
  /**
   * Generic API response handler. Passes the response on to the orginal caller
   * and catches any errors as needed using the catchError operator (rxjs).
   *
   * @param responseObs The generic response Observable of any API call
   */
  handleResponse(responseObs: Observable<any>): Observable<any> {
    return responseObs.pipe(
      map((res: Response) => {
        let retval: any = res;

        // Results that include multiple documemts are packaged in an envelope with a data property.
        if (retval.data) {
          retval = retval.data;
        }
        return retval;
      }),
      catchError((err: HttpErrorResponse, caught: Observable<any>) => this.handleHttpError(err, caught))
    );
  }

  /**
   * The implementation of general error handling is fairly rudimentary. Any 401 response is
   * assumed to mean that the token is expired and we're not logged in anymore. (Valid in this particular
   * app, but would need to be evaluated if developed further).
   * Any connectivity error is thrown as a hard error, as there is no graceful handling to operate in a disconnected state.
   *
   * The application does not provide a means for notifying the user of generic errors (E.g. drawer or toast)
   * therefore those errors are simply logged to the console.
   *
   * @param error the error response
   * @param responseObs the caught Observable with the error.
   */
  handleHttpError(error: HttpErrorResponse, responseObs?: Observable<any>) {
    if (error) {
      throw error;
    }
    return of([]);
  }

  // ******** CUSTOM Backend FUNCTIONS ******************

  /**
   * Makes a post request to the custom submitFOIRequest function and returns the result.
   *
   * @param functionName The name of the API function to call, as defined in
   * the functions object of apiDefinition.js (line 122)
   * @param body The body to post to the request.
   */
  postFoiRequest(foiRequest: FoiRequest, sendEmailOnly?: boolean): Observable<any> {
    const functionName = sendEmailOnly ? "submitFoiRequestEmail" : "submitFoiRequest";
    const url = this.baseUrl + `/fx/${functionName}`;

    const body: FormData = new FormData();
    body.append("requestData", JSON.stringify(foiRequest.requestData));
    for (let i = 0; i < foiRequest.attachments.length; i++) {
      const bf: BlobFile = foiRequest.attachments[i];
      body.append("file" + i, bf.file, bf.filename);
    }

    const obs = this.http.post(url, body, {
      headers: this.headers
    });
    return this.handleResponse(obs);
  }

  createTransaction(transactionRequest): Observable<any> {
    const url = this.requestManagementUrl + `/payments/createTransaction`;

    const obs = this.http.post(url, JSON.stringify(transactionRequest), {
      headers: this.headers
    });
    return this.handleResponse(obs);
  }

  updateTransaction(updateTransactionRequest): Observable<any> {
    const {requestId, payResponseUrl, transactionId} = updateTransactionRequest;

    const url = this.requestManagementUrl + `/payments/${requestId}/transactions/${transactionId}`;

    const obs = this.http.patch(url, JSON.stringify({      
      payResponseUrl: payResponseUrl
    }), {
      headers: this.headers
    });
    
    return this.handleResponse(obs);
  }

  getFeeDetails(feeCode: String, quantity: Number, date: string): Observable<any> {
    const url = this.requestManagementUrl + `/payments/${feeCode}?quantity=${quantity}&date=${date}`

    const obs = this.http.get(url, {
      headers: this.headers
    });
    return this.handleResponse(obs);
  }
}
