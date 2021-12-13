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
  }

  getItemColor(item: UsbFile) {
    if (item.additional.status === 'uploaded') {
      return 'success';
    } else if (item.additional.status === 'uploading') {
      return 'primary';
    } else {
      return null;
    }
  }

}
