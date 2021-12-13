import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DisableScrollKeysService {

  constructor() { }

  handleKeyboardEvent(event: KeyboardEvent) {
    const buttons = ['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

    if (buttons.indexOf(event.code) > -1) {
      event.preventDefault();
    }
  }

}
