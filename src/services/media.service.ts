import { Injectable } from '@angular/core';
import { ElectronService } from 'src/app/electron.service';
import { MediaModel } from 'src/models/media.service';
import browserDataMedia from './browser-data/media';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  constructor(private electron: ElectronService, private mediaModel: MediaModel) { }

  async getMedia(filters: { genreId?: number, artistId?: number } = {}): Promise<MediaModel[]> {
    return new Promise((resolve, reject) => {
      if (!this.electron.isElectronApp) {
        // Browser App
        return resolve(this.mediaModel.newFromArray(browserDataMedia));
      }

      const timeout = setTimeout(() => reject(new Error('timeout')), 2000);

      this.electron.ipcRenderer.send('get-media', filters);
      this.electron.ipcRenderer.once('getting-media', (event, result: MediaModel[]) => {
        if (timeout) {
          clearTimeout(timeout);
        }
        return resolve(this.mediaModel.newFromArray(result));
      });
    });
  }

}
