import { ipcMain } from "electron";
import { Genre } from './../models/genre';

export class GenreEvents {

    constructor() {
        this.run();
    }

    async run() {
        await this.getGenres();
    }

    async getGenres() {
        ipcMain.on('get-genres', async (event, filters) => {
            const result = await Genre.findAll({
                where: {

                },
                raw: true,
            });

            event.reply('getting-genres', result);
        });
    }

}
