import { DataTypes, Model } from 'sequelize';
import { Database } from './database';

export class Genre extends Model {

}

Genre.init({
    name: {
        type: DataTypes.STRING(64),
        allowNull: false,
    },
    imageExt: {
        type: DataTypes.CHAR,
        allowNull: true,
        defaultValue: null,
    },
}, { sequelize: Database, modelName: 'genre' });
