import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {APP_INITIALIZER, NgModule} from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreHeaderComponent } from './core-header/core-header.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { TransomApiClientService } from './transom-api-client.service';
import { HttpClientModule } from '@angular/common/http';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { ServicesModule } from './services/services.module';
import { RouteComponentsModule } from './route-components/route-components.module';
import { FooterComponent } from './footer/footer.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SigninComponent } from './route-components/signin/signin.component';
import {AppConfigService} from './services/appconfig.service';

export function init_app(appConfigService: AppConfigService) {
  return () => appConfigService.load();
}

@NgModule({
  declarations: [
    AppComponent,
    CoreHeaderComponent,
    ProgressBarComponent,
    FooterComponent,
    SigninComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ServicesModule,
    RouteComponentsModule,
    NgxWebstorageModule.forRoot(),
    ReactiveFormsModule
  ],
  providers: [
    TransomApiClientService,
    AppConfigService,
    { provide: APP_INITIALIZER, useFactory: init_app, deps: [AppConfigService], multi: true }

    // {
    //   provide: APP_INITIALIZER,
    //   // useFactory: KeyCloakFactory,
    //   // deps: [KeycloakService],
    //   multi: true
    // }
  ],
  bootstrap: [AppComponent, FooterComponent]
})
export class AppModule { }
