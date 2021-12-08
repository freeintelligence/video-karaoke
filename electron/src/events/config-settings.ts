import { ipcMain } from 'electron';
import { Config } from './../models/config';

export class ConfigSettings {

  constructor() {
    this.run();
  }

  async run() {
    await this.isConfigSetted();
    await this.setConfig();
  }

  async setConfig() {
    ipcMain.on('set-config', async (event, config) => {
      const data = await Config.get();
      config.firstConfig = true;
      await data.update(config);
      event.reply('config-setted', data);
    });
  }

  async isConfigSetted() {
    ipcMain.on('is-config-setted', async (event) => {
      const config = (await Config.get()).get();
      event.reply('config-is-setted', config);
    });
  }

}
