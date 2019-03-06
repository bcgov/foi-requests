import { AlertInfoComponent } from "./alert-info/alert-info.component";
import { AlertWarningComponent } from "./alert-warning/alert-warning.component";
import { BaseComponent } from "./base/base.component";
import { CaptchaComponent } from "./captcha/captcha.component";
import { FoiFileinputComponent } from "./foi-fileinput/foi-fileinput.component";
import { FoiValidComponent } from "./foi-valid/foi-valid.component";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faInfoCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { StaticContactBlockComponent } from './static-contact-block/static-contact-block.component';

// Add an icon to the library for convenient access in other components
library.add(faInfoCircle, faExclamationTriangle);


@NgModule({
  declarations: [
    AlertInfoComponent,
    AlertWarningComponent,
    BaseComponent,
    CaptchaComponent,
    FoiFileinputComponent,
    FoiValidComponent,
    StaticContactBlockComponent
  ],
  imports: [
    // Required to use these in children of RouteComponentsModule
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ],
  exports: [
    AlertInfoComponent,
    AlertWarningComponent,
    BaseComponent,
    CaptchaComponent,
    FoiFileinputComponent,
    FoiValidComponent,
    StaticContactBlockComponent
  ]
})
export class UtilsComponentsModule {}
