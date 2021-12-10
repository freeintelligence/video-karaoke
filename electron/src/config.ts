import { app } from "electron";
import * as path from 'path';

export const Config = {
  httpServer: {
    port: 6868,
  },
  databasePath: path.join(app.getPath('userData'), 'database'),
  imagesPath: path.join(app.getPath('userData'), 'database', 'images'),
  genreImagesPath: path.join(app.getPath('userData'), 'database', 'images', 'genre-images'),
  artistImagesPath: path.join(app.getPath('userData'), 'database', 'images', 'artist-images'),
  mediaImagesPath: path.join(app.getPath('userData'), 'database', 'images', 'media-images'),
}
