import { Component, HostListener, OnInit } from '@angular/core';
import { DisableScrollKeysService } from 'src/services/disable-scroll-keys.service';
import { UsbDevicesService } from 'src/services/usb-devices.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(private disableScrollKeys: DisableScrollKeysService, private usbDevicesService: UsbDevicesService) {}

  ngOnInit() {
    this.usbDevicesService.onDetectChangeDevices();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    return this.disableScrollKeys.handleKeyboardEvent(event);
  }

}
