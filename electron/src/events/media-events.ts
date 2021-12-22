import { ipcMain } from "electron";
import { Genre } from "../models/genre";
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

            const result = await Media.findAll({
                where,
                raw: true,
                include: [
                    {
                        model: Genre,
                        as: 'genre',
                        required: false,
                        where: {

                        }
                    }
                ]
            });

            event.reply('getting-media', result);
        });
    }

}
