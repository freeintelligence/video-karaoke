import { startMonitoring, on, Device } from 'usb-detection';
import * as drivelist from 'drivelist';
import { BrowserWindow, ipcMain, IpcMainEvent } from 'electron';
import { getAllFiles } from 'get-all-files';
import * as path from 'path';
import * as fs from 'fs-extra';
import { getVideoDurationInSeconds } from 'get-video-duration-electron';
import { Genre } from './../models/genre';
import { Artist } from './../models/artist';
import { Media } from './../models/media';

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
        await this.onCopyUsbFile();
    }

    async onChange() {
        on('change', async (device: Device) => {
            try {
                await (() => new Promise<void>(resolve => setTimeout(() => resolve(), 3000)))();
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

    async onCopyUsbFile() {
        ipcMain.on('copy-usb-file', async (event: IpcMainEvent, usbFile: UsbFile) => {
            try {
                await this.copyUsbFile(usbFile);
                event.reply('copied-usb-file', { error: false });
            } catch (err) {
                event.reply('copied-usb-file', { error: err, errorText: err.message });
            }
        });
    }

    async copyUsbFile(usbFile: UsbFile) {
        let genre: Genre, artist: Artist, media: Media;

        // Find genre
        if (typeof usbFile.genreName === 'string' && usbFile.genreName.length) {
            const [ genreData ] = await Genre.findOrCreate({
                where: { name: usbFile.genreName },
                defaults: {
                    name: usbFile.genreName,
                }
            });
            genre = genreData;
        }

        // Find artist
        if (typeof usbFile.artistName === 'string' && usbFile.artistName.length) {
            const [ artistData ] = await Artist.findOrCreate({
                where: { name: usbFile.artistName },
                defaults: {
                    name: usbFile.artistName,
                    genreId: genre ? genre.get('id') : null,
                }
            });
            artist = artistData;
        }

        // Find media (if exists)
        if (await this.mediaAlreadyExists(usbFile, genre, artist)) {
            throw new Error('Ya existe');
        }

        // Create media
        media = await Media.create({
            name: usbFile.name,
            artistId: artist ? artist.get('id') : null,
            mediaExt: path.extname(usbFile.path),
        });

        // Try copy file
        try {
            await fs.copyFile(usbFile.path, media.getMediaPath());
            await media.createGif();
        } catch (err) {
            if (media && media.get('id')) {
                await media.destroy();
            }
            throw new Error('Error desconocido');
        }
    }

    async mediaAlreadyExists(usbFile: UsbFile, genre: Genre, artist: Artist) {
        const media = await Media.findOne({
            where: {
                name: usbFile.name,
                artistId: artist ? artist.get('id') : null,
            }
        });

        return media;
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
