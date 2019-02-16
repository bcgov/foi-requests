import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalSelectAboutComponent } from './personal-select-about.component';

describe('PersonalSelectAboutComponent', () => {
  let component: PersonalSelectAboutComponent;
  let fixture: ComponentFixture<PersonalSelectAboutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalSelectAboutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalSelectAboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
