import { Injectable } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
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

  constructor(private modalController: ModalController, private electron: ElectronService, private toastController: ToastController) { }

  async onDetectChangeDevices() {
    if (!this.electron.isElectronApp) {
      setTimeout(async () => await this.run(), 1000);
      return true;
    }

    this.electron.ipcRenderer.on('change-detected-devices', async (devices) => await this.run());

    return true;
  }

  async run() {
    if (this.isDetectChangeDevicesActive) {
      await this.cancelMediaCopy();
    } else {
      await this.openMediaCopy();
    }
  }

  async cancelMediaCopy() {
    this.isDetectChangeDevicesActive = false;
    await this.detectChangeDevicesModal.dismiss();

    const toast = await this.toastController.create({
      header: 'Copia desde USB',
      message: 'La copia de archivos desde dispositivos USB fue cancelada. Asegúrate de no desconectar el USB mientras se realiza la copia.',
      animated: true,
      duration: 6000,
      keyboardClose: false,
      position: 'bottom',
      color: 'danger',
    });
    await toast.present();
  }

  async openMediaCopy() {
    this.detectChangeDevicesModal = await this.modalController.create({
      component: CopyMediaFromUsbComponent,
      animated: true,
      backdropDismiss: false,
      keyboardClose: false,
      showBackdrop: true,
    });

    await this.detectChangeDevicesModal.present();
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