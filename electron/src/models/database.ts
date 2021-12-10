import { Sequelize } from 'sequelize';
import * as path from 'path';
import { config } from './../config';

const database = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(config.databasePath('database.db')),
    logging: false,
});

export {
    database as Database,
}
