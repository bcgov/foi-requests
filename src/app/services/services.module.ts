import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from './data.service';
import { CaptchaDataService } from './captcha-data.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers:[
    DataService,
    CaptchaDataService
  ]
})
export class ServicesModule { }
