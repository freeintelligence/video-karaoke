import { Sequelize } from 'sequelize';

const database = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.db',
});

export {
    database as Database,
}
