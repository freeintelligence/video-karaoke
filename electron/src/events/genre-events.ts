import { ipcMain, app, protocol } from "electron";
import { Genre } from './../models/genre';

export class GenreEvents {

  constructor() {
    this.run();
  }

  async run() {
    await this.getGenres();
  }

  async getGenres() {
    ipcMain.on('get-genres', async (event) => {
      const result = await Genre.findAll({
        where: { },
        raw: true,
      });

      event.reply('getting-genres', result);
    });
  }

}
