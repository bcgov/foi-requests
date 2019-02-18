import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MinistryConfirmationComponent } from './ministry-confirmation.component';

describe('MinistryConfirmationComponent', () => {
  let component: MinistryConfirmationComponent;
  let fixture: ComponentFixture<MinistryConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MinistryConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinistryConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
