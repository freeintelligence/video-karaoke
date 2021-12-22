import { ipcMain } from "electron";
import { Media } from './../models/media';

export class MediaEvents {

    constructor() {
        this.run();
    }

    async run() {
        await this.getMedia();
    }

    async getMedia() {
        ipcMain.on('get-media', async (event, filters:  { genreId?: number, artistId?: number } = {}) => {
            const where: any = {};

            if (filters.artistId) {
                where.artistId = filters.artistId;
            }
            if (filters.genreId) {
                where.genreId = filters.genreId;
            }

            const result = await Media.findAll({ where, raw: true });

            event.reply('getting-media', result);
        });
    }

}
