import { AlertInfoComponent } from "./alert-info/alert-info.component";
import { AlertWarningComponent } from "./alert-warning/alert-warning.component";
import { AlertWarningWhiteComponent } from "./alert-warning-white/alert-warning-white.component";
import { AlertPlainWhiteComponent } from "./alert-plain-white/alert-plain-white.component";
import { BaseComponent } from "./base/base.component";
import { CaptchaComponent } from "./captcha/captcha.component";
import { FoiFileinputComponent } from "./foi-fileinput/foi-fileinput.component";
import { FoiValidComponent } from "./foi-valid/foi-valid.component";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { FaIconLibrary, FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import {
  faInfoCircle,
  faExclamationTriangle,
  faCalendar,
  faSignInAlt,
  faQuestionCircle,
  faIdCardAlt,
  faIdCard,
  faCheckCircle,
  faExternalLinkAlt,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { StaticContactBlockComponent } from "./static-contact-block/static-contact-block.component";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "@danielmoncada/angular-datetime-picker";
import { AlertSuccessComponent } from "./alert-success/alert-success.component";

@NgModule({
  declarations: [
    AlertInfoComponent,
    AlertWarningComponent,
    AlertWarningWhiteComponent,
    AlertPlainWhiteComponent,
    BaseComponent,
    CaptchaComponent,
    FoiFileinputComponent,
    FoiValidComponent,
    StaticContactBlockComponent,
    AlertSuccessComponent,
  ],
  imports: [
    // Required to use these in children of RouteComponentsModule
    CommonModule,
    ReactiveFormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    FontAwesomeModule,
  ],
  exports: [
    AlertInfoComponent,
    AlertWarningComponent,
    AlertWarningWhiteComponent,
    AlertPlainWhiteComponent,
    BaseComponent,
    CaptchaComponent,
    FoiFileinputComponent,
    FoiValidComponent,
    StaticContactBlockComponent,
    AlertSuccessComponent,
  ],
})
export class UtilsComponentsModule {
  constructor(library: FaIconLibrary) {
    // Add an icon to the library for convenient access in other components
    library.addIcons(
      faInfoCircle,
      faExclamationTriangle,
      faCalendar,
      faSignInAlt,
      faQuestionCircle,
      faIdCardAlt,
      faIdCard,
      faCheckCircle,
      faExternalLinkAlt,
      faSpinner
    );
  }
}
