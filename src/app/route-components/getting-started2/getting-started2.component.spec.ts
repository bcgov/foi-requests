import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GettingStarted2Component } from './getting-started2.component';

describe('GettingStarted2Component', () => {
  let component: GettingStarted2Component;
  let fixture: ComponentFixture<GettingStarted2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GettingStarted2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GettingStarted2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
