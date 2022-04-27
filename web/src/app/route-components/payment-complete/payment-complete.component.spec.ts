import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentCompleteComponent } from './payment-complete.component';

describe('PaymentCompleteComponent', () => {
  let component: PaymentCompleteComponent;
  let fixture: ComponentFixture<PaymentCompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentCompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
