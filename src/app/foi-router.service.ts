import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FoiRouterService {
  routeProgress: BehaviorSubject<any>;

  constructor() {
    this.routeProgress = new BehaviorSubject<any>(null);
  }

  public progress(val) {
    this.routeProgress.next(val);
    this.scrollTop();
  }

  public scrollTop() {
    const step = 20;
    const scrollToTop = window.setInterval(() => {
      const pos = window.pageYOffset;
      if (pos > 0) {
        window.scrollTo(0, pos - step);
      } else {
        window.clearInterval(scrollToTop);
      }
    }, 20);
  }
}
