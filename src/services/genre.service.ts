import { Injectable } from '@angular/core';
import { browser } from 'protractor';
import { ElectronService } from 'src/app/electron.service';
import { GenreModel } from 'src/models/genre.service';
import browserDataGenre from './browser-data/genre';

@Injectable({
  providedIn: 'root'
})
export class GenreService {

  constructor(private electron: ElectronService, private genreModel: GenreModel) { }

  async getGenres(): Promise<GenreModel[]> {
    return new Promise((resolve, reject) => {
      if (!this.electron.isElectronApp) {
        // Browser App
        return resolve(this.genreModel.newFromArray(browserDataGenre));
      }

      const timeout = setTimeout(() => reject(new Error('timeout')), 2000);

      this.electron.ipcRenderer.send('get-genres');
      this.electron.ipcRenderer.once('getting-genres', (event, result: GenreModel[]) => {
        if (timeout) {
          clearTimeout(timeout);
        }
        return resolve(this.genreModel.newFromArray(result));
      });
    });
  }

}
