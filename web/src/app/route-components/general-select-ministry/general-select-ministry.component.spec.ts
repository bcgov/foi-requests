import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";

import { GeneralSelectMinistryComponent } from "./general-select-ministry.component";

describe("GeneralSelectMinistryComponent", () => {
  let component: GeneralSelectMinistryComponent;
  let fixture: ComponentFixture<GeneralSelectMinistryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [GeneralSelectMinistryComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralSelectMinistryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
