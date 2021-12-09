import { DataTypes, Model } from 'sequelize';
import { Database } from './database';

export class Artist extends Model {

}

Artist.init({
    name: {
        type: DataTypes.STRING(64),
        allowNull: false,
    },
}, { sequelize: Database, modelName: 'artist' });

Artist.sync({ alter: true });
