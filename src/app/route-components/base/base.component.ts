import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FoiRouterService } from 'src/app/foi-router.service';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { FoiRoute } from 'src/app/models/FoiRoute';
import { BehaviorSubject } from 'rxjs';

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
  @Input('continueDisabled') continueDisabled: boolean = false;
  routeData$: BehaviorSubject<any>;

  constructor(
    private foiRouter: FoiRouterService,
    private dataService: DataService,
    private router: Router
  ) {
    this.routeData$ = new BehaviorSubject(null);
  }

  ngOnInit() {
    console.log(
      'DescriptionTimeframeComponent',
      this.dataService.getRoute(''),
      this
    );
    console.log('Router url: ', this.router.url);
    const route: FoiRoute = this.dataService.getRoute(this.router.url);
    this.routeData$.next(route.data || {});
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

  goFoiForward(selection?: string) {
    this.foiRouter.progress({ direction: 1, selection });
  }
}
