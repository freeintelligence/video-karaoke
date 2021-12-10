import { app } from "electron";
import * as path from 'path';

export class Config {

  httpServer = {
    port: 6868,
  };

  constructor() {

  }

  databasePath(p: string = '') {
    return path.join(app.getPath('userData'), 'database', p);
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
