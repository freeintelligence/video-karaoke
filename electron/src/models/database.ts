import { Sequelize } from 'sequelize';

const database = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.db',
    logging: false,
});

export {
    database as Database,
}
