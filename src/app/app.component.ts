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
  currentProgress: String = '0';
  foiRoutes: FoiRoute[];

  topRoutes$: Observable<FoiRoute[]>;

  constructor(
    private dataService: DataService,
    private router: Router,
    private foiRouter: FoiRouterService
  ) {
    this.topRoutes$ = this.dataService.getTopRoutes();
    this.topRoutes$.subscribe(routes => {
      this.foiRoutes = routes;
      this.router.events
        .pipe(
          filter(value => {
            return value.constructor.name === 'NavigationEnd';
          })
        )
        .subscribe((navRoute: NavigationEnd) => {
          const foiNavRoute = navRoute.url.substring(1);
          for (let i = 0; i < routes.length; i++) {
            const r = routes[i];
            if (r.route === foiNavRoute) {
              this.setCurrentRoute(i);
            }
          }
          this.currentRoute = routes[0];
        });
    });

    this.foiRouter.routeProgress.subscribe(val => {
      if (val) {
        this.setCurrentRoute((this.currentRouteIndex + val.direction));
        this.router.navigate([this.currentRoute.route]);
      }
    });
  }

  private setCurrentRoute(routeIndex: number) {
    this.currentRouteIndex = routeIndex;
    this.currentRoute = this.foiRoutes[this.currentRouteIndex];
    this.currentProgress = this.currentRoute.progress;
  }

  hasProgress(): boolean {
    return this.currentProgress > '0';
  }

  ngOnInit() {
    const lastKnownReq = this.dataService.getCurrentState();
    console.log('*********************', { lastKnownReq });
  }
}
