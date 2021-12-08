import { ipcMain } from 'electron';
import { Config } from './../models/config';

export class ConfigSettings {

  constructor() {
    this.run();
  }

  async run() {
    await this.isConfigSetted();
  }

  async isConfigSetted() {
    ipcMain.on('is-config-setted', async (event) => {
      const config = (await Config.get()).get();
      event.reply('config-is-setted', config);
    });
  }

}
