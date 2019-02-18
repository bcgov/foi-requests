import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactInfoOptionsComponent } from './contact-info-options.component';

describe('ContactInfoOptionsComponent', () => {
  let component: ContactInfoOptionsComponent;
  let fixture: ComponentFixture<ContactInfoOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactInfoOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactInfoOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
