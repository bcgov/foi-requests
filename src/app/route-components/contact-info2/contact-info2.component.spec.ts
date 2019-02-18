import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactInfo2Component } from './contact-info2.component';

describe('ContactInfo2Component', () => {
  let component: ContactInfo2Component;
  let fixture: ComponentFixture<ContactInfo2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactInfo2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactInfo2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
