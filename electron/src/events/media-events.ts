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

            /*if (typeof filters.genreId === 'number') {
                where.genreId = filters.genreId;
            }*/

            if (typeof filters.artistId === 'number') {
                where.artistId = filters.artistId;
            }

            const result = await Media.findAll({
                where,
                raw: true,
            });

            event.reply('getting-media', result);
        });
    }

}
