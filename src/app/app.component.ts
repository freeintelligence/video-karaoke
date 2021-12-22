import { Component, HostListener, OnInit } from '@angular/core';
import { DisableScrollKeysService } from 'src/services/disable-scroll-keys.service';
import { KeyCombinationService } from 'src/services/key-combination.service';
import { UsbDevicesService } from 'src/services/usb-devices.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(private disableScrollKeys: DisableScrollKeysService, private usbDevicesService: UsbDevicesService, private keyCombinationService: KeyCombinationService) {}

  ngOnInit() {
    this.usbDevicesService.onDetectChangeDevices();
  }

  @HostListener('document:keyup', ['$event'])
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.keyCombinationService.handleKeyboardEvent(event);
    this.disableScrollKeys.handleKeyboardEvent(event);
  }

}
