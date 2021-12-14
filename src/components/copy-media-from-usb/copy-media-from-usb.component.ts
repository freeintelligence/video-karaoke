import { Component, OnInit } from '@angular/core';
import { UsbDevicesService, UsbFile } from 'src/services/usb-devices.service';

@Component({
  selector: 'app-copy-media-from-usb',
  templateUrl: './copy-media-from-usb.component.html',
  styleUrls: ['./copy-media-from-usb.component.scss'],
})
export class CopyMediaFromUsbComponent implements OnInit {

  loadingFiles: boolean;
  totalFiles: number;
  copiedFiles: number;
  filesData: UsbFile[] = [];

  constructor(private usbDevicesService: UsbDevicesService) { }

  ngOnInit() {
    this.getFiles();
  }

  async getFiles() {
    this.loadingFiles = true;
    this.filesData = await this.usbDevicesService.getFiles();
    this.loadingFiles = false;

    await this.startCopyFiles();
  }

  async startCopyFiles() {
    for (let i = 0; i < this.filesData.length; i++) {
      try {
        this.filesData[i].additional.status = 'uploading';
        const result = await this.usbDevicesService.copyFileToStorage(this.filesData[i].path);

        if (result.error) {
          this.filesData[i].additional.status = 'error';
          this.filesData[i].additional.errorText = result.errorText;
        } else {
          this.filesData[i].additional.status = 'uploaded';
        }
      } catch (err) {
        this.filesData[i].additional.status = 'error';
        this.filesData[i].additional.errorText = 'Error desconocido!';
      }
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
