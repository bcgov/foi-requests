import { TestBed, async } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AppComponent } from "./app.component";
import { CoreHeaderComponent } from "./core-header/core-header.component";
import { ProgressBarComponent } from "./progress-bar/progress-bar.component";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { LocalStorageService } from "ngx-webstorage";
import { FoiRouterService } from "./foi-router.service";
import { BehaviorSubject } from "rxjs";
import { Router } from "@angular/router";

class MockLocalStorage {}

describe("AppComponent", () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [AppComponent, CoreHeaderComponent, ProgressBarComponent],
      providers: [{ provide: LocalStorageService, useClass: MockLocalStorage }]
    }).compileComponents();
  }));

  it("should create the app", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it("should change routes on foiRoute progress", done => {
    const foiRouter: FoiRouterService = TestBed.get(FoiRouterService);
    const router: any = TestBed.get(Router);

    const mySubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    spyOn(foiRouter, "getRouteProgress").and.returnValue(mySubject);
    spyOn(router, "navigate").and.returnValue(Promise.resolve(true));
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;

    mySubject.next({ direction: 1 }); //go forward one step
    fixture.detectChanges();

    expect(app).toBeTruthy();
    expect(foiRouter.getRouteProgress).toHaveBeenCalledTimes(1);
    let call = router.navigate.calls.mostRecent();
    expect(call.args[0]).toEqual(["getting-started1"]);

    mySubject.next({ direction: -1 }); //go backward one step
    fixture.detectChanges();
    call = router.navigate.calls.mostRecent();
    expect(call.args.length).toEqual(1);

    mySubject.next({direction:2}); //go forward 2 steps
    call = router.navigate.calls.mostRecent();
    expect(call.args[0]).toEqual(['getting-started2']);

    // mySubject.next({direction:1}); //go forward 1 steps
    // fixture.detectChanges();
    // call = router.navigate.calls.mostRecent();
    // expect(call.args[0]).toEqual(['getting-started3']);

    // //now with a selection
    // mySubject.next({direction:1, selection:"personal"}); //go forward 1 steps
    // fixture.detectChanges();
    // call = router.navigate.calls.mostRecent();
    // expect(call.args[0]).toEqual(['personal','select-about']);
    done();
  });

  it("should have no progress if there's no current route", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    app.currentRoute = null;
    expect(app.currentProgress).toBe(0);
    expect(app.hasProgress).toBeFalsy();
  });

  it("should have progress if there's a current route", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    app.currentRoute = { route: "/foo", progress: 2 };
    expect(app.currentProgress).toBe(2);
    expect(app.hasProgress).toBeTruthy();
  });
});
