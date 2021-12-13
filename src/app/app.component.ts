import { Component, HostListener } from '@angular/core';
import { DisableScrollKeysService } from 'src/services/disable-scroll-keys.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(private disableScrollKeys: DisableScrollKeysService) {}

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    return this.disableScrollKeys.handleKeyboardEvent(event);
  }

}
