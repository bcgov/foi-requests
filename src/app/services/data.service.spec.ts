import { TestBed } from "@angular/core/testing";

import { DataService } from "./data.service";
import { TransomApiClientService } from "../transom-api-client.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { LocalStorageService, NgxWebstorageModule, SessionStorage } from "ngx-webstorage";
import { FoiRoute } from "../models/FoiRoute";
import { FoiRequest } from "../models/FoiRequest";

class MockApiClient {}

describe("DataService", () => {
  let service: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxWebstorageModule.forRoot()],
      providers: [
        { provide: TransomApiClientService, useClass: MockApiClient }
        //{ provide: LocalStorageService, useClass: MockLocalStorage }
      ]
    });
    service = TestBed.get(DataService);
    sessionStorage.removeItem("foi-request");
    sessionStorage.removeItem(service.personFileKey);
    sessionStorage.removeItem(service.childFileKey);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should get an FoiRoute by Url", () => {
    const gettingStarted1: FoiRoute = service.getRoute("/getting-started1");
    expect(gettingStarted1).toBeTruthy();
  });

  it("should set and get the current request state", () => {
    const foi: FoiRequest = {
      requestData: {
        personalInfo: { foo: "bar" }
      }
    };
    service.setCurrentState(foi);
    let returnedState = service.getCurrentState("personalInfo", "anotherInfo");
    expect(returnedState).toBeTruthy();
    expect(returnedState.requestData.personalInfo.foo).toEqual("bar");
    expect(returnedState.requestData.anotherInfo).toEqual({});
    let storedFoiRequest = sessionStorage.getItem("foi-request");
    expect(storedFoiRequest).toEqual('{"requestData":{"personalInfo":{"foo":"bar"}}}');
  });

  it("should set current state from a FormGroup", () => {
    const foi: FoiRequest = {
      requestData: {
        personalInfo: { foo: "bar" }
      }
    };
    service.setCurrentState(foi);
    let req = service.getCurrentState();
    const testForm: any = {
      value: { firstName: "Paul" }
    };
    service.setCurrentState(req, "personalInfo", testForm);

    let storedFoiRequest = sessionStorage.getItem("foi-request");
    expect(storedFoiRequest).toEqual('{"requestData":{"personalInfo":{"firstName":"Paul"}}}');
  });

  it("should record a child file attachment in session storage base64 encoded", (done) => {
    const f = new File(["foo"], "foo.txt", {
      type: "text/plain",
    });
    service.setChildFileAttachment(f).subscribe(value =>{
      if (value){
        let storedData = sessionStorage.getItem(service.childFileKey);
        expect(storedData).toEqual("data:text/plain;base64,Zm9v");  
        
        service.removeChildFileAttachment();
        let emptyData = sessionStorage.getItem(service.childFileKey);
        expect(emptyData).toBeNull();
        done();
      }
    });
    
  });

  it("should record a personal file attachment in session storage base64 encoded", (done) => {
    const f = new File(["foo"], "foo.txt", {
      type: "text/plain",
    });
    service.setPersonFileAttachment(f).subscribe(value =>{
      if (value){
        let storedData = sessionStorage.getItem(service.personFileKey);
        expect(storedData).toEqual("data:text/plain;base64,Zm9v");  
        
        service.removePersonFileAttachment();
        let emptyData = sessionStorage.getItem(service.personFileKey);
        expect(emptyData).toBeNull();
        done();
      }
    });
  });

  it('should return a file object from session storage', (done) => {
    const f = new File(["foo"], "foo.txt", {
      type: "text/plain",
    });
    service.setPersonFileAttachment(f).subscribe(value =>{
      if (value){
        const fReturned = service.getFileFrom(service.personFileKey, 'final.txt');
        const fr : FileReader = new FileReader();
        fr.onload = () => {
          expect(fr.result).toEqual("foo");
          expect(fReturned.name).toEqual("final.txt");
          done();
        };
        fr.readAsText(fReturned);
        
      }
    });
  });
});

