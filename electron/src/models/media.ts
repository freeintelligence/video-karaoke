import { DataTypes, Model } from 'sequelize';
import { Database } from './database';

export class Media extends Model {

}

Media.init({
    name: {
        type: DataTypes.STRING(256),
        allowNull: false,
    },
}, { sequelize: Database, modelName: 'media' });

Media.sync({ alter: true });
