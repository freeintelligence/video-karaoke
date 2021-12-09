import { DataTypes, Model } from 'sequelize';
import { Database } from './database';

export class Genre extends Model {

}

Genre.init({
    name: {
        type: DataTypes.STRING(64),
        allowNull: false,
    },
}, { sequelize: Database, modelName: 'genre' });

Genre.sync({ alter: true });
