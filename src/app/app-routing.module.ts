import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './route-components/landing/landing.component';
import { GettingStarted1Component } from './route-components/getting-started1/getting-started1.component';
import { GettingStarted2Component } from './route-components/getting-started2/getting-started2.component';
import { GettingStarted3Component } from './route-components/getting-started3/getting-started3.component';
import { GeneralInfoComponent } from './route-components/general-info/general-info.component';
import { MinistryConfirmationComponent } from './route-components/ministry-confirmation/ministry-confirmation.component';
import { DescriptionTimeframeComponent } from './route-components/description-timeframe/description-timeframe.component';
import { ContactInfoOptionsComponent } from './route-components/contact-info-options/contact-info-options.component';
// import { DeliveryOptionsComponent } from './route-components/delivery-options/delivery-options.component';
import { AnotherInformationComponent } from './route-components/another-information/another-information.component';
import { ProofOfGuardianshipComponent } from './route-components/proof-of-guardianship/proof-of-guardianship.component';
import { ChildInformationComponent } from './route-components/child-information/child-information.component';
import { ReviewSubmitComponent } from './route-components/review-submit/review-submit.component';
import { RequestInfoComponent } from './route-components/request-info/request-info.component';
import { ContactInfo1Component } from './route-components/contact-info1/contact-info1.component';
import { ReceiveRecordsComponent } from './route-components/receive-records/receive-records.component';
import { SelectAboutComponent } from './route-components/select-about/select-about.component';
import { VerifyYourIdentityComponent } from './route-components/verify-your-identity/verify-your-identity.component';
import { RequestTopicComponent } from './route-components/request-topic/request-topic.component';
import { ReviewSubmitCompleteComponent } from './route-components/review-submit-complete/review-submit-complete.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'getting-started1', component: GettingStarted1Component },
  { path: 'getting-started2', component: GettingStarted2Component },
  { path: 'getting-started3', component: GettingStarted3Component },
  // General
  { path: 'general/fee-info', component: GeneralInfoComponent },
  { path: 'general/ministry-confirmation', component: MinistryConfirmationComponent },
  { path: 'general/description-timeframe', component: DescriptionTimeframeComponent },
  { path: 'general/request-info', component: RequestInfoComponent },
  { path: 'general/contact-info1', component: ContactInfo1Component },
  { path: 'general/contact-info-options', component: ContactInfoOptionsComponent },
  { path: 'general/receive-records', component: ReceiveRecordsComponent },
  { path: 'general/review-submit', component: ReviewSubmitComponent },
  { path: 'general/submit-complete', component: ReviewSubmitCompleteComponent},
  // Personal
  { path: 'personal/select-about', component: SelectAboutComponent },
  // Personal / Yourself
  { path: 'personal/verify-your-identity', component: VerifyYourIdentityComponent },
  { path: 'personal/request-topic', component: RequestTopicComponent },
  { path: 'personal/public-service/ministry-confirmation', component: MinistryConfirmationComponent },
  { path: 'personal/public-service/description-timeframe', component: DescriptionTimeframeComponent },
  { path: 'personal/public-service/contact-info-options', component: ContactInfoOptionsComponent },
  { path: 'personal/public-service/delivery-options', component: ReceiveRecordsComponent },
  { path: 'personal/corrections/ministry-confirmation', component: MinistryConfirmationComponent },
  { path: 'personal/corrections/description-timeframe', component: DescriptionTimeframeComponent },
  { path: 'personal/corrections/contact-info-options', component: ContactInfoOptionsComponent },
  { path: 'personal/corrections/delivery-options', component: ReceiveRecordsComponent },
  { path: 'personal/income-assistance/ministry-confirmation', component: MinistryConfirmationComponent },
  { path: 'personal/income-assistance/description-timeframe', component: DescriptionTimeframeComponent },
  { path: 'personal/income-assistance/contact-info-options', component: ContactInfoOptionsComponent },
  { path: 'personal/income-assistance/delivery-options', component: ReceiveRecordsComponent },
  { path: 'personal/child-protection/ministry-confirmation', component: MinistryConfirmationComponent },
  { path: 'personal/child-protection/description-timeframe', component: DescriptionTimeframeComponent },
  { path: 'personal/child-protection/contact-info-options', component: ContactInfoOptionsComponent },
  { path: 'personal/child-protection/delivery-options', component: ReceiveRecordsComponent },
  { path: 'personal/adoption/ministry-confirmation', component: MinistryConfirmationComponent },
  { path: 'personal/adoption/description-timeframe', component: DescriptionTimeframeComponent },
  { path: 'personal/adoption/contact-info-options', component: ContactInfoOptionsComponent },
  { path: 'personal/adoption/delivery-options', component: ReceiveRecordsComponent },
  { path: 'personal/community-living/ministry-confirmation', component: MinistryConfirmationComponent },
  { path: 'personal/community-living/description-timeframe', component: DescriptionTimeframeComponent },
  { path: 'personal/community-living/contact-info-options', component: ContactInfoOptionsComponent },
  { path: 'personal/community-living/delivery-options', component: ReceiveRecordsComponent },
  { path: 'personal/another-topic/ministry-confirmation', component: MinistryConfirmationComponent },
  { path: 'personal/another-topic/description-timeframe', component: DescriptionTimeframeComponent },
  { path: 'personal/another-topic/contact-info-options', component: ContactInfoOptionsComponent },
  { path: 'personal/another-topic/delivery-options', component: ReceiveRecordsComponent },
  { path: 'personal/review-submit', component: ReviewSubmitComponent },
  // Personal / Child
  { path: 'personal/child/proof-of-guardianship', component: ProofOfGuardianshipComponent },
  { path: 'personal/child/child-information', component: ChildInformationComponent },
  { path: 'personal/child/verify-your-identity', component: VerifyYourIdentityComponent },
  { path: 'personal/child/ministry-confirmation', component: MinistryConfirmationComponent },
  { path: 'personal/child/description-timeframe', component: DescriptionTimeframeComponent },
  { path: 'personal/child/contact-info-options', component: ContactInfoOptionsComponent },
  { path: 'personal/child/delivery-options', component: ReceiveRecordsComponent },
  { path: 'personal/child/review-submit', component: ReviewSubmitComponent },
  // Personal / Another Person
  { path: 'personal/another/proof-of-guardianship', component: ProofOfGuardianshipComponent },
  { path: 'personal/another/another-information', component: AnotherInformationComponent },
  { path: 'personal/another/verify-your-identity', component: VerifyYourIdentityComponent },
  { path: 'personal/another/ministry-confirmation', component: MinistryConfirmationComponent },
  { path: 'personal/another/description-timeframe', component: DescriptionTimeframeComponent },
  { path: 'personal/another/contact-info-options', component: ContactInfoOptionsComponent },
  { path: 'personal/another/delivery-options', component: ReceiveRecordsComponent },
  { path: 'personal/another/review-submit', component: ReviewSubmitComponent },
  // Personal / Yourself & Child
  { path: 'personal/yourself-child/proof-of-guardianship', component: ProofOfGuardianshipComponent },
  { path: 'personal/yourself-child/child-information', component: ChildInformationComponent },
  { path: 'personal/yourself-child/verify-your-identity', component: VerifyYourIdentityComponent },
  { path: 'personal/yourself-child/ministry-confirmation', component: MinistryConfirmationComponent },
  { path: 'personal/yourself-child/description-timeframe', component: DescriptionTimeframeComponent },
  { path: 'personal/yourself-child/contact-info-options', component: ContactInfoOptionsComponent },
  { path: 'personal/yourself-child/delivery-options', component: ReceiveRecordsComponent },
  { path: 'personal/yourself-child/review-submit', component: ReviewSubmitComponent },
  // Personal / Yourself & Another Person
  { path: 'personal/yourself-another/proof-of-guardianship', component: ProofOfGuardianshipComponent },
  { path: 'personal/yourself-another/child-information', component: ChildInformationComponent },
  { path: 'personal/yourself-another/verify-your-identity', component: VerifyYourIdentityComponent },
  { path: 'personal/yourself-another/ministry-confirmation', component: MinistryConfirmationComponent },
  { path: 'personal/yourself-another/description-timeframe', component: DescriptionTimeframeComponent },
  { path: 'personal/yourself-another/contact-info-options', component: ContactInfoOptionsComponent },
  { path: 'personal/yourself-another/delivery-options', component: ReceiveRecordsComponent },
  { path: 'personal/yourself-another/review-submit', component: ReviewSubmitComponent },
  // Personal / Child & Another Person
  { path: 'personal/child-another/proof-of-guardianship', component: ProofOfGuardianshipComponent },
  { path: 'personal/child-another/child-information', component: ChildInformationComponent },
  { path: 'personal/child-another/verify-your-identity', component: VerifyYourIdentityComponent },
  { path: 'personal/child-another/ministry-confirmation', component: MinistryConfirmationComponent },
  { path: 'personal/child-another/description-timeframe', component: DescriptionTimeframeComponent },
  { path: 'personal/child-another/contact-info-options', component: ContactInfoOptionsComponent },
  { path: 'personal/child-another/delivery-options', component: ReceiveRecordsComponent },
  { path: 'personal/child-another/review-submit', component: ReviewSubmitComponent },
  // Personal: Yourself, Child * Another Person
  { path: 'personal/yourself-child-another/proof-of-guardianship', component: ProofOfGuardianshipComponent },
  { path: 'personal/yourself-child-another/child-information', component: ChildInformationComponent },
  { path: 'personal/yourself-child-another/verify-your-identity', component: VerifyYourIdentityComponent },
  { path: 'personal/yourself-child-another/ministry-confirmation', component: MinistryConfirmationComponent },
  { path: 'personal/yourself-child-another/description-timeframe', component: DescriptionTimeframeComponent },
  { path: 'personal/yourself-child-another/contact-info-options', component: ContactInfoOptionsComponent },
  { path: 'personal/yourself-child-another/delivery-options', component: ReceiveRecordsComponent },
  { path: 'personal/yourself-child-another/review-submit', component: ReviewSubmitComponent },
 
  // Demo routes!
  // { path: 'request-demo1', component: RequestDemo1Component },
  // { path: 'review-submit', component: ReviewSubmitDemoComponent }

  // Include routing for a 404 routing back to the landing page!
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
