import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartRequestComponent } from './start-request.component';

describe('StartRequestComponent', () => {
  let component: StartRequestComponent;
  let fixture: ComponentFixture<StartRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
