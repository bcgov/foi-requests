import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProofOfGuardianshipComponent } from './proof-of-guardianship.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';
import { MockDataService, MockRouter } from '../../MockClasses';
import { UtilsComponentsModule } from 'src/app/utils-components/utils-components.module';

describe('ProofOfGuardianshipComponent', () => {
  let component: ProofOfGuardianshipComponent;
  let fixture: ComponentFixture<ProofOfGuardianshipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProofOfGuardianshipComponent ],
      imports:[ReactiveFormsModule, UtilsComponentsModule],
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
