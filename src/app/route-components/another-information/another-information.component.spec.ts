import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnotherInformationComponent } from './another-information.component';

describe('AnotherInformationComponent', () => {
  let component: AnotherInformationComponent;
  let fixture: ComponentFixture<AnotherInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnotherInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnotherInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
