import { AlertInfoComponent } from './alert-info/alert-info.component';
import { AlertWarningComponent } from './alert-warning/alert-warning.component';
import { BaseComponent } from './base/base.component';
import { CaptchaComponent } from './captcha/captcha.component';
import { FoiFileinputComponent } from './foi-fileinput/foi-fileinput.component';
import { FoiValidComponent } from './foi-valid/foi-valid.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faInfoCircle, faExclamationTriangle, faCalendar, faSignInAlt, faQuestionCircle , faIdCardAlt, faIdCard, faCheckCircle, faExternalLinkAlt} from '@fortawesome/free-solid-svg-icons';
import { StaticContactBlockComponent } from './static-contact-block/static-contact-block.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { AlertSuccessComponent } from './alert-success/alert-success.component';

// Add an icon to the library for convenient access in other components
library.add(faInfoCircle, faExclamationTriangle, faCalendar, faSignInAlt, faQuestionCircle, faIdCardAlt, faIdCard, faCheckCircle, faExternalLinkAlt);


@NgModule({
  declarations: [
    AlertInfoComponent,
    AlertWarningComponent,
    BaseComponent,
    CaptchaComponent,
    FoiFileinputComponent,
    FoiValidComponent,
    StaticContactBlockComponent,
    AlertSuccessComponent
  ],
  imports: [
    // Required to use these in children of RouteComponentsModule
    CommonModule,
    ReactiveFormsModule,
    OwlDateTimeModule, OwlNativeDateTimeModule,
    FontAwesomeModule
  ],
  exports: [
    AlertInfoComponent,
    AlertWarningComponent,
    BaseComponent,
    CaptchaComponent,
    FoiFileinputComponent,
    FoiValidComponent,
    StaticContactBlockComponent,
    AlertSuccessComponent
  ]
})
export class UtilsComponentsModule {}
