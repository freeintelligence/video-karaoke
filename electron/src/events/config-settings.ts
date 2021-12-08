import { ipcMain } from 'electron';

export class ConfigSettings {

    constructor() {
        this.isConfigSetted();
    }

    isConfigSetted() {
        ipcMain.on('is-config-setted', (event) => {
            const isSetted = false;
            const config = {};

            event.reply('config-is-setted', { isSetted, config });
        });
    }

}
