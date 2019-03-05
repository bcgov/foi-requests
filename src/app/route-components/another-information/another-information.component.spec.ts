import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnotherInformationComponent } from './another-information.component';
import { BaseComponent } from 'src/app/utils-components/base/base.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';
import { MockDataService, MockRouter } from '../../MockClasses';
import { FoiValidComponent } from 'src/app/utils-components/foi-valid/foi-valid.component';
import { FoiFileinputComponent } from 'src/app/utils-components/foi-fileinput/foi-fileinput.component';

describe('AnotherInformationComponent', () => {
  let component: AnotherInformationComponent;
  let fixture: ComponentFixture<AnotherInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnotherInformationComponent, BaseComponent, FoiValidComponent, FoiFileinputComponent ],
      imports:[ReactiveFormsModule],
      providers: [
        {provide: DataService, useClass: MockDataService},
        {provide: Router, useClass: MockRouter}
      ]
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
