import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProofOfGuardianshipComponent } from './proof-of-guardianship.component';
import { FoiValidComponent } from 'src/app/utils-components/foi-valid/foi-valid.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';
import { MockDataService, MockRouter } from '../../MockClasses';
import { BaseComponent } from 'src/app/utils-components/base/base.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AlertWarningComponent } from 'src/app/utils-components/alert-warning/alert-warning.component';

describe('ProofOfGuardianshipComponent', () => {
  let component: ProofOfGuardianshipComponent;
  let fixture: ComponentFixture<ProofOfGuardianshipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProofOfGuardianshipComponent, BaseComponent, FoiValidComponent, AlertWarningComponent ],
      imports:[ReactiveFormsModule, FontAwesomeModule],
      providers: [
        {provide: DataService, useClass: MockDataService},
        {provide: Router, useClass: MockRouter}
      ]
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
