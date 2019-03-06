import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing/landing.component';
import { GettingStarted1Component } from './getting-started1/getting-started1.component';
import { GettingStarted2Component } from './getting-started2/getting-started2.component';
import { ReviewSubmitCompleteComponent } from './review-submit-complete/review-submit-complete.component';
import { ReactiveFormsModule } from '@angular/forms';
import { StartRequestComponent } from './start-request/start-request.component';
import { GettingStarted3Component } from './getting-started3/getting-started3.component';
import { PersonalSelectAboutComponent } from './personal-select-about/personal-select-about.component';
import { GeneralInfoComponent } from './general-info/general-info.component';
import { GeneralSelectMinistryComponent } from './general-select-ministry/general-select-ministry.component';
import { MinistryConfirmationComponent } from './ministry-confirmation/ministry-confirmation.component';
import { DescriptionTimeframeComponent } from './description-timeframe/description-timeframe.component';
import { ContactInfoComponent } from './contact-info/contact-info.component';
import { ReceiveRecordsComponent } from './receive-records/receive-records.component';
import { ReviewSubmitComponent } from './review-submit/review-submit.component';
import { SelectAboutComponent } from './select-about/select-about.component';
import { RequestTopicComponent } from './request-topic/request-topic.component';
import { ContactInfoOptionsComponent } from './contact-info-options/contact-info-options.component';
import { ProofOfGuardianshipComponent } from './proof-of-guardianship/proof-of-guardianship.component';
import { ChildInformationComponent } from './child-information/child-information.component';
import { VerifyYourIdentityComponent } from './verify-your-identity/verify-your-identity.component';
import { AnotherInformationComponent } from './another-information/another-information.component';
import { AdoptiveParentsComponent } from './adoptive-parents/adoptive-parents.component';
import { UtilsComponentsModule } from '../utils-components/utils-components.module';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

// Add an icon to the library for convenient access in other components
library.add(faSpinner);

@NgModule({
  declarations: [
    LandingComponent,
    GettingStarted1Component,
    GettingStarted2Component,
    ReviewSubmitCompleteComponent,
    StartRequestComponent,
    GettingStarted3Component,
    GeneralInfoComponent,
    PersonalSelectAboutComponent,
    GeneralInfoComponent,
    GeneralSelectMinistryComponent,
    MinistryConfirmationComponent,
    DescriptionTimeframeComponent,
    ContactInfoComponent,
    ReceiveRecordsComponent,
    ReviewSubmitComponent,
    SelectAboutComponent,
    RequestTopicComponent,
    ContactInfoOptionsComponent,
    ProofOfGuardianshipComponent,
    ChildInformationComponent,
    VerifyYourIdentityComponent,
    AnotherInformationComponent,
    AdoptiveParentsComponent
  ],
  imports: [
    // Required to use these in children of RouteComponentsModule
    CommonModule,
    UtilsComponentsModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ]
})
export class RouteComponentsModule { }
