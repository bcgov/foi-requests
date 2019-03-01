import { Component, OnInit } from "@angular/core";
import { DataService } from "./services/data.service";
import { FoiRoute } from "./models/FoiRoute";
import { Router, NavigationEnd } from "@angular/router";
import { filter } from "rxjs/operators";
import { FoiRouterService } from "./foi-router.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  title = "bcfoi";

  currentRoute: FoiRoute;
  currentRouteIndex: number = 0;

  constructor(private dataService: DataService, private router: Router, private foiRouter: FoiRouterService) {
    const rootRoute: FoiRoute = dataService.getRoute("/");

    this.router.events.pipe(filter(value => value instanceof NavigationEnd)).subscribe((navRoute: NavigationEnd) => {
      const navTo: FoiRoute = dataService.getRoute(navRoute.url);
      if (navTo) {
        this.setCurrentRoute(navTo);
      }
    });

    this.foiRouter.routeProgress.subscribe(val => {
      if (!val) {
        this.setCurrentRoute(rootRoute);
        return;
      }
      // Go Back
      if (val.direction < 0) {
        let nextRoute = this.currentRoute;
        if (val.direction === -2) {
            // Optionally skip back a step in the navigation.
            nextRoute = this.dataService.getRoute(nextRoute.back);
        }
        this.router.navigate([nextRoute.back]);
        return;
      }
      // Continue
      if (val.direction > 0) {
        if (this.currentRoute.choices && this.currentRoute.choices[val.selection]) {
          // if this is one of the valid choices...
          let nextRoute = this.currentRoute.choices[val.selection].routes[0];
          if (val.direction === 2) {
            // Optionally skip a step in the navigation.
            nextRoute = this.dataService.getRoute(nextRoute.forward);
          }
          this.router.navigate([nextRoute.route]);
        } else {
          // regular navigation
          let nextRoute = this.currentRoute;
          if (val.direction === 2) {
            // Optionally skip a step in the navigation.
            nextRoute = this.dataService.getRoute(nextRoute.forward);
          }
          this.router.navigate([nextRoute.forward]);
        }
        return;
      }
      throw new Error(`Unknown progress value: ${val}`);
    });
  }

  private setCurrentRoute(route: FoiRoute) {
    this.currentRoute = route;
  }

  hasProgress(): boolean {
    return this.currentProgress > 0;
  }

  get currentProgress() {
    return this.currentRoute ? this.currentRoute.progress : 0;
  }

  ngOnInit() {
    const lastKnownReq = this.dataService.getCurrentState();
  }
}
