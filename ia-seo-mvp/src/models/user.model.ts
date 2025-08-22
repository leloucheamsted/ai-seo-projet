import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db.config';

export interface UserAttributes {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password_hash: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'created_at' | 'updated_at'> { }

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public firstName!: string;
    public lastName!: string;
    public email!: string;
    public password_hash!: string;
    public readonly created_at!: Date;
    public readonly updated_at!: Date;

    // Associations
    public getKeywordSearches!: () => Promise<any[]>;
    public getUrlAudits!: () => Promise<any[]>;
    public getRankMonitor!: () => Promise<any[]>;
    public getRankAlerts!: () => Promise<any[]>;
    public getApiUsage!: () => Promise<any[]>;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        firstName: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [2, 100],
            },
        },
        lastName: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [2, 100],
            },
        },
        email: {
            type: DataTypes.STRING(255),
            unique: true,
            allowNull: false,
            validate: {
                isEmail: true,
            },
        },
        password_hash: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'users',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);