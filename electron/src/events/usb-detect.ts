import { startMonitoring, on, Device, find } from 'usb-detection';
import * as drivelist from 'drivelist';
import { webContents, BrowserWindow } from 'electron';

export class UsbDetectEvents {

    constructor() {
        this.run();
    }

    async run() {
        startMonitoring();

        on('change', async (device) => {
            setTimeout(async () => {
                const devices = await drivelist.list();
                BrowserWindow.getFocusedWindow().webContents.send('detected-devices', devices)
            }, 1000);
        });
    }

}
