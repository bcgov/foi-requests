import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GettingStarted3Component } from './getting-started3.component';

describe('GettingStarted3Component', () => {
  let component: GettingStarted3Component;
  let fixture: ComponentFixture<GettingStarted3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GettingStarted3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GettingStarted3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
