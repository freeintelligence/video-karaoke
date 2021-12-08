import { Injectable } from '@angular/core';
import { ElectronService } from 'src/app/electron.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(private electron: ElectronService) { }

  async getConfig(): Promise<any> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('timeout')), 2000);

      this.electron.ipcRenderer.send('is-config-setted');
      this.electron.ipcRenderer.once('config-is-setted', (event, config) => {
        if (timeout) {
          clearTimeout(timeout);
        }
        return resolve(config);
      });
    });
  }
}
