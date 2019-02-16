import { Component, OnInit } from '@angular/core';
import { DataService } from './services/data.service';
import { Observable } from 'rxjs';
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
  foiRoutes: FoiRoute[];

  topRoutes$: Observable<FoiRoute[]>;

  constructor(
    private dataService: DataService,
    private router: Router,
    private foiRouter: FoiRouterService
  ) {
    this.topRoutes$ = this.dataService.getRoutes();
    this.topRoutes$.subscribe(routes => {
      this.foiRoutes = this.flattenRoutes(routes);
      // console.log(JSON.stringify(this.foiRoutes, null, 2));
    });

    this.router.events
      .pipe(
        filter(value => {
          return value.constructor.name === 'NavigationEnd';
        })
      ).subscribe((navRoute: NavigationEnd) => {
        const foiNavRoute = navRoute.url.substring(1);
        for (let i = 0; i < this.foiRoutes.length; i++) {
          const r = this.foiRoutes[i];
          if (r.route === foiNavRoute) {
            this.setCurrentRoute(r);
          }
        }
      });

    this.foiRouter.routeProgress.subscribe(val => {
      const root = '';
      if (!val) {
        const rootRoute = this.findRoute(root);
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

  findRoute(path: string) {
    const matched: FoiRoute[] = this.foiRoutes.filter(r => r.route === path);
    return matched[0];
  }
  /**
   *
   * @param routes Recursive flattening of the route data.
   * @param parent
   */
  flattenRoutes(routes: FoiRoute[], parent?: string) {
    const flatRoutes: FoiRoute[] = [];
    let goBackRoute: string = null;
    let previousRoute: FoiRoute = null;
    for (const rt of routes) {
      if (flatRoutes.length === 0) {
        rt.back = parent;
      } else {
        rt.back = goBackRoute;
      }
      flatRoutes.push(rt);
      if (rt.choices) {
        Object.keys(rt.choices).map(choice => {
          const choiceObj = rt.choices[choice];
          this.flattenRoutes(choiceObj.routes, rt.route).map(r =>
            flatRoutes.push(r)
          );
        });
      }
      goBackRoute = rt.route;
      if (previousRoute) {
        previousRoute.forward = rt.route;
      }
      previousRoute = rt;
    }
    return flatRoutes;
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
    console.log('*********************', { lastKnownReq });
  }
}
