import { DataTypes, Model } from 'sequelize';
import { Database } from './database';

export class Media extends Model {

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
