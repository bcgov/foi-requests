import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { APP_INITIALIZER, NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { CoreHeaderComponent } from "./core-header/core-header.component";
import { ProgressBarComponent } from "./progress-bar/progress-bar.component";
import { TransomApiClientService } from "./transom-api-client.service";
import { HttpClientModule } from "@angular/common/http";
import { provideNgxWebstorage } from "ngx-webstorage";
import { ServicesModule } from "./services/services.module";
import { RouteComponentsModule } from "./route-components/route-components.module";
import { FooterComponent } from "./footer/footer.component";
import { ReactiveFormsModule } from "@angular/forms";
import { SigninComponent } from "./route-components/signin/signin.component";
import { AppConfigService } from "./services/app-config.service";
import { MatDialogModule } from "@angular/material/dialog";
import { DelayWarningDialog } from "./route-components/contact-info-options/delay-warning-dialog.component";

export function init_app(appConfigService: AppConfigService) {
  return () => appConfigService.load();
}

@NgModule({
  declarations: [
    AppComponent,
    CoreHeaderComponent,
    ProgressBarComponent,
    FooterComponent,
    SigninComponent,
    DelayWarningDialog,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ServicesModule,
    RouteComponentsModule,
    // NgxWebstorageModule.forRoot(),
    ReactiveFormsModule,
    MatDialogModule,
  ],
  providers: [
    TransomApiClientService,
    AppConfigService,
    { provide: APP_INITIALIZER, useFactory: init_app, deps: [AppConfigService], multi: true },
    provideNgxWebstorage(),

    // {
    //   provide: APP_INITIALIZER,
    //   // useFactory: KeyCloakFactory,
    //   // deps: [KeycloakService],
    //   multi: true
    // }
  ],
  bootstrap: [AppComponent, FooterComponent],
})
export class AppModule {}
