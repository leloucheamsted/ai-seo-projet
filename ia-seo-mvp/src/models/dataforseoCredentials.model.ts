import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database.manager';

export interface DataForSEOCredentialsAttributes {
    id: number;
    userId: number; // ou organizationId si multi-org
    login: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface DataForSEOCredentialsCreationAttributes extends Optional<DataForSEOCredentialsAttributes, 'id'> { }

export class DataForSEOCredentials extends Model<DataForSEOCredentialsAttributes, DataForSEOCredentialsCreationAttributes>
    implements DataForSEOCredentialsAttributes {
    public id!: number;
    public userId!: number;
    public login!: string;
    public password!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

DataForSEOCredentials.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        login: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        sequelize,
        tableName: 'dataforseo_credentials',
    }
);
