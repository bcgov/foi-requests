import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ProgressBarComponent } from "./progress-bar.component";

describe("ProgressBarComponent", () => {
  let component: ProgressBarComponent;
  let fixture: ComponentFixture<ProgressBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProgressBarComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should show the progressbar segments", () => {
    const domElement = fixture.debugElement.nativeElement;

    fixture.detectChanges();
    expect(domElement.querySelectorAll("li").length).toBe(4);

    component.progressBarList = [{ route: "Test Segment", progress: 2 }];
    fixture.detectChanges();
    expect(domElement.querySelectorAll("li").length).toBe(1);
  });

  it("should check initial state and initial progress value", () => {
    const domElement = fixture.debugElement.nativeElement;
    const segments = domElement.querySelectorAll("li");

    // Verify that default progress value is "0"
    expect(component.currentProgress).toBe(0);

    // Initial state and contains text
    for (let i = 0; i < segments.length; i++) {
      expect(segments[i].querySelector("div").className).toBe("inactive");
      expect(segments[i].innerText).toContain(`${i + 1}.`);
    }
  });


  it("should update progressbar status on progress = 0", () => {
    const domElement = fixture.debugElement.nativeElement;
    const segments = domElement.querySelectorAll("li");

    // Start with no inactive segments.
    component.currentProgress = 4;
    fixture.detectChanges();

    // Reset it back to "0"!
    component.currentProgress = 0;
    fixture.detectChanges();

    // And make sure they're all updated
    expect(segments[0].querySelector("div").className).toBe("inactive");
    expect(segments[1].querySelector("div").className).toBe("inactive");
    expect(segments[2].querySelector("div").className).toBe("inactive");
    expect(segments[3].querySelector("div").className).toBe("inactive");
  });

  it("should update progressbar status on progress = 1", () => {
    const domElement = fixture.debugElement.nativeElement;
    const segments = domElement.querySelectorAll("li");

    component.currentProgress = 1;
    fixture.detectChanges();

    expect(segments[0].querySelector("div").className).toBe("active");
    expect(segments[1].querySelector("div").className).toBe("inactive");
    expect(segments[2].querySelector("div").className).toBe("inactive");
    expect(segments[3].querySelector("div").className).toBe("inactive");
  });

  it("should update progressbar status on progress = 4", () => {
    const domElement = fixture.debugElement.nativeElement;
    const segments = domElement.querySelectorAll("li");

    // Initial state and contains text
    for (let i = 0; i < segments.length; i++) {
      expect(segments[i].querySelector("div").className).toBe("inactive");
      expect(segments[i].innerText).toContain(`${i + 1}.`);
    }
    component.currentProgress = 2;
    fixture.detectChanges();

    expect(segments[0].querySelector("div").className).toBe("was-active");
    expect(segments[1].querySelector("div").className).toBe("active");
    expect(segments[2].querySelector("div").className).toBe("inactive");
    expect(segments[3].querySelector("div").className).toBe("inactive");
  });

  it("should update progressbar status on progress = 3", () => {
    const domElement = fixture.debugElement.nativeElement;
    const segments = domElement.querySelectorAll("li");

    component.currentProgress = 3;
    fixture.detectChanges();

    expect(segments[0].querySelector("div").className).toBe("was-active");
    expect(segments[1].querySelector("div").className).toBe("was-active");
    expect(segments[2].querySelector("div").className).toBe("active");
    expect(segments[3].querySelector("div").className).toBe("inactive");
  });

  it("should update progressbar status on progress = 4", () => {
    const domElement = fixture.debugElement.nativeElement;
    const segments = domElement.querySelectorAll("li");

    component.currentProgress = 4;
    fixture.detectChanges();

    expect(segments[0].querySelector("div").className).toBe("was-active");
    expect(segments[1].querySelector("div").className).toBe("was-active");
    expect(segments[2].querySelector("div").className).toBe("was-active");
    expect(segments[3].querySelector("div").className).toBe("active");
  });
});
