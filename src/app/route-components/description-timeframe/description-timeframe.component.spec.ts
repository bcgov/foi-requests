import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionTimeframeComponent } from './description-timeframe.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { MockDataService, MockRouter } from '../../MockClasses';
import { Router } from '@angular/router';
import { UtilsComponentsModule } from 'src/app/utils-components/utils-components.module';

describe('DescriptionTimeframeComponent', () => {
  let component: DescriptionTimeframeComponent;
  let fixture: ComponentFixture<DescriptionTimeframeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DescriptionTimeframeComponent ],
      imports:[ReactiveFormsModule, UtilsComponentsModule],
      providers: [
        {provide: DataService, useClass: MockDataService},
        {provide: Router, useClass: MockRouter}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DescriptionTimeframeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
