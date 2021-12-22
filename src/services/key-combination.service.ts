import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class KeyCombinationService {

  keyMaps: { [key: string]: boolean } = {};

  constructor() { }

  handleKeyboardEvent(event: KeyboardEvent) {
    this.keyMaps[event.code] = event.type === 'keydown';
  }

  getPressedKeys() {
    const keys: string[] = [];

    for (let i in this.keyMaps) {
      if (this.keyMaps[i]) {
        keys.push(i);
      }
    }

    return keys;
  }

  hasPressedKeys(...args: string[]) {
    const keys = this.getPressedKeys();

    for (let i in args) {
      if (keys.indexOf(args[i]) === -1) {
        return false;
      }
    }

    return true;
  }
  
}
