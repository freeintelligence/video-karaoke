import { Injectable } from '@angular/core';
import { ElectronService } from 'src/app/electron.service';

@Injectable({
  providedIn: 'root'
})
export class GenreService {

  constructor(private electron: ElectronService) { }

  async getGenres(filters: any = {}): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('timeout')), 2000);

      this.electron.ipcRenderer.send('get-genres', filters);
      this.electron.ipcRenderer.once('getting-genres', (event, result) => {
        if (timeout) {
          clearTimeout(timeout);
        }
        return resolve(result);
      });
    });
  }

}
