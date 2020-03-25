import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseIdentityComponent } from './choose-identity.component';

describe('ChooseIdentityComponent', () => {
  let component: ChooseIdentityComponent;
  let fixture: ComponentFixture<ChooseIdentityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseIdentityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseIdentityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
