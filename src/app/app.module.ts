import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

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

@NgModule({
  declarations: [
    AppComponent,
    CoreHeaderComponent,
    ProgressBarComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ServicesModule,
    RouteComponentsModule,
    NgxWebstorageModule.forRoot(),
    ReactiveFormsModule
  ],
  providers: [
    TransomApiClientService
  ],
  bootstrap: [AppComponent, FooterComponent]
})
export class AppModule { }
