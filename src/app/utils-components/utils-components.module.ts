import { AlertInfoComponent } from "./alert-info/alert-info.component";
import { AlertWarningComponent } from "./alert-warning/alert-warning.component";
import { BaseComponent } from "./base/base.component";
import { CaptchaComponent } from "./captcha/captcha.component";
import { FoiFileinputComponent } from "./foi-fileinput/foi-fileinput.component";
import { FoiValidComponent } from "./foi-valid/foi-valid.component";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgModule } from "@angular/core";

@NgModule({
  declarations: [
    AlertInfoComponent,
    AlertWarningComponent,
    BaseComponent,
    CaptchaComponent,
    FoiFileinputComponent,
    FoiValidComponent
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
    FoiValidComponent
  ]
})
export class UtilsComponentsModule {}
