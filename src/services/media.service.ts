import { Injectable } from '@angular/core';
import { ElectronService } from 'src/app/electron.service';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  constructor(private electron: ElectronService) { }

  async getMedia(filters: any = {}): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('timeout')), 2000);

      this.electron.ipcRenderer.send('get-media', filters);
      this.electron.ipcRenderer.once('getting-media', (event, result) => {
        if (timeout) {
          clearTimeout(timeout);
        }
        return resolve(result);
      });
    });
  }

}
