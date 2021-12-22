import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { AppUtils } from 'src/app/app.utils';
import { SharedDataService } from 'src/services/shared-data.service';
import { UsbDevicesService, UsbFile } from 'src/services/usb-devices.service';

@Component({
  selector: 'app-copy-media-from-usb',
  templateUrl: './copy-media-from-usb.component.html',
  styleUrls: ['./copy-media-from-usb.component.scss'],
})
export class CopyMediaFromUsbComponent implements OnInit {

  @ViewChild('virtualScrollFiles') virtualScrollFiles: CdkVirtualScrollViewport;

  loadingError: boolean;
  loadingFiles: boolean;
  totalFiles: number;
  copiedFiles: number;
  filesData: UsbFile[] = [];

  completeAlert: HTMLIonAlertElement;

  AppUtils = AppUtils;

  constructor(private usbDevicesService: UsbDevicesService, private alertController: AlertController, private modalController: ModalController, private sharedDataService: SharedDataService) { }

  ngOnInit() {
    this.getFiles();
  }

  async getFiles() {
    this.sharedDataService.copyMediaFromUsbModalData.completed = false;

    this.loadingFiles = true;
    this.loadingError = false;

    try {
      this.filesData = await this.usbDevicesService.getFiles();
      this.totalFiles = this.filesData.length;
      this.loadingFiles = false;
  
      await this.startCopyFiles();
    } catch (err) {
      this.loadingError = true;
    }
  }

  async startCopyFiles() {
    this.copiedFiles = 0;

    for (let i = 0; i < this.filesData.length; i++) {
      try {
        this.filesData[i].additional.status = 'uploading';
        if (this.virtualScrollFiles) {
          const totalHeight = document.querySelector('.list-files').clientHeight;
          const itemHeight = document.querySelector('.list-files cdk-virtual-scroll-viewport').getAttribute('itemSize');
          const minus = Math.round(totalHeight / Number(itemHeight)) / 2;
          this.virtualScrollFiles.scrollToIndex(i - minus + 1, 'smooth');
        }

        const result = await this.usbDevicesService.copyFileToStorage(this.filesData[i]);

        if (result.error) {
          this.filesData[i].additional.status = 'error';
          this.filesData[i].additional.errorText = result.errorText;
        } else {
          this.filesData[i].additional.status = 'uploaded';
          this.copiedFiles++;
        }
      } catch (err) {
        this.filesData[i].additional.status = 'error';
        this.filesData[i].additional.errorText = 'Error desconocido!';
      }
    }

    await this.openAlertCompleted();
  }

  async openAlertCompleted() {
    let info = '', uploadCount = 0, errorCount = {};

    this.sharedDataService.copyMediaFromUsbModalData.completed = true;
    this.filesData.forEach(file => file.additional.status === 'uploaded' ? ++uploadCount : null);
    info += 'Copiados exitosamente: <strong>' + uploadCount + '</strong><br>';

    this.filesData.forEach(file => file.additional.status === 'error' ? (errorCount[file.additional.errorText] = typeof errorCount[file.additional.errorText] === 'number' ? ++errorCount[file.additional.errorText] : 1) : null);
    
    for (let key in errorCount) {
      info += key + ': <strong>' + errorCount[key] + '</strong><br>';
    }

    info += '<br><center><strong>PRESIONA CUALQUIER TECLA PARA CERRAR EL DIALOGO</strong></center>';

    this.completeAlert = await this.alertController.create({
      header: 'Copiado completo',
      subHeader: 'Resumen',
      message: info,
      animated: true,
      backdropDismiss: false,
      keyboardClose: false,
      //buttons: [ 'Cerrar' ],
    });
    
    await this.completeAlert.present();

    const { data } = await (await this.modalController.getTop()).onWillDismiss();

    if (data.reason === 'complete') {
      await this.completeAlert.dismiss();
    }
  }

  @HostListener('document:keydown', ['$event'])
  async handleKeyboardEvent(event: KeyboardEvent) {
    if (this.completeAlert) {
      await this.completeAlert.dismiss();
      await this.modalController.dismiss({ reason: 'complete' });

      this.completeAlert = undefined;
    }
    if (this.loadingError) {
      await this.modalController.dismiss({ reason: 'cancel' });
    }
  }

  getItemColor(item: UsbFile) {
    if (item.additional.status === 'uploaded') {
      return 'success';
    } else if (item.additional.status === 'uploading') {
      return 'primary';
    } else if (item.additional.status === 'error') {
      return 'danger';
    } else {
      return null;
    }
  }

}
