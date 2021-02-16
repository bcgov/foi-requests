import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FoiRouterService {
  private _routeProgress: BehaviorSubject<any>;

  constructor() {
    this._routeProgress = new BehaviorSubject<any>(null);
  }

  public getRouteProgress(): BehaviorSubject<any>{
    return this._routeProgress;
  }

  public progress(val) {
    this._routeProgress.next(val);
    this.scrollTop();
  }

  public scrollTop() {
    const step = 20;
    let expectedOffset = -1;
    const scrollToTop = window.setInterval(() => {
      const pos = window.pageYOffset;
      // If the user scrolls the page, stop trying to scroll-top!
      if (pos <= 0 || (expectedOffset !== -1 && expectedOffset !== pos)) {
        window.clearInterval(scrollToTop);
      } else {
        expectedOffset = pos - step;
        window.scrollTo(0, expectedOffset);
      }
    }, 20);
  }
}
