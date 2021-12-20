import { DataTypes, Model } from 'sequelize';
import { Database } from './database';
import { config } from '../config';
import fluentffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffprobeInstaller from '@ffprobe-installer/ffprobe';

fluentffmpeg.setFfmpegPath(ffmpegInstaller.path);
fluentffmpeg.setFfprobePath(ffprobeInstaller.path);

export class Media extends Model {

    getMediaPath() {
        return config.mediaPath(`${this.get('id')}${this.get('mediaExt')}`);
    }

    getGifPath() {
        return config.mediaImagesPath(`${this.get('id')}.gif`);
    }

    async createGif(): Promise<void> {
        return new Promise((resolve, reject) => {
            fluentffmpeg({ source: this.getMediaPath() })
            .setStartTime(10)
            .setDuration(8)
            .size('332x?')
            .output(this.getGifPath())
            .on('end', async (err) => {
                if (err) {
                    return reject(err);
                }
                this.set('imageExt', '.gif');
                await this.save();
                return resolve();
            })
            .on('error', (err) => reject(err))
            .run();
        });
    }

}

Media.init({
    name: {
        type: DataTypes.STRING(256),
        allowNull: false,
    },
    mediaExt: {
        type: DataTypes.CHAR,
        allowNull: false,
    },
    imageExt: {
        type: DataTypes.CHAR,
        allowNull: true,
        defaultValue: null,
    },
}, { sequelize: Database, modelName: 'media' });
