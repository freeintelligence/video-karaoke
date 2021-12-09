import { Injectable } from '@angular/core';
import { ElectronService } from 'src/app/electron.service';

@Injectable({
  providedIn: 'root'
})
export class ArtistService {

  constructor(private electron: ElectronService) { }

  async getArtists(filters: any = {}): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('timeout')), 2000);

      this.electron.ipcRenderer.send('get-artists', filters);
      this.electron.ipcRenderer.once('getting-artists', (event, result) => {
        if (timeout) {
          clearTimeout(timeout);
        }
        return resolve(result);
      });
    });
  }

}
