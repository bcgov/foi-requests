import { FoiRequest } from "./models/FoiRequest";
import { FoiRoute } from "./models/FoiRoute";
import { of, Observable } from "rxjs";
import { FormGroup } from "@angular/forms";

export class MockDataService {
  getCurrentState(dataKey?: string): FoiRequest {
    const state = {
      requestData: {
        requestType: { requestType: "personal" },
        ministry: {
          defaultMinistry: { code: "PSSG", name: "Public Safety and Solicitor General" },
          selectedMinistry: [{ code: "PSSG", name: "Public Safety and Solicitor General" }],
          ministryPage: "/personal/another/ministry-confirmation"
        },
        selectAbout: { yourself: null, child: null, another: true },
        proofOfPermission: { answerYes: "true" },
        anotherInformation: {
          firstName: "Robert",
          middleName: "M",
          lastName: "Smith",
          alsoKnownAs: "Bob",
          dateOfBirth: "2010-10-10",
          proofOfAuthorization: "arts.jpg"
        },
        contactInfo: {
          firstName: "Sam",
          middleName: null,
          lastName: "Smith",
          birthDate: "2011-11-11",
          alsoKnownAs: null,
          businessName: "BinaryOps Software"
        },
        requestTopic: {
          value: "correctionalFacility",
          text: "The person's time spent in a correctional facility",
          ministryCode: "PSSG"
        },
        descriptionTimeframe: {
          topic: "The person's time spent in a correctional facility",
          description: "Visitor Logs",
          fromDate: "2010-10-10",
          toDate: "2011-11-11",
          correctionalServiceNumber: "12345",
          publicServiceEmployeeNumber: null
        },
        contactInfoOptions: {
          phonePrimary: "250-555-1212",
          phoneSecondary: null,
          email: "me@work.com",
          address: "123 fullerton st",
          city: "Corner gas town",
          postal: "V8V 3r4",
          province: "BC",
          country: "CA"
        }
      }
    };

    // Ensure that dataKey exists before returning.
    if (dataKey) {
      state.requestData[dataKey] = state.requestData[dataKey] || {};
    }
    return state;
  }

  getRoute(routeUrl: string): FoiRoute {
    const rt: FoiRoute = { route: "/somewhere", progress: 2 };
    return rt;
  }

  getMinistries(): Observable<any[]> {
    return of([
      { code: "AEST", name: "Advanced Education and Skills Training" },
      { code: "AGRI", name: "Agriculture, Food, and Fisheries" },
      { code: "AG", name: "Attorney General (and Minister Responsible for Housing)" },
      { code: "PSSG", name: "Public Safety and Solicitor General" }
    ]);
  }

  saveState(stateKey: string, state: FoiRequest) {}

  setCurrentState(foi: FoiRequest, key?: string, foiForm?: FormGroup): FoiRequest {
    if (key && foiForm) {
      // Clear the current node and populate it with values from the FormGroup.
      foi.requestData[key] = {};
      Object.keys(foiForm.value).map(k => (foi.requestData[key][k] = foiForm.value[k]));
    }
    this.saveState("foi-request", foi);
    return foi;
  }
  
  removeChildFileAttachment() {
  }

  removePersonFileAttachment() {
  }

  getTopicsObj(about: Object): Array<any> {
    const topics = [
      {
        value: "publicServiceEmployment",
        text: "Your employment with the public service",
        ministryCode: "PSA"
      },
      {
        value: "correctionalFacility",
        text: "Your time spent in a correctional facility",
        ministryCode: "PSSG"
      }
    ];
    return topics;
  }

  getTopics() {
    return [
      {
        value: "publicServiceEmployment",
        text: "Your employment with the public service",
        ministryCode: "PSA"
      },
      {
        value: "correctionalFacility",
        text: "Your time spent in a correctional facility",
        ministryCode: "PSSG"
      }
    ];
  }

  submitRequest(){
    
  }
}

export class MockRouter {
  url: "/general/somewhere";
  navigate(...args) {
  };
}

export class MockCaptchaDataService {
  public fetchData(apiBaseUrl: string, nonce: string): Observable<any> {
    return of({ body: { captcha: {}, validation: {} } });
  }

  public verifyCaptcha(apiBaseUrl: string, nonce: string, answer: string, encryptedAnswer: string): Observable<any>{
    return of({foo:"bar"});
  }

  public fetchAudio(apiBaseUrl: string, validation: string, translation?: string){
    return of({ body: {audio:{}}});
  }
}
