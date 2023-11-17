import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { FoiRouterService } from "src/app/foi-router.service";
import { Router } from "@angular/router";
import { DataService } from "src/app/services/data.service";
import { FoiRoute } from "src/app/models/FoiRoute";
import { BehaviorSubject } from "rxjs";
import { FormControl } from "@angular/forms";

@Component({
  selector: "foi-base",
  templateUrl: "./base.component.html",
  styleUrls: ["./base.component.scss"]
})
export class BaseComponent implements OnInit {
  @Output() continue = new EventEmitter();
  @Output() goBack = new EventEmitter();
  @Input("showButtons") showButtons: boolean = true;
  @Input("showInfo") showInfo: boolean = true;
  @Input("continueText") continueText: string = "Continue";
  @Input("continueClass") continueClass: string = "";
  @Input("continueDisabled") continueDisabled: boolean = false;
  @Input("startupComponent") startupComponent: boolean = false;
  routeData$: BehaviorSubject<any>;

  constructor(private foiRouter: FoiRouterService, private dataService: DataService, private router: Router) {
    this.routeData$ = new BehaviorSubject(null);
  }

  ngOnInit() {
    const route: FoiRoute = this.dataService.getRoute(this.router.url);
    const reqTp: any = this.dataService.getCurrentState("requestType");
    if (!reqTp.requestData.requestType.requestType && !this.startupComponent) {
      this.router.navigate([""]); //dropped into the middle of the form without a session
    }
    this.routeData$.next(route.data || {});
  }

  getCurrentRoute() {
    return this.router.url;
  }

  getFoiRouteData(): BehaviorSubject<any> {
    return this.routeData$;
  }

  /**
   * Handle navigation button clicks.
   * Issue the goBack event, the host component can call goFoiBack to actually
   * make the change.
   * If validation errors are present on the host component then
   * they need to be handled first.
   * It is the responsibility of the host component to persist any form data.
   */
  requestGoBack() {
    this.goBack.emit();
  }

  requestGoForward() {
    this.continue.emit();
  }

  goFoiBack() {
    this.foiRouter.progress({ direction: -1 });
  }

  goSkipBack() {
    this.foiRouter.progress({ direction: -2 });
  }

  goFoiForward(selection?: string) {
    this.foiRouter.progress({ direction: 1, selection });
  }

  goSkipForward() {
     if(selection !== "general")
    {
    this.foiRouter.progress({ direction: 2 });
    }
  }

  toDateValidator(c: FormControl){
    let ret = null;
    if (c.parent && c.parent.controls && c.parent.controls['fromDate'] && c.parent.controls['fromDate'].value && c.value){
      if (c.parent.controls['fromDate'].value > c.value) {
        ret = {
          toDateValid: {
            valid: false
          }
        }
      }
    }
    return ret;
  }

  noFutureValidator(c: FormControl) {
    if (!c.value) {
      if (c.errors && c.errors.required) {
        return null; // required validator already triggered
      }
      if (c.errors) {
        // There's something in the field & it doesn't look like a date!
        return {
          validDate: {
            valid: false
          }
        };
      } else {
        return null; // null date is valid.
      }
    }
    if (typeof c.value === "object" && c.value.constructor.name === "Date") {
      if (c.value <= new Date()) {
        // Entered date is prior to now, it's good!
        return null;
      } else {
        return {
          noFuture: {
            valid: false
          }
        };
      }
    } else {
      if (typeof c.value === "string") {
        const dtStr: string = c.value;
        let enteredDate: Date;
        if (dtStr.length === 24 && dtStr.indexOf("T") === 10) {
          // ISO date string
          enteredDate = new Date(dtStr);
        } else {
          // Three part date string: 01/06/2019 or 01-06-2019
          const parts = dtStr.split('/').join('-').split('-');
          if (parts.length === 3) {
            const year = Number.parseInt(parts[0]);
            const month: number = Number.parseInt(parts[1]) - 1;
            const day = Number.parseInt(parts[2]);
            // console.log("noFuture:", parts, new Date(year, month, day), new Date());
            enteredDate = new Date(year, month, day);
          } else {
            // Not a valid date
            return {
              validDate: {
                valid: false
              }
            };
          }
        }
        if (enteredDate <= new Date()) {
          // Entered date is prior to now, it's good!
          return null;
        }
        // Anything else is failed!
        return {
          validDate: {
            valid: false
          }
        };
      }
    }
  }
}
