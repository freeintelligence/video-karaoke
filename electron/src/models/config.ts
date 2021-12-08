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
    }
}, { sequelize: Database, modelName: 'config' });

Config.sync({ alter: true });