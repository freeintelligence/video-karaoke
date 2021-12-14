import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ElectronService } from 'src/app/electron.service';
import { CopyMediaFromUsbComponent } from 'src/components/copy-media-from-usb/copy-media-from-usb.component';
import browserDataUsbFiles from './browser-data/usb-files';
import { rand } from './browser-data/usb-files';

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

  async copyFileToStorage(filePath: string): Promise<{ error?: boolean, errorText?: string }> {
    return new Promise((resolve, reject) => {
      if (!this.electron.isElectronApp) {
        // Browser App
        return setTimeout(() => resolve({
          error: rand(0, 100) < 10,
          errorText: rand(0, 1) ? 'Ya existe' : (rand(0, 1) ? 'No compatible' : (rand(0, 1) ? 'Archivo eliminado' : 'Error desconocido!')),
        }), 200);
      }

      const timeout = setTimeout(() => reject(new Error('timeout')), 2000);

      this.electron.ipcRenderer.send('copy-usb-file', filePath);
      this.electron.ipcRenderer.once('copied-usb-file', (event, result) => {
        if (timeout) {
          clearTimeout(timeout);
        }
        return resolve(result);
      });
    });
  }

}
