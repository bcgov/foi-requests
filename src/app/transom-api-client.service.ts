import { Injectable } from "@angular/core";
import { User } from "./models/user";
import { BehaviorSubject, Observable, of } from "rxjs";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { map, catchError, mergeMap } from "rxjs/operators";
import { LocalStorageService } from "ngx-webstorage";
import { CanActivate } from "@angular/router";
import { FoiRequest } from "./models/FoiRequest";

const APITOKEN = "TransomApiAuthToken";
const CURRENTUSER = "TransomApiCurrentUser";

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
export class TransomApiClientService implements CanActivate {
  public baseUrl: string;
  private headers: any;
  public currentUser: User;
  public loggedIn: BehaviorSubject<boolean>;

  constructor(public http: HttpClient, private storage: LocalStorageService) {
    this.baseUrl = "/api/v1";
    this.headers = {};
    this.loggedIn = new BehaviorSubject<boolean>(null);

    this.loggedIn.subscribe(isLoggedIn => {
      // Cleanup headers and local storage when a user is logged out.
      if (isLoggedIn === false) {
        this.headers = {};
        this.storage.clear(APITOKEN);
        this.currentUser = null;
      }
    });
  }

  ping(): Observable<any> {
    return this.http.get("/api/v1");
  }

  /**
   * Used on the route guard. Prevents anonymous access to routes that require a login.
   */
  canActivate(): Observable<boolean> {
    return this.loggedIn;
  }

  /**
   * Clear the login state and remove the token from local storage.
   */
  userLogout() {
    this.storage.clear(APITOKEN);
    this.setLoginState(null);
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
    if (error.status === 401) {
      this.setLoginState(null);
    } else if (error.status === 0) {
      // Not connected, note CORS errors end up here as well!
      throw error;
    } else if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.log("An error occurred:", error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body contains details what went wrong,
      console.log(`Backend returned:`, error);
      throw error;
    }
    return of([]);
  }

  /**
   * The access and refresh tokens are submitted to the api back end. It will
   * call Google, including the client secret (available on the API server only)
   * to validate that the token is good. When all is good, the API replies with
   * a bearer token for this client, that needs to be used in the 'Authorization' header
   * for all subsequent authenticated requests.
   *
   * @param tokenObj The tokens obtained from the google authentication.
   */
  validateGoogleLogin(tokenObj): Observable<boolean> {
    const url: string = this.baseUrl + `/user/google`;

    return new Observable<boolean>(observer => {
      this.http.post(url, tokenObj).subscribe(
        (response: any) => {
          if (response.token) {
            this.storage.store(APITOKEN, response.token);
            this.headers["authorization"] = `Bearer ${response.token}`;
            observer.next(true);
          } else {
            observer.next(false);
          }
        },
        (err: any) => {
          console.log("Google validation error: ", err);
          observer.error(err);
        }
      );
    });
  }

  /**
   * Makes an authenticated request that returns the current user profile from the back end API.
   * It is used in the application as the final step of a successful login, to get the user's profile
   * data and manage the login state.
   */
  userMe(): Observable<User> {
    const obs = new Observable<User>(observer => {
      const token = this.storage.retrieve(APITOKEN);
      if (token) {
        this.headers["authorization"] = `Bearer ${token}`;

        // Hit the API for the current user profile.
        this.http.get(this.baseUrl + `/user/me`, { headers: this.headers }).subscribe(
          (user: any) => {
            this.setLoginState(user.me);
            observer.next(user.me);
          },
          error => {
            if (error && error.status === 401) {
              // User is not logged in.
              this.setLoginState(null);
              observer.error(error);
            }
          }
        );
      } else {
        observer.error({
          status: 401,
          message: "API token not found"
        });
        this.loggedIn.next(false);
      }
    });
    return obs;
  }

  /**
   * Makes a GET request that returns all the matching documents in the requested sort order.
   * Endpoint names correspond to the properties of the 'entities' object in the apiDefinition.js (line 24)
   *
   * @param dbEndpoint The named CRUD API endpoint
   * @param queryParams The sort and filter parameters
   */
  getDbData(dbEndpoint: string, queryParams: any): Observable<any> {
    const url: string = this.baseUrl + `/db/${dbEndpoint}`;

    const obs = this.http.get(url, {
      headers: this.headers,
      params: queryParams
    });
    return this.handleResponse(obs);
  }

  /**
   * GET request to retrieve a single document by Id.
   *
   * @param dbEndpoint The CRUD end point in the API.
   * @param id The id of the requested document
   */
  getDbDataById(dbEndpoint: string, id: string): Observable<any> {
    const url = this.baseUrl + `/db/${dbEndpoint}/${id}`;
    const obs = this.http.get(url, {
      headers: this.headers
    });
    return this.handleResponse(obs);
  }

  /**
   * Delete request to remove the document from the database.
   *
   * @param dbEndpoint  The named CRUD end point in the API.
   * @param id    Unique document identifier
   */
  deleteDbDataById(dbEndpoint: string, id: string): Observable<any> {
    const obs = this.http.delete(this.baseUrl + `/db/${dbEndpoint}/${id}`, {
      headers: this.headers
    });
    return this.handleResponse(obs);
  }

  /**
   * Makes a POST request on the endpoint to insert the document.
   * If the document contains a file (binary type in the back-end) then
   * that is submitted on a subsequent PUT request (multi-part form-encoded)
   *
   * @param dbEndpoint The named CRUD end point in the API.
   * @param doc A JSON document to be inserted.
   */
  insert(dbEndpoint: string, doc: any): Observable<any> {
    let fd: FormData;

    for (const key in doc) {
      if (doc[key] && doc[key].constructor) {
        if (doc[key].constructor.name === "File") {
          if (!fd) {
            fd = new FormData();
          }
          fd.append(key, doc[key]);
        }
      }
    }
    const obs = this.http.post(this.baseUrl + `/db/${dbEndpoint}`, doc, {
      headers: this.headers
    });
    let final = obs;
    if (fd) {
      final = obs.pipe(
        mergeMap(doc1 => {
          const internal = this.http.put(this.baseUrl + `/db/${dbEndpoint}/${doc._id}`, fd, { headers: this.headers });
          return internal;
        })
      );
    }
    return this.handleResponse(final);
  }

  /**
   * Makes a PUT request on the endpoint to update a document.
   * If the document contains a file (binary type in the back-end) then
   * that is submitted on a subsequent PUT request (multi-part form-encoded)
   *
   * @param dbEndpoint The CRUD endpoint in the API.
   * @param doc A JSON document containing values to be updated.
   */
  update(dbEndpoint: string, doc: any): Observable<any> {
    let fd: FormData;

    for (const key in doc) {
      if (doc[key] && doc[key].constructor) {
        if (doc[key].constructor.name === "File") {
          if (!fd) {
            fd = new FormData();
          }
          fd.append(key, doc[key]);
        }
      }
    }

    let obs = this.http.put(this.baseUrl + `/db/${dbEndpoint}/${doc._id}`, doc, { headers: this.headers });
    let final = obs;
    if (fd) {
      final = obs.pipe(
        mergeMap(doc1 => {
          let internal = this.http.put(this.baseUrl + `/db/${dbEndpoint}/${doc._id}`, fd, { headers: this.headers });
          return internal;
        })
      );
    }
    return this.handleResponse(final);
  }

  /**
   * During login and logout we are setting a new state, so the loggedIn Observable
   * is triggered with the new value and the application state can be updated.
   *
   * @param newUser The newly acquired user profile, or null.
   */
  private setLoginState(newUser: User) {
    if (newUser) {
      if (!this.currentUser) {
        this.currentUser = newUser;
        this.storage.store(CURRENTUSER, newUser);
        this.loggedIn.next(true);
      }
    } else {
      if (this.currentUser) {
        this.currentUser = null;
        this.loggedIn.next(false);
      }
    }
  }

  // ******** CUSTOM Backend FUNCTIONS ******************

  /**
   * Makes a post request to the custom function and returns the result.
   *
   * @param functionName The name of the API function to call, as defined in
   * the functions object of apiDefinition.js (line 122)
   * @param body The body to post to the request.
   */
  postFunction(functionName: string, body: any): Observable<any> {
    const url = this.baseUrl + `/fx/${functionName}`;
    const obs = this.http.post(url, body, {
      headers: this.headers
    });
    return this.handleResponse(obs);
  }

  /**
   * Makes a post request to the custom submitFOIRequest function and returns the result.
   *
   * @param functionName The name of the API function to call, as defined in
   * the functions object of apiDefinition.js (line 122)
   * @param body The body to post to the request.
   */
  postFoiRequest(foiRequest: FoiRequest): Observable<any> {
    const functionName = "submitFoiRequest";
    const url = this.baseUrl + `/fx/${functionName}`;

    const body: FormData = new FormData();
    body.append("requestData", JSON.stringify(foiRequest.requestData));
    for (let i = 0; i < foiRequest.attachments.length; i++) {
      const f: File = foiRequest.attachments[i];
      body.append("file" + i, f);
    }

    const obs = this.http.post(url, body, {
      headers: this.headers
    });
    return this.handleResponse(obs);
  }

  /**
   * Makes a get request to the custom function with the supplied query string,
   * and return the response.
   *
   * @param functionName The name of the REST API function to call.
   * @param queryString The query string to apply to the get request.
   */
  getFunction(functionName: string, queryString?: string): Observable<any> {
    let url = this.baseUrl + `/fx/${functionName}`;
    if (queryString) {
      url += `?${queryString}`;
    }
    const obs = this.http.get(url, {
      headers: this.headers
    });
    return this.handleResponse(obs);
  }
}
