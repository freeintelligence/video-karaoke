import { Component, HostListener, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { DisableScrollKeysService } from 'src/services/disable-scroll-keys.service';
import { KeyCombinationService } from 'src/services/key-combination.service';
import { KeyboardNavigationService } from 'src/services/keyboard-navigation.service';
import { UsbDevicesService } from 'src/services/usb-devices.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(private toastController: ToastController, private disableScrollKeys: DisableScrollKeysService, private usbDevicesService: UsbDevicesService, private keyCombinationService: KeyCombinationService, private keyboardNavigationService: KeyboardNavigationService) {}

  ngOnInit() {
    this.usbDevicesService.onDetectChangeDevices();
  }

  @HostListener('document:keyup', ['$event'])
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.keyCombinationService.handleKeyboardEvent(event);
    this.disableScrollKeys.handleKeyboardEvent(event);
    this.keyboardNavigationService.handleKeyboardEvent(event);

    this.temporalKeyScreen(event);
  }

  async temporalKeyScreen(event: KeyboardEvent) {
    if (event.type !== 'keydown') {
      return false;
    }

    const toast = await this.toastController.create({
      message: event.code,
      animated: true,
      color: 'primary',
      duration: 2000,
      position: 'bottom',
    });

    toast.present();

    return true;
  }

}
