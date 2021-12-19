import { startMonitoring, on, Device } from 'usb-detection';
import * as drivelist from 'drivelist';
import { BrowserWindow, ipcMain, IpcMainEvent } from 'electron';
import { getAllFiles } from 'get-all-files';
import * as path from 'path';
import { getVideoDurationInSeconds } from 'get-video-duration-electron';

export interface UsbFile {
    name: string;
    mountpoint: string;
    genreName?: string;
    artistName?: string;
    path: string;
    durationInSeconds?: number;
    additional: any;
}

export class UsbDetectEvents {

    static DIRECTORIES = { base: 'video-karaoke', genres: 'genres', artists: 'artists' };

    constructor() {
        this.run();
    }

    async run() {
        startMonitoring();
        await this.onChange();
        await this.onGetUsbFiles();
    }

    async onChange() {
        on('change', async (device: Device) => {
            try {
                await (() => new Promise<void>(resolve => setTimeout(() => resolve(), 1000)))();
                const devices = await drivelist.list();
                BrowserWindow.getFocusedWindow().webContents.send('change-detected-devices', devices);
            } catch (err) {
                BrowserWindow.getFocusedWindow().webContents.send('change-detected-devices', []);
            }
        });
    }

    async onGetUsbFiles() {
        ipcMain.on('get-usb-files', async (event: IpcMainEvent) => {
            try {
                const files = await this.getUsbFiles();
                event.reply('getting-usb-files', files);
            } catch (err) {
                event.reply('getting-usb-files', []);
            }
        })
    }

    async getUsbFiles() {
        const allDevices = await drivelist.list();
        const filteredDevices = allDevices.filter(d => d.isRemovable);
        const files: UsbFile[] = [];

        for (let i in filteredDevices) {
            for (let o in filteredDevices[i].mountpoints) {
                const mountpoint = filteredDevices[i].mountpoints[o];
                const containerPath = path.join(mountpoint.path, UsbDetectEvents.DIRECTORIES.base);
                const containerFiles = await getAllFiles(containerPath).toArray();
                
                for (let u in containerFiles) {
                    let data: UsbFile = {
                        name: path.basename(containerFiles[u]),
                        mountpoint: mountpoint.path,
                        path: containerFiles[u],
                        additional: {},
                    };

                    if (!await this.isValidFile(data)) {
                        continue;
                    }

                    files.push(data);
                }
            }
        }

        return files;
    }

    async isValidFile(usbFile: UsbFile) {
        const extname = path.extname(usbFile.path);

        if (!extname || !(extname.toLowerCase() === '.mp4' || extname.toLowerCase() === '.ogg' || extname.toLowerCase() === '.webm')) {
            return false;
        }

        const pathArr = usbFile.path.replace(usbFile.mountpoint, '').split(path.sep).filter(e => e.length);
        const pathIndex = pathArr.findIndex(e => e === usbFile.name);

        usbFile.durationInSeconds = await getVideoDurationInSeconds(usbFile.path);
        usbFile.name = usbFile.name.replace(extname, '');

        // Genre detector
        if (pathArr.length >= 4 && pathArr.indexOf(UsbDetectEvents.DIRECTORIES.genres) !== -1) {
            usbFile.genreName = pathArr.length === 5 ? pathArr[pathIndex-2] : pathArr[pathIndex-1];
        }

        // Artist detector
        if (pathArr.length >= 4) {
            if (pathArr.indexOf(UsbDetectEvents.DIRECTORIES.artists) !== -1) {
                usbFile.artistName = pathArr[pathIndex-1];
            } else if (pathArr.indexOf(UsbDetectEvents.DIRECTORIES.genres) !== -1) {
                usbFile.artistName = pathArr.length >= 5 ? pathArr[pathIndex-1] : null;
            }
        }

        return true;
    }

}
