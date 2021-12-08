import { ipcMain } from 'electron';

export class ConfigSettings {

    constructor() {
        this.isConfigSetted();
    }

    isConfigSetted() {
        ipcMain.on('is-config-setted', (event) => {
            event.reply('config-is-setted', false);
        });
    }

}
