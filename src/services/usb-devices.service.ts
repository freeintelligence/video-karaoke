import { Injectable } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { Drive } from 'drivelist';
import { IpcRendererEvent } from 'electron';
import { ElectronService } from 'src/app/electron.service';
import { CopyMediaFromUsbComponent } from 'src/components/copy-media-from-usb/copy-media-from-usb.component';
import browserDataUsbFiles from './browser-data/usb-files';
import { rand } from './browser-data/usb-files';

export interface UsbFile {
  name: string;
  mountpoint: string;
  genreName?: string;
  artistName?: string;
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

    this.electron.ipcRenderer.on('change-detected-devices', async (event: IpcRendererEvent, devices: Drive[]) => await this.run(devices));

    return true;
  }

  async run(devices: Drive[] = []) {
    const filtered = devices.filter(d => d.isRemovable);

    if (this.isDetectChangeDevicesActive && !filtered.length) {
      await this.cancelMediaCopy();
    } else if (!this.isDetectChangeDevicesActive && filtered.length) {
      await this.openMediaCopy();
    }
  }

  async cancelMediaCopy() {
    this.isDetectChangeDevicesActive = false;
    await this.detectChangeDevicesModal.dismiss({ reason: 'cancel' });
  }

  async openMediaCopy() {
    this.isDetectChangeDevicesActive = true;
    this.detectChangeDevicesModal = await this.modalController.create({
      component: CopyMediaFromUsbComponent,
      animated: true,
      backdropDismiss: false,
      keyboardClose: false,
      showBackdrop: true,
    });

    await this.detectChangeDevicesModal.present();
    const { data } = await this.detectChangeDevicesModal.onWillDismiss();

    if (data.reason === 'complete') {
      location.reload();
    } else if (data.reason === 'cancel') {
      this.isDetectChangeDevicesActive = false;
      const toast = await this.toastController.create({
        header: 'Copia desde USB',
        message: 'La copia de archivos desde dispositivos USB fue cancelada. Asegúrate de no desconectar el USB mientras se realiza el proceso.',
        animated: true,
        duration: 6000,
        keyboardClose: false,
        position: 'bottom',
        color: 'danger',
      });
      await toast.present();
    }
  }

  async getFiles(): Promise<UsbFile[]> {
    return new Promise((resolve, reject) => {
      if (!this.electron.isElectronApp) {
        // Browser App
        return resolve(browserDataUsbFiles);
      }

      const timeout = setTimeout(() => reject(new Error('timeout')), 60*5*1000);

      this.electron.ipcRenderer.send('get-usb-files');
      this.electron.ipcRenderer.once('getting-usb-files', (event, result: UsbFile[]) => {
        if (timeout) {
          clearTimeout(timeout);
        }
        return resolve(result);
      });
    });
  }

  async copyFileToStorage(usbFile: UsbFile): Promise<{ error?: boolean, errorText?: string }> {
    return new Promise((resolve, reject) => {
      if (!this.electron.isElectronApp) {
        // Browser App
        return setTimeout(() => resolve({
          error: rand(0, 100) < 10,
          errorText: rand(0, 1) ? 'Ya existe' : (rand(0, 1) ? 'No compatible' : (rand(0, 1) ? 'Archivo eliminado' : 'Error desconocido!')),
        }), 200);
      }

      const timeout = setTimeout(() => reject(new Error('timeout')), 60*5*1000);

      this.electron.ipcRenderer.send('copy-usb-file', usbFile);
      this.electron.ipcRenderer.once('copied-usb-file', (event, result: { error?: boolean, errorText?: string }) => {
        if (timeout) {
          clearTimeout(timeout);
        }
        return resolve(result);
      });
    });
  }

}
