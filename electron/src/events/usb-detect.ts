import { startMonitoring, on, Device, find } from 'usb-detection';

export class UsbDetectEvents {

    constructor() {
        this.run();
    }

    async run() {
        startMonitoring();

        on('add', (device) => {
            console.log('device add', device);
        });
    }

}
