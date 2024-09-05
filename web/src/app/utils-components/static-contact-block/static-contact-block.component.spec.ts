import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";

import { StaticContactBlockComponent } from "./static-contact-block.component";

describe("StaticContactBlockComponent", () => {
  let component: StaticContactBlockComponent;
  let fixture: ComponentFixture<StaticContactBlockComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [StaticContactBlockComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaticContactBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
