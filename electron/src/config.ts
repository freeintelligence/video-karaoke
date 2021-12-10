import { app } from "electron";
import * as path from 'path';

export const Config = {
  httpServer: {
    port: 6868,
  },
  imagesPath: path.join(app.getPath('userData'), 'images'),
  genreImagesPath: path.join(app.getPath('userData'), 'images', 'genre-images'),
  artistImagesPath: path.join(app.getPath('userData'), 'images', 'artist-images'),
  mediaImagesPath: path.join(app.getPath('userData'), 'images', 'media-images'),
}
