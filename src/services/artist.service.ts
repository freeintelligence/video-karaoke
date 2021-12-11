import { Injectable } from '@angular/core';
import { ElectronService } from 'src/app/electron.service';
import { ArtistModel } from 'src/models/artist.service';

@Injectable({
  providedIn: 'root'
})
export class ArtistService {

  constructor(private electron: ElectronService, private artistModel: ArtistModel) { }

  async getArtists(filters: { genreId?: number } = {}): Promise<ArtistModel[]> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('timeout')), 2000);

      this.electron.ipcRenderer.send('get-artists', filters);
      this.electron.ipcRenderer.once('getting-artists', (event, result: ArtistModel[]) => {
        if (timeout) {
          clearTimeout(timeout);
        }
        return resolve(this.artistModel.newFromArray(result));
      });
    });
  }

}
