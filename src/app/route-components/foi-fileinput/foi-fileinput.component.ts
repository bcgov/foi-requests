import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Input } from "@angular/core";
import { Form, FormControl } from "@angular/forms";

@Component({
  selector: "foi-fileinput",
  templateUrl: "./foi-fileinput.component.html",
  styleUrls: ["./foi-fileinput.component.scss"]
})
export class FoiFileinputComponent implements OnInit {
  @Input() tip: string;
  @Input() form: Form;
  @Input() formcontrolname: string;
  @Input() filename: string = "None";

  // Validator
  @Input() required: string;

  @ViewChild("myLabel") fieldLabelWrapper: ElementRef;
  fieldLabel: HTMLLabelElement;

  @ViewChild("fileInputDisplay") fileInputDisplay: ElementRef;
  @ViewChild("fileInput") fileInput: HTMLInputElement;

  @Output() fileSelected = new EventEmitter<File>();

  control: FormControl;
  constructor() {}

  validationErrors(validation: string) {
    if (this.control && this.control.errors) {
      return this.control.errors[validation];
    }
    return null;
  }

  ngOnInit() {
    this.fieldLabel = this.fieldLabelWrapper.nativeElement.firstChild || {};
    this.control = this.form["controls"][this.formcontrolname];

    // Set the Label .for, Input .id and .class attributes, if not already set.
    this.fileInput.id = this.formcontrolname;

    // Possibly add a required field indicator, but it's ugly.
    if (this.required) {
      if (this.fieldLabel && this.fieldLabel.innerHTML) {
        this.fieldLabel.innerHTML = this.fieldLabel.innerHTML.replace(":", ' <span class="label-required">*</span>:');
      }
    }
  }

  /**
   * Used in the template to show/hide validation errors and style/unstyle the label text.
   */
  isInvalid() {
    let invalid = false;
    this.fieldLabel.className = (this.fieldLabel.className || "").replace("label-error", "").trim();

    const inputElement = this.fileInputDisplay.nativeElement;
    inputElement.className = (inputElement.className || "").replace("ng-invalid").trim();
    inputElement.className = (inputElement.className || "").replace("ng-touched").trim();

    if (this.control && this.control.invalid && (!this.control.pristine || this.control.touched)) {
      // If a user has touched a field and it's invalid, style the label!
      this.fieldLabel.className = ("label-error " + this.fieldLabel.className).trim();
      inputElement.className = `ng-touched ng-invalid ${inputElement.className}`.trim();
      invalid = true;
    }
    return invalid;
  }

  selectFile() {
    this.fileInput["nativeElement"].click();

    // This marks it as Dirty before the user selected a file or chooses not to.
    this.filename = null; // Set to no file!
    this.form["controls"][this.formcontrolname].setValue(null);
    this.form["controls"][this.formcontrolname].markAsDirty();
    return false;
  }

  get currentFilename() {
    console.log('currentFilename!', this.form["controls"][this.formcontrolname].value);
    return this.form["controls"][this.formcontrolname].value; // this.filename;
  }

  fileChange(event) {
    const newFile: File = event.target.files[0];
    console.log('fileChange!', newFile);
    this.form["controls"][this.formcontrolname].setValue(newFile ? newFile.name : null);
    this.fileSelected.emit(newFile);
  }
}
