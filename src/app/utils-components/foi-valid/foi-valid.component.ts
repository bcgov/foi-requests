import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { FormControl, Form } from '@angular/forms';

@Component({
  selector: 'app-foi-valid',
  templateUrl: './foi-valid.component.html',
  styleUrls: ['./foi-valid.component.scss']
})
export class FoiValidComponent implements OnInit {
  @Input() tip: string;
  @Input() form: Form;

  // Built-in validators
  @Input() min: string;
  @Input() max: string;
  @Input() required: string;
  @Input() requiredTrue: string;
  @Input() email: string;
  @Input() minLength: string;
  @Input() maxLength: string;
  @Input() pattern: string;
  @Input() noFuture: string;

  @ViewChild('myLabel') fieldLabelWrapper: ElementRef;
  fieldLabel: HTMLLabelElement;

  @ViewChild('myInput') fieldInputWrapper: ElementRef;
  fieldInput: HTMLElement;

  control: FormControl;
  constructor() {}

  validationErrors(validation: string) {
    if (this.control && this.control.errors) {
      const retval = this.control.errors[validation];
      return retval;
    }
    return null;
  }

  /**
   * Used in the template to show/hide validation errors and style/unstyle the label text.
   */
  isInvalid() {    
    let invalid = false;
    this.fieldLabel.className = (this.fieldLabel.className || '').replace('label-error', '').trim();

    if (this.control && this.control.invalid && (!this.control.pristine || this.control.touched)) {
      // If a user has touched a field and it's invalid, style the label!
      this.fieldLabel.className = ('label-error ' + this.fieldLabel.className).trim();
      invalid = true;
    }
    return invalid;
  }

  /**
   * Replace interpolated keys from the error into the message.
   *
   * @param err The Validation error object, includes limits as keys
   * @param message The error message including interpolated keys.
   *
   * Example:
   * MaxLength error: { "maxlength": { "requiredLength": 10, "actualLength": 14 } }
   * MaxLength message:  maxLength="First name is longer than the maximum {requiredLength} characters!"
   *
   * Result : First name is longer than the maximum 10 characters!
   */
  dynamicMsg(validation: string): string {
    const err = this.validationErrors(validation);

    // Fix the minlength/minLength case differences.
    if (validation === 'minlength') {
      validation = 'minLength';
    }
    if (validation === 'maxlength') {
      validation = 'maxLength';
    }
    let message = this[validation];

    // If there's an error, fabricate a message.
    if (err) {
      // Saved for debugging validations with interpolated values.
      /// console.log('validation=', validation, 'message=', message, 'err=', err);
      message = message || '';
      Object.keys(err).map(key => {
        message = message.replace(`\{${key}\}`, err[key]);
      });
    }
    return message;
  }

  ngOnInit() {
    this.fieldLabel = this.fieldLabelWrapper.nativeElement.firstChild || {};
    this.fieldInput = this.fieldInputWrapper.nativeElement.firstChild || {};

    // Using the formcontrolname attribute on the Input DOM element to identify the Form control!
    const formcontrolname = this.fieldInput.attributes['formcontrolname'].value;
    this.control = this.form['controls'][formcontrolname];

    // Set the Label .for, Input .id and .class attributes, if not already set.
    this.fieldInput.id = this.fieldInput.id || formcontrolname;
    this.fieldInput.className = this.fieldInput.className || 'form-control';
    this.fieldLabel.htmlFor = this.fieldLabel.htmlFor || this.fieldInput.id;

    // Possibly add a required field indicator, but it's ugly.
    if (this.required) {
      if (this.fieldLabel && this.fieldLabel.innerHTML){
        this.fieldLabel.innerHTML = this.fieldLabel.innerHTML.replace(':', ' <span class="label-required">*</span>:');
      }
    }
  }
}
