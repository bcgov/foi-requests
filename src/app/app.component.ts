import { Component, OnInit } from '@angular/core';
import { DataService } from './services/data.service';
import { FoiRoute } from './models/FoiRoute';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { FoiRouterService } from './foi-router.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'bcfoi';

  currentRoute: FoiRoute;
  currentRouteIndex: number = 0;
  currentProgress: number = 0;

  constructor(
    private dataService: DataService,
    private router: Router,
    private foiRouter: FoiRouterService
  ) {

    this.router.events
      .pipe(
        filter(value => value instanceof NavigationEnd)
      ).subscribe((navRoute: NavigationEnd) => {
        const navTo: FoiRoute = dataService.getRoute(navRoute.url);
        this.setCurrentRoute(navTo);
      });

    this.foiRouter.routeProgress.subscribe(val => {
      if (!val) {
        const rootRoute: FoiRoute = dataService.getRoute('/');
        this.setCurrentRoute(rootRoute);
        return;
      }
      // Go Back
      if (val.direction === -1) {
        this.router.navigate([this.currentRoute.back]);
        return;
      }
      // Continue
      if (val.direction === 1) {
        if (
          this.currentRoute.choices &&
          this.currentRoute.choices[val.selection]
        ) {
          // if this is one of the valid choices...
          const nextRoute = this.currentRoute.choices[val.selection].routes[0];
          this.router.navigate([nextRoute.route]);
        } else {
          // regular navigation
          this.router.navigate([this.currentRoute.forward]);
        }
        return;
      }
      throw new Error(`Unknown progress value: ${val}`);
    });
  }

  private setCurrentRoute(route: FoiRoute) {
    this.currentRoute = route;
    this.currentProgress = this.currentRoute.progress; // TODO: convert currentProgress to a proper getter!
  }

  hasProgress(): boolean {
    return this.currentProgress > 0;
  }

  ngOnInit() {
    const lastKnownReq = this.dataService.getCurrentState();
  }
}
