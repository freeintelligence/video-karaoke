import { Injectable } from '@angular/core';
import { ElectronService } from 'src/app/electron.service';
import browserDataConfig from './browser-data/config';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  lastConfig: any = {};
  httpServer = {
    port: 6868,
  };

  constructor(private electron: ElectronService) { }

  async getConfig(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.electron.isElectronApp) {
        // Electron App
        const timeout = setTimeout(() => reject(new Error('timeout')), 2000);

        this.electron.ipcRenderer.send('is-config-setted');
        this.electron.ipcRenderer.once('config-is-setted', (event, config) => {
          this.lastConfig = config;
          if (timeout) {
            clearTimeout(timeout);
          }
          return resolve(config);
        });
      } else {
        // Browser App
        this.lastConfig = browserDataConfig;
        return resolve(browserDataConfig);
      }
    });
  }

  async setConfig(config: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('timeout')), 2000);

      this.electron.ipcRenderer.send('set-config', config);
      this.electron.ipcRenderer.once('config-setted', (event, config) => {
        if (timeout) {
          clearTimeout(timeout);
        }
        return resolve(config);
      });
    });
  }
}
