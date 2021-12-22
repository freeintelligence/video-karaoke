import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigService } from './config.service';
import { KeyCombinationService } from './key-combination.service';

@Injectable({
  providedIn: 'root'
})
export class KeyboardNavigationService {

  constructor(private keyCombinationService: KeyCombinationService, private router: Router, private configService: ConfigService) { }

  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.keyCombinationService.hasPressedKeys(this.configService.lastConfig.buttonUp, this.configService.lastConfig.buttonLeft, this.configService.lastConfig.buttonRight, this.configService.lastConfig.buttonEnter)) {
      event.stopImmediatePropagation();
      event.stopPropagation();
      event.preventDefault();

      this.router.navigateByUrl('/config');
    }
  }

}
