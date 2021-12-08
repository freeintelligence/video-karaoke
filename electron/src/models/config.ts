import { DataTypes, Model } from 'sequelize';
import { Database } from './database';

export class Config extends Model {

    static async get(): Promise<Config> {
        let config = await Config.findOne();

        if (!config) {
          config = Config.build({});
        }

        return config;
    }
}

Config.init({
    firstConfig: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    genreSearch: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    artistSearch: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    buttonLeft: {
        type: DataTypes.CHAR,
        defaultValue: 'ArrowLeft',
    },
    buttonRight: {
        type: DataTypes.CHAR,
        defaultValue: 'ArrowRight',
    },
    buttonUp: {
        type: DataTypes.CHAR,
        defaultValue: 'ArrowUp',
    },
    buttonDown: {
        type: DataTypes.CHAR,
        defaultValue: 'ArrowDown',
    },
    buttonEnter: {
        type: DataTypes.CHAR,
        defaultValue: 'Enter',
    },
    buttonBack: {
        type: DataTypes.CHAR,
        defaultValue: 'Backspace',
    },
}, { sequelize: Database, modelName: 'config' });

Config.sync({ alter: true });