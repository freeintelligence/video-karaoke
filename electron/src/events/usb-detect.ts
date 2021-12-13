import { startMonitoring, on, Device, find } from 'usb-detection';
import * as drivelist from 'drivelist';

export class UsbDetectEvents {

    constructor() {
        this.run();
    }

    async run() {
        startMonitoring();

        on('change', async (device) => {
            setTimeout(async () => {
                const devices = await drivelist.list();
            }, 1000);
        });
    }

}
