import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProofOfGuardianshipComponent } from './proof-of-guardianship.component';

describe('ProofOfGuardianshipComponent', () => {
  let component: ProofOfGuardianshipComponent;
  let fixture: ComponentFixture<ProofOfGuardianshipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProofOfGuardianshipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProofOfGuardianshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
