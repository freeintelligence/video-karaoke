import * as usbDetect from 'usb-detection';

export class UsbDetectEvents {

    constructor() {
        this.run();
    }

    async run() {
        console.log('run', usbDetect);
        usbDetect.startMonitoring();
        usbDetect.on('change', (device: usbDetect.Device) => {
            console.log('device', device);
        });
    }

}
