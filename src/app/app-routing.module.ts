import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { LandingComponent } from './route-components/landing/landing.component';
import { GettingStarted1Component } from './route-components/getting-started1/getting-started1.component';
import { GettingStarted2Component } from './route-components/getting-started2/getting-started2.component';
import { GettingStarted3Component } from './route-components/getting-started3/getting-started3.component';
import { RequestDemo1Component } from './route-components/request-demo1/request-demo1.component';
import { ReviewSubmitDemoComponent } from './route-components/review-submit-demo/review-submit-demo.component';
import { PersonalSelectAboutComponent } from './route-components/personal-select-about/personal-select-about.component';
import { GeneralInfoComponent } from './route-components/general-info/general-info.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'about', component: AboutComponent },
  { path: 'getting-started1', component: GettingStarted1Component },
  { path: 'getting-started2', component: GettingStarted2Component },
  { path: 'getting-started3', component: GettingStarted3Component },
  { path: 'general-info', component: GeneralInfoComponent },
  { path: 'personal-select-about', component: PersonalSelectAboutComponent },
  { path: 'request-demo1', component: RequestDemo1Component },
  { path: 'review-submit', component: ReviewSubmitDemoComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
