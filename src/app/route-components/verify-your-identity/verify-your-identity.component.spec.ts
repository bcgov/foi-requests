import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { VerifyYourIdentityComponent } from './verify-your-identity.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';
import { MockDataService, MockRouter } from '../../MockClasses';
import { UtilsComponentsModule } from 'src/app/utils-components/utils-components.module';


describe('VerifyYourIdentityComponent', () => {
  let component: VerifyYourIdentityComponent;
  let fixture: ComponentFixture<VerifyYourIdentityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyYourIdentityComponent],
      imports:[ReactiveFormsModule, UtilsComponentsModule],
      providers: [
        {provide: DataService, useClass: MockDataService},
        {provide: Router, useClass: MockRouter}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyYourIdentityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
