import { ipcMain } from "electron";
import { Artist } from './../models/artist';

export class ArtistEvents {

    constructor() {
        this.run();
    }

    async run() {
        await this.getArtists();
    }

    async getArtists() {
        ipcMain.on('get-artists', async (event, filters: { genreId?: number } = {}) => {
            const where: any = {};
            
            if (typeof filters.genreId === 'number') {
                where.genreId = filters.genreId;
            }

            const result = await Artist.findAll({
                where,
                raw: true,
            });

            event.reply('getting-artists', result);
        });
    }

}
