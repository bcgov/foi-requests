import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing/landing.component';
import { BaseComponent } from './base/base.component';
import { GettingStarted1Component } from './getting-started1/getting-started1.component';
import { GettingStarted2Component } from './getting-started2/getting-started2.component';
import { RequestDemo1Component } from './request-demo1/request-demo1.component';
import { ReviewSubmitDemoComponent } from './review-submit-demo/review-submit-demo.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    BaseComponent,
    LandingComponent,
    GettingStarted1Component,
    GettingStarted2Component,
    RequestDemo1Component,
    ReviewSubmitDemoComponent],
  imports: [
    CommonModule,
    // Required to use it in child of RouteComponentsModule
    ReactiveFormsModule 
  ]
})
export class RouteComponentsModule { }
