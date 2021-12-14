import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UsbDevicesService, UsbFile } from 'src/services/usb-devices.service';

@Component({
  selector: 'app-copy-media-from-usb',
  templateUrl: './copy-media-from-usb.component.html',
  styleUrls: ['./copy-media-from-usb.component.scss'],
})
export class CopyMediaFromUsbComponent implements OnInit {

  @ViewChild('virtualScrollFiles') virtualScrollFiles: CdkVirtualScrollViewport;

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
        if (this.virtualScrollFiles) {
          const totalHeight = document.querySelector('.list-files').clientHeight;
          const itemHeight = document.querySelector('.list-files cdk-virtual-scroll-viewport').getAttribute('itemSize');
          const minus = Math.round(totalHeight / Number(itemHeight)) / 2;
          this.virtualScrollFiles.scrollToIndex(i - minus + 1, 'smooth');
        }

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

  toMinutes(seconds: number) {
    return Math.round(seconds / 60).toString() + ':' + Math.round(seconds % 60).toString();
  }

}
