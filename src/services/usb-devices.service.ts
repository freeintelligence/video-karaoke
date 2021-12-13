import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ElectronService } from 'src/app/electron.service';
import { CopyMediaFromUsbComponent } from 'src/components/copy-media-from-usb/copy-media-from-usb.component';
import browserDataUsbFiles from './browser-data/usb-files';

export interface UsbFile {
  name: string;
  genreName: string;
  artistName: string;
  path: string;
  durationInSeconds: number;
  additional: any;
}

@Injectable({
  providedIn: 'root'
})
export class UsbDevicesService {

  isDetectChangeDevicesActive: boolean;
  detectChangeDevicesModal: HTMLIonModalElement;

  constructor(private modalController: ModalController, private electron: ElectronService) { }

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

  async getFiles(): Promise<UsbFile[]> {
    return new Promise((resolve, reject) => {
      if (!this.electron.isElectronApp) {
        // Browser App
        return resolve(browserDataUsbFiles);
      }

      const timeout = setTimeout(() => reject(new Error('timeout')), 2000);

      this.electron.ipcRenderer.send('get-usb-files');
      this.electron.ipcRenderer.once('getting-usb-files', (event, result: UsbFile[]) => {
        if (timeout) {
          clearTimeout(timeout);
        }
        return resolve(result);
      });
    });
  }

}
