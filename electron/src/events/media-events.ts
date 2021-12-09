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
        ipcMain.on('get-media', async (event, filters) => {
            const result = await Media.findAll({
                where: {

                },
                raw: true,
            });

            event.reply('getting-media', result);
        });
    }

}
