import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CopyMediaFromUsbComponent } from 'src/components/copy-media-from-usb/copy-media-from-usb.component';

@Injectable({
  providedIn: 'root'
})
export class UsbDevicesService {

  isDetectChangeDevicesActive: boolean;
  detectChangeDevicesModal: HTMLIonModalElement;

  constructor(private modalController: ModalController) { }

  async onDetectChangeDevices() {
    /*if (this.isDetectChangeDevicesActive) {
      await this.cancelMediaCopy();
    }*/

    await this.openMediaCopy();
  }

  async cancelMediaCopy() {
    this.isDetectChangeDevicesActive = false;
  }

  async openMediaCopy() {
    const modal = await this.modalController.create({
      component: CopyMediaFromUsbComponent,
      animated: true,
      backdropDismiss: false,
      keyboardClose: false,
      showBackdrop: true,
    });

    await modal.present();
  }

}
