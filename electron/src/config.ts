import { app } from "electron";
import * as path from 'path';
import * as fs from 'fs-extra';
import isElectron from 'is-electron';
import * as os from 'os';

export class Config {

  httpServer = {
    port: 6868,
  };

  constructor() {
    fs.mkdirSync(this.databasePath(), { recursive: true });
    fs.mkdirSync(this.mediaPath(), { recursive: true });
    fs.mkdirSync(this.imagesPath(), { recursive: true });
    fs.mkdirSync(this.genreImagesPath(), { recursive: true });
    fs.mkdirSync(this.artistImagesPath(), { recursive: true });
    fs.mkdirSync(this.mediaImagesPath(), { recursive: true });
  }

  databasePath(p: string = '') {
    return path.join(isElectron() ? app.getPath('userData') : path.join(os.homedir(), 'Desktop', 'video-karaoke'), 'database', p);
  }

  mediaPath(p: string = '') {
    return path.join(this.databasePath(), 'media', p);
  }

  imagesPath(p: string = '') {
    return path.join(this.databasePath(), 'images', p);
  }

  genreImagesPath(p: string = '') {
    return path.join(this.imagesPath(), 'genre-images', p);
  }

  artistImagesPath(p: string = '') {
    return path.join(this.imagesPath(), 'artist-images', p);
  }

  mediaImagesPath(p: string = '') {
    return path.join(this.imagesPath(), 'media-images', p);
  }

  pathToUrl(p: string = '') {
    return p.replace(this.databasePath(), `http://localhost:${this.httpServer.port}`);
  }

}

export const config = new Config();
