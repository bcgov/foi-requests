import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './route-components/landing/landing.component';
import { GettingStarted1Component } from './route-components/getting-started1/getting-started1.component';
import { GettingStarted2Component } from './route-components/getting-started2/getting-started2.component';
import { ChooseIdentityComponent } from './route-components/choose-identity/choose-identity.component';
import { GettingStarted3Component } from './route-components/getting-started3/getting-started3.component';
import { GeneralInfoComponent } from './route-components/general-info/general-info.component';
import { MinistryConfirmationComponent } from './route-components/ministry-confirmation/ministry-confirmation.component';
import { DescriptionTimeframeComponent } from './route-components/description-timeframe/description-timeframe.component';
import { ContactInfoOptionsComponent } from './route-components/contact-info-options/contact-info-options.component';
import { AnotherInformationComponent } from './route-components/another-information/another-information.component';
import { ProofOfGuardianshipComponent } from './route-components/proof-of-guardianship/proof-of-guardianship.component';
import { ChildInformationComponent } from './route-components/child-information/child-information.component';
import { ReviewSubmitComponent } from './route-components/review-submit/review-submit.component';
import { ContactInfoComponent } from './route-components/contact-info/contact-info.component';
import { SelectAboutComponent } from './route-components/select-about/select-about.component';
import { VerifyYourIdentityComponent } from './route-components/verify-your-identity/verify-your-identity.component';
import { RequestTopicComponent } from './route-components/request-topic/request-topic.component';
import { ReviewSubmitCompleteComponent } from './route-components/review-submit-complete/review-submit-complete.component';
import { AdoptiveParentsComponent } from './route-components/adoptive-parents/adoptive-parents.component';
import { SigninComponent } from './route-components/signin/signin.component';
import { PaymentComponent } from './route-components/payment/payment.component';
import { PaymentCompleteComponent } from './route-components/payment-complete/payment-complete.component';
import { ChildProtectionParent } from './route-components/childprotection-parent/childprotection-parent.component';
import { ChildProtectionChild } from './route-components/childprotection-child/childprotection-child.component';
import { YouthInCareParent } from './route-components/youthincare-parent/youthincare-parent.component';
import { YouthInCareChild } from './route-components/youthincare-child/youthincare-child.component';
import { FosterParent } from './route-components/foster-parent/foster-parent.component';
import { Adoption } from './route-components/adoption/adoption.component';
const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'getting-started1', component: GettingStarted1Component },
  { path: 'getting-started2', component: GettingStarted2Component },
  { path: 'choose-identity', component: ChooseIdentityComponent },
  { path: 'getting-started3', component: GettingStarted3Component },
  { path: 'signin', component: SigninComponent },

  // General
  { path: 'general/fee-info', component: GeneralInfoComponent },
  { path: 'general/ministry-confirmation', component: MinistryConfirmationComponent },
  { path: 'general/description-timeframe', component: DescriptionTimeframeComponent },
  { path: 'general/contact-info', component: ContactInfoComponent },
  { path: 'general/contact-info-options', component: ContactInfoOptionsComponent },
  { path: 'general/review-submit', component: ReviewSubmitComponent },
  { path: 'general/submit-complete', component: ReviewSubmitCompleteComponent},
  { path: 'general/payment', component: PaymentComponent},
  { path: 'general/payment-complete/:requestId/:paymentId', component: PaymentCompleteComponent},

  //General; IGE

  { path: "general/ige/contact-info-options", component: ContactInfoOptionsComponent },
  { path: "general/ige/review-submit", component: ReviewSubmitComponent },
  { path: "general/ige/submit-complete", component: ReviewSubmitCompleteComponent },

  // Personal
  { path: 'personal/select-about', component: SelectAboutComponent },

  // Personal / Yourself
  { path: 'personal/verify-your-identity', component: VerifyYourIdentityComponent },
  { path: 'personal/request-topic', component: RequestTopicComponent },
  { path: 'personal/childprotectionparent', component: ChildProtectionParent },
  { path: 'personal/childprotectionchild', component: ChildProtectionChild },
  { path: 'personal/youthincareparent', component: YouthInCareParent },
  { path: 'personal/youthincarechild', component: YouthInCareChild },
  { path: 'personal/fosterparent', component: FosterParent },
  { path: 'personal/adoption', component: Adoption },

  { path: 'personal/ministry-confirmation', component: MinistryConfirmationComponent },
  { path: 'personal/youthincarechild/ministry-confirmation', component: MinistryConfirmationComponent },
  { path: 'personal/childprotectionparent/ministry-confirmation', component: MinistryConfirmationComponent },
  { path: 'personal/childprotectionchild/ministry-confirmation', component: MinistryConfirmationComponent },
  { path: 'personal/youthincareparent/ministry-confirmation', component: MinistryConfirmationComponent },
  { path: 'personal/fosterparent/ministry-confirmation', component: MinistryConfirmationComponent },
  { path: 'personal/adoption/ministry-confirmation', component: MinistryConfirmationComponent },

  { path: 'personal/youthincarechild/description-timeframe', component: DescriptionTimeframeComponent },
  { path: 'personal/description-timeframe', component: DescriptionTimeframeComponent }, 
  { path: 'personal/childprotectionparent/description-timeframe', component: DescriptionTimeframeComponent },
  { path: 'personal/childprotectionchild/description-timeframe', component: DescriptionTimeframeComponent },
  { path: 'personal/youthincareparent/description-timeframe', component: DescriptionTimeframeComponent },
  { path: 'personal/fosterparent/description-timeframe', component: DescriptionTimeframeComponent },
  { path: 'personal/adoption/description-timeframe', component: DescriptionTimeframeComponent },
  
  { path: 'personal/adoptive-parents', component: AdoptiveParentsComponent },
  { path: 'personal/youthincarechild/adoptive-parents', component: AdoptiveParentsComponent },
  { path: 'personal/childprotectionparent/adoptive-parents', component: AdoptiveParentsComponent },
  { path: 'personal/childprotectionchild/adoptive-parents', component: AdoptiveParentsComponent },
  { path: 'personal/youthincareparent/adoptive-parents', component: AdoptiveParentsComponent },
  { path: 'personal/fosterparent/adoptive-parents', component: AdoptiveParentsComponent },
  { path: 'personal/adoption/adoptive-parents', component: AdoptiveParentsComponent },

  { path: 'personal/contact-info-options', component: ContactInfoOptionsComponent },
  { path: 'personal/youthincarechild/contact-info-options', component: ContactInfoOptionsComponent },
  { path: 'personal/childprotectionparent/contact-info-options', component: ContactInfoOptionsComponent },
  { path: 'personal/childprotectionchild/contact-info-options', component: ContactInfoOptionsComponent },  
  { path: 'personal/youthincareparent/contact-info-options', component: ContactInfoOptionsComponent },
  { path: 'personal/fosterparent/contact-info-options', component: ContactInfoOptionsComponent },
  { path: 'personal/adoption/contact-info-options', component: ContactInfoOptionsComponent },

  { path: 'personal/review-submit', component: ReviewSubmitComponent },
  { path: 'personal/youthincarechild/review-submit', component: ReviewSubmitComponent },
  { path: 'personal/childprotectionparent/review-submit', component: ReviewSubmitComponent },
  { path: 'personal/childprotectionchild/review-submit', component: ReviewSubmitComponent },
  { path: 'personal/youthincareparent/review-submit', component: ReviewSubmitComponent },
  { path: 'personal/fosterparent/review-submit', component: ReviewSubmitComponent },
  { path: 'personal/adoption/review-submit', component: ReviewSubmitComponent },

  { path: 'personal/submit-complete', component: ReviewSubmitCompleteComponent},
  { path: 'personal/youthincarechild/submit-complete', component: ReviewSubmitCompleteComponent },
  { path: 'personal/childprotectionparent/submit-complete', component: ReviewSubmitCompleteComponent },
  { path: 'personal/childprotectionchild/submit-complete', component: ReviewSubmitCompleteComponent },
  { path: 'personal/youthincareparent/submit-complete', component: ReviewSubmitCompleteComponent },
  { path: 'personal/fosterparent/submit-complete', component: ReviewSubmitCompleteComponent },
  { path: 'personal/adoption/submit-complete', component: ReviewSubmitCompleteComponent },

  // Personal / Child
  { path: 'personal/child/proof-of-guardianship', component: ProofOfGuardianshipComponent },
  { path: 'personal/child/child-information', component: ChildInformationComponent },
  { path: 'personal/child/verify-your-identity', component: VerifyYourIdentityComponent },
  { path: 'personal/child/ministry-confirmation', component: MinistryConfirmationComponent },
  { path: 'personal/child/description-timeframe', component: DescriptionTimeframeComponent },
  { path: 'personal/child/adoptive-parents', component: AdoptiveParentsComponent },
  { path: 'personal/child/contact-info-options', component: ContactInfoOptionsComponent },
  { path: 'personal/child/review-submit', component: ReviewSubmitComponent },
  { path: 'personal/child/submit-complete', component: ReviewSubmitCompleteComponent},

  // Personal / Another Person
  { path: 'personal/another/proof-of-permission', component: ProofOfGuardianshipComponent },
  { path: 'personal/another/another-information', component: AnotherInformationComponent },
  { path: 'personal/another/verify-your-identity', component: VerifyYourIdentityComponent },
  { path: 'personal/another/request-topic', component: RequestTopicComponent },
  { path: 'personal/another/ministry-confirmation', component: MinistryConfirmationComponent },
  { path: 'personal/another/description-timeframe', component: DescriptionTimeframeComponent },
  { path: 'personal/another/adoptive-parents', component: AdoptiveParentsComponent },
  { path: 'personal/another/contact-info-options', component: ContactInfoOptionsComponent },
  { path: 'personal/another/review-submit', component: ReviewSubmitComponent },
  { path: 'personal/another/submit-complete', component: ReviewSubmitCompleteComponent},

  // Personal / Yourself & Child
  { path: 'personal/yourself-child/proof-of-guardianship', component: ProofOfGuardianshipComponent },
  { path: 'personal/yourself-child/child-information', component: ChildInformationComponent },
  { path: 'personal/yourself-child/proof-of-permission', component: ProofOfGuardianshipComponent },
  { path: 'personal/yourself-child/another-information', component: AnotherInformationComponent },
  { path: 'personal/yourself-child/verify-your-identity', component: VerifyYourIdentityComponent },

  { path: 'personal/yourself-child/request-topic', component: RequestTopicComponent },
  { path: 'personal/yourself-child/childprotectionparent', component: ChildProtectionParent },
  { path: 'personal/yourself-child/childprotectionchild', component: ChildProtectionChild },
  { path: 'personal/yourself-child/youthincareparent', component: YouthInCareParent },
  { path: 'personal/yourself-child/youthincarechild', component: YouthInCareChild },
  { path: 'personal/yourself-child/fosterparent', component: FosterParent },
  { path: 'personal/yourself-child/adoption', component: Adoption },

  { path: 'personal/yourself-child/ministry-confirmation', component: MinistryConfirmationComponent },
  { path: 'personal/yourself-child/youthincarechild/ministry-confirmation', component: MinistryConfirmationComponent },
  { path: 'personal/yourself-child/childprotectionparent/ministry-confirmation', component: MinistryConfirmationComponent },
  { path: 'personal/yourself-child/childprotectionchild/ministry-confirmation', component: MinistryConfirmationComponent },
  { path: 'personal/yourself-child/youthincareparent/ministry-confirmation', component: MinistryConfirmationComponent },
  { path: 'personal/yourself-child/fosterparent/ministry-confirmation', component: MinistryConfirmationComponent },
  { path: 'personal/yourself-child/adoption/ministry-confirmation', component: MinistryConfirmationComponent },

  { path: 'personal/yourself-child/youthincarechild/description-timeframe', component: DescriptionTimeframeComponent },
  { path: 'personal/yourself-child/description-timeframe', component: DescriptionTimeframeComponent }, 
  { path: 'personal/yourself-child/childprotectionparent/description-timeframe', component: DescriptionTimeframeComponent },
  { path: 'personal/yourself-child/childprotectionchild/description-timeframe', component: DescriptionTimeframeComponent },
  { path: 'personal/yourself-child/youthincareparent/description-timeframe', component: DescriptionTimeframeComponent },
  { path: 'personal/yourself-child/fosterparent/description-timeframe', component: DescriptionTimeframeComponent },
  { path: 'personal/yourself-child/adoption/description-timeframe', component: DescriptionTimeframeComponent },
  
  { path: 'personal/yourself-child/adoptive-parents', component: AdoptiveParentsComponent },
  { path: 'personal/yourself-child/youthincarechild/adoptive-parents', component: AdoptiveParentsComponent },
  { path: 'personal/yourself-child/childprotectionparent/adoptive-parents', component: AdoptiveParentsComponent },
  { path: 'personal/yourself-child/childprotectionchild/adoptive-parents', component: AdoptiveParentsComponent },
  { path: 'personal/yourself-child/youthincareparent/adoptive-parents', component: AdoptiveParentsComponent },
  { path: 'personal/yourself-child/fosterparent/adoptive-parents', component: AdoptiveParentsComponent },
  { path: 'personal/yourself-child/adoption/adoptive-parents', component: AdoptiveParentsComponent },

  { path: 'personal/yourself-child/contact-info-options', component: ContactInfoOptionsComponent },
  { path: 'personal/yourself-child/youthincarechild/contact-info-options', component: ContactInfoOptionsComponent },
  { path: 'personal/yourself-child/childprotectionparent/contact-info-options', component: ContactInfoOptionsComponent },
  { path: 'personal/yourself-child/childprotectionchild/contact-info-options', component: ContactInfoOptionsComponent },  
  { path: 'personal/yourself-child/youthincareparent/contact-info-options', component: ContactInfoOptionsComponent },
  { path: 'personal/yourself-child/fosterparent/contact-info-options', component: ContactInfoOptionsComponent },
  { path: 'personal/yourself-child/adoption/contact-info-options', component: ContactInfoOptionsComponent },


  { path: 'personal/yourself-child/review-submit', component: ReviewSubmitComponent },
  { path: 'personal/yourself-child/youthincarechild/review-submit', component: ReviewSubmitComponent },
  { path: 'personal/yourself-child/childprotectionparent/review-submit', component: ReviewSubmitComponent },
  { path: 'personal/yourself-child/childprotectionchild/review-submit', component: ReviewSubmitComponent },
  { path: 'personal/yourself-child/youthincareparent/review-submit', component: ReviewSubmitComponent },
  { path: 'personal/yourself-child/fosterparent/review-submit', component: ReviewSubmitComponent },
  { path: 'personal/yourself-child/adoption/review-submit', component: ReviewSubmitComponent },

  { path: 'personal/yourself-child/submit-complete', component: ReviewSubmitCompleteComponent},
  { path: 'personal/yourself-child/youthincarechild/submit-complete', component: ReviewSubmitCompleteComponent },
  { path: 'personal/yourself-child/childprotectionparent/submit-complete', component: ReviewSubmitCompleteComponent },
  { path: 'personal/yourself-child/childprotectionchild/submit-complete', component: ReviewSubmitCompleteComponent },
  { path: 'personal/yourself-child/youthincareparent/submit-complete', component: ReviewSubmitCompleteComponent },
  { path: 'personal/yourself-child/fosterparent/submit-complete', component: ReviewSubmitCompleteComponent },
  { path: 'personal/yourself-child/adoption/submit-complete', component: ReviewSubmitCompleteComponent },

  { path: 'personal/yourself-child/ministry-confirmation', component: MinistryConfirmationComponent },
  { path: 'personal/yourself-child/description-timeframe', component: DescriptionTimeframeComponent },
  { path: 'personal/yourself-child/adoptive-parents', component: AdoptiveParentsComponent },
  { path: 'personal/yourself-child/contact-info-options', component: ContactInfoOptionsComponent },
  { path: 'personal/yourself-child/review-submit', component: ReviewSubmitComponent },
  // { path: 'personal/yourself-child/submit-complete', component: ReviewSubmitCompleteComponent},

  // Personal / Yourself & Another Person
  { path: 'personal/yourself-another/proof-of-permission', component: ProofOfGuardianshipComponent },
  { path: 'personal/yourself-another/another-information', component: AnotherInformationComponent },
  { path: 'personal/yourself-another/verify-your-identity', component: VerifyYourIdentityComponent },
  { path: 'personal/yourself-another/request-topic', component: RequestTopicComponent },

  { path: 'personal/yourself-another/childprotectionparent', component: ChildProtectionParent },
  { path: 'personal/yourself-another/childprotectionchild', component: ChildProtectionChild },
  { path: 'personal/yourself-another/youthincareparent', component: YouthInCareParent },
  { path: 'personal/yourself-another/youthincarechild', component: YouthInCareChild },
  { path: 'personal/yourself-another/fosterparent', component: FosterParent },
  { path: 'personal/yourself-another/adoption', component: Adoption },

  { path: 'personal/yourself-another/ministry-confirmation', component: MinistryConfirmationComponent },
  { path: 'personal/yourself-another/youthincarechild/ministry-confirmation', component: MinistryConfirmationComponent },
  { path: 'personal/yourself-another/childprotectionparent/ministry-confirmation', component: MinistryConfirmationComponent },
  { path: 'personal/yourself-another/childprotectionchild/ministry-confirmation', component: MinistryConfirmationComponent },
  { path: 'personal/yourself-another/youthincareparent/ministry-confirmation', component: MinistryConfirmationComponent },
  { path: 'personal/yourself-another/fosterparent/ministry-confirmation', component: MinistryConfirmationComponent },
  { path: 'personal/yourself-another/adoption/ministry-confirmation', component: MinistryConfirmationComponent },

  { path: 'personal/yourself-another/youthincarechild/description-timeframe', component: DescriptionTimeframeComponent },
  { path: 'personal/yourself-another/description-timeframe', component: DescriptionTimeframeComponent }, 
  { path: 'personal/yourself-another/childprotectionparent/description-timeframe', component: DescriptionTimeframeComponent },
  { path: 'personal/yourself-another/childprotectionchild/description-timeframe', component: DescriptionTimeframeComponent },
  { path: 'personal/yourself-another/youthincareparent/description-timeframe', component: DescriptionTimeframeComponent },
  { path: 'personal/yourself-another/fosterparent/description-timeframe', component: DescriptionTimeframeComponent },
  { path: 'personal/yourself-another/adoption/description-timeframe', component: DescriptionTimeframeComponent },
  
  { path: 'personal/yourself-another/adoptive-parents', component: AdoptiveParentsComponent },
  { path: 'personal/yourself-another/youthincarechild/adoptive-parents', component: AdoptiveParentsComponent },
  { path: 'personal/yourself-another/childprotectionparent/adoptive-parents', component: AdoptiveParentsComponent },
  { path: 'personal/yourself-another/childprotectionchild/adoptive-parents', component: AdoptiveParentsComponent },
  { path: 'personal/yourself-another/youthincareparent/adoptive-parents', component: AdoptiveParentsComponent },
  { path: 'personal/yourself-another/fosterparent/adoptive-parents', component: AdoptiveParentsComponent },
  { path: 'personal/yourself-another/adoption/adoptive-parents', component: AdoptiveParentsComponent },

  { path: 'personal/yourself-another/contact-info-options', component: ContactInfoOptionsComponent },
  { path: 'personal/yourself-another/youthincarechild/contact-info-options', component: ContactInfoOptionsComponent },
  { path: 'personal/yourself-another/childprotectionparent/contact-info-options', component: ContactInfoOptionsComponent },
  { path: 'personal/yourself-another/childprotectionchild/contact-info-options', component: ContactInfoOptionsComponent },  
  { path: 'personal/yourself-another/youthincareparent/contact-info-options', component: ContactInfoOptionsComponent },
  { path: 'personal/yourself-another/fosterparent/contact-info-options', component: ContactInfoOptionsComponent },
  { path: 'personal/yourself-another/adoption/contact-info-options', component: ContactInfoOptionsComponent },

  { path: 'personal/yourself-another/review-submit', component: ReviewSubmitComponent },
  { path: 'personal/yourself-another/youthincarechild/review-submit', component: ReviewSubmitComponent },
  { path: 'personal/yourself-another/childprotectionparent/review-submit', component: ReviewSubmitComponent },
  { path: 'personal/yourself-another/childprotectionchild/review-submit', component: ReviewSubmitComponent },
  { path: 'personal/yourself-another/youthincareparent/review-submit', component: ReviewSubmitComponent },
  { path: 'personal/yourself-another/fosterparent/review-submit', component: ReviewSubmitComponent },
  { path: 'personal/yourself-another/adoption/review-submit', component: ReviewSubmitComponent },

  { path: 'personal/yourself-another/submit-complete', component: ReviewSubmitCompleteComponent},
  { path: 'personal/yourself-another/youthincarechild/submit-complete', component: ReviewSubmitCompleteComponent },
  { path: 'personal/yourself-another/childprotectionparent/submit-complete', component: ReviewSubmitCompleteComponent },
  { path: 'personal/yourself-another/childprotectionchild/submit-complete', component: ReviewSubmitCompleteComponent },
  { path: 'personal/yourself-another/youthincareparent/submit-complete', component: ReviewSubmitCompleteComponent },
  { path: 'personal/yourself-another/fosterparent/submit-complete', component: ReviewSubmitCompleteComponent },
  { path: 'personal/yourself-another/adoption/submit-complete', component: ReviewSubmitCompleteComponent },

  { path: 'personal/yourself-another/ministry-confirmation', component: MinistryConfirmationComponent },
  { path: 'personal/yourself-another/description-timeframe', component: DescriptionTimeframeComponent },
  { path: 'personal/yourself-another/adoptive-parents', component: AdoptiveParentsComponent },
  { path: 'personal/yourself-another/contact-info-options', component: ContactInfoOptionsComponent },
  { path: 'personal/yourself-another/review-submit', component: ReviewSubmitComponent },
  // { path: 'personal/yourself-another/submit-complete', component: ReviewSubmitCompleteComponent},

  // Personal / Child & Another Person
  { path: 'personal/child-another/proof-of-guardianship', component: ProofOfGuardianshipComponent },
  { path: 'personal/child-another/child-information', component: ChildInformationComponent },
  { path: 'personal/child-another/proof-of-permission', component: ProofOfGuardianshipComponent },
  { path: 'personal/child-another/another-information', component: AnotherInformationComponent },
  { path: 'personal/child-another/verify-your-identity', component: VerifyYourIdentityComponent },
  { path: 'personal/child-another/ministry-confirmation', component: MinistryConfirmationComponent },
  { path: 'personal/child-another/description-timeframe', component: DescriptionTimeframeComponent },
  { path: 'personal/child-another/adoptive-parents', component: AdoptiveParentsComponent },
  { path: 'personal/child-another/contact-info-options', component: ContactInfoOptionsComponent },
  { path: 'personal/child-another/review-submit', component: ReviewSubmitComponent },
  { path: 'personal/child-another/submit-complete', component: ReviewSubmitCompleteComponent},

  // Personal: Yourself, Child & Another Person
  { path: 'personal/yourself-child-another/proof-of-guardianship', component: ProofOfGuardianshipComponent },
  { path: 'personal/yourself-child-another/child-information', component: ChildInformationComponent },
  { path: 'personal/yourself-child-another/proof-of-permission', component: ProofOfGuardianshipComponent },
  { path: 'personal/yourself-child-another/another-information', component: AnotherInformationComponent },
  { path: 'personal/yourself-child-another/verify-your-identity', component: VerifyYourIdentityComponent },

  { path: 'personal/yourself-child-another/request-topic', component: RequestTopicComponent },
  { path: 'personal/yourself-child-another/childprotectionparent', component: ChildProtectionParent },
  { path: 'personal/yourself-child-another/childprotectionchild', component: ChildProtectionChild },
  { path: 'personal/yourself-child-another/youthincareparent', component: YouthInCareParent },
  { path: 'personal/yourself-child-another/youthincarechild', component: YouthInCareChild },
  { path: 'personal/yourself-child-another/fosterparent', component: FosterParent },
  { path: 'personal/yourself-child-another/adoption', component: Adoption },

  { path: 'personal/yourself-child-another/ministry-confirmation', component: MinistryConfirmationComponent },
  { path: 'personal/yourself-child-another/youthincarechild/ministry-confirmation', component: MinistryConfirmationComponent },
  { path: 'personal/yourself-child-another/childprotectionparent/ministry-confirmation', component: MinistryConfirmationComponent },
  { path: 'personal/yourself-child-another/childprotectionchild/ministry-confirmation', component: MinistryConfirmationComponent },
  { path: 'personal/yourself-child-another/youthincareparent/ministry-confirmation', component: MinistryConfirmationComponent },
  { path: 'personal/yourself-child-another/fosterparent/ministry-confirmation', component: MinistryConfirmationComponent },
  { path: 'personal/yourself-child-another/adoption/ministry-confirmation', component: MinistryConfirmationComponent },

  { path: 'personal/yourself-child-another/youthincarechild/description-timeframe', component: DescriptionTimeframeComponent },
  { path: 'personal/yourself-child-another/description-timeframe', component: DescriptionTimeframeComponent }, 
  { path: 'personal/yourself-child-another/childprotectionparent/description-timeframe', component: DescriptionTimeframeComponent },
  { path: 'personal/yourself-child-another/childprotectionchild/description-timeframe', component: DescriptionTimeframeComponent },
  { path: 'personal/yourself-child-another/youthincareparent/description-timeframe', component: DescriptionTimeframeComponent },
  { path: 'personal/yourself-child-another/fosterparent/description-timeframe', component: DescriptionTimeframeComponent },
  { path: 'personal/yourself-child-another/adoption/description-timeframe', component: DescriptionTimeframeComponent },
  
  { path: 'personal/yourself-child-another/adoptive-parents', component: AdoptiveParentsComponent },
  { path: 'personal/yourself-child-another/youthincarechild/adoptive-parents', component: AdoptiveParentsComponent },
  { path: 'personal/yourself-child-another/childprotectionparent/adoptive-parents', component: AdoptiveParentsComponent },
  { path: 'personal/yourself-child-another/childprotectionchild/adoptive-parents', component: AdoptiveParentsComponent },
  { path: 'personal/yourself-child-another/youthincareparent/adoptive-parents', component: AdoptiveParentsComponent },
  { path: 'personal/yourself-child-another/fosterparent/adoptive-parents', component: AdoptiveParentsComponent },
  { path: 'personal/yourself-child-another/adoption/adoptive-parents', component: AdoptiveParentsComponent },

  { path: 'personal/yourself-child-another/contact-info-options', component: ContactInfoOptionsComponent },
  { path: 'personal/yourself-child-another/youthincarechild/contact-info-options', component: ContactInfoOptionsComponent },
  { path: 'personal/yourself-child-another/childprotectionparent/contact-info-options', component: ContactInfoOptionsComponent },
  { path: 'personal/yourself-child-another/childprotectionchild/contact-info-options', component: ContactInfoOptionsComponent },  
  { path: 'personal/yourself-child-another/youthincareparent/contact-info-options', component: ContactInfoOptionsComponent },
  { path: 'personal/yourself-child-another/fosterparent/contact-info-options', component: ContactInfoOptionsComponent },
  { path: 'personal/yourself-child-another/adoption/contact-info-options', component: ContactInfoOptionsComponent },

  { path: 'personal/yourself-child-another/review-submit', component: ReviewSubmitComponent },
  { path: 'personal/yourself-child-another/youthincarechild/review-submit', component: ReviewSubmitComponent },
  { path: 'personal/yourself-child-another/childprotectionparent/review-submit', component: ReviewSubmitComponent },
  { path: 'personal/yourself-child-another/childprotectionchild/review-submit', component: ReviewSubmitComponent },
  { path: 'personal/yourself-child-another/youthincareparent/review-submit', component: ReviewSubmitComponent },
  { path: 'personal/yourself-child-another/fosterparent/review-submit', component: ReviewSubmitComponent },
  { path: 'personal/yourself-child-another/adoption/review-submit', component: ReviewSubmitComponent },

  { path: 'personal/yourself-child-another/submit-complete', component: ReviewSubmitCompleteComponent},
  { path: 'personal/yourself-child-another/youthincarechild/submit-complete', component: ReviewSubmitCompleteComponent },
  { path: 'personal/yourself-child-another/childprotectionparent/submit-complete', component: ReviewSubmitCompleteComponent },
  { path: 'personal/yourself-child-another/childprotectionchild/submit-complete', component: ReviewSubmitCompleteComponent },
  { path: 'personal/yourself-child-another/youthincareparent/submit-complete', component: ReviewSubmitCompleteComponent },
  { path: 'personal/yourself-child-another/fosterparent/submit-complete', component: ReviewSubmitCompleteComponent },
  { path: 'personal/yourself-child-another/adoption/submit-complete', component: ReviewSubmitCompleteComponent },

  { path: 'personal/yourself-child-another/ministry-confirmation', component: MinistryConfirmationComponent },
  { path: 'personal/yourself-child-another/description-timeframe', component: DescriptionTimeframeComponent },
  { path: 'personal/yourself-child-another/adoptive-parents', component: AdoptiveParentsComponent },
  { path: 'personal/yourself-child-another/contact-info-options', component: ContactInfoOptionsComponent },
  { path: 'personal/yourself-child-another/review-submit', component: ReviewSubmitComponent },
  // { path: 'personal/yourself-child-another/submit-complete', component: ReviewSubmitCompleteComponent},

  // Include routing for a 404 routing back to the landing page!
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
