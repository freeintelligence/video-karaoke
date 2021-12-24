import { startMonitoring, on, Device } from 'usb-detection';
import * as drivelist from 'drivelist';
import { BrowserWindow, ipcMain, IpcMainEvent } from 'electron';
import { getAllFiles, getAllFilesSync } from 'get-all-files';
import * as path from 'path';
import * as fs from 'fs-extra';
import { getVideoDurationInSeconds } from 'get-video-duration-electron';
import { Genre } from './../models/genre';
import { Artist } from './../models/artist';
import { Media } from './../models/media';

export interface UsbFile {
    name: string;
    mountpoint: string;
    path: string;
    genreName: string | null;
    genreImagePath: string | null;
    artistName: string | null;
    artistImagePath: string | null;
    durationInSeconds: number;
    type: 'video'|'image';
    additional: any;
}

export class UsbDetectEvents {

    static DIRECTORIES = { genres: 'genres', artists: 'artists' };

    constructor() {
        //this.run();
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
            genreId: genre ? genre.get('id') : null,
            mediaExt: path.extname(usbFile.path),
            durationInSeconds: usbFile.durationInSeconds ? Number(usbFile.durationInSeconds) : 0,
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
                const genresPath = path.join(mountpoint.path, UsbDetectEvents.DIRECTORIES.genres);
                const artistsPath = path.join(mountpoint.path, UsbDetectEvents.DIRECTORIES.artists);
                const mountFiles = fs.readdirSync(mountpoint.path).map(e => path.join(mountpoint.path, e));
                const genresFiles = fs.existsSync(genresPath) && fs.lstatSync(genresPath).isDirectory() ? fs.readdirSync(genresPath).map(e => path.join(genresPath, e)) : [];
                const artistsFiles = fs.existsSync(artistsPath) && fs.lstatSync(artistsPath).isDirectory() ? fs.readdirSync(artistsPath).map(e => path.join(artistsPath, e)) : [];

                // "D:/*"
                for (const mountFile of [...mountFiles, ...genresFiles, ...artistsFiles]) {
                    const fileType = this.getUsbFileType(mountFile);

                    if (!fs.lstatSync(mountFile).isFile() || !fileType) {
                        continue;
                    }

                    files.push(<UsbFile>{
                        name: path.basename(mountFile, path.extname(mountFile)),
                        mountpoint: mountpoint.path,
                        path: mountFile,
                        durationInSeconds: fileType === 'video' ? await getVideoDurationInSeconds(mountFile) : null,
                        type: fileType,
                        additional: {}
                    });
                }

                // "D:/artists/*"
                for (const artistsFile of artistsFiles.filter(e => fs.lstatSync(e).isDirectory())) {
                    const artistName = path.basename(artistsFile);
                    const artistFiles = getAllFilesSync(artistsFile).toArray();

                    // "D:/artists/*/*"
                    for (const artistFile of artistFiles) {
                        const fileType = this.getUsbFileType(artistFile);

                        if (!fs.lstatSync(artistFile).isFile() || !fileType) {
                            continue;
                        }
    
                        files.push(<UsbFile>{
                            name: path.basename(artistFile, path.extname(artistFile)),
                            mountpoint: mountpoint.path,
                            path: artistFile,
                            durationInSeconds: fileType === 'video' ? await getVideoDurationInSeconds(artistFile) : null,
                            type: fileType,
                            artistName,
                            additional: {},
                        });
                    }
                }

                // "D:/genres/*"
                for (const genresFile of genresFiles.filter(e => fs.lstatSync(e).isDirectory())) {
                    const genreName = path.basename(genresFile);
                    const genreFiles = fs.readdirSync(genresFile).map(e => path.join(genresFile, e));

                    // "D:/genres/*/*"
                    for (const genreFile of genreFiles) {
                        if (fs.lstatSync(genreFile).isFile()) {
                            const fileType = this.getUsbFileType(genreFile);

                            files.push(<UsbFile>{
                                name: path.basename(genreFile, path.extname(genreFile)),
                                mountpoint: mountpoint.path,
                                path: genreFile,
                                durationInSeconds: fileType === 'video' ? await getVideoDurationInSeconds(genreFile) : null,
                                type: fileType,
                                genreName,
                                additional: {},
                            });
                        } else if (fs.lstatSync(genreFile).isDirectory()) {
                            const artistName = path.basename(genreFile);
                            const genreArtistFiles = getAllFilesSync(genreFile).toArray();

                            // "D:/genres/*/*/*"
                            for (const genreArtistFile of genreArtistFiles) {
                                const fileType = this.getUsbFileType(genreArtistFile);

                                if (!fs.lstatSync(genreArtistFile).isFile() || !fileType) {
                                    continue;
                                }
            
                                files.push(<UsbFile>{
                                    name: path.basename(genreArtistFile, path.extname(genreArtistFile)),
                                    mountpoint: mountpoint.path,
                                    path: genreArtistFile,
                                    durationInSeconds: fileType === 'video' ? await getVideoDurationInSeconds(genreArtistFile) : null,
                                    type: fileType,
                                    genreName,
                                    artistName,
                                    additional: {},
                                });
                            }
                        }
                    }
                }
            }
        }

        return files;
    }

    getUsbFileType(file: string): UsbFile['type'] {
        let extname = path.extname(file);

        // No extension
        if (!extname) {
            return null;
        }

        // To lowercase
        extname = extname.toLowerCase();

        // Video extension
        if (['.mp4'].indexOf(extname) !== -1) {
            return 'video';
        }

        // Image extension
        if (['.jpg', '.jpeg', '.png'].indexOf(extname) !== -1) {
            return 'image';
        }

        return null;
    }

}

const v = new UsbDetectEvents();
v.getUsbFiles().then(e => {
    console.log('usb files', e);
})
