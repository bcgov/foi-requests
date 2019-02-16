import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing/landing.component';
import { BaseComponent } from './base/base.component';
import { GettingStarted1Component } from './getting-started1/getting-started1.component';
import { GettingStarted2Component } from './getting-started2/getting-started2.component';
import { RequestDemo1Component } from './request-demo1/request-demo1.component';
import { ReviewSubmitDemoComponent } from './review-submit-demo/review-submit-demo.component';
import { ReactiveFormsModule } from '@angular/forms';
import { StartRequestComponent } from './start-request/start-request.component';
import { GettingStarted3Component } from './getting-started3/getting-started3.component';
import { PersonalSelectAboutComponent } from './personal-select-about/personal-select-about.component';
import { GeneralInfoComponent } from './general-info/general-info.component';
import { GeneralSelectMinistryComponent } from './general-select-ministry/general-select-ministry.component';

@NgModule({
  declarations: [
    BaseComponent,
    LandingComponent,
    GettingStarted1Component,
    GettingStarted2Component,
    RequestDemo1Component,
    ReviewSubmitDemoComponent,
    StartRequestComponent,
    GettingStarted3Component,
    GeneralInfoComponent,
    PersonalSelectAboutComponent,
    GeneralInfoComponent,
    GeneralSelectMinistryComponent],
  imports: [
    CommonModule,
    // Required to use it in child of RouteComponentsModule
    ReactiveFormsModule 
  ]
})
export class RouteComponentsModule { }
