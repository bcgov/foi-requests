import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { max } from 'rxjs/operators';

@Component({
  selector: 'app-foi-valid',
  templateUrl: './foi-valid.component.html',
  styleUrls: ['./foi-valid.component.scss']
})
export class FoiValidComponent implements OnInit {
  @Input() tip: string;
  @Input() control: FormControl;

  // Built-in validators
  @Input() min: string;
  @Input() max: string;
  @Input() required: string;
  @Input() requiredTrue: string;
  @Input() email: string;
  @Input() minLength: string;
  @Input() maxLength: string;
  @Input() pattern: string;

  constructor() {}

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
   * 
   */
  dynamicMsg(err: Object, message: String): String {
    if (err) {
      // Saved for debugging validations with interpolated values.
      // console.log('message=', message, 'err=', err);
      message = message || '';
      Object.keys(err).map(key => {
        message = message.replace(`\{${key}\}`, err[key]);
      });
    }
    return message;
  }

  ngOnInit() {}
}
