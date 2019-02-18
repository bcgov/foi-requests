import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactInfo1Component } from './contact-info1.component';

describe('ContactInfo1Component', () => {
  let component: ContactInfo1Component;
  let fixture: ComponentFixture<ContactInfo1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactInfo1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactInfo1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
