import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FoiRouterService } from 'src/app/foi-router.service';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { FoiRoute } from 'src/app/models/FoiRoute';
import { BehaviorSubject } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'foi-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit {
  @Output() continue = new EventEmitter();
  @Output() goBack = new EventEmitter();
  @Input('showButtons') showButtons: boolean = true;
  @Input('showInfo') showInfo: boolean = true;
  @Input('continueText') continueText: string = 'Continue';
  @Input('continueClass') continueClass: string = '';
  @Input('continueDisabled') continueDisabled: boolean = false;
  @Input('startupComponent') startupComponent: boolean = false;
  routeData$: BehaviorSubject<any>;

  constructor(
    private foiRouter: FoiRouterService,
    private dataService: DataService,
    private router: Router
  ) {
    this.routeData$ = new BehaviorSubject(null);
  }

  ngOnInit() {
    const route: FoiRoute = this.dataService.getRoute(this.router.url);
    const reqTp:any = this.dataService.getCurrentState('requestType');
    if (!reqTp.requestData.requestType.requestType && !this.startupComponent){
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
    this.foiRouter.progress({ direction: 2 });
  }

  noFutureValidator(c: FormControl) {
    if (!c.value) {
      return null; // null date is valid.
    }
    const parts = (c.value || "").split("-");
    if (parts.length === 3) {
      const year = parts[0];
      const month = parts[1] - 1;
      const day = parts[2];
      // console.log("noFuture:", parts, new Date(year, month, day), new Date());
      const enteredDate = new Date(year, month, day);
      if (enteredDate <= new Date()) {
        // Entered date is prior to now, it's good!
        return null;
      }
    }
    // Anything else is failed!
    return {
      noFuture: {
        valid: false
      }
    };
  }
}
