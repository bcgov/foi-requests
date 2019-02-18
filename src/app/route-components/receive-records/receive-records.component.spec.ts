import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveRecordsComponent } from './receive-records.component';

describe('ReceiveRecordsComponent', () => {
  let component: ReceiveRecordsComponent;
  let fixture: ComponentFixture<ReceiveRecordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiveRecordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiveRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
