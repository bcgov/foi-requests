import { Injectable } from '@angular/core';

function _window(): any {
  // return the global native browser window object
  return window;
}

@Injectable({
  providedIn: 'root'
})
export class WindowRefService {

  constructor() { }


  /**
   * Get a reference to the native window object.
   *
   */
  get nativeWindow(): any {
    return _window();
  }
}
