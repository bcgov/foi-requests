import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertSuccessComponent } from './alert-success.component';

describe('AlertSuccessComponent', () => {
  let component: AlertSuccessComponent;
  let fixture: ComponentFixture<AlertSuccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertSuccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
