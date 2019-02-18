import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyYourIdentityComponent } from './verify-your-identity.component';

describe('VerifyYourIdentityComponent', () => {
  let component: VerifyYourIdentityComponent;
  let fixture: ComponentFixture<VerifyYourIdentityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyYourIdentityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyYourIdentityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
